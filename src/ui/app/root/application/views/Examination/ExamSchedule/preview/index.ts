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
import { IUser, PayloadMessageTypes } from '../../../../../../model';


import * as helper from '../../../../helper';
import { IExaminationExamSchedule } from '../../../../models/Examination/ExamSchedule';
import { ExaminationExamScheduleService } from '../../../../service/Examination/ExamSchedule';
import { IAttendanceAttendenceStatus, IExamBulkUpdateVM, IExamBulkVM, IExaminationExamDetail, IExaminationExamMaster, IExaminationExamType, RegistrationProgramCourseLinkVM } from '../../../../models';
import { AttendanceAttendenceStatusService, ExaminationExamDetailService, ExaminationExamTypeService } from '../../../../service';
import { IExaminationFailMasterCriteria, IExaminationVWFailMasterCriteria } from '../../../../models/Examination/FailCriteria';
import { ExaminationFailCriteriaService } from '../../../../service/Examination/FailCriteria';
import { GradingMasterDetailData } from '../../../../models/Examination/GradingCriteria';
import { ExaminationGradingMasterService } from '../../../../service/Examination/GradingMaster';
import moment from 'moment';
import { IOperationExamMasterEx } from '../../ExamScheduleDetail/list';
import { State } from 'vuex-class';
import { IRootStoreState } from '../../../../../store';

