import { ICommonState } from '../../store';

export interface IRootState {
    apiCallContent: string;
    sidebarClose: boolean;
    sidebarStatic: boolean;
    sidebarActiveElement: any;
    chatOpen: boolean;
    feeStudentInfo: any;
    reportOperation: any;
}

export interface IRootStoreState extends IRootState {
    common?: ICommonState
}