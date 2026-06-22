export interface IStaffCourse {
    staffCourseId: string;
    campusBuildingId: string;
    courseId: string;
    isPrimary: boolean;
    statusId: number;
    staffId:string;
}


export interface StaffCourseVM {
    staffCourseId: string;
    campusBuildingId: string;
    courseId: string;
    isPrimary: boolean;
    statusId: number;
    staffName: string;
    campusName: string;
    buildingName: string;
    course: string;
    staffId: string;
}

export interface IStaffCourseDeptVM {
    staffCourseId: string;
    campusBuildingId: string;
    courseId: string;
    isPrimary: boolean;
    statusId: number;
    building: string;
    campus: string;
    department: string;
    parentDepartment: string;
    course: string;
    staffId: string;
}