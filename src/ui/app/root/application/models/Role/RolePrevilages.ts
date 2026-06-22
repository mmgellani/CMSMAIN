export interface IRolePrevilages {
    rolePrevilagesLinkId: string;
    userId: number;
    moduleStore: string;


}
export interface IRoles {
    roleId: string;
    parentRoleId: string;
    enabled: boolean;
    name: string;
    createdBy: number;
    createdOn: string;
    lastUpdatedBy?: number;
    lastUpdatedOn?: string;
    roleId1: string;
}


export interface IRoleAssignedList {
    id: string;
    roleId: string;
    storeData: string;
    moduleType: string;
}
export interface ISectionRightLink {
    sectionRightLinkId: string;
    allowedSection: string;
    userId: number;
}

export interface IMaskRightLink {
    maskRightLinkId: string;
    allowedMask: string;
    userId: number;
}
export interface IUserList {

    uid: number;
    name: string;
    type: string;

}

export interface PrevilagesData {
    id: string;
    model: string;
}

export interface ISectionCampusVM {
    sectionCourseLinkId: string;
    campusProgramId: string;
    className: string;
    sectionName: string;
    description: string;
    classId: string;
    sessionId: string;
    campusId: string;
    programDetailId: string;
    sectionId: string;
    isChecked: boolean;
}
export interface RoleDashboard {
    roleDasboardId: number;
    roleId: string;
    moduleId: string;
    columnWidth: string;
    orderBy: number;
}
export interface IRoleDashboardfilter {
    roleDasboardId: number;
    moduleId: string;
    columnWidth: string;
    orderBy: number;

}

export interface UserRoleDashboardlink {
    userDashboadId: string;
    roleDasboardId: number;
    roleId: string;
    moduleId: string;
    columnWidth: string;
    orderBy: number;
    userId: number;
    statusId: number;
}

export interface IOperation{
    link: string
}

export interface TodoList {
    todoListId: string;
    userId: number;
    dated: Date;
    description: string;
    taskStatus: boolean;
    title: string;
    statusId: number;
}
