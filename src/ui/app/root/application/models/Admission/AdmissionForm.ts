import { ISetupAdmissionType, ISetupBoard, ISetupDegree, ISetupGender, ISetupGroup, ISetupReligion } from "..";

import { ISetupBloodGroup } from "../Setup/BloodGroup";
import { ISetupPassStatus } from "../Setup/PassStatus";

export interface IAdmissionAdmissionForm {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    admissionDate: Date;
    rollNo: string;
    refferenceNo: string;
    statusId: number;
    loggerId: string;
    studentType: string;
    formNo: string;
    operation: string;
}

export interface IAcademicInfo {
    degreeId: string;
    groupId: string;
    institute: string;
    board: string;
    registrationNo: string;
    rollNo: string;
    year: string;
    passStatusId: string;
    obtainMarks: number;
    totalMarks: number;
    classLevel: number

}

export interface IPreAcademicInfo {
    courseId: string;
    obtainMarks: string;
    totalMarks: string;

}

export interface IAdmissionAdmissionFormVM {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    academicInfo: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    parentCNIC: string;
    studentContactNo: string;
    parentContactNo: string;
    guardians: string;
    genderId: string;
    dateOfBirth: Date;
    address: string;
    bloodGroupId: string;
    religionId: string;
    studentLoggerId: string;
    studentType: string;
    formNo: string;
}
export interface IAdmissionAdmissionFormVMEx {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    academicInfo: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    parentCNIC: string;
    studentContactNo: string;
    parentContactNo: string;
    guardians: string;
    genderId: string;
    dateOfBirth: Date;
    address: string;
    bloodGroupId: string;
    religionId: string;
    studentLoggerId: string;
    studentType: string;
    formNo: string;
    admissionDate: Date;
    operation: string;
    annualPackage: number;
    relationship:string;
    cmsRollNo:string;
    cmsSection:string;

}

export interface IAdmissionAdmissionFormCplVM {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    academicInfo: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    parentCNIC: string;
    studentContactNo: string;
    parentContactNo: string;
    guardians: string;
    genderId: string;
    dateOfBirth: string;
    address: string;
    bloodGroupId: string;
    religionId: string;
    campusId: string;
    sessionId: string;
    programDetailId: string;
    shiftId: string;
    admissionStatus: string
    studentType: string;
}
export interface IAdmissionAdmissionFormCpl4VM {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    academicInfo: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    parentCNIC: string;
    studentContactNo: string;
    parentContactNo: string;
    guardians: string;
    genderId: string;
    dateOfBirth: string;
    address: string;
    bloodGroupId: string;
    religionId: string;
    campusId: string;
    sessionId: string;
    programDetailId: string;
    shiftId: string;
    admissionStatus: string
    description: string;
    studentType: string;
    formNo: string;
    admissionDate: Date;
    operation: string;
    isApproved: boolean
    annualPackage: number;
    cmsRollNo:string;
    cmsSection:string;

}


export interface IAdmissionAdmissionFormPromoted {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    academicInfo: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    parentCNIC: string;
    studentContactNo: string;
    parentContactNo: string;
    guardians: string;
    genderId: string;
    dateOfBirth: string;
    address: string;
    bloodGroupId: string;
    religionId: string;
    campusId: string;
    sessionId: string;
    programDetailId: string;
    shiftId: string;
    admissionStatus: string
    description: string;
    studentType: string;
    formNo: string;
    admissionDate: Date;
    operation: string;
    isApproved: boolean
    annualPackage: number;
    promotedFrom: string;
    flag: number;
}


export interface IVWAdmissionFormCpl3 {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    academicInfo: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    parentCNIC: string;
    studentContactNo: string;
    parentContactNo: string;
    guardians: string;
    genderId: string;
    dateOfBirth: string;
    address: string;
    bloodGroupId: string;
    religionId: string;
    campusId: string;
    sessionId: string;
    programDetailId: string;
    shiftId: string;
}

export interface IVWStudentsProfile {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    academicInfo: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    parentCNIC: string;
    studentContactNo: string;
    parentContactNo: string;
    guardians: string;
    genderId: string;
    dateOfBirth: string;
    address: string;
    bloodGroupId: string;
    religionId: string;
    campusId: string;
    sessionId: string;
    programDetailId: string;
    shiftId: string;
    description: string;
    campusName: string;
    cityName: string;
    shouldAbsent: boolean;
    image: string;
}
export interface IVWStudentsProfileEx {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    academicInfo: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    parentCNIC: string;
    studentContactNo: string;
    parentContactNo: string;
    guardians: string;
    genderId: string;
    dateOfBirth: string;
    address: string;
    bloodGroupId: string;
    religionId: string;
    campusId: string;
    sessionId: string;
    programDetailId: string;
    shiftId: string;
    description: string;
    campusName: string;
    cityName: string;
    shouldAbsent: boolean;
    guardianName: string;
    image: string;
    sessionName: string;
}

