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
    IChallanValidityUpdate,
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
    IVMChallanValidityUpdate
} from '../../../../models';
import { IRootStoreState, RootStoreTypes } from '../../../../../store';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import WidgetBox from '../../../../../home/widget-box/index';


import { BoardCampusStudentLinkService } from '../../../../service/Board/CampusStudentLink';
import Component from 'vue-class-component';
import { IBoardVWCampusStudentLink } from '../../../../models/Board/VWCampusStudentLink';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import { debug } from 'util';
import moment from "moment";
import { FeeChallanValidityUpdateList2 } from '../ChallanFeeBulk';
interface IQueryParam {
    param: string;
    value: string;
    name: string;
}
// import { AttendanceSlot } from './attendanceslot';



// export interface IAttendanceDetailUpdate {
//     attendanceDetailId: string;
//     attendenceStatusId: string;
// }
@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        WidgetBox,
        'disable-challan': FeeChallanValidityUpdateList2
    }
})

export class FeeChallanValidityUpdateList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    private SectionCourserepository: RegistrationSectionCourseLinkService;
    private repository: FeeChallanValidityService;
    checkgender = false;
    checkSection = false;

    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private genderId = ''
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
    private sectionId = '';
    private reportData: any = [];
    private report: String = "";


    private selectAll: boolean = false;
    private isSelected: boolean = false;
    private ischecked: boolean = false;


    private installmentNo = 1;
    private dueDate = '';

    private StudentList: Array<IChallanValidityUpdate> = [];
    private StudentList1: Array<IChallanValidityUpdate> = [];
    private ChallanRList: Array<ChallanBReport> = [];

    // private dated = ''
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
    private challannumber: String = "";
    private templist: Array<IUpdateDueDate> = []

    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private genderrepository: SetupGenderService = new SetupGenderService(this.$store);

    //private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private attendanceDetailRepo: AttendanceAttendanceDetailService = new AttendanceAttendanceDetailService(this.$store)
    private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(this.$store)
    private attendanceMasterRepo: AttendanceAttendenceMasterService = new AttendanceAttendenceMasterService(this.$store)
    private CheckRepository: AttendanceAttendenceMasterService = new AttendanceAttendenceMasterService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private timeTableRepo: TimeTableTimeTableService = new TimeTableTimeTableService(this.$store)
    private sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];
    private genderlist: Array<ISetupGender> = [];
    private resultdata: any = [];
    enablebutton: boolean = false;
    enableprintbutton: boolean = false;
    previousInstallment :boolean = true;
    private updateList: Array<IUpdateDueDate> = []


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private selected = [];
    private paramList: Array<IQueryParam> = [];

    private columns = [
        { key: 'rollNo', caption: "Roll No." },
        { key: 'fullName', caption: "Student's Name" },
        { key: 'installmentNo', caption: "Select All" },
        { key: 'challanNo', caption: "Challan No." },
        { key: 'feeAmount', caption: "Amount" },
        { key: 'dueDate', caption: "Current Due Date" },
        { key: 'newDueDate', caption: "New Due Date" },

        { key: 'isSelected', caption: "Select All" }
    ];
    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }]
    created() {
        this.repository = new FeeChallanValidityService(this.$store);
        this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
        this.loadSession();
        this.loadGender();

        // this.loadCityCampus();
    }

    addParam(isChecked: boolean, param: string) {

        // console.log(isChecked, param)



        if (param == 'SectionCourseLinkId') {
            if (isChecked) {
                this.checkSection == !this.checkSection;

                if (this.paramList.find(s => s.name == 'SectionCourseLinkId')) {
                    this.paramList.find(s => s.name == 'SectionCourseLinkId').value = this.sectionCourseLinkId;
                    console.log(this.sectionCourseLinkId)
                }

                else {
                    this.paramList.push({ param: "AND ab.\"SectionCourseLinkId\"", value: this.sectionCourseLinkId, name: 'SectionCourseLinkId' });
                }
            } else {
                this.checkSection == !this.checkSection;
                if (this.paramList.find(s => s.name == 'SectionCourseLinkId')) {
                    this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionCourseLinkId'), 1);
                }
            }
        }
        if (param == 'GenderId') {
     
            if (isChecked) {
                // console.log(isChecked);
                this.checkgender == !this.checkgender;
                if (this.paramList.find(s => s.name == 'GenderId')) {
                    this.paramList.find(s => s.name == 'GenderId').value = this.genderId;


                }

                else {
                    this.paramList.push({ param: "AND ab.\"GenderId\"", value: this.genderId, name: 'GenderId' });
                }
            } else if (isChecked) {
                this.checkgender == !this.checkgender;
                if (this.paramList.find(s => s.name == 'GenderId')) {
                    this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
                }
            }
        }

    }





    checkAll() {
   
        if (this.selectAll == true ) {
           // var studentli = this.StudentList.filter(e => e.isSelected);
           this.StudentList.forEach(element => {
           this.enablebutton = element.allowButton;

         if(element.expiredButton===true && element.allowButton===true){

            element.isSelected = true; 
            this.enableprintbutton = element.enablePrintButton;

         }
          

         else{
               element.isSelected = false;
         }
                //this.previousInstallment = element.expiredButton;
    
            });
            // this.StudentList.forEach(element => {
            //     element.isSelected = true;               
                
            //     this.enablebutton =true;
            // });
        }
        else {
            this.StudentList.forEach(element => {
                element.isSelected = false;
                this.enablebutton=false;
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
        this.enablebutton = false;
        // this.refreshData();
        this.checkgender = false;
        this.enableprintbutton=false;

    }

    loadCityCampus() {
        this.ischecked = false;
        if (this.sessionId.length > 0) {
            this.campusddl = [];
            this.cityDDL = [];
            let oldObj: ICampusCityVM;
            this.campusRepo.GetCityVM().then(r => {
                this.campusCityList = r as Array<ICampusCityVM>;
            });
        }
    }
    loadGender() {

        this.genderrepository.GetFindBy('e=>e.StatusId==1').then(r => {
            this.genderlist = r as Array<ISetupGender>
        })


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

        if (this.StudentList) {
            if (this.StudentList.filter(s => s.isSelected)) {
                if (this.StudentList.filter(s => s.isSelected).length > 0) {
                    isEnable = true;

                }
            }
        }

        return isEnable;
    }
    get allowbutton() {
        var isEnable: boolean = false;
        var enablecheckbox: boolean = false;
        if (this.StudentList) {
            if (this.StudentList.filter(s => s.allowButton === true)) {


                enablecheckbox = true;
            }
            else {

                enablecheckbox = false;
            }
        }

        return enablecheckbox;
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
  
        this.enablebutton = false;
        var where = "ab.\"AdmissionFormId\" IS NOT NULL ";
        console.log(this.paramList)
        this.paramList.forEach(e => {

            where = where + " " + e.param + "=''" + e.value + "''";

        })

        if ((this.checkgender == true || this.checkSection == true) && this.genderId == '' && this.sectionCourseLinkId == '') {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'No record Found',
                title: 'Failed',
                messageTypeId: PayloadMessageTypes.warning
            });
            this.paramList=[];
        }
        else {
            
            console.log(where);
            if (this.classId.length > 0) {

                this.StudentList = [];
                var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + this.classId + "?" + this.installmentNo + "?" + where
                this.repository.GetFindByEx(key)
                    .then(r => {
                        this.StudentList = r as Array<IChallanValidityUpdate>

                    });
            }
        }
    }
    
    updatedata(challanNo) {

        this.challannumber = challanNo;
        var studentli = this.StudentList.filter(e => e.isSelected === true);
        studentli.forEach(element => {
            this.enablebutton = element.allowButton;
            this.enableprintbutton = element.enablePrintButton;
             this.previousInstallment = element.expiredButton;
        });

    }
    generateChallanReport() {
         
        this.ChallanRList = [];
        this.reportData = [];
        var getchallandata ='';
        var campusProgramid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;     
        this.reportData= this.StudentList.filter(e=>e.isSelected === true);
        this.reportData.forEach(element => {
        getchallandata = getchallandata + element.challanNo;
        getchallandata = getchallandata +','; 
        
        });
        console.log(getchallandata);
       console.log(this.reportData);

        var key = this.campusId + "?" + this.programDetailId + "?" + this.sectionCourseLinkId + "?" + this.installmentNo + "?" + this.user.email + "?" + campusProgramid + "?" + this.classId + "?"+ getchallandata.slice(0,-1);
        this.repository.get_challan_report(key)
            .then(r => {






                if (r) {
                    if (r.length > 0) {
                        this.resultdata = r;
                        var res1 = [];
                        var stdlist = this.StudentList.filter(e => e.isSelected == true);
                        stdlist.forEach(element => {
                            var res = this.resultdata.filter(e => e.challanNo == element.challanNo);

                            if (res.length > 0) {
                                res1.push(res);
                            }
                        });

                        this.resultdata = res1;

                        if (this.selectAll == true) {
                            this.$store.dispatch(RootStoreTypes.reportOperation, {
                                data: r as any,
                                path: '/assets/Reports/Resource/Admission/student-challan-ex.xml',
                                show: true
                            });

                        }
                        else {
                            // if( this.resultdata[0].challanNo == this.challannumber){
                            this.$store.dispatch(RootStoreTypes.reportOperation, {
                                data: this.resultdata as any,
                                path: '/assets/Reports/Resource/Admission/student-challan-ex.xml',
                                show: true
                            });


                        }
                    }
                    else {
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
        this.updateList = [];
        this.templist = [];

        this.StudentList.filter(s => s.isSelected).forEach(e => {
            this.templist.push({ challanNo: e.challanNo })
            // this.enableprintbutton=true;
        })
        if (this.templist.length > 0) {
            var key = JSON.stringify(this.templist) + "?" + this.campusId + "?" + this.installmentNo + "?" + this.programDetailId + "?" + this.classId + "?" + this.sessionId;

            this.repository.UpdateBulk(key)
                .then(r => {
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

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }
}

export interface IUpdateDueDate {
    challanNo: string;
}