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

import { IELChapters, IMCQsQuestion } from '../../../../models';
import { ELChaptersService, MCQsQuestionService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateMCQsQuestion = { data: IMCQsQuestion, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateMCQsQuestion> = {
    data: {
        question: { required }


    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class MCQsQuestionAddEdit extends Vue {
    private isActive: boolean = true;
    private repository: MCQsQuestionService;
    private data: IMCQsQuestion = { mcqId: '', chapterId: '', answers: '', question: '', statusId: 0 }
    private IsNewRecord: boolean = true;
    private title: string = '';
    answerJson: any = []
   
    created() {
        this.repository = new MCQsQuestionService(this.$store);
    }
    beforeModalClose() {
        
        this.data = { mcqId: '', chapterId: '', answers: '', question: '', statusId: 0 }
        this.$v.$reset();

    }

    
    beforeModalOpen(event) {
        this.answerJson=[];
        console.log('befor calling ' + JSON.stringify(event.params.model))
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model as IMCQsQuestion);

        if (this.IsNewRecord) {
            this.answerJson.push({ option: '' })
        }
        else {
            this.answerJson=JSON.parse(this.data.answers)
            console.log('edit')
            console.log(this.data)
            if (this.data.statusId == 1) {
                this.isActive = true
            }
            else {
                this.isActive = false
            }

        }

    }

    insertIntoAnsr(){
        this.answerJson.push({ option: '' })

    }
    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.data.answers=JSON.stringify(this.answerJson)

        if (this.IsNewRecord) {
            //this.data.loggerId = helper.newGuid();
            this.data.statusId = 1;
            this.data.mcqId = helper.newGuid();
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
            console.log(this.data)
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

    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
        //return  this.$v.data.$error (this.data.name.length > 0);
    }

    $v: any;
}