export interface StudentsProfileCon {
    admissionFormId: string;
    challanTypeId: string;
    refferenceNo: string;
    rollNo: string;
    fullName: string;
}
export interface ConcessKinBulk {
    admissionFormId: string;
    refferenceNo: string;
    fullName: string;
    fatherName: string;
    isChecked: boolean;
    percentage: number;
    formNo: string;
}

export interface ConcessKinBulkEx extends ConcessKinBulk {
    obtainMarks: number;
    totalMarks: number;
}

export interface IVWStudentFeeProfile {
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
    statusId: number;
    loggerId: string;
    totalMarks: string;
    obtainMarks: string;
    sectionName: string;
    remarks: string;
}

export interface IStudentModel {
    admissionFormId: string;
    studentId: string;
    rollNo: string;
    referrenceNo: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    studentContactNo: string;
    percentage: number;
    zoneId: number;
}

export interface IStudentModelCB {
    admissionFormId: string;
    studentId: string;
    rollNo: string;
    referrenceNo: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    studentContactNo: string;
    percentage: number;
    zoneId: number;
    isChecked: boolean;
}
export interface IScholarshipStudentModel {
    admissionFormId: string;
    studentId: string;
    rollNo: string;
    referrenceNo: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    studentContactNo: string;
    percentage: number;
    zoneId: string;
    scholarshipId: string;
    scholarshipName: string;
}

export interface IScholarshipApplyVM {
    scholarshipName: string;
    count: number;
}
export interface DDLGroupModel {
    title: string;
    group: Array<DDLModel>;
}
export interface DDLGroupModelCB {
    title: string;
    group: Array<DDLModelCB>;
}
export interface DDLModel {
    id: string;
    text: string;
}

export interface DDLModelCB {
    id: string;
    text: string;
    isChecked: boolean
}


export interface CheckFeeExist {

    checkFeeStructure: string
}
export interface IMarks {
    marks: number;
}

export interface IAdmissionFormData {
    admissionType: ISetupAdmissionType[];
    gender: ISetupGender[];
    religion: ISetupReligion[];
    degree: ISetupDegree[];
    group: ISetupGroup[];
    totalMarks: IMarks[];
    board: ISetupBoard[];
    passStatus: ISetupPassStatus[];
    bloodGroup: ISetupBloodGroup[];

}


export interface AdmissionsCount {
    admissionCount: number;
}

export interface IElUsersModel {
    userId: string;
    roleId: string;
    userName: String;
    password: String;
    varification: String;
    isEnable: number;
    batch: number;
}

export interface FeeStudentChallanCount {
    paidChallanCount: number;
}

export interface EnrollmentsCount {
    enrollmentCount: number;
}

export interface VWStudentSectionProfile {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    academicInfo: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    parentCNIC: string;
    studentContactNo: string;
    parentContactNo: string;
    sectionCourseLinkId: string;
    genderId: string;
    dateOfBirth: string;
    address: string;
    bloodGroupId: string;
    religionId: string;
    campusId: string;
    sessionId: string;
    programDetailId: string;
    shiftId: string;
    description: string;
    campusName: string;
    cityName: string;
    classId: string;
}
export interface VWStudentSectionProfile2 {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    academicInfo: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    parentCNIC: string;
    studentContactNo: string;
    parentContactNo: string;
    sectionCourseLinkId: string;
    genderId: string;
    dateOfBirth: string;
    address: string;
    bloodGroupId: string;
    religionId: string;
    campusId: string;
    sessionId: string;
    programDetailId: string;
    shiftId: string;
    description: string;
    campusName: string;
    cityName: string;
    classId: string;
    className: string;
}

export interface DuplicateAdmission {
    admissionFormId: string;
    refferenceNo: string;
    fullName: string;
    fatherName: string;
    contactNo: string;
    boardRollNo: string;
    isChecked: boolean;
}

export interface ElMigrationVM {
    studentId: string;
    rollNo: string;
    fullName: string;
    fatherName: string;
    isChecked: boolean;
}
export interface KinshipStudent {
    admissionFormId: string;
    campusProgramId: string;
    refferenceNo: string;
    fullName: string;
    fatherName: string;
    isChecked: boolean;
    rollTeachId: string;
    relName: string;
    relFatherName: string;
    type: string;
    city: string;
    session: string;
    program: string;
    section: string;

}
export interface OnlineApprovalStudent {
    admissionFormId: string;
    campusProgramId: string;
    refferenceNo: string;
    fullName: string;
    fatherName: string;
    isApproval: boolean;
    admissionDate: Date;
    apllicationStatus: string;
}

export interface PreDashoboard {
    total: number;
    online: number;
    office: number;
    enrolled: number;
    cityName: string;
}

// export interface IAdmissionGenderDashboard {
//     description: string;
//     gendercount: number;
// }

