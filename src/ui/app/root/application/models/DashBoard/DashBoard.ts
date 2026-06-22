export interface IPublicVWDashBoardVM {
    cityId: string;
    campusId: string;
    programId: string;
    programDetailId: string;
    subCityId: string;
    cityName: string;
    totalAdmission: number;
    subCityName: string;
    campusName: string;
    programName: string;
    description: string;


}

export interface VWDashBoardVMA {
    drillDownId: string;
    cityId: string;
    subCityId: string;
    campusId: string;
    programId: string;
    cityName: string;
    programDetailId: string;
    subCityName: string;
    totalAdmission: number;
    totalFeeConfirmed: number;
    totalEnrolled: number;
    campusName: string;
    programName: string;
    description: string;
}

export interface IStudentFeeCountVM {
    feeCountId: string;
    shift: string;
    totalStudents: number;
    paidAmount: number;
    average: number;
    discount: number;
}

export interface INotificationDashboardList {
    newID: string;
    courseId: string;
    courseName: string;
    teacherName: string;
    average: number;
    currentAverage: number;
    previousAverage: number;
}

export interface INotificationDashboardListEx {
    newID: string;
    subCity: string;
    courseId: string;
    courseName: string;
    teacherName: string;
    teacherId: string;
    average: number;
    currentAverage: number;
    previousAverage: number;
}

export interface IDashboardComment {
    newID: string;
    dated: Date;
    subCity: string;
    comment: string;
    sectionName: string;
    campusCode: string;
    category:string;
}

export interface ITeacherSearch {
    newID: string;
    teacherId: string;
    teacherName: string;
    subCityId: string;
    subcity: string;
    campusName: string;
    courseName: string;
}
export interface ITeacherSurvey {
    newID: string;
    totalSurvey: number;
    totalSubmitted: number;
    average: number;
    groupAverage: number;
}
export interface IAdmissionCount {
    admissionCountWiz: number;
}
export interface ITeacherRatingGraph {
    newID: string;
    sectionId: string;
    sectionName: string;
    average?: number;
    totalSubmitted?: number;
}
export interface ITeacherRatingGraphEX {
    newID: string;
    teacherName: string;
    courseName: string;
    rating?: number;
    totalSubmitted?: number;
}
export interface ITeacherRatingGraphEXSection {
    newID: string;
    courseName: string;
    sectionName: string;
    rating?: number;
}
export interface ITeacherRatingGraphEXSectionwithtotal {
    newID: string;
    courseName: string;
    sectionName: string;
    rating?: number;
    total?:number;
}
export interface ITeacherRatingGraphMonth {
    newID: string;
    month: string;
    average?: number;
}

export interface ISurvey {
    totalSurvey: number;
    totalSubmitted: number;
    average: number;
    groupAverage: number;

}

export interface ISurvey2 {
    totalSubmitted?: number;
    average?: number;
}

export interface Survey26 {
    totalSubmitted?: number;
    average?: number;
    totalStudents: number;
}
export interface ITotalSurveyJanuary2024 {
    totalCount?: number;
    totalSubmitted?: number;
    average?: number;
}
export interface IBuildingData {
    buildingName?: string;
    isBuilding?: boolean;
    
}

export interface ISurveyStatistics {
    iddd: string;
    fullName: string;
    total?: number;
    submitted?: number;
    response?: number;
    next: string;
}
export interface ISurveyStatistics1 {
    iddd: string;
    fullName: string;
    total?: number;
    submitted?: number;
    response?: number;
    next: string;
}
export interface ISurveyCommentDash {
    newID: string;
    admissionFormId: string;
    comment: string;
    surveyDetailId: string;

}
export interface ISurveyCommentDash26 {
    newID: string;
    admissionFormId: string;
    comment: string;
    surveyDetailId: string;
    category: string;
}
export interface ISurveyQuestionDash {
    newID: string;
    admissionFormId: string;
    comment: string;
    surveyDetailId: string;
}

export interface ISurveyRatingList {
    newID: string;
    question: string;
    order: number;
    course: string;
    subCity: string;
    rating: number;
    subCity1: string;
    subCity1Rating: number;
    subCity2: string;
    subCity2Rating: number;
    subCity3: string;
    subCity4Rating: number;
}

