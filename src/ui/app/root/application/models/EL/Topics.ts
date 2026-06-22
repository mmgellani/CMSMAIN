export interface IELTopics {
	topicId: string;
	chapterId: string;
	title: string;
	description: string;
	videoLinks: string;
	boardId: string;

	statusId: number;
}

export interface IVideoLinkJson {
	link: string;
}

export interface IELTopicsVm {
	topicId: string;
	chapterId: string;
	title: string;
	description: string;
	videoLinks: string;
	statusId: number;
	boardId: string;
	board: string;

}