export interface FeeDefaultEx {
    programDetailId: string;
    campus: string;
    description: string;
    programName: string;
    sessionName: string;
    studentCount: number;
    defaultAmount: number;
    installment: number;
}

export interface KinshipConcession {

    scholarshipCriteriaId: string;
    concessionName: string;
}

export interface ProgramMult {
    programDetailId: string;
    description: string;
    formCollection: number;
    feePaid: number;
}

export interface CityMult {
    programDetailId: string;
    cityName: string;
    formCollection: number;
    feePaid: number;
}

export interface ICityMultDrill {
    id: string;
    cityName: string;
    enrolled: number;
    feePaid: number;
    className:string;
}

export interface AdmissiontrendClass {
    paidDate: string;
    count: number;
}
export interface OnlineAdmissionUpdData {
    studentId: string;
    admissionFormId: string;
    parentCNIC: string;
    refferenceNo: string;
    studentName: string;
    fatherName: string;
    parentNo: string;
    studentNo: string;
    address: string;
    year: string;
    boardRollNo: string;
    total: number;
    obtained: number;
    board: string;
    email: string;
    rollNo: string;
    institution: string;
    degreeId: string;
    gender: string;
    program: string;
    city: string;
    groupId: string;
    dateOfBirth: Date;
    admissionDate: string;
}
export interface OnlineAdmissionUpdDataEx {
    studentId: string;
    admissionFormId: string;
    parentCNIC: string;
    refferenceNo: string;
    studentName: string;
    fatherName: string;
    parentNo: string;
    studentNo: string;
    address: string;
    year: string;
    boardRollNo: string;
    total: number;
    obtained: number;
    board: string;
    email: string;
    rollNo: string;
    institution: string;
    degreeId: string;
    gender: string;
    program: string;
    city: string;
    groupId: string;
    dateOfBirth: Date;
    admissionDate: string;
    challanNo:string;
    feeAmount:string;
}
export interface AdmissionAgingData {
    admissionFormId: string;
    studentRno: string;
    studentName: string;
    fatherName: string;
    formNo: string;
    email: string;
    phoneNo: string;
    regdate: string;
    fatherCnicCheck: string;
    studentCnic: string;
    studentPic: string;
    resultCard: string;
    admissionStatus: string;
    aging: string;
}
export interface TransferList {
    admissionFormId: string;
    refferenceNo: string;
    fullName: string;
    fatherName: string;
    classId: string;


}

export interface TransferListEx extends TransferList {
    isChecked: boolean;


}

export interface admissionStatus {
    statusCount: number;
    apllicationStatus: string;
    orderBy: number;
}
export interface AdmissionConcession {
    admissionConcessionId: string;
    admissionUserId: string;
    concessionType: string;
    oldRollNo: string;
    fullName: string;
    session: string;
    program: string;
    section: string;
    address: string;
    status: number;
    admissionFormId: string;
    concessionId: string;
    fatherName: string;
    city: string;
}

export interface IStudentCreditNotes {
    NewID: string;
    Sr:number;
    RefferenceNo:string;
    StudentName:string;
    ChallanNo:string;
    InstallmentNo: number;
    Amount: number;
    isChecked:boolean;
    paidDate:string;
}
export interface IStudentfeedback {
      newID:string;
      admissionFormId:string;
      subCity:string;
      rollNo:string;
      name:string;
      program:string;
      date:string;
      plateForm:string;
      feedBack:string;
      parentNo:string;
      studentNo:string;
}
export interface IStudentfeedbackagainststudent {
    newID:string;
    subCity:string;
    rollNo:string;
    name:string;
    program:string;
    date:string;
    plateForm:string;
    feedBack:string;
    parentNo:string;
    studentNo:string;
}
export interface IInstallmentNos {
    id: string;
    installmentNo: number;
}

export interface IAttendanceCutOffDate {
    id: string;
    cutOffDate: string;
}
export interface IGetConcessionReversalStudents {
    admissionFormId: string;
    rollNo:string;
    studentName:string;
    total: number;
    presents: number;
    absents: number;
    leave: number;
    percentage: number;
    currentConcession:string;
    reConcession:string;
    isChecked:boolean;
    installmentNo:number;
    classId:string;
}
export interface IssatStudentData {
    refferenceNo: string;
    date: string;
    studentName: string; 
    fatherName: string;
    studentCNIC: string;
    phoneNo: string; 
    email: string;
    collegeName: string;
    rollNo: string; 
    marks: string;
    programDetail: string;
    provinceName: string; 
    cityName: string; 
}
export interface StudentResult{ 
 refrenceNo :string;
 programName :string;
 studentName:string;
 studentCNIC :string;

}
export interface EnrolledStudentResult{ 
    refrenceNo :string;
    programName :string;
    studentName:string;
    studentCNIC :string;
    rollNo:string;
    className:string;
    campusName:string;
   }