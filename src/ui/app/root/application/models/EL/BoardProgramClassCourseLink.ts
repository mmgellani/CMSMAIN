export interface IBoardProgramClassCourseLink {
    boardProgramClassCourseLinkId: string;
    boardId: string;
    programId: string;
    classId: string;
    courseId: string;
    statusId: number;
}
export interface IBoardProgramClassCourseVM {
    boardProgramClassCourseLinkId: string;
    boardId: string;
    programId: string;
    classId: string;
    courseId: string;
    board: string;
    program: string;
    class: string;
    course: string;
    alias: string;
    statusId:number;
}