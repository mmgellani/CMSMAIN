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
    ITimeTableTimeTableVM, IAttendanceAttendanceDetailVMEx, IOperationAttendanceMaster, IReNewConcessionVM, IScholarshipsVM, IStudentEnrolledVM, ISetupBoard, IFeeFeeHead, IFeeChallanType
} from '../../../../models';
import { FeeConcessionDetailService, SetupClassService, TimeTableTimeTableService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService, SetupBoardService, FeeFeeHeadService, FeeChallanTypeService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import * as helper from '../../../../helper';
import moment from "moment";
import { MigrationService } from '../../../../service/Migration/migration-service';
import { BoardProgramCampusService } from '../../../../service/Board/ProgramCampus';
import { IBoardProgramCampus } from '../../../../models/Board/ProgramCampus';
import { IBoardExamType } from '../../../../models/Board/BoardExamType';
import { SessionBoardExamTypeService } from '../../../../service/Board/BoardExamType';
import { BoardFeeService } from '../../../../service/Board/boardFee';
import { ISessionBoardFee } from '../../../../models/Board/sessionboardfee';
import { SessionBoardFeeService } from '../../../../service/Board/sessionboardfee';
import { IBoardFee } from '../../../../models/Board/boardFee';


@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class BoardFee extends Vue {
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
    private isCheckedAll: boolean = false;
    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private courseList: Array<ICourseSection> = [];
    private programCourseList: Array<ITimeTableTimeTableVM> = [];
    //private data: Array<IReNewConcessionVM> = [];
    private enrollRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)



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
    private migRepo: MigrationService = new MigrationService(this.$store)
    private data: Array<IStudentEnrolledVM> = []
    private programCampusList: Array<IBoardProgramCampus> = []
    private boardExamTypeList: Array<IBoardExamType> = []
    private boardList: Array<ISetupBoard> = []
    private feeHeadList: Array<IFeeFeeHead> = []
    private sessionBoardFeeList: Array<ISessionBoardFee> = []

    private feeHeadId = ''
    private programCampusId = '';
    private examTypeId = ''
    private boardId = ''

    private RepoProgramCampus: BoardProgramCampusService = new BoardProgramCampusService(this.$store)
    private RepoBoardExamType: SessionBoardExamTypeService = new SessionBoardExamTypeService(this.$store)
    private RepoBoard: SetupBoardService = new SetupBoardService(this.$store)
    private RepoFeeHead: FeeFeeHeadService = new FeeFeeHeadService(this.$store)
    private RepoSessionBoardFee: SessionBoardFeeService = new SessionBoardFeeService(this.$store)
    private RepoBoardFee: BoardFeeService = new BoardFeeService(this.$store)

    private amount = 0;

    private dueDate = "";
    private year = 2019;
    challanTypeId: string = '';
    challanTypeList: Array<IFeeChallanType> = [];
    repoChallanType: FeeChallanTypeService = new FeeChallanTypeService(this.$store);
    //private boardFeeList: Array<ISessionBoardFee> = []
    private submitList: any = []

    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.loadSession();
        this.loadProgramCampus();
        this.loadBoardExamType();
        this.loadBoard();
        this.loadChallanTypeList();
        this.fromdatestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
        this.todatestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);

        this.$watch(() => this.sessionId, this.loadSections);
        this.$watch(() => this.campusId, this.loadSections);
        this.$watch(() => this.programDetailId, this.loadSections);
        this.$watch(() => this.classId, this.loadSections);
        this.$watch(() => this.sectionCourseLinkId, this.refreshData);
        this.$watch(() => this.sessionId, this.loadSessionBoardFee);
        this.$watch(() => this.boardId, this.loadSessionBoardFee);
        this.$watch(() => this.feeHeadId, this.loadSessionBoardFee);
    }
    loadChallanTypeList() {
        this.repoChallanType.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.challanTypeList = r as Array<IFeeChallanType>
                var index1 = this.challanTypeList.indexOf(this.challanTypeList.find(s => s.fullName.toLowerCase().startsWith('edu')))
                this.challanTypeList.splice(index1, 1);
                var index2 = this.challanTypeList.indexOf(this.challanTypeList.find(s => s.fullName.toLowerCase().startsWith('trans')))

                this.challanTypeList.splice(index2, 1);

            })
    }
    checkAll() {
        if (this.isCheckedAll) {
            this.data.forEach(e => {
                e.isSelected = true;
            })
        } else {
            this.data.forEach(e => {
                e.isSelected = false;
            })
        }

    }
    loadFeeHeads() {

        if (this.challanTypeId.length > 0) {
            this.RepoFeeHead.GetFindBy('s=>s.ChallanTypeId.ToString()=="' + this.challanTypeId + '"')
                .then(r => {
                    this.feeHeadList = r as Array<IFeeFeeHead>
                })

        }
    }
    loadProgramCampus() {
        if (this.data.length > 0) {
            this.RepoProgramCampus.GetFindBy(this.data[0].programId)
                .then(r => { this.programCampusList = r as Array<IBoardProgramCampus> })
        }

    }

    loadBoardExamType() {
        this.RepoBoardExamType.GetFindBy("s=>s.StatusId==1")
            .then(r => { this.boardExamTypeList = r as Array<IBoardExamType> })
    }

    loadBoard() {
        this.RepoBoard.GetFindBy("s=>s.StatusId==1")
            .then(r => { this.boardList = r as Array<ISetupBoard> })
    }

    // loadFeeHead() {
    //     this.RepoFeeHead.GetFindBy("s=>s.StatusId==1")
    //         .then(r => { this.feeHeadList = r as Array<IFeeFeeHead> })
    // }


    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }

    mounted() {
        //   this.validatePage();
        // this.refreshData();
    }

    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
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
    loadSessionBoardFee() {
        this.amount = 0;
        if (this.sessionId.length > 0 && this.boardId.length > 0 && this.feeHeadId.length > 0) {
            var key = this.sessionId + "?" + this.boardId + "?" + this.feeHeadId
            this.RepoSessionBoardFee.FindPk(key)
                .then(r => {
                    this.sessionBoardFeeList = r as Array<ISessionBoardFee>
                    if (this.sessionBoardFeeList.length > 1) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Ambigious',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }
                    else if (this.sessionBoardFeeList.length == 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Fee is not defined',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }
                    else {
                        this.amount = this.sessionBoardFeeList[0].amount;
                    }
                })
        }
    }

    loadSections() {
        this.courseList = []
        this.sectionCourseLinkId = ''
        //  this.loadScholarships();
        this.refreshData();

        if (this.campusId.length > 0 && this.sessionId.length > 0 && this.programDetailId.length > 0 && this.classId.length > 0) {
            var campusProgramid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
            var key = campusProgramid + "?" + this.classId;
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
    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('boardFee' in this.user.claims) == true) {
                if (this.user.claims['boardFee'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['boardFee'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['boardFee'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['boardFee'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = []
        if (this.sectionCourseLinkId.length > 0) {
            this.enrollRepo.GetStudentsBySection(this.sectionCourseLinkId)
                .then(r => {
                    this.data = r as Array<IStudentEnrolledVM>;
                    this.loadProgramCampus();
                })

        }

    }


    insertModel() {
        if (this.amount < 1) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Fee not Defined',
                title: 'warning',
                messageTypeId: PayloadMessageTypes.warning
            });
        }
        else if(this.dueDate.length==0){
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Select due date',
                title: 'warning',
                messageTypeId: PayloadMessageTypes.warning
            });
        }
        else {
            this.submitList = []
            this.data.filter(s => s.isSelected).forEach(e => {
                this.submitList.push({
                    examTypeId: this.examTypeId, statusId: 1, admissionFormId: e.admissionFormId,
                    boardFeeId: helper.newGuid(), challanDueDate: new Date(this.dueDate), examYear: this.year,
                    programCampusId: this.programCampusId, sessionBoardFeeId: this.sessionBoardFeeList[0].sessionBoardFeeId
                    , classId: this.classId, challanTypeId: this.challanTypeId, feeHeadId: this.feeHeadId, feeAmount: this.amount
                })
            })

            this.RepoBoardFee.AddBulk(JSON.stringify(this.submitList))
                .then(r => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Data Entered Successfully',
                        title: 'success',
                        messageTypeId: PayloadMessageTypes.success
                    });
                })
        }


    }

    // private insertModelJson: Array<IReNewConcessionInsert> = [];
    // private installmentNo: number = 0;


}

// export interface IReNewConcessionInsert {
//     scholarshipId: string;
//     admissionFormId: string;
//     installmentNo: number;
// }

