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

import {
    IFeeConcessionDetail, ISetupClass, IAttendanceAttendanceDetail, IAttendanceAttendenceStatus, ICourseSection, IAttendenceDataEx, IFeeConcessionDetailVM, ISetupSession, ISetupShift, ISetupCampus, IStudentModel, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupProgramDetailsVM, IFeeConcession, IFeeScholarshipCriteriaVM, ISetupAdmissionType, ISetupCampusProgramVM, IScholarshipStudentModel, IScholarshipApplyVM, IStudentToEnrollVM, IRegistrationSectionCourseLinkVM, IAttendanceAttendenceMaster, ICampusCityVM, ITimeTableTimeTable,
    ITimeTableTimeTableVM, IAttendanceAttendanceDetailVMEx, IOperationAttendanceMaster, IReNewConcessionVM, IScholarshipsVM
} from '../../../../models';
import { FeeConcessionDetailService, SetupClassService, TimeTableTimeTableService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import * as helper from '../../../../helper';
import moment from "moment";
import { MigrationService } from '../../../../service/Migration/migration-service';


@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class AttendancePercentage extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    private scholarshipCriteriaId = ''
    private campusProgramId = '';
    private date: Date = new Date();
    private fromdatestring = ''
    private todatestring = ''

    private classId = '';
    private sectionCourseLinkId = '';

    private sectionId = ''

    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private attendanceStatusList: Array<IAttendanceAttendenceStatus> = []
    private attendanceMaster: IAttendanceAttendenceMaster;
    private attendanceDetailList: Array<IAttendanceAttendanceDetail> = []
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []
    private classList: Array<ISetupClass> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private courseList: Array<ICourseSection> = [];
    private programCourseList: Array<ITimeTableTimeTableVM> = [];
    private data: Array<IReNewConcessionVM> = [];




    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    //private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private attendanceDetailRepo: AttendanceAttendanceDetailService = new AttendanceAttendanceDetailService(this.$store)
    private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(this.$store)
    private attendanceMasterRepo: AttendanceAttendenceMasterService = new AttendanceAttendenceMasterService(this.$store)
    private CheckRepository: AttendanceAttendenceMasterService = new AttendanceAttendenceMasterService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private timeTableRepo: TimeTableTimeTableService = new TimeTableTimeTableService(this.$store)

    private opertation: IOperationAttendanceMaster = { approvalTime: '', approvedBy: 0, browserInfo: '', inTime: false, insertedBy: 0, insertionTime: '' }
    private mergeSectionList: any = []

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []
    private scholarshipList: Array<IScholarshipsVM> = []
    private studentList: any = [];
    private migRepo: MigrationService = new MigrationService(this.$store);

    private columns = [
        { key: 'rollNo', caption: 'Roll No' },
        { key: 'fullName', caption: 'Name' },
        { key: 'percentage', caption: 'Attendance (%)' }
        // { key: '', caption: 'Action' },
    ];


    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.loadSession();
        this.fromdatestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
        this.todatestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);

        // this.$watch(() => this.sessionId, this.loadSections);
        // this.$watch(() => this.campusId, this.loadSections);
        // this.$watch(() => this.programDetailId, this.loadSections);
        // this.$watch(() => this.classId, this.loadSections);
        // this.$watch(() => this.sectionCourseLinkId, this.refreshData);
    }

    loadScholarships() {
        this.scholarshipList = []
        if (this.campusId.length > 0 && this.sessionId.length > 0 && this.programDetailId.length > 0) {
            var campusProgramid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
            var key = campusProgramid;
            this.repository.GetScholarships(key)
                .then(r => {
                    this.scholarshipList = r as Array<IScholarshipsVM>
                })
        }
    }
    loadClass() {
        if (this.programDetailId.length > 0) {
            this.classRepo.GetFindBy('s=>s.StatusId!=2')
                .then(r => { this.classList = r as Array<ISetupClass> });
        }

    }

    mounted() {
        //   this.validatePage();
        // this.refreshData();
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

    loadSections() {
        if (this.classId.length > 0) {
            this.courseList = []
            this.sectionCourseLinkId = ''
            // this.refreshData();
            if (this.campusId.length > 0 && this.sessionId.length > 0 && this.programDetailId.length > 0 && this.classId.length > 0) {
                var campusProgramid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
                var key = campusProgramid + "?" + this.classId;
                this.enrollmentRepo.GetSectionList(key)
                    .then(r => {
                        this.courseList = r as Array<ICourseSection>
                        this.loadScholarships();
                        if (this.courseList.length == 0) {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: 'Section not Defined',
                                title: 'warning',
                                messageTypeId: PayloadMessageTypes.warning
                            });
                        }
                    });
            }
        }
    }


    loadProgramsOfCampus() {
        if (this.campusId.length > 0) {
            this.ddl = [];
            this.programDDL = [];
            let oldObj: ISetupCampusProgramVM;
            var key = this.sessionId + "?" + this.campusId;
            this.campusProgramLinkRepo.GetAllVM(key).then(r => {
                this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            });
        }

    }
    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('attendancePercentage' in this.user.claims) == true) {
                if (this.user.claims['attendancePercentage'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['attendancePercentage'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['attendancePercentage'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['attendancePercentage'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }


    refreshData() {
        if (this.sectionCourseLinkId.length > 0) {
            this.data = []
            if (this.sectionCourseLinkId.length > 0 && this.classId.length > 0) {
                var key = this.sectionCourseLinkId + "?" + this.classId + "?" + moment(this.fromdatestring).format('YYYY-MM-DD') + "?" + moment(this.todatestring).format('YYYY-MM-DD');
                this.repository.AttendancePercentage(key)
                    .then(r => {
                        this.data = r as Array<IReNewConcessionVM>
                    });
            }
        }
    }


    insertModel() {


        var list = [];
        this.studentList = [];
        this.data.forEach(r => {
            list.push({ rollNo: r.rollNo, attendancePercentage: r.percentage, fromDate: new Date(this.fromdatestring), toDate: new Date(this.todatestring) })
        })
        this.migRepo.AddManyStudents(
            list).then(() => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Record has been inserted successfully",
                    title: "Success",
                    messageTypeId: PayloadMessageTypes.success
                });
            });

        //     if(this.installmentNo>0){
        //         this.insertModelJson = []
        //         this.data.filter(s => s.isSelected).forEach(a => {
        //             this.insertModelJson.push({
        //                 admissionFormId: a.admissionFormId, installmentNo: this.installmentNo,
        //                 scholarshipId: a.scholarshipCriteriaId
        //             })
        //         })
        //         if (this.insertModelJson.length > 0) {
        //             this.repository.ReNewConcessionBulk(JSON.stringify(this.insertModelJson))
        //                 .then(r => {
        //                     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                         text: 'Concession Applied Successfully',
        //                         title: 'Success',
        //                         messageTypeId: PayloadMessageTypes.success
        //                     })
        //                 })
        //         }
        //         else {
        //             this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                 text: 'Please select any student',
        //                 title: 'warning',
        //                 messageTypeId: PayloadMessageTypes.warning
        //             })
        //         }
        //     }
        //     else{
        //         this.$store.dispatch(StoreTypes.updateStatusBar, {
        //             text: 'Please select any Installment no',
        //             title: 'warning',
        //             messageTypeId: PayloadMessageTypes.warning
        //         })
        //     }


    }

    // private insertModelJson: Array<IReNewConcessionInsert> = [];
    // private installmentNo: number = 0;


}

// export interface IReNewConcessionInsert {
//     scholarshipId: string;
//     admissionFormId: string;
//     installmentNo: number;
// }