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

import { IBoardProgramClassCourseVM, IChapterLinks, IELChapters } from '../../../../models';
import { BoardProgramClassCourseLinkService, ChapterLinksService, ELChaptersService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateChapterLinks = { data: IChapterLinks, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateChapterLinks> = {
    data: {
        
        orderNo: { required },
       

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class ChapterLinksAddEdit extends Vue {
    private isActive: boolean = true;
    private repository: ChapterLinksService;
    private data: IChapterLinks = { boardProgramClassCourseLinkId: '', orderNo: 0, chapterId: '', chapterLinkId: '', statusId: 0 }
    private IsNewRecord: boolean = true;
    private title: string = '';
    private boardProgramClassCourseLinkService: BoardProgramClassCourseLinkService = new BoardProgramClassCourseLinkService(this.$store)
    boardProgramClassCourseLinkList: IBoardProgramClassCourseVM[] = []
    private chapterList: Array<IELChapters> = []
    private chapterRepo: ELChaptersService = new ELChaptersService(this.$store);
    created() {
        this.repository = new ChapterLinksService(this.$store);
        this.loadboardProgramClassCourseLink()
        this.loadChapters();
    }
    loadboardProgramClassCourseLink() {
        this.boardProgramClassCourseLinkService.GetAllVM()
            .then(r => {
                this.boardProgramClassCourseLinkList = r 
                this.boardProgramClassCourseLinkList=this.boardProgramClassCourseLinkList.filter(s=>s.statusId==1)
            })
    }
    loadChapters() {
        this.chapterRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.chapterList = r as Array<IELChapters>

            })
    }
    beforeModalOpen(event) {
        this.$v.$reset();
        console.log('befor calling')
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
            this.data.statusId = 1;
            this.data.chapterLinkId = helper.newGuid();
            // alert(JSON.stringify(this.data))
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