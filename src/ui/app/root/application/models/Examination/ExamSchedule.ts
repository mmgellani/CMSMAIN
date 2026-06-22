export interface IExaminationExamSchedule {

        examScheduleId: string;
        examDate: Date | string;
        statusId: number;
        sectionCourseLinkId: string;
        examTypeId: string;
        courseId: string;
        campusProgramId: string;
        failMasterId: string;
        gradingMasterId: string;
        classId: string;
        totalMarks: number;
        fullName: string;
        month:string;

}
export interface ExaminationExamScheduleList{
    id:string;
    sectionCourseLinkId: string;
    examTypeId: string;
    fullName: string;

}

export interface IExaminationExamScheduleCourseName {

        examScheduleId: string;
        examDate: Date | string;
        statusId: number;
        sectionCourseLinkId: string;
        examTypeId: string;
        courseId: string;
        campusProgramId: string;
        failMasterId: string;
        gradingMasterId: string;
        classId: string;
        totalMarks: number;
        fullName: string;
        month:string;
        courseName:string

}
export interface IExaminationExamScheduleVW {

        examScheduleId: string;
        examDate: Date | string;
        statusId: number;
        sectionCourseLinkId: string;
        examTypeId: string;
        courseId: string;
        campusProgramId: string;
        failMasterId: string;
        gradingMasterId: string;
        classId: string;
        totalMarks: number;
        fullName: string;
        failMasterName: string;
        name: string;

}

export interface IExaminationExamScheduleVWEx {

        examScheduleId: string;
        examDate: Date | string;
        statusId: number;
        sectionCourseLinkId: string;
        examTypeId: string;
        courseId: string;
        campusProgramId: string;
        failMasterId: string;
        gradingMasterId: string;
        classId: string;
        totalMarks: number;
        fullName: string;
        failMasterName: string;
        name: string;
        courseName: string;
        id: string;
        examTypeName: string;
        month:string;
}

export interface IExamScheduleExx {
    examTypeId: string;
    fullName: string;
}

export interface GetCourseListByTimetable {
        response:string;
       
    }
    export interface GetCourseFromTimetable {
        courseName:string;
        courseId: string;
        programDetailId: string;
        programCourseLinkId:string; 
    }

    export interface DateArray {
      
        examdate: Date;
    }
    export interface  UpdatemarksResponse {
        pg_catalog:number;
       
    }