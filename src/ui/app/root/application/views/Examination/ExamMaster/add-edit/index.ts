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

import { IExaminationExamMaster, IExaminationExamType, IRegistrationSectionCourseLink, IRegistrationSectionCourseLinkVM, IExamCourseVM, RegistrationProgramCourseLinkVM } from '../../../../models';
import { ExaminationExamMasterService, ExaminationExamTypeService, RegistrationSectionCourseLinkService, ExaminationExamDetailService, RegistrationProgramCourseLinkService } from '../../../../service';

import * as helper from '../../../../helper';

import { ExaminationExamTypeAddEdit } from '../../ExamType/add-edit';
import { ExecFileOptionsWithStringEncoding } from 'child_process';

type ValidateExaminationExamMaster = { model: IExaminationExamMaster, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateExaminationExamMaster> = {
    model: {
        // examMasterId: { required },
        sectionCourseLinkId: { required },
        examTypeId: { required },
        dated: { required },
        // toDate: { required },
        totalMarks: { required },
        // statusId: { required },
        // loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'ExamMaster-add-edit-model',
    template: require('./index.html'),
    components: {
        'ExamType': ExaminationExamTypeAddEdit
    }
})
export class ExaminationExamMasterAddEdit extends Vue {


    isActive: boolean = true;
    private sessionId: string;
    private campusId: string;
    private classId: string;
    private programDetailId: string;
    private courseId: string;
    private programCourseLinkId: string;
    private sectionCourseLinkId: string;

    private repository: ExaminationExamMasterService;
    private ExamTyperepository: ExaminationExamTypeService;
    private SectionCourserepository: ExaminationExamDetailService;
    // private SectionCourserepository: RegistrationSectionCourseLinkService;
    private sectionCourseLinkList: Array<IExamCourseVM> = [];
    examTypeList: Array<IExaminationExamType> = [];
    private courseList: Array<RegistrationProgramCourseLinkVM> = [];
    private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store);

    private data: IExaminationExamMaster = {operation:'',
        examMasterId: '', examTypeId: '', dated: new Date(), totalMarks: 0, statusId: 0, loggerId: '', sectionCourseLinkId: '', programCourseLinkId: '', isApproved: false
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new ExaminationExamMasterService(this.$store);
        this.ExamTyperepository = new ExaminationExamTypeService(this.$store);
        this.SectionCourserepository = new ExaminationExamDetailService(this.$store);
        // this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);

        this.ExamTyperepository.GetFindBy('e=>e.StatusId!=2')
            .then(res => {
                this.examTypeList = res as Array<IExaminationExamType>
            });
        this.sessionId = event.params.model.sessionId;
        this.campusId = event.params.model.campusId;
        this.programDetailId = event.params.model.programDetailId;
        this.programCourseLinkId = event.params.model.programCourseLinkId;
        this.classId = event.params.model.classId;
        this.sectionCourseLinkId = event.params.model.sectionCourseLinkId;
        this.loadSectionCourse();
    }

    loadSectionCourse() {
        this.courseList = [];
        var key = this.programDetailId + "?" + this.classId
        this.programCourseRepo.GetAllFilterData(key)
            .then(r => {
                this.courseList = r as Array<RegistrationProgramCourseLinkVM>
            })
    }

    addNewExamType() {
        this.$modal.show('ExamType-add-edit-model', { IsNewRecord: true });

    }
    loadExamType() {
        this.ExamTyperepository.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.examTypeList = res as Array<IExaminationExamType>

        });

    }

    cancel() {
        this.$modal.hide('ExamMaster-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        if (this.IsNewRecord) {
            this.data.examMasterId = helper.newGuid();
            this.data.statusId = 1;
            this.data.loggerId = helper.newGuid();
            this.data.dated = new Date(this.data.dated);
            this.data.programCourseLinkId = this.programCourseLinkId;
            this.data.sectionCourseLinkId = this.sectionCourseLinkId;
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
                this.data.statusId = 1;
            }

            else {
                this.data.statusId = 0;
            }
            this.data.programCourseLinkId = this.programCourseLinkId;
            this.data.dated = new Date(this.data.dated);
            this.data.sectionCourseLinkId = this.sectionCourseLinkId;
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
        return (this.data.examTypeId.length > 0) && (this.data.totalMarks > 0);
    }
    $v: Vuelidate<any>;
}