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

import { IExaminationCampusGradingPolicyLink } from '../../../../models';
import { ExaminationCampusGradingPolicyLinkService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateExaminationCampusGradingPolicyLink = { model: IExaminationCampusGradingPolicyLink, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateExaminationCampusGradingPolicyLink> = {
    model: {
	campusGradingPolicyLinkId: { required },
	campusProgramLinkId: { required },
	gradingPolicyId: { required },
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
export class ExaminationCampusGradingPolicyLinkAddEdit extends Vue {
    private repository: ExaminationCampusGradingPolicyLinkService;
    private data: IExaminationCampusGradingPolicyLink = {
        campusGradingPolicyLinkId: '', campusProgramLinkId: '', gradingPolicyId: '', statusId: 0, loggerId: '', 
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new ExaminationCampusGradingPolicyLinkService(this.$store);
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
    $v: Vuelidate<any>;
}