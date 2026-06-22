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

import { IFeeChallanType } from '../../../../models';
import { FeeChallanTypeService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateFeeChallanType = { data: IFeeChallanType, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeChallanType> = {
    data: {
        code: { required },
        fullName: { required }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'ChallanType-add-edit-model',
    template: require('./index.html')
})
export class FeeChallanTypeAddEdit extends Vue {

    private repository: FeeChallanTypeService;
    isActive: boolean = true;
    private data: IFeeChallanType = {
        challanTypeId: '', code: '', fullName: '', statusId: 0, loggerId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new FeeChallanTypeService(this.$store);
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true
        }
        else {
            this.isActive = false
        }
    }

    cancel() {
        this.$modal.hide('ChallanType-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.loggerId = helper.newGuid();
                this.data.challanTypeId = helper.newGuid();
                this.data.statusId = 1;
                this.repository.AddOne(this.data)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been inserted successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });
            } else {
                if (this.isActive == true) {
                    this.data.statusId = 1
                }
                else {
                    this.data.statusId = 0
                }
                this.repository.Update(this.data)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been updated successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });
            }
        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}