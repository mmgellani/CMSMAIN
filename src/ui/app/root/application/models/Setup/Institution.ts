export interface ISetupInstitution {
	institutionId : string;
	fullName : string;
	description : string;
	businessUnitID : string;
	code : string;
	institutionTypeId : string;
	statusId : number;
	loggerId : string;

}
export interface ISetupInstitutionVM {
    institutionId: string;
    fullName: string;
    description: string;
    businessUnitID: string;
    businessUnitName: string;
    institutionTypeName: string;
    institutionTypeId: string;
    code: string;
    statusId: number;
    loggerId: string;
}