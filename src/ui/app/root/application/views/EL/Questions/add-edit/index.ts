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

import { IELQuestions } from '../../../../models';
import { ELQuestionsService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateELQuestions = { model: IELQuestions, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateELQuestions> = {
    model: {
	// questionId: { required },
	// topicId: { required },
	fullQuestion: { required },
	questionType: { required },
	difficultyLevel: { required },
	answers: { required },
	orderNumber: { required }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class ELQuestionsAddEdit extends Vue {
    private isActive: boolean=true;
    private repository: ELQuestionsService;
    private data: IELQuestions = {
        questionId: '', topicId: '', fullQuestion: '', questionType: 0, difficultyLevel: 0, answers: '', orderNumber: 0, statusId: 0,loggerId:'' 
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private answerList:Array<IAnswers>=[];
    created() {
        this.repository = new ELQuestionsService(this.$store);
        
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
    addAnswer() {
        this.answerList.push({answer:'',reason:'',status:true,type:1})

    }
    delAnswer(model: IAnswers) {
        var index = this.answerList.indexOf(model);
        this.answerList.splice(index, 1)
    }
    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.data.answers=JSON.stringify(this.answerList);
        if (this.IsNewRecord) {
            this.data.loggerId = helper.newGuid();
            this.data.statusId=1;
            this.data.questionId=helper.newGuid();
           
            //console.log(JSON.stringify(this.data))
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
        return  (this.data.fullQuestion.length > 0) && (this.data.difficultyLevel > 0) && (this.data.orderNumber > 0) && (this.data.questionType > 0);
      }
}
export interface IAnswers{
    answer:string;
    reason:string;  
    type:number;
    status:boolean;
}