export interface IFeeChallanValidity {
    challanValidityId: string;
    campusId: string;
    installmentNo: number;
    fromDate: Date;
    toDate: Date;
    statusId: number;
    loggerId: string;
    campusProgramId:string;
    classId: string;
}

export interface ICampusChallanValidityVM {
    challanValidityId: string;
    campusId: string;
    fullName: String;
    installmentNo: number;
    fromDate: Date;
    toDate: Date;
    statusId: number;
    loggerId: string;
    campusProgramId: string;
    description:string;
    classId: string;
    sessionid:string;
}

export interface IVMChallanValidityUpdate {
    challanNo: string;
    rollNo: string;
    fullName: String;
    admissionFormId: string;
    feeAmount: number;
    installmentNo: number;
    dueDate: Date;
    paidDate: Date;
    statusId: number;
    sessionId: string;
    campusId: string;
    programDetailId: string;
    classId: string;
    sectionId: string;
    isSelected: boolean;
    sectionCourseLinkId: string;
    allowButton:boolean;

}
export interface IVMChallanValidityUpdateEx {
    challanNo: string;
    rollNo: string;
    fullName: String;
    admissionFormId: string;
    feeAmount: number;
    installmentNo: number;
    dueDate: Date;
    paidDate: Date;
    statusId: number;
    sessionId: string;
    campusId: string;
    programDetailId: string;
    classId: string;
    sectionId: string;
    isSelected: boolean;
    sectionCourseLinkId: string;
    refferenceNo:string;
    genderid:string;
    allowButton:boolean;
}

export interface StudentUserGenEx {
    studentId: string;
    rollNo: string;
    fullName: string;
    sectionCourseLinkId: string;
    isSelected: Boolean;
}

export interface IChallanValidityUpdate {
    challanNo: string;
    rollNo: string;
    fullName: String;
    admissionFormId: string;
    feeAmount: number;
    installmentNo: number;
    dueDate: Date;
    paidDate: Date;
    statusId: number;
    sessionId: string;
    campusId: string;
    programDetailId: string;
    classId: string;
    sectionId: string;
    isSelected: boolean;
    sectionCourseLinkId: string;
    newDueDate:Date;
    genderId:string;
    allowButton:boolean;
    enablePrintButton:boolean;
    expiredButton:boolean;
}