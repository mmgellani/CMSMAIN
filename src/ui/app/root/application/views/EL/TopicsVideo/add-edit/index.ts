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
import { JsxEmit } from 'typescript';
import { TopicsVideoService } from '../../../../service/EL/TopicsVideo';

type ValidateTopics = { data: IELTopics, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateTopics> = {
    data: {
        title: { required },
        description: { required }


    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class TopicsAddEdit extends Vue {
    private isActive: boolean = true;
    private repository: TopicsVideoService;
    private data: IELTopics = { chapterId: '', videoLinks: '', description: '', title: '', topicId: '', statusId: 0 ,boardId:''}
    private IsNewRecord: boolean = true;
    private title: string = '';
    private videoLinksJson: any[] = []
    created() {
        this.repository = new TopicsVideoService(this.$store);
    }
    beforeModalClose() {
        
        this.data = { chapterId: '', videoLinks: '', description: '', title: '', topicId: '', statusId: 0 ,boardId:'' }
        this.$v.$reset();

    }
    beforeModalOpen(event) {
        this.videoLinksJson=[]
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model as IELTopics);

        if (this.IsNewRecord) {
            this.videoLinksJson.push({ link: '' })
        }
        else {
            console.log('edit')
            console.log(this.data)
            this.videoLinksJson=JSON.parse(this.data.videoLinks)
            if (this.data.statusId == 1) {
                this.isActive = true
            }
            else {
                this.isActive = false
            }

        }

    }
    insertLink(){
        this.videoLinksJson.push({link:''})
    }
    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        debugger
        this.data.videoLinks = JSON.stringify(this.videoLinksJson)

        if (this.IsNewRecord) {
            //this.data.loggerId = helper.newGuid();
            this.data.statusId = 1;
            this.data.topicId = helper.newGuid();
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