/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { AttendanceAttendanceDetailService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, ExaminationExamDetailService, ExaminationExamMasterService, ExaminationExamTypeService, ExaminationGradingPolicyService, FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, RegistrationProgramCourseLinkService, RegistrationSectionCourseLinkService, SetupAdmissionTypeService, SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupProgramDetailsService, SetupSessionService, SetupShiftService } from '../../../../service';
import { DDLGroupModel, DDLModel, IAttendanceAttendanceDetail, IAttendanceAttendenceMaster, IAttendanceAttendenceStatus, IAttendenceData, ICampusCityVM, ICourseSection, IExamBulkUpdateVM, IExamBulkVM, IExamCourseVM, IExamDataVM, IExaminationExamDetail, IExaminationExamMaster, IExaminationExamType, IExaminationGradingPolicy, IFeeConcession, IFeeConcessionDetail, IFeeConcessionDetailVM, IFeeScholarshipCriteriaVM, IRegistrationSectionCourseLinkVM, IScholarshipApplyVM, IScholarshipStudentModel, ISetupAdmissionType, ISetupCampus, ISetupCampusProgramVM, ISetupClass, ISetupProgramDetails, ISetupProgramDetailsVM, ISetupSession, ISetupShift, IStudentModel, IStudentToEnrollVM, RegistrationProgramCourseLinkVM } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import moment from 'moment';

