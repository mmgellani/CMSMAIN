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

import { ISetupPossessionType } from '../../../../models';
import { SetupPossessionTypeService } from '../../../../service';

import * as helper from '../../../../helper';
import { newGuid } from '../../../../helper';

type ValidateSetupPossessionType = { data: ISetupPossessionType, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupPossessionType> = {
    data: {
        fullName: { required },
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'PossessionType-add-edit-model',
    template: require('./index.html')
})
export class SetupPossessionTypeAddEdit extends Vue {
    private repository: SetupPossessionTypeService;
    isActive: boolean = true;
    private data: ISetupPossessionType = {
        possessionTypeId: '', fullName: '', statusId: 0, loggerId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new SetupPossessionTypeService(this.$store);
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else if (this.data.statusId == 0) {
            this.isActive = false;
        }
    }

    cancel() {
        this.$modal.hide('PossessionType-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.loggerId = helper.newGuid();
                this.data.possessionTypeId = newGuid();
                this.data.statusId = 1;
                this.repository.AddOne(this.data)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been inserted successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        });
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
                        });
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