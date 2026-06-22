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

import { IExaminationExamDetail, IExaminationExamMaster, IAdmissionAdmissionForm, IAttendanceAttendenceStatus, IAdmissionAdmissionFormVM, IExaminationExamMasterVM, IExamDataVM, IExaminationGradingPolicy } from '../../../../models';
import { ExaminationExamDetailService, AdmissionAdmissionFormService, ExaminationExamMasterService, AttendanceAttendenceStatusService, ExaminationGradingPolicyService } from '../../../../service';

import * as helper from '../../../../helper';

import { ExaminationExamMasterAddEdit } from '../../ExamMaster/add-edit';

type ValidateExaminationExamDetail = { model: IExaminationExamDetail, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateExaminationExamDetail> = {
    model: {
        examMasterId: { required },
        admissionFormId: { required },
        attendanceStatusId: { required },
        obtainMarks: { required },
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'ExamMaster': ExaminationExamMasterAddEdit
    }
})
export class ExaminationExamDetailAddEdit extends Vue {
    private repository: ExaminationExamDetailService;
    private ExamMasterrepository: ExaminationExamMasterService = null;
    private AdmissionFormrepository: AdmissionAdmissionFormService = null;
    private AttendanceStatusrepository: AttendanceAttendenceStatusService = null;
    private gradeRepository: ExaminationGradingPolicyService;
    private data: IExamDataVM = {
        examDetailId: '', 
        admissionFormId: '', 
        rollNo: '', 
        fullName: '', 
        examMasterId: '', 
        attendanceStatusId: '', 
        obtainMarks: 0, 
        statusId: 0, 
       
        code: '', 
        dated: new Date(), 
        totalMarks: 0, 
        classId:'', 
        className: '', 
        sectionId:'', 
        sectionName:'' , 
        courseId: '', 
        courseName: '', 
        campusProgramId: '', 
        campusId: '', 
        programDetailId: '', 
        sessionId: ''
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private isActive: boolean = true;
    private ExamMasterList: Array<IExaminationExamMasterVM> = [];
    private AdmissionFormList: Array<IAdmissionAdmissionFormVM> = [];
    private AttendenceStatusList: Array<IAttendanceAttendenceStatus> = [];
    private gradeData: Array<IExaminationGradingPolicy> = [];
    private totalMarks = 0;
    private att: string = "";

    created() {
        this.repository = new ExaminationExamDetailService(this.$store);
        this.ExamMasterrepository = new ExaminationExamMasterService(this.$store);
        this.AdmissionFormrepository = new AdmissionAdmissionFormService(this.$store);
        this.AttendanceStatusrepository = new AttendanceAttendenceStatusService(this.$store);
        this.gradeRepository = new ExaminationGradingPolicyService(this.$store);
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        this.ExamMasterrepository.GetAllAsync().then(res => {
            this.ExamMasterList = res as Array<IExaminationExamMasterVM>


        })

        // this.AdmissionFormrepository.GetAll().then(res => {
        //     this.AdmissionFormList = res as Array<IAdmissionAdmissionFormVM>
        // })

        this.AttendanceStatusrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.AttendenceStatusList = res as Array<IAttendanceAttendenceStatus>


        })
        this.loadGrades();

    }
    addNewExamMaster() {
        this.$modal.show('ExamMaster-add-edit-model', { IsNewRecord: true });

    }
    loadExamMaster() {
        this.ExamMasterrepository.GetAllAsync().then(res => {
            this.ExamMasterList = res as Array<IExaminationExamMasterVM>


        });

    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }
    loadGrades() {
        this.gradeData = [];
        if (this.data.classId.length > 0 && this.data.campusProgramId.length > 0 && this.data.sectionId.length > 0) {
            this.gradeRepository.GetFindBy('s=>s.ClassId.ToString()=="' + this.data.classId + '" && s.CampusProgramId.ToString()=="' + this.data.campusProgramId + '" && s.SectionId.ToString()=="' + this.data.sectionId + '" && s.StatusId!=2')
                .then(response => this.gradeData = (response as Array<IExaminationGradingPolicy>));

        }
    }

    saveModel() {
        if (this.IsNewRecord) {
            this.data.examDetailId = helper.newGuid();
            this.data.attendanceStatusId = this.att;
            this.data.statusId = 1;
            //this.data.loggerId = helper.newGuid();
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






            
                var total = 0;
                total = Math.round((this.data.obtainMarks / this.data.totalMarks) * 100);
               





           
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
        // return true;
        return (this.data.examMasterId.length > 0) && (this.data.admissionFormId.length > 0) && (this.data.attendanceStatusId.length > 0) && (this.data.obtainMarks > 0);
    }
    $v: Vuelidate<any>;
}