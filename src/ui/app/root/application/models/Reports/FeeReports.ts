export interface IFeeReports {
  StudentId: string;

  RollNo: string;

  RefferenceNo: string;

  FullName: string;

  ParentContactNo: string;

  StudentContactNo: string;

  Description: string;

  GenderId: string;

  ClassId: string;

  ClassName: string;

  GenderName: string;

  FatherName: string;

  CampusName: string;

  SessionName: string;

  SessionId: string;

  CampusId: string;

  SectionCourseLinkId: string;
  
  SectionName: string;

  ProgramDetailId: string;

  AdmissionDate: Date;

  ShiftName: string;

  ChallanNo: string;

  InstallmentNo: number;

  FeeAmount: number;

  DueDate: Date;

  PaidDate: Date;

  FeeDetail: number;

  PayableAmount: number;

  ConcessionName: string;

  StatusId: number;
}

export interface StudentFeeDetailDescription {
  id: string;
  installmentNo: number;
  challanNo: string;
  refferenceNo: string;
  rollNo: string;
  fullName: string;
  feeAmount: number;
  paidDate?: string;
  concession: string;
  admission: number;
  admissionConcession: number;
  tuition: number;
  tuitionConcession: number;
  miscCharges: number;
}


export interface StudentFeesdetailActivity {
  activity: string;
  activity_DateTime: string;
  month_Campus_Class_Fee_Structure_Detail_ID: number;
  status_ID: number;
  payable_Date: string;
  challan_Number: string;
  student_Name: string;
  father_Name: string;
  class: string;
  ref_No: string;
  reg_No: string;
  section: string;
  fee_For: string;
  legal_Entity: string;
  cluster: string;
  campus: string;
  city: string;
  program: string;
  description: string;
  session: string;
  academic_Year: string;
  bank_Name: string;
  admission: number;
  discountOnAdmission: number;
  tuition: number;
  discountOnTuition: number;
  misc_Charges: number;
  discountOnBoardRegistration_Exam_Sport_CollegeCard_Building_Mis: number;
  discountOnOtherFeeHeads: number;
  discount: number;
  fine: number;
  late_Fee_Fine: number;
  total_Payable: number;
  due_Date: string;
  over_Due_Amount: number;
  print_Date: string;
  bank_Account: string;
  payDate: string;
  modeOfPayment: string;
  generationDate: string;
  boardRegistrationSportsHouseCollegeExam: number;
  collegeFee: number;
  boardRegistrationFee: number;
  universityRegistrationFee: number;
  boardExamFee: number;
  universityExamFee: number;
  entryTestFee: number;
  statusId: number;
}
export interface IConcessionReportModel {
    ncity: string;
    nTotal: number;
    nPaid: number;
    nEnrolled: number;
    pTotal: number;
    pPaid: number;
    pEnrolled: number;
};