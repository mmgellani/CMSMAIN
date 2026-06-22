export interface IAdmissionReports {
  studentId: string;

  cityId: string;

  programId: string;
  
  programName: string;
  
  subCityId: string;
  
  admissionTypeId: string;
  
  name: string;

  rollNo: string;

  refferenceNo: string;

  fullName: string;

  description: string;

  fatherName: string;

  academicInfo: string;

  parentCNIC: string;

  parentContactNo: string;

  dateOfBirth: Date;

  campusName: string;

  sessionName: string;

  shiftName: string;

  logo: string;

  slogan: string;

  studentType: string;

  genderType: string;

  statusId: number;

  loggerId: string;
}


export interface IAdmissionReportsData
{
  studentId: string;
  sessionId: string;
  campusId: string;
  sectionId: string;
  genderId: string;
  programDetailId: string;
  refferenceNo: string;
  sectionName: string;
  fullName: string;
  description: string;
  cityName: string;
  address: string;
  fatherName: string;
  board: string;
  year: string;
  obtained: string;
  total: string;
  boardRollNo: string;
  enrollmentNo: string;
  parentCNIC: string;
  parentContact: string;
  dateOfBirth: string;
  genderType: string;
  studentType: string;
  campusName: string;
  sessionName: string;
  shiftName: string;
  statusId: number;
  loggerId: string;

}