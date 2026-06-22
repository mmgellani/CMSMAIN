export interface ISetupBuildingAddressLink {
	addressLinkId : string;
	addressId : string;
	statusId : number;
	loggerId : string;
	buildingId : string;
	preferenceNo : number;
}

export interface ISetupBuildingAddressLinkVM {
    addressLinkId: string;
    addressId: string;
    statusId: number;
    loggerId: string;
    buildingId: string;
    preferenceNo: number;
    buildingName: string;
    address: number;
} 
