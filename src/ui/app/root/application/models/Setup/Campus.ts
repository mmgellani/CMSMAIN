export interface ISetupCampus {
	campusId: string;
    fullName: string;
    code: string;
    description: string;
    franchiseId: string;
    institutionId: string;
    digitCode: string;
    subCityId: string;
    statusId: number;
    logo: string;
    loggerId: string;
    customerCode: string;
    isTestCampus: number; 
    businessUnitId: string; 
    smsApId:string;
    emailPrefix:string;
    isEbook:boolean;
    isMerchandise:boolean;
    isDelivery:boolean;

}
export interface ICampusCityVM {
    campusId: string;
    campusName: string;
    cityName: string;
    zoneId:string;
    subCityId:string;
    cityId:string;
    franchiseId:string;
}

export interface ILevel{
    levelId: string;
    fullName: string;
    code: string;
    statusId: number;
}
export interface IAssessmentScheme {
    assessmentSchemeMasterId: string;
    fullName: string;
    gradingMasterId: string;
    failMasterId: string;
    totalWeightage: number;
    statusId: number;
  }
 export interface VWAssessmentSectionMap {
    assessmentSectionMapId: string;
    assessmentSchemeMasterId: string;
    assessmentMaster: string;
    sectionCourseLinkId: string;
    statusId: number;
    campusProgramId: string;
    campusId: string;
    programDetailId : string;
    campusName: string;
    programId: string;
    programName: string;
    classId: string;
    className: string;
    sessionId: string;
    sectionId: string;
    sectionName: string;
}
  export interface IAssessmentNames {
    assessmentSchedulingDetailId: string;
    assessmentSchemeDetailId: string;
    fullName: string;
    month: string;
    weightage: number;
    order: number;
    statusId: number;
    assessmentSchedulingMasterId: string;
    assessmentSchemeMasterId: string;
    examTypeId : string;
    examName : string;
  }
  export interface VWAssessmentSections {
    fullName: string;
    description: string;
    assessmentSchemeMasterId: string;
    statusId: number;
    assessmentSectionMapId: string;
    sectionCourseLinkId: string;
    sectionId: string;
  }
export interface IProgramDetail{
    campusProgramId: string;
    campusId: string;
    programDetailId: string;
    statusId: number;
    loggerId: string;
    sessionId: string;
    description: string;
    campusName: string;
    programName: string;
    programId: string;
    shiftId: string;
    shiftName: string;
    levelId: string;
}
export interface ICampusCityData {
    campusId: string;
    campusName: string;
    cityName: string;
    zoneId:string;
    subCityId:string;
    cityId:string;
   
}
