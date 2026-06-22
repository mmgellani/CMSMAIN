export interface IFeeFeeHead {
    feeHeadId: string;
    fullName: string;
    description: string;
    feeType: number;
    statusId: number;
    loggerId: string;
    orderBy: number;
    challanTypeId: string;
}

export interface IFilterString {
    filterString: string;
	
}
export interface IFilterString2 {
    filterString: string;
	refundAmount:number;
	paidDate:Date;
}
export interface IFeeFeeHeadCheckBox extends IFeeFeeHead{
	
isChecked:boolean
}

export interface IVWStudentsProfileEx1 {
	newID : string;
	admissionFormId: string;
	student_Name : string;
	father_Name : string;
	ref_No : string;
	Reg_No : string;
	program : string;
	programDetail : string;
	Class : string;
	challenType : string;
	challan_Number : string;
	session : string;
	academic_Year : string;
	installmentNo : string;
	admissionFee : string;
	discountOnAdmission : string;
	admission : string;
	tuitionFee: string;
	discountOnTuition : string;
	tuition : string;
	concessionName : string;
	entryTestFee : string;
	distEntryTest : string;
	transportation : string;
	examFee : string;
	tourFee : string;
	other: string;
	status : string;
	due_Date : string;
	payDate : string;
	section : string;
	bank_Account: string;
	totalFeeReceiable: string;
	feeRecived: string;
	balance: string;


}



export interface IVWStudentsProfileEx1new {
	admissionFormId : string;
	student_Name : string;
	father_Name : string;
	ref_No : string;
	Reg_No : string;
	program : string;
	programDetail : string;
	

}


export interface IVWCityFinanceData {
	newID : string;
	campus : string;
	studentsNo : string;
	admission : string;
	distAdmission : string;
	disAdms : string;
	tuitionFee : string;
	discountTutuion : string;
	disTuition : string;
	entryTest : string;
	distEntryTest : string;
	examFee : string;
	tourFee : string;
	transportationFee : string;
	other : string;
	totalFeeReceiable : string;
	feeRecived : string;
 balance: string;
	

}


export   interface      IVWCampusFinanceData{

newID : string;
program : string;
studentsNo : string;
admission : string;
distAdmission : string;
disAdms : string;
tuitionFee : string;
discountTutuion : string;
disTuition : string;
entryTest : string;
distEntryTest : string;
examFee : string;
tourFee : string;
transportationFee : string;
other : string;
totalFeeReceiable : string;
feeRecived : string;
 balance: string;


}


export   interface  IVWProgramFinanceData{

	newID : string;
	refferenceNo : string;
	student_Name : string;
	admissionFee : string;
	distAdmission : string;
	disAdms : string;
	tuitionFee : string;
	discountTutuion : string;
	disTuition : string;
	entryTest : string;
	distEntryTest : string;
	examFee : string;
	tourFee : string;
	transportationFee : string;
	other : string;
	totalFeeReceiable : string;
	feeRecived : string;
	balance: string;
	
	
	}