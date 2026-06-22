import { Number } from "../../../../stimulsoft.reports";

export interface IPreFirstYear {
    name: string;
    studentId: string;
    fatherCnic: string;
    fatherName: string;
    amount: string;
    challanNo: string;
    recievedDate: string;
}
export interface IFeeStudentChallan {
    studentChallanId: string;
    admissionFormId: string;
    classId: string;
    installmentNo: number;
    challanNo: string;
    feeAmount: number;
    fine: number;
    dueDate: Date;
    paidDate: Date;
    statusId: number;
    collectorId: string;
    loggerId: string;
    challanTypeId: string;
}
export interface IFeeStudentChallans {
    studentChallanId: string;
    admissionFormId: string;
    classId: string;
    installmentNo: number;
    challanNo: string;
    feeAmount: number;
    fine: number;
    dueDate: Date;
    paidDate: Date;
    statusId: number;
    collectorId: string;
    loggerId: string;
    challanTypeId: string;
    allowButton:boolean;
}

export interface IFeeStudentChallanEx {
    studentChallanId: string;
    admissionFormId: string;
    classId: string;
    installmentNo: number;
    challanNo: string;
    feeAmount: number;
    dueDate: Date;
    paidDate: Date;
    statusId: number;
    loggerId: string;

}

export interface IFeeStudentChallanSubIns {
    studentChallanId: string;
    admissionFormId: string;
    classId: string;
    installmentNo: number;
    challanNo: string;
    feeAmount: number;
    dueDate: Date;
    paidDate: Date;
    statusId: number;
    loggerId: string;
    subInstallmentAmount: number;

}



export interface IFeeStudentChallanVM {
    feeHeadId: string;
    stfeeamount: number;
    payableAmount: number;
    challanNo: string;
    collectorName: string;
    documentNo: string;
    dueDate: string;
    paidDate?: string;
    statusId: number;
    refferenceNo: string;
    fullName: string;
    fatherName: string;
    campusName: string;
    description: string;
    concessionName: string;
    studentFeeStructureId: string;
    admissionFormId: string;
    studentChallanId: string;
    concessionDetailId?: string;
    campusId: string;
    programDetailId: string;
    installmentNo: number;
    feeHead: string;
    loggerId: string;
    bankId: string;
    bankName: string;
    branch: string;
    feeAmount: number;
    accountNo: string;
    code: string;
    className: string;
    programName: string;
    sessionId: string;
    campusProgramId: string;
    classId: string;
    sectionCourseLinkId: string;
    rollNo: string;


}



export interface IFeeSubinstallmentVM {
    feeHeadId: string;
    studentFeeStructureId: string;
    admissionFormId: string;
    classId: string;
    concessionDetailId: string;
    campusId: string;
    programDetailId: string;
    installmentNo: number;
    feeHead: string;
    fullName: string;
    refferenceNo: string;
    fatherName: string;
    concessionFullName: string;
    campus: string;
    description: string;
    campusCode: string;
    feeAmount: number;
    payableAmount: number;
    statusId: number;
    loggerId: string;
    remarks: string;
    rollNo: string;
    challanTypeId: string;
}
export interface IFeeSubinstallmentVMs {
    feeHeadId: string;
    studentFeeStructureId: string;
    admissionFormId: string;
    classId: string;
    concessionDetailId: string;
    campusId: string;
    programDetailId: string;
    installmentNo: number;
    feeHead: string;
    fullName: string;
    refferenceNo: string;
    fatherName: string;
    concessionFullName: string;
    campus: string;
    description: string;
    campusCode: string;
    feeAmount: number;
    payableAmount: number;
    statusId: number;
    loggerId: string;
    remarks: string;
    rollNo: string;
    challanTypeId: string;
    challanNO:string;
}
export interface IFeeBulkModel {
    feeSubinstallmentVM: IFeeSubinstallmentVM[];
    feeStudentChallan: IFeeStudentChallan[];
}

export interface IFeeBulkModels {
    feeSubinstallmentVM: IFeeSubinstallmentVM[];
    feeStudentChallans: IFeeStudentChallans[];
}
export interface IFeeBulkModelss {
    feeSubinstallmentVMs: IFeeSubinstallmentVMs[];
    feeStudentChallans: IFeeStudentChallans[];
}

export interface ITransportSubinstallmentVM {
    feeHeadId: string;
    studentFeeStructureId: string;
    admissionFormId: string;
    concessionDetailId: string;
    campusId: string;
    programDetailId: string;
    installmentNo: number;
    feeHead: string;
    fullName: string;
    refferenceNo: string;
    fatherName: string;
    concessionFullName: string;
    campus: string;
    description: string;
    campusCode: string;
    feeAmount: number;
    payableAmount: number;
    statusId: number;
    loggerId: string;
    remarks: string;
    rollNo: string;
}


export interface StudentReportData {

    newID: string;
    feeHeadId: string;
    bankName: string;
    accountNo: string;
    studentFeeStructureId: string;
    admissionFormId: string;
    studentChallanId: string;
    concessionDetailId?: string;
    campusId: string;
    programDetailId: string;
    installmentNo: number;
    challanNo: string;
    feeHead: string;
    fullName: string;
    refferenceNo: string;
    fatherName: string;
    challanNote: string;
    concessionName: string;
    campusName: string;
    description: string;
    feeAmount: number;
    challanAmount: number;
    payableAmount: number;
    dueDate: string;
    paidDate?: string;
    statusId: number;
    loggerId: string;
    CampusCode: string;
    businessUnit: string;
    DigitCode: string;
}

