export interface IFeeScholarshipCriteria {
  scholarshipCriteriaId: string;
  campusProgramId: string;
  admissionTypeId: string;
  scholarshipTypeId: string;
  marksPer: number;
  continuationPolicyId: string;
  concessionId: string;
  attendancePercentage: number;
  fullName: string;
  statusId: number;
  loggerId: string;
  isScholarhsip:boolean;
}

export interface IFeeScholarshipCriteriaVM {
  scholarshipCriteriaId: string;
  campusProgramId: string;
  admissionTypeId: string;
  continuationPolicyId: string;
  scholarshipTypeId: string;
  grades: string;
  marksPer: number;
  concessionId: string;
  fullName: string;
  statusId: number;
  loggerId: string;
  continuationPolicyName: string;
  concessionName: string;
  admissionTypeName: string;
  shiftId: string;
  campusId: string;
  sessionId: string;
  programDetailId: string;
  attendancePercentage: number;
  isScholarship:boolean;
}

export interface TBLGrades {
  scholarshipTypeId: string;
  grades: string;
}
