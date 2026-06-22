/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */
import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";
import { IUser, PayloadMessageTypes } from "../../../../../model";
import { IRootStoreState } from "../../../../store";
import { StoreTypes } from "../../../../../store";
import * as helper from "../../../helper";
import {
  CitySubCity,
  ISetupCity,
  ISetupClass,
  ISetupSectionList,
  ISetupCollector,
  IGeneral,
  ISetupCampus,
  ISetupSession,
  DDLModel,
  DDLGroupModel,
  IStudentCreditNotes,
  ISetupCampusProgramVM,
  IInstallmentNos,
  IAttendanceCutOffDate,
  IGetConcessionReversalStudents,
  IGetConcessionStudentsList,
  IGetConcessionStudentsListEX,
  IScholarshipsVM,
  IScholarshipsVMEX,
  ICourseSection
} from "../../../models";
import {
  SetupCampusService,
  SetupSessionService,
  SetupCityService,
  SetupSubCityService,
  SetupClassService,
  SetupCollectorService,
  FeeStudentFeeStructureService,
  SetupCampusProgramLinkService,
  FeeConcessionDetailService, 
} from "../../../service";
import { SetupConcessionRemarksService } from '../../../service/Setup/ConcessionRemarks';
import { ISetupConcessoinRemarks, IVWConcessionRemarksVM } from '../../../models/Setup/ConcessionRemarks';
export interface ICampusCityVM {
  campusId: string;
  campusName: string;
  cityName: string;
  zoneId:string;
  subCityId:string;
  cityId:string;
}
import { GroupModel, GeneralModel } from "../../../models/general";
@Component({
  name: "comparison-dashboard",
  template: require("./index.html"),
  components: {},
})
export class applyConcessionOnInstallment extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private Collectorrepository: SetupCollectorService = null;
  private campusRepo: SetupCampusService = null;
  private sessionRepo: SetupSessionService = null;
  private cityRepo: SetupCityService = null;
  private subCityRepo: SetupSubCityService = null;
  private classRepo: SetupClassService = null;
  private courseList: Array<ICourseSection> = [];
  private concessionremarksmarkslist: Array<IVWConcessionRemarksVM> = [];
  private studentfeestructure: FeeStudentFeeStructureService = null;
  private campusProgramLinkRepo: SetupCampusProgramLinkService = null;
  private concessionmarkrepository: SetupConcessionRemarksService = null;
  private campusddl: Array<DDLModel> = [];
  private campusId = "";
  private sessionId = "";
  private termModel: Array<GeneralModel> = [];
  private subCityList: Array<CitySubCity> = [];
  private cityList: Array<ISetupCity> = [];
  classList: Array<ISetupClass> = [];
  sectionslist: Array<ISetupSectionList> = [];
  CollectorList: Array<ISetupCollector> = [];
  private cityId: string = "";
  private subCityId: string = "";
  private classId: string = "";
  private sectionId: string = "";
  private collectorId: string = "";
  public tabOne: boolean = false;
  public tabTwo: boolean = true;
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private isDisabled: boolean = false;
  private chkall: boolean = false;
  private chksingle: boolean = false;
  private collector: string;
  private dueDate: string;
  private sectionCourseLinkId: string;
  private paidDate: string;
  private InstallmentNo: string= "";
  private cutofDate: string= "";
  private currentDate = new Date();
  private alldata: Array<IStudentCreditNotes> = [];
  private installmentnos: Array<IInstallmentNos> = [];
  private attendanceCutOffDate: Array<IAttendanceCutOffDate> = [];
  private cityDDL: Array<DDLGroupModel> = [];
  private campusSubCityModel: Array<GroupModel> = [];
  private ddl: Array<DDLModel> = [];
  private programDDL: Array<DDLGroupModel> = [];
  private data: Array<IGetConcessionStudentsList> = [];
  //private data: Array<IGetConcessionStudentsListEX> = [];
  private scholarshipList: Array<IScholarshipsVMEX> = []
  private scholarshipListEX: Array<IScholarshipsVMEX> = []
  private repository: FeeConcessionDetailService;
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private campusProgramId = "";
  private programDetailId = '';
  private admissionType = '';


  private remarks = '';
  private columns = [
    { key: "rollNo", caption: "Refference No.", sort: true },
    { key: "studentName", caption: "Student's Name" },
    { key: "percentage", caption: "Attendance %" },
    { key: "currentConcession", caption: "Current Concession" },
    { key: "reConcession", caption: "Re-Apply Concession"}, 
     { key: 'isSelected', caption: 'Selected', width: 80 }
  ];
  mounted() {
    this.loadSession();
  }
  created() {
    this.Collectorrepository = new SetupCollectorService(this.$store);
    this.campusRepo = new SetupCampusService(this.$store);
    this.sessionRepo = new SetupSessionService(this.$store);
    this.cityRepo = new SetupCityService(this.$store);
    this.subCityRepo = new SetupSubCityService(this.$store);
    this.classRepo = new SetupClassService(this.$store);
    this.studentfeestructure= new FeeStudentFeeStructureService(this.$store);
    this.campusProgramLinkRepo=new SetupCampusProgramLinkService(this.$store);
    this.concessionmarkrepository=new SetupConcessionRemarksService(this.$store);
  }
  loadSession() {
    this.data=[];
    this.campusSubCityModel=[];
    this.campusProgramLinkList=[];
    this.classList=[];
    this.courseList=[];
    this.installmentnos=[];
    this.sessionId="";
    this.campusId="";
    this.campusProgramId="";
    this.programDetailId="";
    this.classId="";
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.termModel = r;
    });
    this.Getdata();
  }
  loadCityCampus() {
    this.data=[];
    this.campusSubCityModel=[];
    this.campusProgramLinkList=[];
    this.classList=[];
    this.courseList=[];
    this.installmentnos=[];
    this.cityId = "";
    this.subCityId = "";
    this.classId = "";
    this.campusId = "";
    this.campusProgramId="";
    this.programDetailId="";
    this.sectionId="";
    this.InstallmentNo="";
    this.campusProgramLinkList=[];
    this.campusddl = [];
    this.cityDDL = [];
    this.campusId = "";
    let oldObj: ICampusCityVM;
    if(this.sessionId.length>0)
    {
      this.campusRepo.GetCityVM().then(r => {
        this.campusSubCityModel = r;
      });
    }
    this.Getdata();
  }
  loadProgramsOfCampus() {
    this.data=[];
    this.campusProgramLinkList=[];
    this.classList=[];
    this.courseList=[];
    this.installmentnos=[];
    this.classId = ""; 
    this.campusProgramId="";
    this.programDetailId="";
    this.sectionId="";
    this.InstallmentNo="";
    this.ddl = [];
    this.programDDL = [];
    this.classList=[];
    let oldObj: ISetupCampusProgramVM;
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      var key = this.sessionId + "?" + this.campusId;
      this.campusProgramLinkRepo.GetAllVM(key).then(r => {
        this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
      });
    }
    this.Getdata();
  }
  loadClass() {
    this.data=[];
    this.classList=[];
    this.courseList=[];
    this.installmentnos=[];
    this.sectionId="";
    this.InstallmentNo=""; 
    if (
      this.sessionId.length > 0 &&
      this.campusId.length > 0 &&
      this.programDetailId.length > 0
    ) {
      this.classRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
        this.classList = r as Array<ISetupClass>;
      });
    }
    this.Getdata();
  }
  loadSections() {
    this.data=[];
    this.sectionslist=[];
    this.installmentnos=[];
    this.InstallmentNo="";
    if (
      this.sessionId.length > 0 &&
      this.campusId.length > 0 &&
      this.programDetailId.length > 0 &&
      this.classId.length > 0
    ) {
      var campusProgramid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
      this.campusProgramId=campusProgramid;
      var key= this.sessionId+'?'+this.campusId+'?'+campusProgramid+'?'+this.classId;
      this.studentfeestructure.LoadSections(key)
        .then((res) => {
          this.sectionslist = res as Array<ISetupSectionList>;   });
    }
    this.loadScholarships();
    this.loadScholarshipsEX();
    this.getConcessionMarks();
    this.Getdata();
  }
  loadInstallmentNo() {
    this.data=[];
    this.installmentnos=[];
    if (
      this.sessionId.length > 0 &&
      this.campusId.length > 0 &&
      this.programDetailId.length > 0 &&
      this.classId.length > 0
    ) {
      var campusProgramid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
      this.campusProgramId=campusProgramid;
      var key= this.sessionId+'?'+this.campusId+'?'+this.campusProgramId+'?'+this.classId;
      this.studentfeestructure.InstallmentNos(key)
        .then((res) => {
          this.installmentnos = res as Array<IInstallmentNos>;   });
    }
    this.Getdata();
  }
  loadScholarships() {
    debugger
    this.scholarshipList = []
    if (this.campusId.length > 0 && this.sessionId.length > 0 && this.programDetailId.length > 0) {
        var campusProgramid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
       this.admissionType='0becb36d-3cfb-49ac-ad3e-9af692a1a558';
        var key = campusProgramid+'?'+this.admissionType;
        this.studentfeestructure.GetScholarshipsEX(key)
            .then(r => {
                this.scholarshipList = r as Array<IScholarshipsVMEX>

            })
    }
}
loadScholarshipsEX() {
  debugger
  this.scholarshipList = []
  if (this.campusId.length > 0 && this.sessionId.length > 0 && this.programDetailId.length > 0) {
      var campusProgramid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
      this.admissionType='6f9a5f64-727f-4cb8-8e54-a54f67f7be05';
      var key = campusProgramid+'?'+this.admissionType;
      this.studentfeestructure.GetScholarshipsEX(key)
          .then(r => {
              this.scholarshipListEX = r as Array<IScholarshipsVMEX>
          })
  }
}
  Getdata() {
    if (
      this.sessionId.length > 0 &&
      this.campusId.length > 0 &&
      this.programDetailId.length > 0 &&
      this.classId.length > 0 &&
      this.sectionId.length>0 &&
      this.InstallmentNo.length>0
    ) {
      var campusProgramid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
      var key = campusProgramid;
      var key=this.sessionId+'?'+this.campusId+'?'+campusProgramid+'?'+this.classId+'?'+this.sectionId+'?'+this.InstallmentNo+'?'+this.programDetailId;
      console.log(key);
      this.studentfeestructure.GetStudentDataApplyConcession(key).then((res) => { 
        this.data = res as Array<IGetConcessionStudentsList>;
      });
    }
    this.chkall=false;
    this.isDisabled=false;
  }
