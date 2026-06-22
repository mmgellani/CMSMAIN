/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, required } from 'vuelidate/lib/validators';

import Component from 'vue-class-component';
import { FeeContinuationPolicyService } from '../../../../service';
import { IFeeContinuationPolicy } from '../../../../models';
import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

type ValidateFeeContinuationPolicy = { data: IFeeContinuationPolicy, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeContinuationPolicy> = {
    data: {
        code: { required },
        fullName: { required },
        maxInstallmentNo: { required }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'ContinuationPolicy-add-edit-model',
    template: require('./index.html')
})
export class FeeContinuationPolicyAddEdit extends Vue {
    private isActive: boolean = true;
    private repository: FeeContinuationPolicyService;
    private data: IFeeContinuationPolicy = {
        continuationPolicyId: '', code: '', fullName: '', maxInstallmentNo: 1, statusId: 0, loggerId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private listData: Array<IFeeContinuationPolicy> = [];
    created() {
        this.repository = new FeeContinuationPolicyService(this.$store);
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        Object.assign(this.listData,event.params.listData);
        console.log(this.listData.length)
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true
        }
        else {
            this.isActive = false
        }
        if(this.IsNewRecord==true)
        {
            this.data.maxInstallmentNo=1
        }

    }

    cancel() {
        this.$modal.hide('ContinuationPolicy-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.loggerId = helper.newGuid();
                this.data.statusId = 1;
                this.data.continuationPolicyId = helper.newGuid()
                //console.log(this.listData.find(s=>s.fullName.toLowerCase()==this.data.fullName.toLowerCase()))
                if(this.listData.find(s=>s.fullName.toLowerCase()==this.data.fullName.toLowerCase())==null){
                    this.repository.AddOne(this.data)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been inserted successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });
                }
                else{
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Duplicate Record Cannot be Entered',
                        title: 'Warning',
                        messageTypeId: PayloadMessageTypes.warning
                    })
                }
               
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