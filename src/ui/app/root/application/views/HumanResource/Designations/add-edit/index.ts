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

import { IHumanResourceDesignations } from '../../../../models';
import { HumanResourceDesignationsService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateHumanResourceDesignations = { data: IHumanResourceDesignations, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateHumanResourceDesignations> = {
    data: {
        // designationId: { required },
        fullName: { required },
        category: { required },
        // statusId: { required },
        // loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'Designations-add-edit-model',
    template: require('./index.html')
})
export class HumanResourceDesignationsAddEdit extends Vue {
    private repository: HumanResourceDesignationsService;
    private isActive: boolean = true;
    private data: IHumanResourceDesignations = {
        designationId: '', fullName: '', category: '', statusId: 0, loggerId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new HumanResourceDesignationsService(this.$store);
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else {
            this.isActive = false;
        }
    }

    cancel() {
        this.$modal.hide('Designations-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.designationId = helper.newGuid();
                this.data.statusId = 1;
                this.data.loggerId = helper.newGuid();
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
                    this.data.statusId = 1;
                }
                else {
                    this.data.statusId = 0;
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
            this.cancel();
        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}