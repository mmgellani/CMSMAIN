/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { AttendanceAttendanceDetailService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, FeeChallanValidityService, FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, RegistrationSectionCourseLinkService, SetupAdmissionTypeService, SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupGenderService, SetupProgramDetailsService, SetupSessionService, SetupShiftService, TimeTableTimeTableService } from '../../../../service';
import {
    ChallanBReport,
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
    ITimeTableTimeTableVM,
    IVMChallanValidityUpdate,
    IVMChallanValidityUpdateEx
} from '../../../../models';
import { IRootStoreState, RootStoreTypes } from '../../../../../store';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import { BoardCampusStudentLinkService } from '../../../../service/Board/CampusStudentLink';
import Component from 'vue-class-component';
import { IBoardVWCampusStudentLink } from '../../../../models/Board/VWCampusStudentLink';
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
    name: 'DisableChallans',
    template: require('./index.html'),
    // components: {
    //     'CampusStudentLink-add-edit-model': BoardCampusStudentLinkAddEdit
    // }
})

export class FeeChallanValidityUpdateList2 extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private SectionCourserepository: RegistrationSectionCourseLinkService;
    private genderrepository:SetupGenderService=new SetupGenderService(this.$store);
    private repository: FeeChallanValidityService;
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    private scholarshipCriteriaId = ''
    private campusProgramId = '';
    private datestring = ''
    private sectionCourseid = '';
    private courseId = '';
    private fullDayAbsent = false;
    private classId = '';
    private sectionCourseLinkId = '';
    private attendanceStatusId = '';
    private attendenceMasterId = '';
    private reportData: any = [];
    private report: String = "";



    private selectAll: boolean = false;
    private isSelected: boolean = false;

   private enableprintbutton:boolean=false;

    private installmentNo = 1;
    private dueDate = '';

    private StudentList: Array<IVMChallanValidityUpdate> = [];
    private ChallanRList: Array<ChallanBReport> = [];

    // private dated = ''
    private sectionId = '';
    private opertation: IOperationAttendanceMaster = { approvalTime: '', approvedBy: 0, browserInfo: '', inTime: false, insertedBy: 0, insertionTime: '' }

    private detailData: Array<IAttendanceAttendanceDetailVM> = [];
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
    private datas: any = [];
    private Ddata: any = [];
    // private updateAttendanceList: Array<IAttendanceDetailUpdate> = [];

    private templist: Array<IUpdateDueDate> = []

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
    private sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];
    private genderide='';



    private updateList: Array<IUpdateDueDate> = []
    private genderlist:Array<ISetupGender>=[];


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = [];
    private columns = [
        { key: 'rollNo', caption: "Roll No." },
        { key: 'refferenceNo', caption: "Reference No" },
        { key: 'fullName', caption: "Student's Name" },
        { key: 'installmentNo', caption: "Select All" },
        { key: 'challanNo', caption: "Challan No." },
        { key: 'feeAmount', caption: "Amount" },
        { key: 'dueDate', caption: "Due Date" },
        { key: 'isSelected', caption: "Select All" }
    ];
    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5},{item:6}]
    maxInstallment=[{ item: 1 }]
    created() {
        this.genderlist=[];
        this.repository = new FeeChallanValidityService(this.$store);
        this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
        this.loadSession();
        this.loadGender();
        // this.loadCityCampus();
    }

    checkAll() {
        if (this.selectAll == true) {
            this.StudentList.forEach(element => {
                element.isSelected = true;
                this.enableprintbutton = element.allowButton;
            });
            
        }
        else {
            this.StudentList.forEach(element => {
                element.isSelected = false;
            });
        }
    }
    loadProgramSection() {
        if (this.classId.length > 0) {
            this.campusProgramId = null;
            this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.programDetailId == this.programDetailId).campusProgramId;
            this.SectionCourserepository.GetSectionData(this.campusId + `?` + this.campusProgramId + `?` + this.classId)
                .then(response => {
                    this.sectionCourseLinkList = response as Array<IRegistrationSectionCourseLinkVM>
                });
        }

    }
    loadClass() {
        if (this.programDetailId.length > 0) {
            this.classRepo.GetFindBy('s=>s.StatusId!=2')
                .then(r => { this.classList = r as Array<ISetupClass> });
        }
    }

    mounted() {
        this.validatePage();
        //this.loadGender();
        // this.refreshData();
        this.enableprintbutton=false;
    }

    loadGender()
    {
      this.genderrepository.GetFindBy('e=>e.StatusId==1').then(r=>{
          this.genderlist= r as Array<ISetupGender>
      })


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

    get shouldSave() {
        var isEnable: boolean = false;

        if( this.StudentList) {
            if( this.StudentList.filter(s => s.isSelected)) {
                if( this.StudentList.filter(s => s.isSelected).length > 0) {
                    isEnable = true;
                }
            }
        }

        return isEnable;
    }

    // loadChallanValidity(){
    //     var key1 = this.campusId; 
    //     this.repository.GetFindByChallanValidity(key1)
    //     .then(r => {
    //         this.$store.dispatch(StoreTypes.updateStatusBar, {
    //             text: 'Updated Successfully',
    //             title: 'success',
    //             messageTypeId: PayloadMessageTypes.success
    //         });
    //     })
    // }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('feeChallanValidityUpdate' in this.user.claims) == true) {
                if (this.user.claims['feeChallanValidityUpdate'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeChallanValidityUpdate'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeChallanValidityUpdate'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeChallanValidityUpdate'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }
    refreshData() {
            if(this.genderide.length>0)
            {
            this.StudentList = [];
            var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + this.classId + "?" +this.genderide+'?' +this.installmentNo
            this.repository.GetFindByEx2(key)
                .then(r => {
                    this.StudentList = r as Array<IVMChallanValidityUpdateEx>
                });
            }

    }
    updatedata() {

        //this.challannumber = challanNo;
        var studentli = this.StudentList.filter(e => e.isSelected === true);
        studentli.forEach(element => {
            // this.enablebutton = element.allowButton;
            this.enableprintbutton = element.allowButton;
            //  this.previousInstallment = element.expiredButton;
        });

    }
    generateChallanReport() {
        
        var challanTypeId='73d41647-8f68-4af1-a365-75e286f3f59b'
        this.templist=[];

        this.StudentList.filter(s => s.isSelected).forEach(e => {
            this.templist.push({ challanNo: e.challanNo,
            challanTypeId:challanTypeId })
        })
        this.ChallanRList = [];
        this.reportData = [];
        var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + this.classId+"?"+this.genderide+'?'+this.installmentNo + "?" + this.user.email+"?"+JSON.stringify(this.templist);
        this.repository.get_challan_reportBulk(key).then(r => {
                if(r) {
                    if(r.length > 0) {
                        this.$store.dispatch(RootStoreTypes.reportOperation, {
                            data: r as any,
                            path: '/assets/Reports/Resource/Admission/student-challan-ex.xml',
                            show: true
                          });
                    } else {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'No record Found',
                            title: 'Failed',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }
                }
            })
    }

    insertModel() {
         
        var response=confirm('Are you sure to change challan validity')
        
        if(response)
        {
        this.updateList = [];
        this.templist = [];
        var challanTypeId='73d41647-8f68-4af1-a365-75e286f3f59b'

        this.StudentList.filter(s => s.isSelected).forEach(e => {
            this.templist.push({ challanNo: e.challanNo,
            challanTypeId:challanTypeId })
        })
        if (this.templist.length > 0) {
            var key = JSON.stringify(this.templist) + "?" + this.campusId + "?" + this.installmentNo + "?" + this.programDetailId + "?" + this.classId+"?"+this.sessionId;
   
            this.repository.UpdateBulk(key)
                .then(r => {
                    this.refreshData();
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Updated Successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    });
                })
                
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Select Record',
                title: 'Failed',
                messageTypeId: PayloadMessageTypes.error
            });
        }
    }
    this.refreshData();
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }
}

export interface IUpdateDueDate {
    challanNo: string;
    challanTypeId:string;
}


