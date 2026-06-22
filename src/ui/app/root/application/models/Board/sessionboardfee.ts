export interface ISessionBoardFee {
    sessionBoardFeeId: string;
    sessionId: string;
    boardId: string;
    feeHeadId:string;
    amount: number;
    statusId: number;
}

export interface ISessionBoardFeeVM {
    sessionBoardFeeId: string;
    sessionId: string;
    feeHead: string;
    board: string;
    session: string;
    boardId: string;
    challanTypeId: string;
    feeHeadId: string;
    amount: number;
    statusId: number;
}