<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/composables/useFetch'
import UserDetail from '@/components/user/UserDetail.vue'
import SearchForm from '@/components/form/SearchForm.vue'
import { URLS } from '@/Urls'
import { type UserInterface, type GroupInterface, type ProjectInterface } from '@/types'

const isLoading = ref(false)
const users = ref<UserInterface[]>([])
const userData = ref<Record<number, { groups: GroupInterface[]; projects: ProjectInterface[] }>>({})

const updateUsers = (newUsers: UserInterface[]) => {
  for (const user of newUsers) {
    const userExists = users.value.some(
      (existingUser: UserInterface) => existingUser.id === user.id
    )

    if (!userExists) {
      users.value.push(user)
    }
  }
}

const updateUserListResource = (
  users: UserInterface[],
  resource: GroupInterface | ProjectInterface,
  resourceType: 'groups' | 'projects'
) => {
  for (const user of users) {
    const userId = user.id

    if (!userData.value[userId]) {
      userData.value[userId] = { groups: [], projects: [] }
    }

    const newItem = { ...resource, userRole: user.access_level } as GroupInterface &
      ProjectInterface
    userData.value[userId][resourceType].push(newItem)
  }
}

const getGroupChildren = async (groupId: number) => {
  return await Promise.all([
    useFetch<GroupInterface[]>(URLS.groupProjects(groupId)),
    useFetch<UserInterface[]>(URLS.groupUsers(groupId))
  ])
}

const getDescendantGroupUsers = async (groupId: number) => {
  isLoading.value = true
  users.value = []
  userData.value = {}

  try {
    const { data: descendantGroupsResponse } = await useFetch<GroupInterface[]>(
      URLS.groupDescendantGroups(groupId)
    )
    const descendantGroups = descendantGroupsResponse.value!

    // Root group is not a part of descendant groups, therefore fetch info separately
    const rootGroupResponse = await useFetch<GroupInterface>(URLS.groupById(groupId), false)
    const rootGroup = rootGroupResponse.data.value!

    for (const group of [rootGroup, ...descendantGroups]) {
      const [groupProjectsResponse, groupUsersResponse] = await getGroupChildren(group.id)

      const groupProjects = groupProjectsResponse.data.value!
      const groupUsers = groupUsersResponse.data.value!

      updateUsers(groupUsers)
      updateUserListResource(groupUsers, group, 'groups')

      for (const project of groupProjects) {
        const projectUserResponse = await useFetch<UserInterface[]>(URLS.projectUsers(project.id))
        const projectUsers = projectUserResponse.data.value!

        updateUsers(projectUsers)
        updateUserListResource(projectUsers, project, 'projects')
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main>
    <SearchForm @search="getDescendantGroupUsers" />
    <template v-if="isLoading">Data is loading...</template>
    <template v-else>
      <UserDetail
        v-for="user in users"
        :key="user.id"
        :name="user.name"
        :username="user.username"
        :groups="userData[user.id].groups"
        :projects="userData[user.id].projects"
      />
      <template v-if="users.length">Total users: {{ Object.keys(userData).length }}</template>
    </template>
  </main>
</template>

<style lang="scss" module>
main {
  min-width: 700px;
}
</style>
