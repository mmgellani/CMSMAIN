/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { IExaminationGradingDetail, IExaminationGradingMaster } from '../../../../models/Examination/GradingCriteria';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, required } from 'vuelidate/lib/validators';

import Component from 'vue-class-component';
import { ExaminationGradingDetailService } from '../../../../service/Examination/GradingDetail';
import { ExaminationGradingMasterService } from '../../../../service/Examination/GradingMaster';
import { ExaminationGradingPolicyService } from '../../../../service';
import { IExaminationGradingPolicy } from '../../../../models';
import { IPhoneNumber } from '../../../Setup/Address/add-edit';
import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

export interface IGradingInfo {
    maxMarks: number;
    gradeLetter: string;
}

export interface DeletedVal {
    val: string;
}

type ValidateExaminationGradingPolicy = { data: IExaminationGradingMaster, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateExaminationGradingPolicy> = {
    data: {
        name: { required }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'grading-olicy-preview',
    template: require('./index.html')
})
export class GradingPolicyPreview extends Vue {
    private repository: ExaminationGradingMasterService;
    private repo: ExaminationGradingDetailService;
    private data: IExaminationGradingMaster = {
        gradingMasterId: '', name: '', statusId: 1, loggerId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private isActive: boolean = true;
    private name: string;
    private DeletedList: Array<DeletedVal> = [];

    private gradingInfo: Array<IGradingInfo> = []
    private gradingDetail: Array<IExaminationGradingDetail> = []
    private gradingDetailNew: Array<IExaminationGradingDetail> = []
    //private gradingMaster: IExaminationGradingMaster = {gradingMasterId:'', name: '', statusId: 1, loggerId: ''};

    private campusId: string;
    private classId: string;
    private gradingMasterId: string;
    private sectionId: string;
    private detailLength = 0;
    private phoneResult:boolean=false;
    //private failDetailList: Array<IExaminationFailDetailCriteria> = [];
    //private newfailDetailList: Array<IGradingInfo> = [];
    created() {
        this.repository = new ExaminationGradingMasterService(this.$store);
        this.repo = new ExaminationGradingDetailService(this.$store);
    }

    addStudentInfo() {
        this.gradingInfo.push({ maxMarks: 0, gradeLetter: '' })
    }
    delStudentInfo(model: IGradingInfo, val: any) {
        var response = confirm('Are you sure to Delete this');
        if (response) {
            var index = this.gradingInfo.indexOf(model);
            this.gradingInfo.splice(index, 1)
            this.DeletedList.push({ val: val });
            if (this.IsNewRecord == false) {
                this.DeletedVal();
            }
        }

    }

    DeletedVal() {

        if (this.DeletedList.length > 1) {
            var z = (JSON.stringify(this.DeletedList));
            this.repo.DeleteGradingDetail(z).then(r => {

            })
        }

    }
    fullName=''
    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord =false;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        this.DeletedList = [];
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else {
            this.isActive = false;
        }
        if (this.IsNewRecord == false) {
            this.gradingMasterId = event.params.gradingMasterId;
            this.fullName = event.params.fullName;
            this.repo.GetFind(this.gradingMasterId)
                .then(response => {
                    this.gradingInfo = (response as Array<IExaminationGradingDetail>)

                    this.detailLength = this.gradingInfo.length;
                });
        }
    }

    cancel() {
       

        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }
    cancel2() {
        this.data = {
            gradingMasterId: '', name: '', statusId: 1, loggerId: '',
        };
        this.gradingInfo = [];
        this.$modal.hide('grading-olicy-preview');
    }
    validated(val) {

        var phoneRGEX = /[A-Za-z\s+-]/;
        this.phoneResult = phoneRGEX.test(val);
        alert(this.phoneResult);
        return this.phoneResult;

    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.gradingDetail = [];
                this.data.gradingMasterId = helper.newGuid();
                this.data.loggerId = helper.newGuid();
                this.data.statusId = 1;

                // this.gradingInfo.forEach(e => {
                //     this.gradingDetail.push({ gradingDetailId: helper.newGuid(), maxMarks: e.maxMarks, gradeLetter: e.gradeLetter, gradingMasterId: this.data.gradingMasterId, statusId: 1, loggerId: helper.newGuid() })
                // })

                // this.gradingMaster = { gradingMasterId: this.data.gradingMasterId, name: this.data.name, statusId: 1, loggerId: this.data.loggerId }

                if (this.gradingInfo.length > 0) {

                    var key = JSON.stringify(this.data) + "?" + JSON.stringify(this.gradingInfo)

                    this.repository.AddBulk(key)
                        .then(() => {

                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: 'Record has been inserted successfully',
                                title: 'Success',
                                messageTypeId: PayloadMessageTypes.success
                            })

                            this.cancel();
                        });
                }
                else {

                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Please Enter Grading Policy Detail',
                        title: '',
                        messageTypeId: PayloadMessageTypes.warning
                    })



                }
            } else {

                if (this.isActive == true) {
                    this.data.statusId = 1;
                } else {
                    this.data.statusId = 0;
                }

                this.gradingDetailNew = []
                if (this.gradingInfo.length > this.detailLength) {
                    this.gradingInfo.slice(this.detailLength, this.gradingInfo.length).forEach(e => {
                        this.gradingDetailNew.push({ gradingDetailId: helper.newGuid(), maxMarks: e.maxMarks, gradeLetter: e.gradeLetter, gradingMasterId: this.data.gradingMasterId, statusId: 1, loggerId: helper.newGuid() })
                    })
                }

                var key = JSON.stringify(this.data) + "?" + JSON.stringify(this.gradingInfo) + "?" + JSON.stringify(this.gradingDetailNew);
                this.repository.EditBulkCriteria(key).then(r => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Record has been Updated successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                    this.cancel();
                });
            }
            // {
            //     if (this.isActive == true) {
            //         this.data.statusId = 1
            //     }
            //     else {
            //         this.data.statusId = 0
            //     }

            //     this.repository.Update(this.data)
            //         .then(() => {
            //             this.$store.dispatch(StoreTypes.updateStatusBar, {
            //                 text: 'Record has been updated successfully',
            //                 title: 'Success',
            //                 messageTypeId: PayloadMessageTypes.success
            //             })
            //             this.cancel();
            //         });
            // }
        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any;

}