export interface ISurveyRatingListEx {
    newID: string;
    question: string;
    order: number;
    course: string;
    subCity: string;
    rating: number;
    subCity1: string;
    subCity1Rating: number;
    subCity2: string;
    subCity2Rating: number;
}
export interface ITeacherRatingOverAllList {
    newID: string;
    teacherName: string; 
    rating: number;
    total:number;
}
export interface ITeacherRatingOverAllListwithid {
    newID: string;
    teacherName: string;
    staffId:string;
    rating: number;
    total:number;
}
export interface ITeacherRatingOverAllList1 {
    newID: string;
    teacherName: string;
    rating: number;
    total:number;
}
export interface ISurveyOverAllResult {
    newID: string;
    order: number;
    question: string;
    course: string;
    overAllRating: number;
    rating: number;
    total:number;
}export interface ISurveyOverAllResultApril {
    newID: string;
    order: number;
    question: string;
    course: string;
    overAllRating: string;
    rating: string;
    total:number;
}
export interface ISurveyOverAllResult1 {
    newID: string;
    order: number;
    question: string;
    course: string;
    overAllRating: number;
    rating: number;
    total:number;
}
 
//survey December 2021 
export interface ISurveyOverAllResultEX {
    newID: string;
    order: number;
    question: string;
    course: string;
    overAllRating: number;
    rating: number;
}
export interface IQueryType {
    queryTypeId: string;
    fullName: string;
}
export interface ISurveyList {
    newID: string;
    totalSurvey: number;
    totalSubmitted: number;
    cityId: string;
    cityName: string;
    average: number;
    groupAverage: number;
    monthAverage: number;
    prevAverage: number;
}
export interface ISurveySubCityList {
    newID: string;
    totalSurvey: number;
    totalSubmitted: number;
    subCityId: string;
    subCityName: string;
    average: number;
    groupAverage: number;
    monthAverage: number;
    prevAverage: number;
}


export interface ITopTeachers {
    newID: string;
    teacherId: string;
    teacherName: string;
    courseName: string;
    subCiy: string;
    average: number;
}

export interface INotificationRatingGraph {
    newID: string;
    sectionId: string;
    sectionName: string;
    average?: number;
}
export interface ISurveySubjectList {
    newID: string;
    teacherId: string;
    teacherName: string;
    totalSurvey: number;
    totalSubmitted: number;
    average: number;
    groupAverage: number;
    monthAverage: number;
    prevAverage: number;
}

export interface ITeacherRatingList {
    newID: string;
    campusId: string;
    campusName: string;
    cityName: string;
    teacherName: string;
    teacherId: string;
    average: number;
}


export interface ISubjectRatingList {
    newID: string;
    campusId: string;
    campusName: string;
    cityName: string;
    courseName: string;
    average: number;
}
export interface ISurveyCampusList {
    newID: string;
    totalSurvey: number;
    totalSubmitted: number;
    campusId: string;
    campusName: string;
    average: number;
    groupAverage: number;
    monthAverage: number;
    prevAverage: number;
}

export interface ISurveyCourseList {
    newID: string;
    courseId: string;
    totalSurvey: number;
    totalSubmitted: number;
    courseName: string;
    average: number;
    groupAverage: number;
    monthAverage: number;
    prevAverage: number;
}
export interface IAdmissionFeeCount {
    admissionCountFeeWise: number;
}

export interface CalculateMonthAverageList {
    newID: string;
    courseName: string;
    teacherName: string;
    average: number;
    month: string;
}


export interface ISurveyMaster {



    surveyMasterId: string;
    name: string;
    description: string;
    statusId: number;





}
export interface ISurveyMasterNew {



    surveyMasterId: string;
    name: string;
    description: string;
    popupDescription:string;
    statusId: number;





}
export interface INotificationCredntialsEx {

    sesseion: string;
    campus: string;
    program: string;
    classstudent: string;
    section: string;
    rollno: string;
    notification: string;
    popupNotification: string;
    type: string;
    title: string;
    image: string;
    id: string;
    mandatory: string
    fromDate: string;
    toDate: string;

}


export interface SurveyDetail {



    surveyDetailId: string;
    question: string;
    description: string;
    query: string;
    controlType: string;
    operation: Array<optionsls2>;
    statusId: number;
    surveyMasterId: string;
    order: number;

}

export interface SurveyDetail2 {



    surveyDetailId: string;
    question: string;
    description: string;
    query: string;
    controlType: string;


    operation: Array<optionsls2>;

    statusId: number;
    order :number;
   





}
export interface SurveyDetailVM {


    surveyMaster: string;
    surveyDescription: string;
    popupDescription: string;
    surveyDetailId: string;
    question: string;
    description: string;
    query: string;
    controlType: string;


    operation: Array<optionsls2>;

    statusId: number;
    surveyMasterId: string;
    order: number;





}


export interface optionsls2 {

    order: number;
    option: string;

}



