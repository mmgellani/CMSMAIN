export interface IAcademicSectionMap {
	academicSectionLinkId: string;
	academicCalendarMasterId: string;
	sectionCourseLinkId: string;
	statusId: number;
}

export interface IAcademicSectionMapVW {
	academicSectionLinkId: string;
	academicCalendarMasterId: string;
	sectionCourseLinkId: string;
	academicMaster: string;
	sectionName: string;
	subCityId: string;
	classId: string;
	boardId: string;
	statusId: number;
}