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

import { IELChapters, IBoardProgramClassCourseLink, RegistrationProgramCourseLinkVM, ISetupClass, IBoards, ISetupProgram } from '../../../../models';
import { ELChaptersService, BoardProgramClassCourseLinkService, RegistrationProgramCourseLinkService, SetupClassService, BoardsService, SetupProgramService, RegistrationCourseService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateBoardProgramClassCourseLink = { data: IBoardProgramClassCourseLink, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateBoardProgramClassCourseLink> = {
    data: {
       


    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class BoardProgramClassCourseLinkAddEdit extends Vue {
    private isActive: boolean = true;
    private repository: BoardProgramClassCourseLinkService;
    private data: IBoardProgramClassCourseLink = {boardId:'',boardProgramClassCourseLinkId:'',classId:'',courseId:'',programId:'',statusId:0}
    private IsNewRecord: boolean = true;
    private title: string = '';
    private classId = '';
    private courseId = ''
    boardId="";
    programId=""
    private courseList: Array<RegistrationProgramCourseLinkVM> = []
    private classList: Array<ISetupClass> = []
    private chapterId = ''
    private programCourseRepo: RegistrationCourseService = new RegistrationCourseService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    boardList:IBoards[]=[];
    boardRepo:BoardsService=new BoardsService(this.$store);
    programList:ISetupProgram[]=[];
    programRepo: SetupProgramService=new SetupProgramService(this.$store);

    answerJson: any = []
   
    created() {
        this.repository = new BoardProgramClassCourseLinkService(this.$store);
        this.loadBoards()
        this.loadClass()
        this.loadPrograms()
        this.loadCourse();
    }
    beforeModalClose() {
        
        this.data = {boardId:'',boardProgramClassCourseLinkId:'',classId:'',courseId:'',programId:'',statusId:0}
        this.$v.$reset();

    }

    
    beforeModalOpen(event) {
        this.answerJson=[];
        console.log('befor calling ' + JSON.stringify(event.params.model))
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model as IBoardProgramClassCourseLink);

        if (this.IsNewRecord) {
            //this.answerJson.push({ option: '' })
        }
        else {
            //this.answerJson=JSON.parse(this.data.answers)
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

    loadPrograms() {
        this.programRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.programList = r

            })
    }
    loadBoards() {
        this.boardRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.boardList = r

            })
    }
    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.classList = r

            })
    }
    loadCourse() {
        this.programCourseRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.courseList = r as Array<RegistrationProgramCourseLinkVM>
               // this.refreshData();
            })

    }
    insertIntoAnsr(){
        this.answerJson.push({ option: '' })

    }
    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
    // this.data.answers=JSON.stringify(this.answerJson)

        if (this.IsNewRecord) {
            //this.data.loggerId = helper.newGuid();
            this.data.statusId = 1;
            this.data.boardProgramClassCourseLinkId = helper.newGuid();
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