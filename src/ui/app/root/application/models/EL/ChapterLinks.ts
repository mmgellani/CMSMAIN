export interface IChapterLinks {
    chapterLinkId: string;
    boardProgramClassCourseLinkId: string;
    chapterId: string;
    orderNo: number;
    statusId: number;
}


export interface IChapterLinksVM {
    chapterLinkId: string;
    boardProgramClassCourseLinkId: string;
    chapterId: string;
    board: string;
    program: string;
    class: string;
    course: string;
    alias: string;
    statusId: number;
    chapter: string;
    orderNo:number;
}