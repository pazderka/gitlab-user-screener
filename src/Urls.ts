export const URLS = {
  groupProjects: (groupId: number) => `/groups/${groupId}/projects`,
  groupUsers: (groupId: number) => `/groups/${groupId}/members`,
  groupDescendantGroups: (groupId: number) => `/groups/${groupId}/descendant_groups`,
  groupById: (groupId: number) => `/groups/${groupId}`,
  projectUsers: (projectId: number) => `/projects/${projectId}/members`
}