type ValidateExaminationExamSchedule = { model: IExaminationExamSchedule, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateExaminationExamSchedule> = {
    model: {
        fromDate: { required },
        toDate: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'preview-model',
    template: require('./index.html'),
})
export class ExaminationExamSchedulePreview extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private examUpdateDataList: Array<IExamBulkUpdateVM> = [];
    private examDetailRepo: ExaminationExamDetailService = new ExaminationExamDetailService(this.$store)
    private datas: any = [];
    private attendanceStatusList: Array<IAttendanceAttendenceStatus> = []
    private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(this.$store)
    private examDetailList: Array<IExaminationExamDetail> = []

    private columns = [
        { key: 'rollNo', caption: ' Roll Number' },
        { key: 'fullName', caption: 'Name' },
        { key: 'attendanceStatusId', caption: 'Attendance' },
        { key: 'obtainMarks', caption: 'Marks Obtained' },

    ];
    private canRead: boolean = true;
    private canAdd: boolean = true;
    private canEdit: boolean = true;
    private canDelete: boolean = true;
    totalMarks: number=0;
    isapproved: boolean=false;
    validMarks: boolean=true;
    created() {
        


    }
   
    examScheduleId=''
    sessionId=''
    campusId=''
    programDetailId=''
    classId=''
    sectionId=''
    courseId=''
    sectionCourseLinkId=''
    programCourseLinkId=''
    examTypeId=''
    private presentStatusId = '';

    beforeModalOpen(event) {
       this.loadAttendanceStatus()
        this.examScheduleId = event.params.examScheduleId;
        this.sessionId = event.params.sessionId;
        this.campusId = event.params.campusId;
        this.programDetailId = event.params.programDetailId;
        this.classId = event.params.classId;
        this.sectionId = event.params.sectionId;
        this.courseId = event.params.courseId;
        this.sectionCourseLinkId = event.params.sectionCourseLinkId;
        this.totalMarks=event.params.totalMarks
        this.programCourseLinkId = event.params.programCourseLinkId;
        this.examTypeId = event.params.examTypeId;
        console.log(this.sectionCourseLinkId+" : "+this.examTypeId+" : "+this.totalMarks)
        this.refreshData()
        // this.examDetailRepo.GetExamScheduleUpdateData(this.examScheduleId)
        // .then(r => {
        //     this.examUpdateDataList = r as Array<IExamBulkUpdateVM>})

        //     console.log(this.examUpdateDataList)

    }

    refreshData() {
        // this.totalMarks=0;
         this.datas = [];
         this.examUpdateDataList = [];
        // if (this.sectionCourseLinkId.length > 0 && this.programCourseLinkId.length > 0 && this.examTypeId.length > 0) {
             //var key = this.sectionCourseLinkId + "?" + this.programCourseLinkId + "?" + this.examTypeId + "?" + moment(this.datestring).format('YYYY-MM-DD')+"?"+this.examScheduleId;
             this.examDetailRepo.GetExamScheduleBulkPreview(this.examScheduleId)
             .then(r => {
                     this.examUpdateDataList = r as Array<IExamBulkUpdateVM>
                     
                     if (this.examUpdateDataList.length == 0) {
                         if (this.sessionId.length > 0 && this.campusId.length > 0 && this.programDetailId.length > 0 && this.classId.length > 0 && this.sectionId.length > 0 && this.courseId.length > 0) {
                             var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + this.classId + "?" + this.sectionId + "?" + this.courseId
                             this.examDetailRepo.GetExamData(key)
                                 .then(response => {
                                     this.datas = (response as Array<IExamBulkVM>)
                                 });
                         }
 
                     }
                     else {
                         //this.totalMarks = this.examUpdateDataList[0].totalMarks;

                         this.isapproved=this.examUpdateDataList[0].isApproved;
                         this.datas = this.examUpdateDataList;
 
                     }
                 })
        // }
 
 
 
 
     }

     private date: Date = new Date();
     private datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
     private examMaster: IExaminationExamMaster;

     insertModel() {

         
      


        this.validMarks = true;
        //INSERT
        if (this.examUpdateDataList.length == 0) {
            for (var v = 0; v < this.datas.length; v++) {
                
                if (+(this.datas[v].obtainMarks) > this.totalMarks || +(this.datas[v].obtainMarks) < 0) {
                    this.validMarks = false;
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: +(this.datas[v].obtainMarks) < 0?'Obtained Marks cannot be less than 0':'Obtained Marks Cannot be greater than Total Marks',
                        title: '',
                        messageTypeId: PayloadMessageTypes.error
                    });
                    break;
                }
            }
            if (this.validMarks) {
                let operation: IOperationExamMasterEx = {
                    approvalTime: '', approvedBy: 0, browserInfo: '',
                    insertedBy: 0, insertionTime: '',examScheduleId:''
                };
               // var key = this.sessionId + '?' + this.campusProgramId + '?' + this.classId + '?' + this.sectionId + '?' + this.courseId + '?' + this.examTypeId + '?' + this.datestring;
                this.examDetailList = []
                this.date = new Date (moment(this.datestring).format('YYYY-MM-DD'));
                var examMasterId = helper.newGuid();
                operation.approvalTime = '';
                operation.approvedBy = 0;
                operation.browserInfo = navigator.userAgent;
                operation.insertedBy = this.user.userId;
                operation.insertionTime = new Date().toString();
                operation.examScheduleId=this.examScheduleId;
                this.examMaster = { operation: JSON.stringify(operation), examMasterId: examMasterId, sectionCourseLinkId: this.sectionCourseLinkId, programCourseLinkId: this.programCourseLinkId, loggerId: helper.newGuid(), statusId: 1, dated: this.date, examTypeId: this.examTypeId, totalMarks: this.totalMarks, isApproved: false }
                this.datas.forEach(e => {
                    this.examDetailList.push({ admissionFormId: e.admissionFormId, examMasterId: examMasterId, statusId: 1, loggerId: helper.newGuid(), attendanceStatusId: e.attendanceStatusId, examDetailId: helper.newGuid(), obtainMarks: e.obtainMarks })
                })
                var key = JSON.stringify(this.examMaster) + "?" + JSON.stringify(this.examDetailList)
                this.examDetailRepo.InsertExamBulk(key)
                    .then(r => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Data Inserted Successfully',
                            title: '',
                            messageTypeId: PayloadMessageTypes.success
                        });
                        this.refreshData();

                    })
            }

        }
        //UPDATE
        else {
            this.examUpdateDataList = this.datas;
            var updatList = []
            for (var v = 0; v < this.examUpdateDataList.length; v++) {
                if (this.examUpdateDataList[v].obtainMarks > this.totalMarks) {
                    this.validMarks = false;
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Obtained Marks Cannot be greater than Total Marks',
                        title: '',
                        messageTypeId: PayloadMessageTypes.error
                    });
                    break;
                }
            }
            if (this.validMarks) {
                this.examUpdateDataList.forEach(s => {
                    updatList.push({ examdetailid: s.examDetailId, attendanceStatusId: s.attendanceStatusId, obtainMrks: s.obtainMarks,exammasterid:s.examMasterId,totalmarks:this.totalMarks })
                })
                this.examDetailRepo.UpdateExamBulk(JSON.stringify(updatList))
                    .then(r => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Updated Successfully',
                            title: '',
                            messageTypeId: PayloadMessageTypes.success
                        });
                        this.refreshData();
                    }).catch(e => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Something Went Wrong ',
                            title: 'error',
                            messageTypeId: PayloadMessageTypes.error
                        });
                    })

                
            }

        }



    }
     loadAttendanceStatus() {
        this.attendanceStatusRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.attendanceStatusList = r as Array<IAttendanceAttendenceStatus>
                this.presentStatusId = this.attendanceStatusList.find(s => s.code.toLowerCase() == "p").attendenceStatusId;
            });
    }
    
     checks(item: any) {
        if (this.attendanceStatusList.find(s => s.attendenceStatusId == item.attendanceStatusId).fullName.toLowerCase().startsWith('pre')) {
        }
        else {
            item.obtainMarks = 0;
        }
    }
    cancel() {
        this.$modal.hide('preview-model');
        this.$emit("submit");
    }

    saveModel() {
      
        

        this.cancel();
    }
    get allowSubmit() {
        // return ((this.data.fromDate.toString.length > 0) && (this.data.toDate.toString.length > 0));
        return true;
    }
    $v: Vuelidate<any>;
}