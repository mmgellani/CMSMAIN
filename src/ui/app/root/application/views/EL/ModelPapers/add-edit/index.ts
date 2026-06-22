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

import { IELModelPapers } from '../../../../models';
import { ELModelPapersService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateELModelPapers = { model: IELModelPapers, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateELModelPapers> = {
    model: {
	// modelPaperId: { required },
	fullName: { required },
	totalMarks: { required },
	correctCredit: { required },
	incorrectCredit: { required },
	skippedCredit: { required },
	testTime: { required },
	// isActive: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class ELModelPapersAddEdit extends Vue {
    private isActive: boolean=true;
    private repository: ELModelPapersService;
    private data: IELModelPapers = {
        modelPaperId: '', fullName: '', totalMarks: 0, correctCredit: 0, incorrectCredit: 0, skippedCredit: 0, testTime: 0, statusId: 0,loggerId:'' 
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new ELModelPapersService(this.$store);
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        if (this.IsNewRecord) {
           
        }
        else {
           
            if (this.data.statusId == 1) {
                this.isActive = true
            }
            else {
                this.isActive = false
            }
            
        }
    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        if (this.IsNewRecord) {
            this.data.loggerId = helper.newGuid();
            this.data.statusId=1;
            this.data.modelPaperId=helper.newGuid();
            this.repository.AddOne(this.data)
                .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
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
        return  (this.data.totalMarks > 0) && (this.data.fullName.length > 0) && (this.data.correctCredit > 0) && (this.data.incorrectCredit > 0) && (this.data.skippedCredit > 0) && (this.data.testTime > 0);
      }
    $v: Vuelidate<any>;
}