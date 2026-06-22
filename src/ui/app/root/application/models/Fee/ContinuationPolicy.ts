export interface IFeeContinuationPolicy {
	continuationPolicyId: string;
	code: string;
	fullName: string;
	maxInstallmentNo: number;
	statusId: number;
	loggerId: string;

}
export interface IFeeContinuationPolicyCB {
	continuationPolicyId: string;
	fullName: string;
	isChecked: boolean;
}