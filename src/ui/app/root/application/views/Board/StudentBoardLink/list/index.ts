/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { AttendanceAttendanceDetailService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, RegistrationSectionCourseLinkService, SetupAdmissionTypeService, SetupBoardService, SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupGenderService, SetupProgramDetailsService, SetupProgramService, SetupSessionService, SetupShiftService, TimeTableTimeTableService } from '../../../../service';
import {
    DDLGroupModel,
    DDLModel,
    IAttendanceAttendanceDetail,
    IAttendanceAttendanceDetailVM,
    IAttendanceAttendenceMaster,
    IAttendanceAttendenceStatus,
    IAttendanceBulkChild,
    IAttendanceBulkChildU,
    IAttendanceBulkModel,
    IAttendanceBulkModelU,
    IAttendenceData,
    ICampusCityVM,
    ICourseSection,
    IFeeConcession,
    IFeeConcessionDetail,
    IFeeConcessionDetailVM,
    IFeeScholarshipCriteriaVM,
    IOperationAttendanceMaster,
    IRegistrationSectionCourseLinkVM,
    IScholarshipApplyVM,
    IScholarshipStudentModel,
    ISetupAdmissionType,
    ISetupBoard,
    ISetupCampus,
    ISetupCampusProgramVM,
    ISetupClass,
    ISetupGender,
    ISetupProgramDetails,
    ISetupProgramDetailsVM,
    ISetupSession,
    ISetupShift,
    IStudentModel,
    IStudentToEnrollVM,
    ITimeTableTimeTable,
    ITimeTableTimeTableVM
} from '../../../../models';
import { IBoardStudentBoardLink, StudentBoardLinkData } from '../../../../models/Board/StudentBoardLink';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import { BoardCampusStudentLinkAddEdit } from '../add-edit';
import { BoardCampusStudentLinkService } from '../../../../service/Board/CampusStudentLink';
import { BoardStudentBoardLinkEdit } from '../delete';
import { BoardStudentBoardLinkService } from '../../../../service/Board/BoardStudentBoardLink';
import Component from 'vue-class-component';
import { IBoardVWCampusStudentLink } from '../../../../models/Board/VWCampusStudentLink';
import { IRootStoreState } from '../../../../../store';
import { IVWCampusBaseProgram } from '../../../../models/Setup/CampusBaseProgram';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import { debug } from 'util';
import moment from "moment";

// import { AttendanceSlot } from './attendanceslot';








// export interface IAttendanceDetailUpdate {
//     attendanceDetailId: string;
//     attendenceStatusId: string;
// }
@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'CampusStudentLink-add-edit-model': BoardCampusStudentLinkAddEdit,
        'EditCampusStudentLink': BoardStudentBoardLinkEdit
    }
})

