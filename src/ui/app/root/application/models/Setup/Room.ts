export interface ISetupRoom {
	roomId : string;
	fullName : string;
	description : string;
	capacity : number;
	roomTypeId : string;
	statusId : number;
	loggerId : string;
	buildingId : string;

}

export interface ISetupRoomTypeBuildingVM {
    roomId: string;
    fullName: string;
    description: string;
    capacity: number;
    roomTypeId: string;
    statusId: number;
    loggerId: string;
    roomTypeName: string;
    buildingName: string;
    buildingId: string;
    campusId: string;
    campusName: string;
}
export interface ISetupRoomBuilding {
    
    roomBuildingLinkId: string;
	sectionId:string;
	roomName:string;
	
}