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
  ISetupCollector,
  IGeneral,
  ISetupCampus,
  ISetupSession,
  DDLModel,
  DDLGroupModel,
  IStudentCreditNotes,
} from "../../../models";
import {
  SetupCampusService,
  SetupSessionService,
  SetupCityService,
  SetupSubCityService,
  SetupClassService,
  SetupCollectorService,
  FeeStudentFeeStructureService
} from "../../../service";
import { GroupModel, GeneralModel } from "../../../models/general";

@Component({
  name: "comparison-dashboard",
  template: require("./index.html"),
  components: {},
})
export class CreditNotes extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private Collectorrepository: SetupCollectorService = null;
  private campusRepo: SetupCampusService = null;
  private sessionRepo: SetupSessionService = null;
  private cityRepo: SetupCityService = null;
  private subCityRepo: SetupSubCityService = null;
  private classRepo: SetupClassService = null;
  private studentfeestructure: FeeStudentFeeStructureService = null;

  private campusddl: Array<DDLModel> = [];
  private campusId = "";
  private sessionId = "";
  private termModel: Array<GeneralModel> = [];
  private subCityList: Array<CitySubCity> = [];
  private cityList: Array<ISetupCity> = [];
  classList: Array<ISetupClass> = [];
  CollectorList: Array<ISetupCollector> = [];
  private cityId: string = "";
  private subCityId: string = "";
  private classId: string = "";
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
  private paidDate: string;
  private currentDate = new Date();
  private data: Array<IStudentCreditNotes> = [];
  private columns = [
    { key: "refferenceNo", caption: "Refference No.", sort: true },
    { key: "studentName", caption: "Student's Name" },
    { key: "challanNo", caption: "Challan No." },
    { key: "installmentNo", caption: "Installment No." },
    { key: "amount", caption: "Amount", sort: true },
    { key: 'refundDate', caption: 'Refund Date' },
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
  }
  loadSession() {
    this.cityId = "";
    this.subCityId = "";
    this.classId = "";
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.termModel = r;
    });
  }
  loadCity() {
    if (this.sessionId.length > 0) {
      this.subCityId = "";
      this.classId = "";
      this.cityRepo.GetAllEx().then((r) => {
        this.cityList = r as Array<ISetupCity>;
        this.cityList = this.cityList.sort((one, two) =>
          one.fullName < two.fullName ? -1 : 1
        );
      });
      this.$store.dispatch(StoreTypes.loadingState, true);
    }
  }
  loadSubCity() {
    if (this.sessionId.length > 0 && this.cityId.length > 0) {
      this.classId = "";
      this.subCityRepo.GetFindByEx(this.cityId).then((r) => {
        this.subCityList = r as Array<CitySubCity>;
      });
    }
  }
  loadClass() {
    if (
      this.sessionId.length > 0 &&
      this.cityId.length > 0 &&
      this.subCityId.length > 0
    ) {
      this.classRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
        this.classList = r as Array<ISetupClass>;
      });
    }
  }
  loadCollector() {
    if (
      this.sessionId.length > 0 &&
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.classId.length > 0
    ) {
      //this.collector = "Head Office";
      this.collector = "Head Office";
      this.Collectorrepository.GetFindBy(
        'e=>e.Description =="' + this.collector + '" && e.StatusId == 4'
      ).then((res) => {
        this.CollectorList = res as Array<ISetupCollector>;
        this.collectorId=this.CollectorList[0].collectorId;
      });
    }
    this.Getdata();
  }

  Getdata() {
    this.dueDate=this.currentDate.toString();
    if (
      this.sessionId.length > 0 &&
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.classId.length > 0
    ) {
      this.collector = "Head Office";
      var key=this.sessionId+'?'+this.cityId+'?'+this.subCityId+'?'+this.classId;
      this.studentfeestructure.StudentCreditNotes(key).then((res) => { 
        this.data = res as Array<IStudentCreditNotes>;
        this.data.forEach(e=>e.paidDate=this.currentDate.toString());
        console.log(this.data);

      });
    }
    this.chkall=false;
    this.isDisabled=false;
  }
Savedata() {
    if (
        this.sessionId.length > 0 &&
        this.cityId.length > 0 &&
        this.subCityId.length > 0 &&
        this.classId.length > 0
      )    {
        var list =  this.data.filter(x => x.isChecked);
        if(list.length > 0)
        {
            list.forEach(e=> e.paidDate = helper.formateDate(new Date(e.paidDate)));
            this.studentfeestructure.UpdatePaidDateCreditNotes(JSON.stringify(list)).then(r => {
                this.Getdata();
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Paid Date Added successfully',
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
  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("creditnotes" in this.user.claims == true) {
        if (this.user.claims["creditnotes"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["creditnotes"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["creditnotes"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["creditnotes"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }
}
