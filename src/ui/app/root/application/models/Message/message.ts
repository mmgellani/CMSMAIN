export interface IMessage {
    messageText: string;
    sendToList: string;
}
export interface ISmsAPI {
    smsApId: string;
    loginId: string;
    password: string;
    shortCodePref: string;
    isUnicode: string;
    mask: string;
}
export interface MessageApproval {
    viewId: string;
    messageText: string;
    recipients: number;
    quedDate: string;
    isApproved: boolean;
    mask: string;
    userId: number;
    displayName: string;
    username: string;
    messageCount:number; 

}
export interface MessageApprovalex {
    viewId: string;
    messageText: string;
    recipients: number;
    quedDate: string;
    isApproved: boolean;
    mask: string;
    userId: number;
    displayName: string;
    username: string;
    messageCount:number; 
    isChecked: boolean;

}
export interface ITemplates {
    templateId: string;
    type: string;
    title: string;
    description: string;
    status: number;
    sendSms: number;
    sendNotification: number;
}
export interface ISms {

    messageId: string;
    messageNo: string;
    messageText: string;
    quedDate: Date;
    sendDate: Date;
    sendTo: string;
    status: number;
    smsApId:string;
}

export interface ISmsApproval {
    messageId: string;
    messageNo: string;
    messageText: string;
    quedDate: Date;
    sendDate: Date;
    sendTo: string;
    status: number;
    smsApId?: string;
    isApproved: boolean;
    userId: number;
}
export interface IVWCustomData {
    admissionFormId: string;
    campusProgramId: string;
    rollNo: string;
    refferenceNo: string;
    statusId: number;
    fullName: string;
    fatherName: string;
    campusId: string;
    programDetailId: string;
    sessionId: string;
    studentContactNo: string;
    parentContactNo: string;
    sectionCourseLinkId: string;
    classId: string;
    className: string;
    sectionId: string;
    sectionName: string;
}
export interface MessageDetailStud {

    messageId: string;
    messageText: string;
    sendDate: Date | string;
  
    status: number;
    messageNo:string;

}

export interface ContactList{
    phoneNo: string;
}

export interface migrationtransferlist{
    newId: string;
    Type: string;
    dateTime: string;
    fromCampus: string;
    toCampus: string;
}