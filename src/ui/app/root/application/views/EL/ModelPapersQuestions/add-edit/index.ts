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

import { IELModelPapersQuestions } from '../../../../models';
import { ELModelPapersQuestionsService } from '../../../../service';

import * as helper from '../../../../helper';
import { IAnswers } from '../../Questions/add-edit';

type ValidateELModelPapersQuestions = { model: IELModelPapersQuestions, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateELModelPapersQuestions> = {
    model: {
	// modelPapersQuestionsId: { required },
	// modelPaperId: { required },
	// courseId: { required },
	fullQuestion: { required },
	orderNumber: { required },
	answers: { required },
	// isActive: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class ELModelPapersQuestionsAddEdit extends Vue {
    private isActive: boolean=true;
    private repository: ELModelPapersQuestionsService;
    private data: IELModelPapersQuestions = {
        modelPapersQuestionsId: '', modelPaperId: '', courseId: '', fullQuestion: '', orderNumber: 0, answers: '',statusId: 0,loggerId:'' 
    };
    private answerList:Array<IAnswers>=[];
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new ELModelPapersQuestionsService(this.$store);
    }

    beforeModalOpen(event) {
        this.answerList=[];
        this.answerList.push({answer:'',reason:'',status:true,type:1})
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        if (this.IsNewRecord) {
           
        }
        else {    
            this.answerList=JSON.parse(this.data.answers);     
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
    addAnswer() {
        this.answerList.push({answer:'',reason:'',status:true,type:1})

    }
    delAnswer(model: IAnswers) {
        var index = this.answerList.indexOf(model);
        this.answerList.splice(index, 1)
    }
    saveModel() {
        this.data.answers=JSON.stringify(this.answerList);

        if (this.IsNewRecord) {
            
            this.data.loggerId = helper.newGuid();
            this.data.statusId=1;
            this.data.modelPapersQuestionsId=helper.newGuid();
            
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
        return  (this.data.orderNumber > 0) && (this.data.fullQuestion.length > 0) && (this.data.answers.length > 0);
      }
    $v: Vuelidate<any>;
}