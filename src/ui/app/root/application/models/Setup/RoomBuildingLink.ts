export interface ISetupRoomBuildingLink {
	
	roomBuildingLinkId : string;
	roomId : string;
	buildingId : string;
	remarks : string;
	statusId : number;
	loggerId : string;

}


export  interface RoomBuildingLinkVM {
    roomBuildingLinkId: string;
    roomId: string;
    buildingId: string;
    remarks: string;
    name: string;
    fullName: string;
    capacity: number;
    statusId: number;
    campusId:string;
    campusName:string;
}
