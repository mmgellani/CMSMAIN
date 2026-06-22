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

import { ITopicVideoChapterLink, IVideos, IELTopics } from '../../../../models';
import { TopicVideoChapterLinkService, VideosService, ELTopicsService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateTopicVideoChapterLink = { data: ITopicVideoChapterLink, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateTopicVideoChapterLink> = {
    data: {
        name: { required }


    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class TopicVideoChapterLinkAddEdit extends Vue {
    private isActive: boolean = true;
    private repository: TopicVideoChapterLinkService;
    private data: ITopicVideoChapterLink = { chapterId: '', orderBy: '', statusId: 0, topicVideoChapterLinkId: '', topicsId: '', videosId: '' }
    private IsNewRecord: boolean = true;
    private title: string = '';
    videoList: IVideos[]=[];
    videoRepo: VideosService;
    topicList: IELTopics[]=[];
    topicRepo: ELTopicsService;

    created() {
        this.repository = new TopicVideoChapterLinkService(this.$store);
        this.videoRepo = new VideosService(this.$store);
        this.topicRepo = new ELTopicsService(this.$store);
        this.loadTopics();
        this.loadVidoes();
    }
    beforeModalClose() {
        console.log('i am clled')
        this.data = { chapterId: '', orderBy: '', statusId: 0, topicVideoChapterLinkId: '', topicsId: '', videosId: '' }
        this.$v.$reset();

    }
    beforeModalOpen(event) {
        console.log('befor calling ' + JSON.stringify(event.params.model))
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';

        if (this.IsNewRecord) {

        }
        else {
            Object.assign(this.data, event.params.model as ITopicVideoChapterLink);
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
    loadVidoes() {
        this.videoRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.videoList = r as Array<IVideos>
                // this.refreshData();
            })

    }
    loadTopics() {
        this.topicRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.topicList = r as Array<IELTopics>
                // this.refreshData();
            })

    }


    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        if (this.IsNewRecord) {
            //this.data.loggerId = helper.newGuid();
            this.data.statusId = 1;
            this.data.topicVideoChapterLinkId = helper.newGuid();
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