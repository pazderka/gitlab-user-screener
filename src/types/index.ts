export interface UserInterface {
  id: number
  username: string
  name: string
  access_level: number
}

export interface GroupInterface {
  id: number
  full_path: string
  userRole?: number
}

export interface ProjectInterface {
  id: number
  path_with_namespace: string
  userRole?: number
}

export enum UserRoleEnum {
  NoAccess = 0,
  MinimalAccess = 5,
  Guest = 10,
  Reporter = 20,
  Developer = 30,
  Maintainer = 40,
  Owner = 50
}
