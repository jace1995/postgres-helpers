type UserInterface = {}

export enum Action {
  // GUEST

  // main
  start = 'start',
  info = 'info',
  union = 'union',
  union_selected = 'union_selected',
  admin = 'admin',
  admin_community_selected = 'admin_community_selected',

  community_info = 'community_info',

  // create community
  create_community = 'create_community',
  create_community_select_type = 'create_community_select_type',
  create_community_input_name = 'create_community_input_name',
  create_community_input_description = 'create_community_input_description',
  create_community_upload_image = 'create_community_upload_image',

  // join community
  join_union = 'join_union',
  join_union_input_code = 'join_union_input_code',
  join_union_confirm = 'join_union_confirm',

  // leave community
  leave_community = 'leave_community',
  confirm_leave_community = 'confirm_leave_community',

  // manage role
  appoint_verified = 'appoint_verified',
  manage_role = 'manage_role',
  manage_role_select_role = 'manage_role_select_role',
  update_role_input_members = 'update_role_input_members',

  // edit community info
  edit_community = 'edit_community',

  edit_community_name = 'edit_community_name',
  edit_community_description = 'edit_community_description',
  edit_community_image = 'edit_community_image',

  edit_community_input_name = 'edit_community_input_name',
  edit_community_input_description = 'edit_community_input_description',
  edit_community_upload_image = 'edit_community_upload_image',

  edit_community_delete_description = 'edit_community_delete_description',
  edit_community_delete_image = 'edit_community_delete_image',
}


export type ID<FK = void> = number // bigint
export type Code = number // int 6
export type ChatId = number // int 6

// user

export interface User<Payload = unknown> extends UserInterface { // table, no delete
  id: ID
  chat: ChatId // index, unique, readonly
  code: Code // index, unique, readonly

  steps: Action[] // Action[], default []
  action: Action // default null
  payload: Payload // jsonb, default null

  memberships: CommunityInfo[] // autoupdate (iud UnionMember.role, u Community.name), default []
}

export interface CommunityInfo {
  id: Community['id']
  code: Community['code']
  type: Community['type']
  name: Community['name']
  role: UnionMember['role']
}

// community

export enum CommunityType {
  union = 'union',
  alliance = 'alliance',
}

export interface Community { // table, no delete
  id: ID
  code: Code // index, unique, readonly
  type: CommunityType // readonly
  name: string // unique
  description?: string // 255
  image?: string // 255

  members: MemberInfo[] // autoupdate (iud UnionMember.role), default []
}

export interface MemberInfo {
  id: User['id']
  chat: User['chat']
  code: User['code']
  role: UnionMember['role']
}

export enum Role {
  member = 'member',
  verified = 'verified',
  activist = 'activist',
  admin = 'admin',
}

// TODO: rename Member
export interface UnionMember { // table
  // PK
  user_id: ID<User>
  union_id: ID<Community>

  role: Role // default Role.member
}
