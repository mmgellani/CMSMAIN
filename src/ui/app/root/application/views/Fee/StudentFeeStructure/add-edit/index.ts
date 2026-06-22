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

import { IFeeStudentFeeStructure } from '../../../../models';
import { FeeStudentFeeStructureService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateFeeStudentFeeStructure = { model: IFeeStudentFeeStructure, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeStudentFeeStructure> = {
    model: {
	studentFeeStructureId: { required },
	admissionFormId: { required },
	classId: { required },
	installmentNo: { required },
	feeHeadId: { required },
	feeAmount: { required },
	payableAmount: { required },
	statusId: { required },
	loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class FeeStudentFeeStructureAddEdit extends Vue {
    private repository: FeeStudentFeeStructureService;
    private data: IFeeStudentFeeStructure = {
        studentFeeStructureId: '', admissionFormId: '', classId: '', installmentNo: 0, feeHeadId: '', feeAmount: 0, concessionDetailId: '', payableAmount: 0, statusId: 0, loggerId: '', 
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new FeeStudentFeeStructureService(this.$store);
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        if (this.IsNewRecord) {
            this.data.loggerId = helper.newGuid();
            this.repository.AddOne(this.data)
                .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been inserted successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                })
                this.cancel();
            });
        } else {
            this.repository.Update(this.data)
                .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been updated successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                })
                this.cancel();
            });
        }

        this.cancel();
    }
    get allowSubmit() {
        return (this.data.feeAmount > 0) ;
    }
    $v: Vuelidate<any>;
}