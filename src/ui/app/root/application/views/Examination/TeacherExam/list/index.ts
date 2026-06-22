/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IFeeConcessionDetail, IAttendanceAttendanceDetail, IAttendanceAttendenceStatus, ICourseSection, IAttendenceData, IFeeConcessionDetailVM, ISetupSession, ISetupShift, ISetupCampus, IStudentModel, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupProgramDetailsVM, IFeeConcession, IFeeScholarshipCriteriaVM, ISetupAdmissionType, ISetupCampusProgramVM, IScholarshipStudentModel, IScholarshipApplyVM, IStudentToEnrollVM, IRegistrationSectionCourseLinkVM, IAttendanceAttendenceMaster, ICampusCityVM, IExamCourseVM, ISetupClass, IExamDataVM, IExaminationExamType, IExaminationExamMaster, IExaminationExamDetail, RegistrationProgramCourseLinkVM, IExamBulkVM, IExaminationGradingPolicy, IExamBulkUpdateVM, ITeacherSection, ITeacherCourse } from '../../../../models';
import { FeeConcessionDetailService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService, ExaminationExamDetailService, SetupClassService, ExaminationExamTypeService, ExaminationExamMasterService, RegistrationProgramCourseLinkService, RegistrationSectionCourseLinkService, ExaminationGradingPolicyService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import * as helper from '../../../../helper';
import { SetupMonthService } from '../../../../service/Setup/Month';
import { ISetupMonth } from '../../../../models/Setup/Month';
import { IOperationExamMaster } from '../../ExamBulk/list';


@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class TeacherExam extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;
    private filterString: string = '';
    private campusId = '';
    private currentdate: Date = new Date();
    private sessionId = ''
    private programDetailId = ''
    private scholarshipCriteriaId = ''
    private campusProgramId = '';
    private date: Date = new Date();
    private datestring: Date = new Date();
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
    private courseLists: Array<ITeacherCourse> = [];
    private data: Array<IExamDataVM> = [];//
    private examData: Array<IExamDataVM> = [];
    private examTypeList: Array<IExaminationExamType> = [];
    private datas: any = [];
    // private gradeData: Array<IExaminationGradingPolicy> = [];
    sectionCourseLinkList: Array<ITeacherSection> = [];
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

    private monthRepo: SetupMonthService = new SetupMonthService(this.$store);
    private monthList: Array<ISetupMonth> = [];


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
        this.loadExamType();
        this.datestring = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
       // this.$watch('sectionCourseLinkId', this.getSectionId);
       this.$watch('sectionCourseLinkId', this.loadSectionCourse)
        this.$watch('sectionCourseLinkId', this.refreshData)
        
      //  this.$watch('programCourseLinkId', this.getcourseId);
        this.$watch('programCourseLinkId', this.refreshData)

        this.$watch('sessionId', this.loadProgramsOfCampus)
        this.$watch('campusId', this.loadProgramsOfCampus)
        this.$watch('campusId', this.loadSection)
        this.$watch('programDetailId', this.loadSection)
        this.$watch('programDetailId', this.loadSection)
        this.$watch('programDetailId', this.loadSectionCourse)
        this.$watch('examTypeId', this.refreshData)
        this.$watch('datestring', this.refreshData)
        this.$watch('classId', this.refreshData)
        this.$watch('classId', this.loadSectionCourse)
        this.$watch('classId', this.loadSection)
        this.$watch('examTypeId', this.loadMonth)


    }

    loadAttendanceStatus() {
        this.attendanceStatusRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.attendanceStatusList = r as Array<IAttendanceAttendenceStatus>
                this.presentStatusId = this.attendanceStatusList.find(s => s.code.toLowerCase() == "p").attendenceStatusId;
            });
    }
    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }

    loadExamType() {
        this.examTypeRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => { this.examTypeList = r as Array<IExaminationExamType> });
    }

    mounted() {
        this.validatePage();
        this.loadSession();

    }
    private tempProgramCourseLinkId=''

    loadSectionCourse() {
        this.programCourseLinkId=''
        if (this.sectionCourseLinkList.length > 0) {
            this.courseLists = [];
            this.tempProgramCourseLinkId = this.sectionCourseLinkList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).programCourseLinkId;
            if (this.tempProgramCourseLinkId.length > 0 && this.sessionId.length > 0 && this.classId.length > 0) {
                var key = this.user.userId + "?" + this.tempProgramCourseLinkId + "?" + this.sessionId + "?" + this.classId
                this.examDetailRepo.GetTeacherCourse(key)
                    .then(r => {
                        this.courseLists = r as Array<ITeacherCourse>

                    });
            }
        }


    }

    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }


    loadProgramsOfCampus() {
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


    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }
    loadMonth() {
        this.monthList = [];
        this.monthRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.monthList = r as Array<ISetupMonth>
            })
    }


    loadSection() {
        this.campusProgramId = '';
        this.sectionCourseLinkId = '';
        this.sectionCourseLinkList = [];
        if (this.sessionId.length > 0 && this.classId.length > 0) {
            var key = this.user.userId + "?" + this.sessionId + "?" + this.classId
            this.examDetailRepo.GetTeacherSection(key)
                .then(response => {
                    this.sectionCourseLinkList = response as Array<ITeacherSection>
                    this.datas = []
                });
        }

    }
    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('teacherExam' in this.user.claims) == true) {
                if (this.user.claims['teacherExam'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['teacherExam'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['teacherExam'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['teacherExam'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }
    // getSectionId() {
    //     this.sectionId = this.sectionCourseLinkList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;

    // }
    // getcourseId() {
    //     this.courseId = this.courseLists.find(s => s.programCourseLinkId == this.programCourseLinkId).courseId;

    // }

    refreshData() {
        this.datas = [];
        this.examData = [];
        this.examUpdateDataList = [];
        if (this.sectionCourseLinkId.length > 0 && this.programCourseLinkId.length > 0 && this.examTypeId.length > 0) {
            var key = this.sectionCourseLinkId + "?" + this.programCourseLinkId + "?" + this.examTypeId + "?" + helper.formateDate(this.datestring);
            this.examDetailRepo.GetExamUpdateData(key)
                .then(r => {
                    this.examUpdateDataList = r as Array<IExamBulkUpdateVM>
                    if (this.examUpdateDataList.length == 0) {
                        if (this.sectionCourseLinkId.length > 0) {
                            // var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + this.classId + "?" + this.sectionId + "?" + this.courseId
                            this.examDetailRepo.GetTeacherExamData(this.sectionCourseLinkId)
                                .then(response => {
                                    this.datas = (response as Array<IExamBulkVM>)
                                    this.totalMarks=0;
                                });
                        }
                        console.log('new record')
                    }
                    else {
                        this.totalMarks = this.examUpdateDataList[0].totalMarks;
                        this.datas = this.examUpdateDataList;
                        console.log('update record')

                    }
                })
        }
    }

    insertModel() {
        this.validMarks = true;
        //INSERT
        if (this.examUpdateDataList.length == 0) {
            if (this.totalMarks > 0) {
                for (var v = 0; v < this.datas.length; v++) {
                    if (parseInt(this.datas[v].obtainMarks) > this.totalMarks) {

                        this.validMarks = false;
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Obtained Marks Cannot be greater than Total Marks',
                            title: 'error',
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
                  //  var key = this.sessionId + '?' + this.campusProgramId + '?' + this.classId + '?' + this.sectionId + '?' + this.courseId + '?' + this.examTypeId + '?' + this.datestring;
                    this.examDetailList = []
                    var tempdate = new Date(this.datestring)
                    this.date = new Date(tempdate.getFullYear(), tempdate.getMonth(), 10);

                    var examMasterId = helper.newGuid();
                    operation.approvalTime = '';
                    operation.approvedBy = 0;
                    operation.browserInfo = navigator.userAgent;
                    operation.insertedBy = this.user.userId;
                    operation.insertionTime = new Date().toString();
                    this.examMaster = {
                        operation: JSON.stringify(operation), examMasterId: examMasterId, sectionCourseLinkId: this.sectionCourseLinkId, programCourseLinkId: this.programCourseLinkId,
                        loggerId: helper.newGuid(), statusId: 1, dated: this.date, examTypeId: this.examTypeId, totalMarks: this.totalMarks, isApproved: false
                    }
                    this.datas.forEach(e => {
                        this.examDetailList.push({ admissionFormId: e.admissionFormId, examMasterId: examMasterId, statusId: 1, loggerId: helper.newGuid(), attendanceStatusId: e.attendanceStatusId, examDetailId: helper.newGuid(), obtainMarks: e.obtainMarks })
                    })

                    var key = JSON.stringify(this.examMaster) + "?" + JSON.stringify(this.examDetailList)
                    this.examDetailRepo.InsertExamBulk(key)
                        .then(r => {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: 'Data Entered Successfully',
                                title: 'success',
                                messageTypeId: PayloadMessageTypes.success
                            });
                            this.refreshData();

                        })
                }
            }
            else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Total Marks should be greater than 0',
                    title: 'warning',
                    messageTypeId: PayloadMessageTypes.warning
                });
            }
        }
        //UPDATE
        else {
            console.log('update record ' + this.examUpdateDataList.length)
            this.examUpdateDataList = this.datas;
            var updatList = []
            for (var v = 0; v < this.examUpdateDataList.length; v++) {
                if (this.examUpdateDataList[v].obtainMarks > this.totalMarks) {
                    this.validMarks = false;
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Obtained Marks Cannot be greater than Total Marks',
                        title: 'error',
                        messageTypeId: PayloadMessageTypes.error
                    });
                    break;
                }
            }
            if (this.validMarks) {
                this.examUpdateDataList.forEach(s => {
                    updatList.push({ examdetailid: s.examDetailId, attendanceStatusId: s.attendanceStatusId, obtainMrks: s.obtainMarks })
                })
                this.examDetailRepo.UpdateExamBulk(JSON.stringify(updatList))
                    .then(r => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Updated Successfully',
                            title: 'success',
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

                console.log(JSON.stringify(updatList))
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

// export interface IOperationExamMaster {
//     approvedBy: number,
//     insertedBy: number,
//     browserInfo: string,
//     approvalTime: string,
//     insertionTime: string

// }