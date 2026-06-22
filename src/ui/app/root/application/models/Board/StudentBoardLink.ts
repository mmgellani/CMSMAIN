export interface IBoardStudentBoardLink {
    studentBoardLinkId: string;
    admissionFormId: string;
    returnTypeId: string;
    registrationCodeId: string;
    dueDate: Date;
    amount: number;
    returnDate: Date;
    statusId: number;
    boardUniversityNo:string;
}

export interface StudentBoardLinkData {
    studentBoardLinkId: string;
    student: string;
    rollNo: string;
    description: string;
    fullName: string;
    fatherName:string;
    amount: number;
    returnTypeId: string;
    registrationCodeId: string;
    returnDate: string;
    dueDate: string;
    boardName:string;
    boardUniversityNo:string;
}

export interface StudentBoardUniversityRollNoList
{
    boardUniRollNoSlipId:string;
    boardUniversityExamEntryId:string;
    rollNo:string;
    fullName:string;
    fatherName:string;
    boardUniversityNo:string;
    boardRollNo:string;



}
export interface StudentBoardUniversityResultCard
{
    boardUniResultCardId:string;
    boardUniRollNoSlipId:string;
    rollNo:string;
    fullName:string;
    fatherName:string;
    boardUniversityNo:string;
    boardRollNo:string;
    passFailCriteria:string;



}
export interface StudentBoardExamEntry 
{
    admissionFormId:string;
    rollNo:string;
    fullName:string;
    fatherName:string
    boardUniversityNo:string
    examTypeName:string;
    examTypeId:string;
    examYear:string;



}
export interface BoardUniRolNoslip {

    boardUniRollNoSlipId:string;
    boardUniversityExamEntryId:string;
    boardRollNo:string;
    statusId:number
}

export interface boardUniResultCards
{
    boardUniRollNoSlipId:string;
    boardUniResultCardId:string;
    passFailCriteria:string;
    statusId:number


}
export interface BoardUniversityRollData
{
    admissionFormId:string;
    boardUniversityExamEntryId:string;
    boardRollNo:string;
    rollNo:string;
    fullName:string;
    fatherName:string
    boardUniversityNo:string
    examTypeName:string;
    examTypeId:string;
    examYear:string;



}
export interface StudentBoardRegistration {
    admissionFormId: string;
    rollNo: string;
    fullName: string;
    fatherName:string;
    sectionName:string;
    boardUniversityNo:string;
}

export interface StudentBoardRegistrationEx {
    admissionFormId: string;
    rollNo: string;
    fullName: string;
    fatherName:string;
    boardUniversityNo:string;
    isSelected:boolean;
}

export interface BoardFeePaidStudent {
    admissionFormId: string;
    fullName: string;
    fatherName:string;
    rollNo: string;
    isSelected:boolean;
    boardNo:string;

}

export interface StudentBoardUnivertySearch 
{
    admissionFormId:string;
    boardName:string;
    year:string;
    rolln:string;
    regNo:string;
    studentId:string;
    student:string;
    fatherName:string;
    rollNo:string;
    boardUniversityNo:string;
    examType:string;
    
 }
 