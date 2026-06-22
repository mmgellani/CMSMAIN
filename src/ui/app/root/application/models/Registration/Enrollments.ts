export interface IRegistrationEnrollments {
    enrollmentId: string;
    admissionFormId: string;
    sectionCourseLinkId: string[];
    statusId: number;
    loggerId: string;

}

export interface IStudentToEnrollVM {
    admissionFormId: string;
    campusProgramId: string;
    classId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    sectionId: string;
    range: string;
    isSelected: boolean;
    isDisabled: boolean;
    genderId: string;
    statusId: number;
    obtainedMarks:string;

}
export interface IStudentsToEnrolledPercentageVM {
    admissionFormId: string;
    campusProgramId: string;
    classId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    sectionId: string;
    range: string;
    isSelected: boolean;
    isDisabled: boolean;
    genderId: string;
    statusId: number;

}

export interface IStudentEnrolledVM {
    admissionFormId: string;
    campusProgramId: string;
    classId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    sectionId: string;
    range: string;
    isSelected: boolean;
    isDisabled: boolean;
    genderId: string;
    statusId: number;
    sectionName: string;
    sessionId: string;
    campusId: string;
    programDetailId: string;
    sectionCourseLinkId: string;
    enrollmentId: string
    loggerId: string;
    programId:string;
    className:string;

}

export interface IToEnrollWithoutPaidVM {
    admissionFormId: string;
    campusProgramId: string;
    classId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    sectionId: string;
    range: string;
    isSelected: boolean;
    isDisabled: boolean;
    genderId: string;
    statusId: number;
}

export interface HadafStudent {
    StudentId: string;
    FullName: string;
    FatherName: string;
    StudentCNIC: string;
    ParentCNIC: string;
    StudnetContactNo: string;
    ParentContactNo: string;
    GenderId?: string;
    DateOfBirth?: string;
    Address: string;
    BloodGroupId?: string;
    ReligionId?: string;
    StatusId: number;
    LoggerId?: string;
    AcademicInfo: string;
    Images: string;
    AdmissionFormId?: string;
    CampusProgramId?: string;
    AdmissionTypeId?: string;
    GroupID?: string;
    RollNo: string;
    ReferenceNo: string;
    AdmissionDate?: string;
    isSelected: boolean;
}

export interface CmsModel {
    City: string;
    Campus: string;
    Combination: string;
    AdmissionYear: number;
    CurrentCampusID: number;
    Program: string;
    Shift_ID: number;
    Medium_ID: number;
    Admission_Form_ID: number;
    Program_Detail_ID: number;
    Rollno: string;
    ReferenceNo: string;
    AdmissionType: string;
    Admission_Date_Save: string;
    Admission_Date: string;
    Status_ID: number;
    StudentName: string;
    FatherName: string;
    StudentCNIC: string;
    Father_CNIC: string;
    StudentContactNo: string;
    Father_Phone_No: string;
    Guardians: string;
    Date_of_Birth: string;
    Gender_ID: number;
    Blood_Group_ID: string;
    Religion_ID: string;
    Image: string;
    Address: string;
    Class: string;
    Matric_Registration_Number: string;
    Board_Registration_Number: string;
    Academicinfo: string;
    IsSelected: boolean;
}


export interface StudentPromotionList {
    admissionFormId: string;
    refferenceNo: string;
    rollNo: string;
    fullName: string;
    sectionCourseLinkId:string;
    isSelected:boolean;
}
export interface StudentPromotionListEx {
    admissionFormId: string;
    refferenceNo: string;
    rollNo: string;
    fullName: string;
    sectionCourseLinkId:string;
    campusProgramId:string;
    isSelected:boolean;
}

export interface StudentPromotionPreList {
    admissionFormId: string;
    refferenceNo: string;
    rollNo: string;
    fullName: string;
    sectionCourseLinkId:string;
    isSelected:boolean;
    range: string;
    newRollNo :string;
}

