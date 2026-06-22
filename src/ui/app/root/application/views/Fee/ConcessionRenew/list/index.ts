/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { AttendanceAttendanceDetailService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, SetupAdmissionTypeService, SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupProgramDetailsService, SetupSessionService, SetupShiftService, TimeTableTimeTableService } from '../../../../service';
import {
    DDLGroupModel,
    DDLModel,
    IAttendanceAttendanceDetail,
    IAttendanceAttendanceDetailVMEx,
    IAttendanceAttendenceMaster,
    IAttendanceAttendenceStatus,
    IAttendenceDataEx,
    ICampusCityVM,
    ICourseSection,
    IFeeConcession,
    IFeeConcessionDetail,
    IFeeConcessionDetailVM,
    IFeeScholarshipCriteriaVM,
    IOperationAttendanceMaster,
    IReNewConcessionVM,
    IRegistrationSectionCourseLinkVM,
    IScholarshipApplyVM,
    IScholarshipStudentModel,
    IScholarshipsVM,
    ISetupAdmissionType,
    ISetupCampus,
    ISetupCampusProgramVM,
    ISetupClass,
    ISetupProgramDetails,
    ISetupProgramDetailsVM,
    ISetupSession,
    ISetupShift,
    IStudentModel,
    IStudentToEnrollVM,
    ITimeTableTimeTable,
    ITimeTableTimeTableVM,
    IconcessionContinutionRules,
} from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import moment from "moment";
import { ConcesssionReNewEx } from '../concessoinrenewwithoutatt';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'concessrenewex': ConcesssionReNewEx
    }
})

export class ConcesssionReNew extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    private scholarshipCriteriaId = ''
    private campusProgramId = '';
    private date: Date = new Date();
    private fromdatestring = new Date();
    private todatestring = new Date();

    private classId = '';
    private sectionCourseLinkId = '';
    private concessionRulesId= '';
    private forAllSectionId = "";
    private sectionId = ''

    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private ConcessionRulesList:Array<IconcessionContinutionRules>=[]
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
    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }];




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
    public concessionrule:boolean=false;
    public checkboxdisable:boolean=false;
    private forAllSection:boolean = false;
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []
    private scholarshipList: Array<IScholarshipsVM> = []