@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class ExamBulk extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    private scholarshipCriteriaId = ''
    private campusProgramId = '';
    private date: Date = new Date();
    private datestring = ''
    private sectionCourseLinkId = '';
    private sectionCourseid = '';
    private courseId = "";
    private programCourseLinkId = '';
    private studentAttendanceid = '';
    private fullDayAbsent = false;
    private classId = ''
    private examTypeId = '';
    private sectionId = '';
    private examMaster: IExaminationExamMaster;
    private totalMarks = 0;
    private ObtainMarks = 0;
    private isEnable = false;
    private fullName: IAttendanceAttendenceStatus;
    private checker = false;
    private dataList: any = [];
    private presentStatusId = '';
    private examUpdateDataList: Array<IExamBulkUpdateVM> = [];
    private currentdate: Date = new Date();
    private isapproved=false;



    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private attendanceStatusList: Array<IAttendanceAttendenceStatus> = []
    //private attendanceMaster: IAttendanceAttendenceMaster;
    private examDetailList: Array<IExaminationExamDetail> = []

    private classList: Array<ISetupClass> = []

    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private courseList: Array<IExamCourseVM> = [];
    private courseLists: Array<RegistrationProgramCourseLinkVM> = [];
    private data: Array<IExamDataVM> = [];//
    private examData: Array<IExamDataVM> = [];
    private examTypeList: Array<IExaminationExamType> = [];
    private datas: any = [];
    // private gradeData: Array<IExaminationGradingPolicy> = [];
    sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];
    private id: string = "";



    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    //private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    // private attendanceDetailRepo: AttendanceAttendanceDetailService = new AttendanceAttendanceDetailService(this.$store)
    private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(this.$store)
    // private attendanceMasterRepo: AttendanceAttendenceMasterService = new AttendanceAttendenceMasterService(this.$store)
    private examDetailRepo: ExaminationExamDetailService = new ExaminationExamDetailService(this.$store)
    private CheckRepository: ExaminationExamDetailService = new ExaminationExamDetailService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private examTypeRepo: ExaminationExamTypeService = new ExaminationExamTypeService(this.$store)
    private examMasterRepo: ExaminationExamMasterService = new ExaminationExamMasterService(this.$store)
    private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store);
    private SectionCourserepository: RegistrationSectionCourseLinkService;
    private gradeRepository: ExaminationGradingPolicyService;



    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'rollNo', caption: ' Roll Number' },
        { key: 'fullName', caption: 'Name' },
        { key: 'attendanceStatusId', caption: 'Attendance' },
        { key: 'obtainMarks', caption: 'Marks Obtained' },

    ];


    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
        this.gradeRepository = new ExaminationGradingPolicyService(this.$store);
        this.loadClass();
        this.loadCityCampus();
        this.loadAttendanceStatus();
        // this.loadExamType();
        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
        this.$watch('sectionCourseLinkId', this.getSectionId);
        this.$watch('sectionCourseLinkId', this.refreshData)
        this.$watch('programCourseLinkId', this.getcourseId);
        this.$watch('programCourseLinkId', this.refreshData)

        this.$watch('sessionId', this.loadProgramsOfCampus)
        this.$watch('campusId', this.loadProgramsOfCampus)
        this.$watch('campusId', this.loadSection)
        this.$watch('programDetailId', this.loadSection)
        this.$watch('programDetailId', this.loadSectionCourse)
        this.$watch('examTypeId', this.refreshData)
        this.$watch('datestring', this.refreshData)
        this.$watch('classId', this.refreshData)
        this.$watch('classId', this.loadSectionCourse)
        this.$watch('classId', this.loadSection)


    }

    loadAttendanceStatus() {
        this.attendanceStatusRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.attendanceStatusList = r as Array<IAttendanceAttendenceStatus>
                this.presentStatusId = this.attendanceStatusList.find(s => s.code.toLowerCase() == "p").attendenceStatusId;
            });
    }
    loadClass() {
        if (this.programDetailId.length > 0) {
            this.classRepo.GetFindBy('s=>s.StatusId==1')
                .then(r => { this.classList = r as Array<ISetupClass> });
        }

    }

    loadExamType() {
        if (this.programCourseLinkId.length > 0) {
            this.examTypeRepo.GetFindBy('s=>s.StatusId!=2')
                .then(r => { this.examTypeList = r as Array<IExaminationExamType> });
        }

    }

    mounted() {
        this.validatePage();
        this.loadSession();

    }

    loadSectionCourse() {
        this.courseLists = [];
        this.programCourseLinkId = ''
        if (this.programDetailId.length > 0 && this.classId.length > 0) {
            var key = this.programDetailId + "?" + this.classId
            this.programCourseRepo.GetAllFilterData(key)
                .then(r => {
                    this.courseLists = r as Array<RegistrationProgramCourseLinkVM>

                });
        }

    }

    loadCityCampus() {
        if (this.sessionId.length > 0) {
            this.campusddl = [];
            this.cityDDL = [];
            let oldObj: ICampusCityVM;
            this.campusRepo.GetCityVM().then(r => {
                this.campusCityList = r as Array<ICampusCityVM>;
            });
        }
    }


    loadProgramsOfCampus() {
        if (this.campusId.length > 0) {
            this.sectionCourseLinkId = ''
            this.programDetailId = ''
            let oldObj: ISetupCampusProgramVM;
            if (this.sessionId.length > 0 && this.campusId.length > 0) {
                var key = this.sessionId + "?" + this.campusId;
                this.campusProgramLinkRepo.GetAllVM(key).then(r => {
                    this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
                    this.sectionCourseLinkList = []
                    this.datas = []
                });
            }
        }


    }


    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }


    loadSection() {
        this.campusProgramId = '';
        this.sectionCourseLinkId = '';
        this.sectionCourseLinkList = [];
        if (this.campusId.length > 0 && this.programDetailId.length > 0 && this.sessionId.length > 0 && this.classId.length > 0) {
            this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.programDetailId == this.programDetailId && e.sessionId == this.sessionId).campusProgramId
            var key = this.campusId + "?" + this.campusProgramId + "?" + this.classId
            this.SectionCourserepository.GetSectionData(key)
                .then(response => {
                    this.sectionCourseLinkList = response as Array<IRegistrationSectionCourseLinkVM>
                    this.datas = []
                });
        }

    }
    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('examBulk' in this.user.claims) == true) {
                if (this.user.claims['examBulk'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['examBulk'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['examBulk'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['examBulk'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }
    getSectionId() {
        this.sectionId = this.sectionCourseLinkList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;

    }
    getcourseId() {
        this.courseId = this.courseLists.find(s => s.programCourseLinkId == this.programCourseLinkId).courseId;

    }
    refreshData() {
        this.totalMarks=0;
        this.datas = [];
        this.examData = [];
        this.examUpdateDataList = [];
        if (this.sectionCourseLinkId.length > 0 && this.programCourseLinkId.length > 0 && this.examTypeId.length > 0) {
            var key = this.sectionCourseLinkId + "?" + this.programCourseLinkId + "?" + this.examTypeId + "?" + moment(this.datestring).format('YYYY-MM-DD');
            this.examDetailRepo.GetExamUpdateData(key)
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
                        this.totalMarks = this.examUpdateDataList[0].totalMarks;
                        this.isapproved=this.examUpdateDataList[0].isApproved;
                        this.datas = this.examUpdateDataList;

                    }
                })
        }




    }

    get allowsubmit()
    {
        return (this.sessionId.length>0 && this.campusId.length>0 && this.programDetailId.length>0 && this.classId.length>0 &&
            this.sectionCourseLinkId.length>0 && this.programCourseLinkId.length>0 && this.examTypeId.length>0 && this.totalMarks>0 )


    }

    insertModel() {

         
      


        this.validMarks = true;
        //INSERT
        if (this.examUpdateDataList.length == 0) {
            for (var v = 0; v < this.datas.length; v++) {
                
                if (+(this.datas[v].obtainMarks) > this.totalMarks) {
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
                let operation: IOperationExamMaster = {
                    approvalTime: '', approvedBy: 0, browserInfo: '',
                    insertedBy: 0, insertionTime: ''
                };
                var key = this.sessionId + '?' + this.campusProgramId + '?' + this.classId + '?' + this.sectionId + '?' + this.courseId + '?' + this.examTypeId + '?' + this.datestring;
                this.examDetailList = []
                this.date = new Date (moment(this.datestring).format('YYYY-MM-DD'));
                var examMasterId = helper.newGuid();
                operation.approvalTime = '';
                operation.approvedBy = 0;
                operation.browserInfo = navigator.userAgent;
                operation.insertedBy = this.user.userId;
                operation.insertionTime = new Date().toString();
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
    validMarks = true;

    editModel(model: IScholarshipApplyVM) {
        // this.$modal.show('add-edit-model', { model: this.datas.filter(s=>s.scholarshipName==model.scholarshipName)});
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }

    checks(item: any) {
        if (this.attendanceStatusList.find(s => s.attendenceStatusId == item.attendanceStatusId).fullName.toLowerCase().startsWith('pre')) {
        }
        else {
            item.obtainMarks = 0;
        }
    }


}

export interface IOperationExamMaster {
    approvedBy: number,
    insertedBy: number,
    browserInfo: string,
    approvalTime: string,
    insertionTime: string

}