export class BoardStudentBoardLinkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private Genderrepo: SetupGenderService = new SetupGenderService(this.$store);
    private repository: BoardStudentBoardLinkService;
    private filterString: string = '';
    private campusId = '';
    private programId = '';
    private sessionId = ''
    private programDetailId = ''
    private genderid = '';
    private boardId = '';
    private Genderlist: Array<ISetupGender> = [];
    private Tempdata: IBoardStudentBoardLink = {
        studentBoardLinkId: '',
        admissionFormId: '',
        returnTypeId: '',
        registrationCodeId: '',
        dueDate:new Date(),
        returnDate: new Date(),
        amount:0,
        statusId: 1,
        boardUniversityNo:''
      };

    private classId = '';
    private programList: Array<IVWCampusBaseProgram> = [];


    private sessioncode: string = '';
    private programSRepo: SetupProgramService = new SetupProgramService(this.$store);



    private campusStudentList: Array<IBoardVWCampusStudentLink> = [];

    private dated = ''
    private shiftId = ''
    private opertation: IOperationAttendanceMaster = { approvalTime: '', approvedBy: 0, browserInfo: '', inTime: false, insertedBy: 0, insertionTime: '' }

    private detailData: Array<IAttendanceAttendanceDetailVM> = [];
    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private boardList: Array<ISetupBoard> = []
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private attendanceStatusList: Array<IAttendanceAttendenceStatus> = []
    private attendanceMaster: IAttendanceAttendenceMaster;
    private attendanceDetailList: Array<IAttendanceAttendanceDetail> = []
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []
    private classList: Array<ISetupClass> = []
    private attendanceBulkListI: Array<IAttendanceBulkModel> = []
    private attendanceBulkListU: Array<IAttendanceBulkModelU> = []
    private attendanceBulkList: any = [];
    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private courseList: Array<ICourseSection> = [];
    private programCourseList: Array<ITimeTableTimeTableVM> = [];
    private data: Array<IAttendenceData> = [];
    private StudentBoardLinkData: Array<StudentBoardLinkData> = [];
    private datas: any = [];
    private Ddata: any = [];
    title:string='Delete Board University Registration';
    // private updateAttendanceList: Array<IAttendanceDetailUpdate> = [];



    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private boardRepo: SetupBoardService = new SetupBoardService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private attendanceDetailRepo: AttendanceAttendanceDetailService = new AttendanceAttendanceDetailService(this.$store)
    private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(this.$store)
    private attendanceMasterRepo: AttendanceAttendenceMasterService = new AttendanceAttendenceMasterService(this.$store)
    private CheckRepository: AttendanceAttendenceMasterService = new AttendanceAttendenceMasterService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private timeTableRepo: TimeTableTimeTableService = new TimeTableTimeTableService(this.$store)
    shiftList: Array<ISetupShift> = [];


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = [];

    private columns = [
        { key: 'rollNo', caption: "Roll No" },
        { key: 'student', caption: "Name" },
        { key: 'fatherName', caption: " Father Name" },
       
        { key: 'boardName', caption: "Board" },
        // { key: 'dueDate', caption: "Due Date" },
        { key: 'returnDate', caption: "Return Date" },
        { key: 'amount', caption: "Amount" },
        { key: "description", caption: "Registeration Code" },
        { key: 'action', caption: "Action", width: 120 }
    ];
    created() {
        this.repository = new BoardStudentBoardLinkService(this.$store);
        this.loadSession();
        this.loadGender();
    }
    loadShift() {
        this.shiftRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {

                this.shiftList = r as Array<ISetupShift>
            })

    }
    loadClass() {

        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classList = r as Array<ISetupClass> });


    }
    loadBoard() {
        this.boardRepo.GetFindBy("s=>s.StatusId==1")
            .then(r => { this.boardList = r as Array<ISetupBoard> })
    }

    mounted() {
        this.validatePage();
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

    loadGender() {
        this.Genderrepo.GetFindBy('e=>e.StatusId==1').then(r => {
            this.Genderlist = r as Array<ISetupGender>

        })

    }

    loadSession() {
        this.sessioncode = '';
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>

            })
    }

    loadSections(key: string) {
        this.enrollmentRepo.GetSectionList(key)
            .then(r => {
                this.courseList = r as Array<ICourseSection>
                if (this.courseList.length == 0) {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Section not Defined',
                        title: 'warning',
                        messageTypeId: PayloadMessageTypes.warning
                    });
                }
            })
    }
    loadPrograms() {

        this.programSRepo.ProgramByCampus('e=>e.CampusId.ToString()=="' + this.campusId + '"&& e.SessionId.ToString()=="' + this.sessionId + '"')
            .then(r => {
                this.programList = r as Array<IVWCampusBaseProgram>
            })
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('BoardStudentBoardLinkList' in this.user.claims) == true) {
                if (this.user.claims['BoardStudentBoardLinkList'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['BoardStudentBoardLinkList'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['BoardStudentBoardLinkList'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['BoardStudentBoardLinkList'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }
    refreshData() {

        this.StudentBoardLinkData = [];
        if (this.sessionId.length > 0 && this.campusId.length > 0 && this.programId.length > 0 && this.classId.length > 0 && this.shiftId.length > 0 && this.genderid.length > 0) {
            var key = this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.classId + "?" + this.shiftId + '?' + this.genderid + '?' + this.boardId
            this.repository.GetStudentBoardLink(key).then(r => {
                this.StudentBoardLinkData = r as Array<StudentBoardLinkData>
               
            });
        }
    }


    insertModel() {
        if (this.boardId.length > 0) {


            this.$modal.show('CampusStudentLink-add-edit-model', {
                model: {
                    studentBoardLinkId: '',
                    admissionFormId: '',
                    returnTypeId: '',
                    registrationCodeId: '',
                    dueDate: new Date(),
                    returnDate: moment.defaultFormat,
                    amount: 0,
                    statusId: 1
                }, SessionId: this.sessionId, CampusId: this.campusId, ProgramDetailId: this.programId, ClassId: this.classId, SHIFTID: this.shiftId, GENDERID: this.genderid, IsNewRecord: true, PROGRAMID: this.programId, BOARDID: this.boardId
            });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please select the Dropdowns',
                title: 'Danger',
                messageTypeId: PayloadMessageTypes.error
            });
        }
    }

    editModel(obj: any) {
       
        this.$modal.show('delete-model', { model: obj, PROGRAMID: this.programId, BOARDID: this.boardId });
    }

    deletemodal(obj: any) {

        
      Object.assign(this.Tempdata,obj);
    }


    deleteconfirmation()
    {
        

        var key=this.Tempdata.studentBoardLinkId+'?'+this.Tempdata.returnTypeId+'?'+this.Tempdata.registrationCodeId+'?'+helper.formateDate(this.Tempdata.dueDate)+'?'+this.Tempdata.amount+'?'+helper.formateDate(this.Tempdata.returnDate)+'?'+this.Tempdata.boardUniversityNo+'?'+'2'
        this.repository.UpdateStudentBoardLink(key).then(r=>{
          
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: r.returnValue,
            title: 'Success',
            messageTypeId: PayloadMessageTypes.success
        });
    })
}

}




    





