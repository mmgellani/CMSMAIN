export interface AssessmentSchedule {
    assessmentScheduleId: string;
    scheduleDate: Date;
    totalMarks?: number;
    assessmentSchedulingDetailId?: string;
    assessmentSectionMapId?: string;
    assessmentStatus?: number;
    statusId: number;
    programCourseLinkId?: string;
  }


  export interface Assesmentsecdulelistdata
  {
    assessmentSchedulingDetailId:string;
    assessmentType:string;
    assessmentName:string;
    failMasterCriteria:string;
    gradingCriteria:string;
    month:string;
    weightage:number;
    
  }

  export interface GetassesmentSceduleData{
    assessmentScheduleId :string;
    assessmentSchedulingDetailId:string;
    scheduleDate :Date ;
    totalMarks :number;
     courseId:string;
    courseName:string;
    programCourseLinkId:string;
    statusId: number;
    assessmentStatus?: number;
    assessmentSectionMapId:string;

  }