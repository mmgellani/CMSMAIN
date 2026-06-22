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

import { ISetupStatus } from '../../../../models';
import { SetupStatusService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateSetupStatus = { model: ISetupStatus, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupStatus> = {
    model: {
	status: { required },
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class SetupStatusAddEdit extends Vue {
    private repository: SetupStatusService;
    private data: ISetupStatus = {
        statusId: 0, status: '', loggerId: '', 
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private statusident: number = 0;
    private statusDes: string;
    private isActive: boolean = false;

    created() {
        this.repository = new SetupStatusService(this.$store);
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        this.$emit("submit");
        this.$modal.hide('add-edit-model');
    }

    saveModel() {
        if (this.IsNewRecord) {
            // this.data.statusId = this.statusident;
            // this.data.status = this.statusDes;
            this.data.loggerId = helper.newGuid();
            this.repository.AddOne(this.data)
                .then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been inserted successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                }));

        } else {
            this.repository.Update(this.data)
                .then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been updated successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                }));
        }

        this.cancel();
    }
    // get allowSubmit() {
    //     return  (this.data.status.length > 0);
    //   }
    $v: Vuelidate<any>;
}