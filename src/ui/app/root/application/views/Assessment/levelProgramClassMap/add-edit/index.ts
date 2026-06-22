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

import { ITopicVideoChapterLink, IVideos, IELTopics, ISetupProgram, ISetupClass } from '../../../../models';
import { TopicVideoChapterLinkService, VideosService, ELTopicsService, SetupProgramService, SetupClassService } from '../../../../service';

import * as helper from '../../../../helper';
import { LevelProgramClassMapService } from '../../../../service/Assessment/LevelProgramClassMap';
import { ILevelProgramClassMap } from '../../../../models/Assessment/LevelProgramClassMap';
import { ILevelDefinition } from '../../../../models/Assessment/LevelDefinition';
import { LevelDefinitionService } from '../../../../service/Assessment/LevelDefinition';

type ValidateLevelProgramClassMap = { data: ILevelProgramClassMap, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateLevelProgramClassMap> = {
    data: {
        levelId : { required },
        programId : { required },
        classId : { required },


    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class LevelProgramClassMapAddEdit extends Vue {
    private isActive: boolean = true;
    private repository:LevelProgramClassMapService;
    private data: ILevelProgramClassMap = {levelProgramClassId:'',levelId:'',programId:'',classId:'',statusId:0}
    private programRepo: SetupProgramService = new SetupProgramService(this.$store);
    private classRepo: SetupClassService = new SetupClassService(this.$store);
    private levelRepo: LevelDefinitionService = new LevelDefinitionService(this.$store);
    private IsNewRecord: boolean = true;
    private title: string = '';
    videoList: IVideos[]=[];
    videoRepo: VideosService;
    topicList: IELTopics[]=[];
    private classList: Array<ISetupClass> = []
    topicRepo: ELTopicsService;
    private programList: Array<ISetupProgram> = [];
    private levelList: Array<ILevelDefinition> = [];
    private levelproMapmodel : Array<ILevelProgramClassMap> = [];
    private sectionCourseLinkId = ''
    private classId = ''
    private programId = ''

    created() {
        this.repository = new LevelProgramClassMapService(this.$store);
        this.classRepo = new SetupClassService(this.$store);
        this.programRepo = new SetupProgramService(this.$store);
        this.levelRepo = new LevelDefinitionService(this.$store);
        // this.videoRepo = new VideosService(this.$store);
        // this.topicRepo = new ELTopicsService(this.$store);
        this.loadPrograms();
        this.loadClass();
        this.loadLevels();
    }
    beforeModalClose() {
        console.log('i am clled')
        this.data = {levelProgramClassId:'',levelId:'',programId:'',classId:'',statusId:0}
        this.$v.$reset();

    }
    beforeModalOpen(event) {
        console.log('befor calling ' + JSON.stringify(event.params.model))
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';

        if (this.IsNewRecord) {

        }
        else {
            Object.assign(this.data, event.params.model as ILevelProgramClassMap);
            console.log('edit')
            console.log(this.data)
            if (this.data.statusId == 1) {
                this.isActive = true
            }
            else {
                this.isActive = false
            }

        }

        this.repository.GetFindBy('e=>e.StatusId!=2').then(
            r => {
                this.levelproMapmodel = r as Array<ILevelProgramClassMap>
            }
        )

    }
    loadPrograms() {
        this.programRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.programList = r as Array<ISetupProgram>
            })
    }

    loadLevels() {
        this.levelRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.levelList = r as Array<ILevelDefinition>
            })
    }

    loadClass() {
        //if (this.programId.length > 0) {
            this.classId = ''
            this.sectionCourseLinkId = ''
            this.classRepo.GetFindBy('s=>s.StatusId==1')
                .then(r => { this.classList = r as Array<ISetupClass> });
        //}
    }


    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                
                //this.data.loggerId = helper.newGuid();
                //Object.assign(this.data, event.params.model as ILevelProgramClassMap);
                //this.data.levelId = 
                this.data.statusId = 1;
                this.data.levelProgramClassId = helper.newGuid();
                    if (this.levelproMapmodel.find(e =>e.levelId == this.data.levelId && e.classId == this.data.classId && e.programId == this.data.programId 
                        && e.statusId != 2)) {
                        
    
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record already Exist',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        })
    
                    }
                    else{
                        this.repository.AddOne(this.data)
                        .then(() => {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: 'Record has been inserted successfully',
                                title: 'Success',
                                messageTypeId: PayloadMessageTypes.success
                            })
                            this.cancel();
                        });
                    }
               
            } else {
                if (this.isActive == true) {
                    this.data.statusId = 1
                }
                else {
                    this.data.statusId = 0
                }
    
                console.log(this.data)
                if (this.levelproMapmodel.find(e =>e.levelProgramClassId != this.data.levelProgramClassId &&e.levelId == this.data.levelId && e.classId == this.data.classId && e.programId == this.data.programId 
                    && e.statusId != 2)) {
                    
    
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Record already Exist',
                        title: 'warning',
                        messageTypeId: PayloadMessageTypes.warning
                    })
    
                }
                else{
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
               
            }
        }
       

       // this.cancel();
    }

    get allowSubmit() {
        
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
        //return  this.$v.data.$error (this.data.name.length > 0);
    }

    $v: any;
}