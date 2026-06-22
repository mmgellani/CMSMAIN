export interface IAssessmentSectionMap {
    assessmentSectionMapId: string;
    assessmentSchemeMasterId: string;
    sectionCourseLinkId: string;
    statusId: number;
}

export interface IVWAsssessmentSectionMap {
    assessmentSectionMapId: string;
    assessmentSchemeMasterId: string;
    assessmentMaster: string;
    sectionId: string;
    sessionId : string;
    campusId : string;
    campusName : string;
    programId : string ;
    programName : string;
    classId : string;
    className : string;
    campusProgramId : string;
    sectionCourseLinkId : string;
    sectionName : string ;
    levelId : string ;
    levelName : string;
    statusId: number;
}

export interface IAssessmentSchemeMaster1 {
        assessmentSchemeMasterId : string;
        fullName : string;	
        gradingMasterId : string;
        failMasterId : string;
        totalWeightage : string;
		statusId : number;
}

export interface IAssessmentProgramLevel {
    programId : string;
    programName : string;	
    levelId : string;
    programDetailId : string;
    campusProgramId : string;
    statusId : number;
}

// export interface CheckCount {
//     response : number;
// }

export interface IAssessmentClassLevel {
    programId : string;
    programName : string;	
    levelId : string;
    programDetailId : string;
    campusProgramId : string;
    classId : string;
    className : string;
    statusId : number;
}