export interface StudentChallanReport {
    feeChallanId: string;
    feeHeadId: string;
    studentFeeStructureId: string;
    admissionFormId: string;
    studentChallanId: string;
    concessionDetailId?: string;
    campusId: string;
    programDetailId: string;
    installmentNo: number;
    challanNo: string;
    feeHead: string;
    fullName: string;
    refferenceNo: string;
    fatherName: string;
    concessionName: string;
    campusName: string;
    description: string;
    feeAmount: number;
    challanAmount: number;
    payableAmount: number;
    dueDate: string;
    paidDate?: string;
    challanNote: string;
    statusId: number;
    loggerId: string;
    customerCode: string;
    businessUnit: string;
    totalMarks: string;
    obtainMarks: string;
    sectionName: string;
}

export interface StudentChallanReportEx {
    feeChallanId: string;
    feeHeadId: string;
    studentFeeStructureId: string;
    admissionFormId: string;
    studentChallanId: string;
    concessionDetailId?: string;
    campusId: string;
    programDetailId: string;
    installmentNo: string;
    challanNo: string;
    feeHead: string;
    fullName: string;
    refferenceNo: string;
    fatherName: string;
    concessionName: string;
    campusName: string;
    description: string;
    feeAmount: number;
    challanAmount: number;
    payableAmount: number;
    dueDate: string;
    paidDate?: string;
    statusId: number;
    loggerId: string;
    customerCode: string;
    businessUnit: string;
    totalMarks: string;
    obtainMarks: string;
    sectionName: string;
    cap: string;
    zoneNote: string;
}

export interface TransportChallanReport {
    feeChallanId: string;
    feeHeadId: string;
    studentFeeStructureId: string;
    admissionFormId: string;
    studentChallanId: string;
    campusId: string;
    programDetailId: string;
    installmentNo: number;
    challanNo: string;
    feeHead: string;
    fullName: string;
    refferenceNo: string;
    fatherName: string;
    campusName: string;
    description: string;
    feeAmount: number;
    challanAmount: number;
    payableAmount: number;
    dueDate: string;
    paidDate?: string;
    statusId: number;
    loggerId: string;
    customerCode: string;
    businessUnit: string;
    totalMarks: string;
    obtainMarks: string;
    sectionName: string;
    challanTypeId: string;
}


export interface StudentConcessedData {
    studentFeeStructureId: string;
    studentChallanId: string;
    installmentNo: number;
    feeHeadId: string;
    challanNo: string;
    dueDate: string;
    paidDate?: string;
    fullName: string;
    fatherName: string;
    refferenceNo: string;
    payableAmount: number;
    statusId: number;
    feeAmount: number;
    admissionFormId: string;
    campusId: string;
    sessionId: string;
    shiftId: string;
    programDetailId: string;
}

export interface StudentPaidCountData {
    feeCount: number;
}

export interface ChallanBReport {
    challanNo: string;
    general: GeneralList;
    banks: BankDataList[];
    challanInfo: InfoList[];
    nextInstallment: SubInstList[];
}

export interface GeneralList {
    businessUnit: string;
    campusName: string;
    cap: string;
    refferenceNo: string;
    fullName: string;
    fatherName: string;
    description: string;
    sectionName: string;
    totalMarks: string;
    obtainMarks: string;
    challanNo: string;
    installmentNo: string;
    challanAmount: number;
    dueDate: string;
    customerCode: string;
    docNo: string;
    challanNote: string;
    userName: string;
}

export interface BankDataList {
    challanNo: string;
    bankName: string;
    accountNo: string;
    address: string;
}

export interface InfoList {
    challanNo: string;
    feeHead: string;
    feeAmount: number;
    payableAmount: number;
    concessionName: string;
}

export interface SubInstList {
    challanNo: string;
    challanNoEx: string;
    dueDate?: string;
    feeAmount: number;
}
export interface DisableChallans {
    newID: string;
    myProperty: string;
    displayName: string;
    localIpPort: string;
    device: string;
    operation1: string;
    challanNo: string;
    dueDate: string;
    installmentNo: string;
    paidDate: string;
    fullName:string;
    rollNo:string;
    amount: string;
    refferenceNo:string;
}


export interface IFinanceData {
    id: string;
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
    campus_ID: string;
    generationDate: string;
    boardRegistrationSportsHouseCollegeExam: number;
    collegeFee: number;
    transportation: number;
    boardRegistrationFee: number;
    universityRegistrationFee: number;
    boardExamFee: number;
    universityExamFee: number;
    entryTestFee: number;
}

export interface BankIbanVM {
    campusId: string;
    bankDetail: string;
}

export interface StudentFeePaid {
    studentChallanId: string;
    refferenceNo: string;
    fullName: string;
    installmentNo: number;
    challanNo: string;
    feeAmount: number;
    dueDate: string;
    paidDate?: string;
    challanType: string;
    collector: string;
    campus: string;
    description: string;
}
export interface SubInstallmentNo {
    checkInstallementId: string;
    checkInstallment: string;
    
}
export interface RefundChallanofStudent {
  newID:string;
  studentName:string;
  admissionFormId:string;
  challanNo:string;
  programDetail:string;
  installmentNo:number;  
  challanType:string;
}

export interface AllalreadyRefundChallan {
  refundChallanId:string;
  studentChallanId:string;
  refundAmount:string;
  refundDate:Date;
  challanNo:string;  
   rollNo :string;
   studentName:string;
   fatherName:string;
   payName:string;
   chequeNumber:string;
   remarks:string;
   chequeDate:Date;
   bank:string;
  campusBankLinkId:string;

   detail:string;
}

export interface IRefundChallanFee {
  
  refundAmount:number;
  refundDate:Date;
}