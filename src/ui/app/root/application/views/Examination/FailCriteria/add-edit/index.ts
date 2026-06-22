/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IExaminationExamType } from '../../../../models';
import { ExaminationExamTypeService } from '../../../../service';

import * as helper from '../../../../helper';
import { IExaminationFailMasterCriteria, IExaminationFailDetailCriteria } from '../../../../models/Examination/FailCriteria';
import { ExaminationFailCriteriaService } from '../../../../service/Examination/FailCriteria';

type ValidateExaminationFailCriteria = { failMaster: IExaminationFailMasterCriteria, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateExaminationFailCriteria> = {
    failMaster: {
        fullName: { required },
        fail_In: { required },
        failMarks: { required }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'FailCriteria-add-edit-model',
    template: require('./index.html')
})
export class FailCriteriaAddEdit extends Vue {

    private IsNewRecord: boolean = true;
    private title: string = '';
    private failMaster: IExaminationFailMasterCriteria = {
        absentConsiderFail: false, failMarks: 0, failMasterId: '',
        fail_In: 0, loggerId: helper.newGuid(), statusId: 1, fullName: ''
    }
    private failDetailList: Array<IExaminationFailDetailCriteria> = [];
    private newfailDetailList: Array<IExaminationFailDetailCriteria> = [];
    private detailLength = 0;
    private repo: ExaminationFailCriteriaService = new ExaminationFailCriteriaService(this.$store)
    created() {
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.failDetailList = []
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.failMaster, event.params.failMaster);

        // var failMasterId = event.params.failMasterId;

        if (this.IsNewRecord) {
            this.failDetailList.push({ statusId: 1, loggerId: helper.newGuid(), fail_In: 0, failMasterId: '', description: '', failDetailId: helper.newGuid() })
        }
        else {
            this.repo.GetFailDetailById(this.failMaster.failMasterId)
                .then(r => {
                    this.failDetailList = r as Array<IExaminationFailDetailCriteria>;
                    this.detailLength = this.failDetailList.length;
                })
        }

    }

    addDetail() {

        this.failDetailList.push({ statusId: 1, loggerId: helper.newGuid(), fail_In: 0, failMasterId: '', description: '', failDetailId: helper.newGuid() })


    }
    removeDetail(index: number, item: IExaminationFailDetailCriteria) {
        this.failDetailList.splice(index, 1)
        if (index <= this.detailLength - 1) {
            item.statusId = 2;
            this.repo.DeleteFailDetail(item)
                .then(r => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Record has been deleted successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                })
        }
    }

    cancel() {
        this.failMaster = {
            absentConsiderFail: false, failMarks: 0, failMasterId: '',
            fail_In: 0, loggerId: helper.newGuid(), statusId: 1, fullName: ''
        }
        this.detailLength = 0;
        this.$modal.hide('failCriteria-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.failMaster.failMasterId = helper.newGuid();
                this.failDetailList.forEach(s => {
                    s.failMasterId = this.failMaster.failMasterId
                })
                if (this.failMaster.failMarks >= 0 && this.failMaster.failMarks <= 100 && this.failMaster.fail_In >= 0 && this.failMaster.fail_In <= 100) {
                    var key = JSON.stringify(this.failMaster) + "?" + JSON.stringify(this.failDetailList);
                    console.log(key)
                    this.repo.AddBulkCriteria(key).then(r => {
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
                        text: 'Please Enter Fail Percentage and Exam Fail Count In Valid  Range (0-100)',
                        title: 'Warning',
                        messageTypeId: PayloadMessageTypes.warning
                    })




                }
            }
            else {
                if (this.failDetailList.length > this.detailLength) {
                    this.failDetailList.slice(this.detailLength, this.failDetailList.length).forEach(s => {
                        this.newfailDetailList.push({ statusId: 1, loggerId: helper.newGuid(), fail_In: s.fail_In, failMasterId: this.failMaster.failMasterId, description: s.description, failDetailId: helper.newGuid() })
                    })
                }

                if (this.failMaster.failMarks >= 0 && this.failMaster.failMarks <= 100 && this.failMaster.fail_In >= 0 && this.failMaster.fail_In <= 100) {
                    var key = JSON.stringify(this.failMaster) + "?" + JSON.stringify(this.failDetailList) + "?" + JSON.stringify(this.newfailDetailList);

                    this.repo.EditBulkCriteria(key).then(r => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been Updated successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });
                }
                else {

                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Please Enter Fail Percentage and Exam Fail Count In Valid  Range (0-100)',
                        title: 'Warning',
                        messageTypeId: PayloadMessageTypes.warning
                    })


                }
            }
        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}