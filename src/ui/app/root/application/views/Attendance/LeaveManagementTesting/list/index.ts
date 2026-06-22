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
import moment from "moment";
import {
    IFeeConcessionDetail, ISetupClass, IAttendanceAttendanceDetail, IAttendanceAttendenceStatus, ICourseSection, IAttendenceData, IFeeConcessionDetailVM, ISetupSession, ISetupShift, ISetupCampus, IStudentModel, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupProgramDetailsVM, IFeeConcession, IFeeScholarshipCriteriaVM, ISetupAdmissionType, ISetupCampusProgramVM, IScholarshipStudentModel, IScholarshipApplyVM, IStudentToEnrollVM, IRegistrationSectionCourseLinkVM, IAttendanceAttendenceMaster, ICampusCityVM, ITimeTableTimeTable,
    ITimeTableTimeTableVM, IAttendanceAttendanceDetailVM, IAttendanceBulkModel, IAttendanceBulkChild, IAttendanceBulkModelU, IAttendanceBulkChildU, IOperationAttendanceMaster, VWStudentSectionProfile2
} from '../../../../models';
import { FeeConcessionDetailService, SetupClassService, TimeTableTimeTableService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService, RegistrationSectionCourseLinkService, AdmissionStudentsService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import * as helper from '../../../../helper';

import { AttendanceSlot } from './attendanceslot';
import { debug } from 'util';
import { IAttendanceDetailUpdate } from '../../../../views';
import { LeaveManagementAddEdit } from '../add-edit';
import { LeaveInfo, IAttendanceLeaves } from '../../../../models/Attendance/Attendenceleave';
import { LeaveManagementViewLeave } from '../../LeaveManagement/view-leaves';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'leave-manage': LeaveManagementAddEdit,
        'view-leave-model': LeaveManagementViewLeave
    }
})

export class LeaveManagementTesting extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private SectionCourserepository: RegistrationSectionCourseLinkService;
    private attendanceDetailRepo: AttendanceAttendanceDetailService = null;
    private stdservice: AdmissionStudentsService = null;
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
    private courseId = '';
    private fullDayAbsent = false;
    private classId = '';
    private sectionCourseLinkId = '';
    private attendanceStatusId = '';
    private attendenceMasterId = '';
    private dated = ''
    private sectionId = ''
    private admissionformid: string = '';

    Leaveinfolist: Array<IAttendanceLeaves> = [];
    TempLeaveinfolist: Array<IAttendanceLeaves> = [];
    attendanceBulkList: Array<VWStudentSectionProfile2> = [];


    // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []



    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []
    private columns = [
        // { key: "fromDate", caption: "From Date" },
        // { key: "toDate", caption: "To Date" },
        // { key: "days", caption: "Days" },
        // { key: "isPartial", caption: "Is Partial" },
        // { key: "isApproved", caption: "Is Approved" },
        // { key: "action", caption: "Action", width: 120 }
        { key: "fullName", caption: "Student's Name" },
        { key: "rollNo", caption: "Roll No." },
        { key: "className", caption: "Class" },
        { key: "action", caption: "Action", width: 120 }
    ];
    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.attendanceDetailRepo = new AttendanceAttendanceDetailService(this.$store);
        this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
        this.stdservice = new AdmissionStudentsService(this.$store);
    }

    mounted() {
        this.validatePage();

        // this.refreshData();
    }





    getstudent() {

        this.stdservice.GetStudentsSectionDetails(this.filterString + '?' + this.user.userId.toString()).then(r => {

            this.attendanceBulkList = r as Array<VWStudentSectionProfile2>;

        })



    }






    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('leaveManagement' in this.user.claims) == true) {
                if (this.user.claims['leaveManagement'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['leaveManagement'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['leaveManagement'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['leaveManagement'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }


    refreshData() {



    }





    GetLeaveInfo() {
        this.Leaveinfolist = [];
        this.attendanceDetailRepo.GetLeaveInfo(this.admissionformid).then(
            r => {
                this.Leaveinfolist = r as Array<IAttendanceLeaves>
                Object.assign(this.TempLeaveinfolist, this.Leaveinfolist);


            }
        )



    }
    AddModel(option: any) {



        this.classId = option.classId;
        this.programDetailId = option.programDetailId

        this.$modal.show('add-edit-model', { ClassID: this.classId, ProgramDetailID: this.programDetailId, AdmissionFormID: option.admissionFormId, IsNewRecord: true });
    }

    viewLeave(option: any) {
        this.classId = option.classId;
        this.programDetailId = option.programDetailId

        this.$modal.show('view-leave-model', { ClassID: this.classId, ProgramDetailID: this.programDetailId, AdmissionFormID: option.admissionFormId, IsNewRecord: true });

    }

    getDays(fromDate: any, ToDate: any) {

        var date2 = new Date(ToDate);
        var date1 = new Date(fromDate);
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return dayDifference;

    }



    EditModel(option: any) {


        this.$modal.show('add-edit-model', { ClassID: this.classId, ProgramDetailID: this.programDetailId, AdmissionFormID: option, IsNewRecord: false, modelVM: option });
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }


}