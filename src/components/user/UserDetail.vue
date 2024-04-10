<script setup lang="ts">
import { computed } from 'vue'
import { type GroupInterface, type ProjectInterface, UserRoleEnum } from '@/types'

interface PropsInterface {
  name: string
  username: string
  groups: GroupInterface[]
  projects: ProjectInterface[]
}
const props = defineProps<PropsInterface>()

const getUserRoleAccessLabel = (accessLevel: number) => {
  switch (accessLevel) {
    case UserRoleEnum.NoAccess:
      return 'No access'
    case UserRoleEnum.MinimalAccess:
      return 'Minimal Access'
    case UserRoleEnum.Guest:
      return 'Guest'
    case UserRoleEnum.Reporter:
      return 'Reporter'
    case UserRoleEnum.Developer:
      return 'Developer'
    case UserRoleEnum.Maintainer:
      return 'Maintainer'
    case UserRoleEnum.Owner:
      return 'Owner'
    default:
      return ''
  }
}

const groups = computed(() => {
  return (
    '[' +
    props.groups
      .map((group) => `${group.full_path} (${getUserRoleAccessLabel(group.userRole!)})`)
      .join(', ') +
    ']'
  )
})

const projects = computed(() => {
  return (
    '[' +
    props.projects
      .map(
        (project) => `${project.path_with_namespace} (${getUserRoleAccessLabel(project.userRole!)})`
      )
      .join(', ') +
    ']'
  )
})
</script>

<template>
  <div :class="$style.detail">
    <div>{{ name }} (@{{ username }})</div>
    <div>Groups: {{ groups }}</div>
    <div>Projects: {{ projects }}</div>
  </div>
</template>

<style lang="scss" module>
.detail {
  margin: 12px 0;
}
</style>