Savedata() {
    if (
      this.sessionId.length > 0 &&
      this.campusId.length > 0 &&
      this.programDetailId.length > 0 &&
      this.classId.length > 0 &&
      this.sectionId.length>0 &&
      this.InstallmentNo.length>0
      )    {
        var list =  this.data.filter(x => x.isChecked);
        if(list.length > 0)
        {
          debugger
            this.studentfeestructure.ConcessionAppliedOnInstallment(JSON.stringify(list)).then(r => {
                this.Getdata();
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Concession Applied successfully',
                            title: '',
                            messageTypeId: PayloadMessageTypes.success
                        });
                    })
        }
     }
}
  updatechek(){
    if(this.data.filter(e=>e.isChecked==true).length>0){
        this.isDisabled=true;
        this.chkall=false;
    }
    else{
    this.isDisabled=false;
    this.chkall=false;
}
 }
updall() {
    if (this.chkall == true) {
        this.data.forEach(element => {
          if(element.remarks!=null && element.scholarshipCriteriaId!='00000000-0000-0000-0000-000000000000')
            element.isChecked = true;
        });
        this.isDisabled=true;
    }
    if (this.chkall == false) {
        this.data.forEach(element => {
             element.isChecked = false;
        });
        this.isDisabled=false;
    }
}
getConcessionMarks() {
  this.concessionmarkrepository.GetFindBy(`e=>e.StatusId==1 && (e.CampusId.ToString() == "` +  this.campusId + `")`).then(res => {
      this.concessionremarksmarkslist = res as Array<IVWConcessionRemarksVM>;
  });
}
  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("applyConcessionOnInstallment" in this.user.claims == true) {
        if (this.user.claims["applyConcessionOnInstallment"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["applyConcessionOnInstallment"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["applyConcessionOnInstallment"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["applyConcessionOnInstallment"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }
}