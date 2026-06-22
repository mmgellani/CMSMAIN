/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { AttendanceAttendanceDetailService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, SetupAdmissionTypeService, SetupCampusProgramLinkService, SetupCampusService, SetupProgramDetailsService, SetupSessionService, SetupShiftService } from '../../../../service';
import { DDLGroupModel, DDLModel, IAttendanceApprovalDataExVM, IAttendanceApprovalDataVM, IAttendanceAttendanceDetail, IAttendanceAttendenceMaster, IAttendanceAttendenceStatus, IAttendenceData, ICampusCityVM, ICourseSection, IFeeConcession, IFeeConcessionDetail, IFeeConcessionDetailVM, IFeeScholarshipCriteriaVM, IOperationAttendanceMaster, IRegistrationSectionCourseLinkVM, IScholarshipApplyVM, IScholarshipStudentModel, ISetupAdmissionType, ISetupCampus, ISetupCampusProgramVM, ISetupProgramDetails, ISetupProgramDetailsVM, ISetupSession, ISetupShift, IStudentModel, IStudentToEnrollVM } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import moment from "moment";

@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class AttendanceApprovalRemove extends Vue {
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
    private sectionCourseid = '';
    private fullDayAbsent = false;

    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private attendanceStatusList: Array<IAttendanceAttendenceStatus> = []
    private attendanceMaster: IAttendanceAttendenceMaster;
    private attendanceDetailList: Array<IAttendanceAttendanceDetail> = []
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private courseList: Array<ICourseSection> = [];
    private data: Array<IAttendanceApprovalDataVM> = [];
    private datas: Array<IAttendanceApprovalDataExVM> = [];
    private updateList: Array<IUpdateAttendanceMasterVM> = []
    private checkAll: boolean = false;


    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    //private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private attendanceDetailRepo: AttendanceAttendanceDetailService = new AttendanceAttendanceDetailService(this.$store)
    private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(this.$store)
    private attendanceMasterRepo: AttendanceAttendenceMasterService = new AttendanceAttendenceMasterService(this.$store)

    private opertation: IOperationAttendanceMaster = { approvalTime: '', approvedBy: 0, browserInfo: '', inTime: false, insertedBy: 0, insertionTime: '' }


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []
    private columns = [
        { key: "staffName", caption: 'Teacher' },
        { key: 'startTime', caption: 'Start Time' },
        { key: 'endTime', caption: 'End Time' },
        { key: 'course', caption: 'Course' },
        { key: 'sectionName', caption: 'Section' },
        { key: 'isApproved', caption: 'Approve' }
    ];
    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        // this.loadCampus();
        this.loadCityCampus();
        this.loadSession();

        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
    }


    mounted() {
        this.validatePage();
        this.refreshData();
    }

    activated() {

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
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionId + "?" + this.campusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
        });
    }

    loadCampus() {
        this.campusRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.campusList = r as Array<ISetupCampus>

            })
    }

    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }

    loadSections(key: string) {
        this.enrollmentRepo.GetSectionList(key)
            .then(r => {
                this.courseList = r as Array<ICourseSection>

                // console.log(this.sectionList==null)
                //alert(this.courseList.length)
                if (this.courseList.length == 0) {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Section not Defined',
                        title: 'warning',
                        messageTypeId: PayloadMessageTypes.warning
                    });
                }
            })
    }



    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('attendanceApprovalRemove' in this.user.claims) == true) {
                if (this.user.claims['attendanceApprovalRemove'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['attendanceApprovalRemove'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['attendanceApprovalRemove'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['attendanceApprovalRemove'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    loadCourses() {
        this.date = new Date();
        if (this.campusProgramId.length > 0 && this.date != null) {
            var key = this.campusProgramId + '?' + this.datestring
            this.attendanceDetailRepo.GetCourseSection(key)
                .then(response => {
                    this.courseList = (response as Array<ICourseSection>);
                    if (this.courseList.length == 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Courses not Defined',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }
                });
        }
    }
    refreshData() {
        this.datas = [];
        this.checkAll = false;
        // this.date=new Date(this.date);
        var convert = moment(this.datestring).format('YYYY-MM-DD')
        if (convert != null) {
            var key = this.user.userId + '?' + convert;
            this.attendanceMasterRepo.GetAttendanceApprovalDataRemove(key)
                .then(response => {
                    this.datas = (response as Array<IAttendanceApprovalDataExVM>)
                });
        }
    }

    insertModel() {
        this.updateList = [];

        this.datas.filter(s => s.isApproved).forEach(e => {
            this.opertation = JSON.parse(e.operation);
            if (this.opertation) {
                this.opertation.approvalTime = new Date().toString();
                this.opertation.approvedBy = this.user.userId;
            } else {
                this.opertation = {
                    approvalTime: new Date().toString(),
                    approvedBy: this.user.userId, browserInfo: '',
                    inTime: false,
                    insertedBy: 0,
                    insertionTime: ''
                };
            }
            this.updateList.push({
                attendenceMasterId: e.attendenceMasterId,
                operation: JSON.stringify(this.opertation)
            })
        })


        this.attendanceMasterRepo.UpdateBulkRemove(JSON.stringify(this.updateList))
            .then(r => {
                this.refreshData();
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Approval Removed Successfully',
                    title: '',
                    messageTypeId: PayloadMessageTypes.success
                });


            })


    }

    selectAll() {
        if (this.checkAll == true) {
            this.datas.forEach(element => {
                element.isApproved = true;
            });
        }
        else {
            this.datas.forEach(element => {
                element.isApproved = false;
            });


        }


    }
    editModel(model: IScholarshipApplyVM) {
        // this.$modal.show('add-edit-model', { model: this.datas.filter(s=>s.scholarshipName==model.scholarshipName)});
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }


}

export interface IUpdateAttendanceMasterVM {
    attendenceMasterId: string;
    operation: string;
}