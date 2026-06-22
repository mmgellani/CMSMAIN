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

import { IELTopics } from '../../../../models';
import { ELTopicsService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateELTopics = { model: IELTopics, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateELTopics> = {
    model: {
	// topicId: { required },
	// chapterId: { required },
	tCode: { required },
	fullName: { required },
	description: { required },
	orderNumber: { required },
	// isEnable: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class ELTopicsAddEdit extends Vue {
    private isActive: boolean=true;
    private repository: ELTopicsService;
    private data: IELTopics = { chapterId: '', videoLinks: '', description: '', title: '', topicId: '', statusId: 0  ,boardId:''}
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new ELTopicsService(this.$store);
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
            //this.data.loggerId = helper.newGuid();
            this.data.statusId=1;
            //this.data.topicId=helper.newGuid();
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
    $v: Vuelidate<any>;

    get allowSubmit() {
        return (this.data.title.length > 0) && (this.data.description.length > 0);
      }
}