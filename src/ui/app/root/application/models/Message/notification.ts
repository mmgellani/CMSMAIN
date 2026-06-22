export interface IVWNotificationCustomData {
  qDate: string;
  bulkNotificationId: string;
  sendDate: Date;
  quedDate: Date;
  title: string;
  messageText: string;
  operation: string;
  status: number;
  approvalStatus: boolean;
  recipients: number;
  isApproved: boolean;
  mask: string;
  userId: number;
  displayName: string;
  userName: string;

}
export interface IVWNotificationCustomDataex {
  qDate: string;
  bulkNotificationId: string;
  sendDate: Date;
  quedDate: Date;
  title: string;
  messageText: string;
  operation: string;
  status: number;
  approvalStatus: boolean;
  recipients: number;
  isApproved: boolean;
  mask: string;
  userId: number;
  displayName: string;
  userName: string;
  tagName:string;
  isChecked:boolean;
  receiverType:string;
}
export interface IUpdateNotificationMasterVM {
  bulkNotificationId: string;
  operation: string;
}