private progress:number= 0;
    private columns = [
        { key: 'rollNo', caption: "Roll No" },
        { key: 'fullName', caption: "Name" },
        { key: 'admissionType', caption: "AdmissionType" },
        { key: 'percentage', caption: "Percentage" },
        {Key:'firstConcession', caption:"First Concession"},
        { key: 'concession', caption: "Concession" },
        { key: 'action', caption: "Action", width: 120 },
    ];
    private isLoading: boolean=false;
   private toastMessage: string='';

    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.loadSession();

        //var fdated = this.paidDate.getFullYear() + '/' + (this.paidDate.getMonth() + 1) + '/' + this.paidDate.getDate();

        //this.fromdatestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
        //this.todatestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);

        this.$watch(() => this.sessionId, this.loadSections);
        this.$watch(() => this.campusId, this.loadSections);
        this.$watch(() => this.programDetailId, this.loadSections);
        this.$watch(() => this.classId, this.loadSections);
        this.$watch(() => this.installmentNo, this.refreshData);
        this.$watch(() => this.sectionCourseLinkId, this.refreshData);
        this.$watch(() => this.classId, this.refreshData);  
    }
    private isCheckedAll = false;
    checkAll() {
        if (this.isCheckedAll) {
            this.data.filter(s => s.isEligible).forEach(r => {
                r.isSelected = true;
            })
        }
        else {
            this.data.forEach(r => {
                r.isSelected = false;
            })
        }
    }
    enableSectionCheckbox() {

        if (this.sectionCourseLinkId == "") {

            this.forAllSectionId = "00000000-0000-0000-0000-000000000000";
            this.sectionCourseLinkId = "";
            // this.forAllSectionId = "";
            // this.courseList.forEach(e => {
            //     this.forAllSectionId = this.forAllSectionId + e.sectionCourseLinkId + ',';

            // });
            // if (this.forAllSectionId.length > 0) {
            //     this.forAllSectionId = this.forAllSectionId.substring(0, this.forAllSectionId.length - 1);
            // }
        }
        else {
            this.sectionCourseLinkId = "";
            this.forAllSectionId = "";
        }
    }

    loadScholarships() {
        this.scholarshipList = []
        if (this.campusId.length > 0 && this.sessionId.length > 0 && this.programDetailId.length > 0) {
            var campusProgramid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
            var key = campusProgramid;
            this.campusProgramId = campusProgramid;
            this.repository.GetScholarships(key)
                .then(r => {
                    this.scholarshipList = r as Array<IScholarshipsVM>
                })
        }
    }
    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }

    mounted() {
        //   this.validatePage();
        // this.refreshData();
        this. GetAllConcessionRules();
        this.concessionrule=false;
    }
    enableCheckbox(){
      
       
        if (!this.concessionrule) {
      // When toggle is switched OFF → clear the selected rule
      this.concessionRulesId = "";
      this.checkboxdisable=false;
    }
    else{
        this.checkboxdisable=true;
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
    GetAllConcessionRules() {
        this.repository.getAllConcessionContinutionRules()
            .then(r => {
                this.ConcessionRulesList = r as Array<IconcessionContinutionRules>
            })
    }

    loadSections() {
        this.courseList = []
        this.sectionCourseLinkId = ''
        this.loadScholarships();
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
        if (this.sessionId.length > 0 && this.campusId.length > 0) {


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
            if (('concessionRenew' in this.user.claims) == true) {
                if (this.user.claims['concessionRenew'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['concessionRenew'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['concessionRenew'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['concessionRenew'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }
    checkconcessionrulesisenable(concessionRulesId) {
        
        this.concessionRulesId=concessionRulesId;
        this.checkboxdisable=false;
    }

    refreshData() {
        this.isCheckedAll=false;
        this.data = []
        // if(this.concessionrule == false){
        if (this.classId.length > 0) {
            var startdate = this.fromdatestring.getFullYear() + '/' + (this.fromdatestring.getMonth() + 1) + '/' + this.fromdatestring.getDate();
            var enddate = this.todatestring.getFullYear() + '/' + (this.todatestring.getMonth() + 1) + '/' + this.todatestring.getDate();
            if (this.sectionCourseLinkId =="") {
                this.forAllSectionId="00000000-0000-0000-0000-000000000000";
                var key = this.forAllSectionId + "?" + this.classId + "?" + startdate + "?" + enddate + "?" + this.installmentNo + "?" + this.campusProgramId;
            }
            else {
                var key = this.sectionCourseLinkId + "?" + this.classId + "?" + startdate + "?" + enddate + "?" + this.installmentNo + "?" + this.campusProgramId;
            }
            this.repository.ReNewConcession(key)
                .then(r => {
                    this.data = r as Array<IReNewConcessionVM>
                })
        }
    }

//    insertModel() {

//         if (this.installmentNo > 0) {
//             this.insertModelJson = []
//             if(this.concessionRulesId.length==0){
//             this.data.filter(s => s.isSelected && s.scholarshipCriteriaId !=='00000000-0000-0000-0000-000000000000').forEach(a => {
//                 this.insertModelJson.push({
//                     admissionFormId: a.admissionFormId, installmentNo: this.installmentNo,
//                     scholarshipId: a.scholarshipCriteriaId,classid:this.classId,
//                     continutionpolicy:this.concessionRulesId
//                 })
//             })
//         }
//         else if(this.concessionRulesId.length>0){
//              this.data.filter(s => s.isSelected).forEach(a => {
//                 this.insertModelJson.push({
//                     admissionFormId: a.admissionFormId, installmentNo: this.installmentNo,
//                     scholarshipId: a.scholarshipCriteriaId,classid:this.classId,
//                     continutionpolicy:this.concessionRulesId
//                 })
//             })
//         }
//             if (this.insertModelJson.length > 0) {

//                 this.repository.ReNewConcessionBulk(JSON.stringify(this.insertModelJson))
//                     .then(r => {
//                         this.$store.dispatch(StoreTypes.updateStatusBar, {
//                             text: 'Concession Applied Successfully',
//                             title: 'Success',
//                             messageTypeId: PayloadMessageTypes.success
//                         })
//                     })
//             }
//             else {
//                 this.$store.dispatch(StoreTypes.updateStatusBar, {
//                     text: 'Please select any student',
//                     title: 'warning',
//                     messageTypeId: PayloadMessageTypes.warning
//                 })
//             }
//         }
//         else {
//             this.$store.dispatch(StoreTypes.updateStatusBar, {
//                 text: 'Please select any Installment no',
//                 title: 'warning',
//                 messageTypeId: PayloadMessageTypes.warning
//             })
//         }
//     }
loadListofStudents(){

}
 
async insertModel() {
    if (this.installmentNo <= 0) {
        this.showWarning("Please select any Installment no");
        return;
    }

    const selectedStudents = this.data.filter(s => s.isSelected);
    if (!selectedStudents.length) {
        this.showWarning("Please select any student");
        return;
    }

    const batchSize = 50;
    const totalBatches = Math.ceil(selectedStudents.length / batchSize);

    this.isLoading = true;
    this.progress = 0;
    let processedCount = 0;

    // Show initial toaster
    this.toastMessage = `Concession Applying  on ${selectedStudents.length} students...`;

    // Allow Vue to render the loader/toast before starting the processing
    await this.$nextTick();

    for (let i = 0; i < totalBatches; i++) {
        const batch = selectedStudents.slice(i * batchSize, (i + 1) * batchSize);

        const insertModelJson = batch.map(a => ({
            admissionFormId: a.admissionFormId,
            installmentNo: this.installmentNo,
            scholarshipId: a.scholarshipCriteriaId,
            classid: this.classId,
            continutionpolicy: this.concessionRulesId
        }));

        try {
            await this.repository.ReNewConcessionBulk(JSON.stringify(insertModelJson));
            processedCount += batch.length;

            // Update progress
            this.progress = Math.round((processedCount / selectedStudents.length) * 100);

            // Update toaster dynamically
            this.toastMessage = `Concession Applied on ${processedCount}/${selectedStudents.length} students (${this.progress}%)`;

        } catch (err) {
            console.error(`Batch ${i + 1} failed`, err);
            this.toastMessage = `Error inserting batch ${i + 1}. See console for details.`;
            // optionally: break; to stop on error
        }
    }

    this.isLoading = false;
    this.toastMessage = ''; // hide toaster after done

    // Success message
    this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'Concession Applied Successfully',
        title: 'Success',
        messageTypeId: PayloadMessageTypes.success
    });
}

    showWarning(msg) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: msg,
            title: 'Warning',
            messageTypeId: PayloadMessageTypes.warning
        });
    }












    private insertModelJson: Array<IReNewConcessionInsert> = [];
    private installmentNo: number = 0;


}

export interface IReNewConcessionInsert {
    scholarshipId: string;
    admissionFormId: string;
    installmentNo: number;
    classid: string;
    continutionpolicy?: string;
}