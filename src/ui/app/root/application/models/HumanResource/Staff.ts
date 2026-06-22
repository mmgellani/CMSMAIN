export interface IHumanResourceStaff {
	staffId : string;
	departmentId : string;
	designationId : string;
	countryId : string;
	bloodGroupId : string;
	religionId : string;
	genderId : string;
	fullName : string;
	fatherName : string;
	cnic : string;
	dateOfBirth : Date;
	email : string;
	maritalStatus : boolean;
	contactNo : string;
	address : string;
	picture : string;
	statusId : number;
	loggerId : string;
	empolyeeCode : string;
	cityId : string;
	subCityId:string;

}

export interface IProfileStaff {
    staffId: string;
    departmentId: string;
    designationId: string;
    genderId: string;
    fullName: string;
    fatherName: string;
    dateOfBirth: Date;
    email: string;
    maritalStatus: boolean;
    contactNo: string;
    address: string;
    picture: string;
    statusId: number;
    loggerId: string;
	userId: number;
	countryId : string;
	bloodGroupId : string;
	religionId : string;
	cNIC:string;
}

export interface StaffHODData {
    ide: string;
	fullName: string;
	email:string;
	isChecked:boolean;
}
export interface teachercheckmodel {
   
	fullName: string;
	email:string;
	
}
export interface IHumanResourceEvaluationMaster {

    evaluationId: string;
    fullName: string;
	description: string;
	popupDescription: string;
	statusId:number
}



export interface IHumanResourceEvaluationDetail {

    evaluationDetailId: string;
    evaluationId: string;
	options: Array<optionsls>;
	statusId:number;
	questions:string;
}



export interface optionsls {

    order: number;
    option: string;

}

export interface IEvaluationMaster {
	evaluationId: string;
	fullName: string;
	description: string;
	statusId: number;


}

export interface EvaluationDetail {
	evaluationDetailId: string;
	fullName: string;
	description: string;
	statusId: number;
	options: Array<optionsls>;

	questions: string;


}
export interface ITeacherProfileList {
    newID: string;
    teacherId: string;
    teacherName: string;
    email: string;
    cNIC: string;
    contactNo: string;
    department: string;
    designation: string;
    cityName: string;
    subCity: string;
}
export interface IStaffByCampus {
	staffId : string;
	fullName : string;
	fatherName : string;
	email : string;
	}