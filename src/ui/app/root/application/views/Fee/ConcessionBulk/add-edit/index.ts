/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { required, maxLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import {
  IFeeConcession,
  ISetupZone,
  ISetupSession,
  ISetupProgram,
  ISetupShift,
  IFeeChallanType,
  IFeeFeeHead,
  IFeeConcessionDetailVM,
  IFeeStructureVM,
  IFeeConcessionDetail,
  ICampusCityVM,
  DDLGroupModel,
  DDLModel,
  DDLModelCB,
  ISetupCampusProgramVM,
  IFeeContinuationPolicy,
  IFeeContinuationPolicyCB,
  ISetupAdmissionType,
  TBLGrades,
  ISetupCampusProgramLinkVM,
  IFeeScholarshipCriteria,
  CampusProgramZoneVM,
  ISetupClass,
  IFeeConcessionExtended
} from "../../../../models";
import {
  FeeConcessionService,
  SetupZoneService,
  SetupSessionService,
  SetupProgramService,
  SetupShiftService,
  FeeChallanTypeService,
  FeeFeeHeadService,
  FeeConcessionDetailService,
  FeeScholarshipCriteriaService,
  SetupCampusService,
  SetupCampusProgramLinkService,
  FeeContinuationPolicyService,
  SetupAdmissionTypeService,
  SetupClassService
} from "../../../../service";

import * as helper from "../../../../helper";

import { SetupShiftAddEdit } from '../../../Setup/Shift/add-edit';
import { SetupSessionAddEdit } from '../../../Setup/Session/add-edit';
import { SetupZoneAddEdit } from '../../../Setup/Zone/add-edit';

type ValidateFeeConcession = {
  model: IFeeConcession;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateFeeConcession> = {
  model: {
    concessionId: { required },
    zoneId: { required },
    sessionId: { required },
    programId: { required },
    shiftId: { required },
    challanTypeId: { required },
    fullName: { required },
    statusId: { required },
    loggerId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
  components: {
    'Shift': SetupShiftAddEdit,
    'Zone': SetupZoneAddEdit,
    // 'Session': SetupSessionAddEdit
  }
})
export class FeeConcessionBulkAddEdit extends Vue {
  private repository: FeeConcessionService;
  private zonerepository: SetupZoneService = null;
  private Sessionrepository: SetupSessionService = null;
  private Programrepository: SetupProgramService = null;
  private shiftrepository: SetupShiftService = null;
  private ChallanTyperepositry: FeeChallanTypeService = null;
  private feeHeadRepo: FeeFeeHeadService = new FeeFeeHeadService(this.$store);
  private concessionDetailRepo: FeeConcessionDetailService = new FeeConcessionDetailService(
    this.$store
  );

  private zoneList: Array<ISetupZone> = [];
  private SessionList: Array<ISetupSession> = [];
  private ProgramList: Array<ISetupProgram> = [];
  private ShiftList: Array<ISetupShift> = [];
  private feeHeadList: Array<IFeeFeeHead> = [];
  private ChallantypeList: Array<IFeeChallanType> = [];
  private programCBList: Array<ICheckBoxModel> = [];
  private feeHeadCBList: Array<ICheckBoxModel> = [];
  private feeStructureVMList: Array<IFeeStructureVM> = [];
  private feeStructureVMListTemp: Array<IFeeStructureVM> = [];
  private concessionDetailList: Array<IFeeConcessionDetail> = [];
  private concessionList: Array<IFeeConcessionExtended> = [];
  private scholarshipList: Array<IFeeScholarshipCriteria> = [];

  private campusCityList: Array<ICampusCityVM> = []

  private campusProgramVMList: Array<CampusProgramZoneVM> = []
  private campusProgramRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store);
  private campusProgramVMListCB: Array<ICheckBoxModel> = []
  // private continuationPolicyList:Array<IFeeContinuationPolicy>=[]
  // private continuationPolicyRepo:FeeContinuationPolicyService=new FeeContinuationPolicyService(this.$store)

  

  private isActive: boolean = true;
  private sessionId: '';
  private sessionName = '';
  private zoneName = '';
  private shiftName = '';
  private data: IFeeConcession = {
    concessionId: "",
    zoneId: "",
    sessionId: "",
    programId: "",
    shiftId: "",
    challanTypeId: "",
    fullName: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private challanTypeId: string = "";

  private cityDDL: Array<DDLGroupModel> = []
  private campusddl: Array<DDLModelCB> = []
  private continuationPolicyList: Array<IFeeContinuationPolicy> = [];
  private continuationPolicyCBList: Array<IFeeContinuationPolicyCB> = [];
  private admissionTypeId: string = ''
  private admissionTypeList: Array<ISetupAdmissionType> = [];
  private admissionTypeCBList: Array<ICheckBoxModel> = [];
  private isScholarship = false;
  private scholarshipTypeId = "00000000-0000-0000-0000-000000000000";
  private marksPer = 0;

  private continuationPolicyRepo: FeeContinuationPolicyService = new FeeContinuationPolicyService(this.$store);
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
  private admissionTypeRepo: SetupAdmissionTypeService = new SetupAdmissionTypeService(this.$store);
  private gradeRepository: FeeScholarshipCriteriaService = new FeeScholarshipCriteriaService(this.$store);

  private attendancePercentage: number = 0;
  GradesList: Array<TBLGrades> = [];
  existingConcsessionList: any = []
  concessionName = ''
  created() {

    this.repository = new FeeConcessionService(this.$store);
    this.zonerepository = new SetupZoneService(this.$store);
    this.Sessionrepository = new SetupSessionService(this.$store);
    this.Programrepository = new SetupProgramService(this.$store);
    this.shiftrepository = new SetupShiftService(this.$store);
    this.ChallanTyperepositry = new FeeChallanTypeService(this.$store);

    this.loadZone();
    // this.loadSession();
    this.loadShift();
    this.loadChallanType();
    this.loadClass();
    this.$watch('challanTypeId', this.loadFeeHeads)
    //this.loadCityCampus();
  }

  loadExistingConcession() {
    this.existingConcsessionList = []
    if (this.data.zoneId.length > 0 && this.sessionId.length > 0 && this.data.shiftId.length > 0 && this.challanTypeId.length > 0) {
      var key = this.data.zoneId + "?" + this.sessionId + "?" + this.data.shiftId + "?" + this.challanTypeId;
      this.repository.GetExistingConcession(key)
        .then(r => {

          this.existingConcsessionList = r as Array<any>
          this.existingConcsessionList.push({ "providedString": "+ New Concession" })
          this.existingConcsessionList = this.existingConcsessionList.reverse()
          this.reloadFeeHead();
        })
    }
  }
  loadCampusProgram() {

    if (this.data.zoneId.length > 0 && this.sessionId.length > 0 && this.data.shiftId.length > 0) {

      this.campusProgramRepo.GetAllByZoneId(this.data.zoneId + "?" + this.sessionId + "?" + this.data.shiftId)
        .then(r => {
          this.campusProgramVMList = r as Array<CampusProgramZoneVM>;

          this.loadExistingConcession();
        })
    }

  }
  loadGrades() {
    this.gradeRepository.GetAllGrades()
      .then(res => {
        this.GradesList = res as Array<TBLGrades>;
      });
  }
  loadAdmissionType() {
    this.admissionTypeCBList = [];
    this.admissionTypeList = [];
    this.admissionTypeRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.admissionTypeList = r as Array<ISetupAdmissionType>;
      this.admissionTypeList.forEach(e => {
        this.admissionTypeCBList.push({
          id: e.admissionTypeId,
          name: e.fullName,
          isChecked: false
        });
      });
    });
  }
  checkScholarship() {
    if (
      this.admissionTypeList.find(s => s.fullName.search("Sch") != -1)
        .admissionTypeId == this.admissionTypeId
    ) {
      this.isScholarship = true;

    } else {
      this.isScholarship = false;
      this.scholarshipTypeId = "00000000-0000-0000-0000-000000000000"

    }
  }
  loadContinuationPolicy() {
    this.continuationPolicyList = [];
    this.continuationPolicyCBList = [];
    this.continuationPolicyRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.continuationPolicyList = r as Array<IFeeContinuationPolicy>;
      this.continuationPolicyList.forEach(e => {
        this.continuationPolicyCBList.push({
          continuationPolicyId: e.continuationPolicyId,
          fullName: e.fullName,
          isChecked: false
        })
      })
    });
  }

  addNewShift() {
    this.$modal.show('Shift-add-edit-model', { IsNewRecord: true });

  }


  addNewZone() {
    this.$modal.show('Zone-add-edit-model', { IsNewRecord: true });

  }


  addNewSession() {
    this.$modal.show('Session-add-edit-model', { IsNewRecord: true });

  }

  loadChallanType() {
    this.ChallantypeList = []
    this.ChallanTyperepositry.GetFindBy("e=>e.StatusId==1").then(res => {
      this.ChallantypeList = res as Array<IFeeChallanType>;
    });
  }
  loadZone() {
    this.zoneList = []
    this.zonerepository.GetFindBy("e=>e.StatusId==1").then(res => {
      this.zoneList = res as Array<ISetupZone>;
    });
  }

  loadProgram() {
    this.programCBList = []
    this.ProgramList = []
    this.Programrepository.GetFindBy("e=>e.StatusId==1").then(res => {
      this.ProgramList = res as Array<ISetupProgram>;
      this.ProgramList.forEach(e => {
        this.programCBList.push({
          id: e.programId,
          name: e.fullName,
          isChecked: false
        });
      });
    });
  }
  loadShift() {
    this.ShiftList = []
    this.shiftrepository.GetFindBy("e=>e.StatusId==1").then(res => {
      this.ShiftList = res as Array<ISetupShift>;
    });
  }

  private classList: Array<ISetupClass> = []
  private classRepo: SetupClassService = new SetupClassService(this.$store)
  private classId = '';
  loadClass() {
    this.classRepo.GetFindBy('s=>s.StatusId!=2')
      .then(r => { this.classList = r as Array<ISetupClass> });
  }
  loadFeeHeads() {
    if (this.challanTypeId.length > 0) {
      this.feeHeadList = [];
      this.feeHeadCBList = [];
      this.feeHeadRepo.GetFindBy('e=>e.StatusId==1 && e.ChallanTypeId.ToString()=="' + this.challanTypeId + '"').then(res => {
        this.feeHeadList = res as Array<IFeeFeeHead>;
        this.feeHeadList.forEach(e => {
          this.feeHeadCBList.push({
            id: e.feeHeadId,
            name: e.fullName,
            isChecked: false
          });
        });
      });
    }

  }

  reloadFeeHead() {
    // if (this.concessionName == 'New Concession') {
    this.feeStructureVMList = [];
    this.feeStructureVMListTemp = [];
    if (
      this.programCBList.filter(s => s.isChecked).length > 0 &&
      this.feeHeadCBList.filter(s => s.isChecked).length > 0 &&
      this.data.zoneId.length > 0 &&
      this.data.shiftId.length > 0 &&
      this.data.sessionId.length > 0 &&
      this.classId.length > 0
    ) {
      var key =
        this.data.zoneId +
        "?" +
        this.data.sessionId +
        "?" +
        this.data.shiftId +
        "?" +
        JSON.stringify(this.programCBList.filter(s => s.isChecked)) +
        "?" +
        JSON.stringify(this.feeHeadCBList.filter(s => s.isChecked)) +
        "?" +
        this.classId
        ;

      this.concessionDetailRepo.GetBulkData(key).then(r => {
        this.feeStructureVMList = r as Array<IFeeStructureVM>;
        if (this.feeStructureVMList.length > 0) {
          this.feeStructureVMListTemp.push(this.feeStructureVMList[0]);
          var oldId = this.feeStructureVMList[0].programId;
          this.feeStructureVMList.forEach(e => {
            if (e.programId != oldId) {
              this.feeStructureVMListTemp.push(e);
            }
            oldId = e.programId;
          });
          console.log(this.feeStructureVMList.length)
          console.log(this.feeStructureVMListTemp.length)

        }
      });
    }
    // }
  }

  calculatePercentage(data: IFeeStructureVM) {
    // alert("sdfsadf")
    var index = this.feeStructureVMList.indexOf(data);
    this.feeStructureVMList[index].percentage =
      (data.amount / data.feeAmount) * 100;
    this.feeStructureVMList[index].percentage = +parseFloat(
      this.feeStructureVMList[index].percentage.toString()
    ).toFixed(2);
  }
  calculateTotalAmount(data: IFeeStructureVM) {
    var index = this.feeStructureVMList.indexOf(data);
    this.feeStructureVMList[index].amount = +parseFloat(
      ((data.percentage / 100) * data.feeAmount).toString()).toFixed(2);;
  }

  beforeModalOpen(event) {
    this.loadChallanType();

    this.loadFeeHeads();
    this.loadContinuationPolicy();

    this.loadProgram();
    this.loadGrades();
    this.loadAdmissionType();
    this.IsNewRecord = event.params.IsNewRecord;

    this.sessionId = event.params.sessionId;
    this.sessionName = event.params.sessionName;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
  }

  cancel() {
    this.concessionName = ''
    this.challanTypeId = ''
    this.ChallantypeList = []
    this.existingConcsessionList = [];
    this.campusProgramVMList = []
    this.feeStructureVMList = [];
    this.feeStructureVMListTemp = [];
    this.admissionTypeId = '';
    this.scholarshipTypeId = "00000000-0000-0000-0000-000000000000"
    this.marksPer = 0;
    this.attendancePercentage = 0;
    this.classId = '';

    this.data = {
      concessionId: "",
      zoneId: "",
      sessionId: "",
      programId: "",
      shiftId: "",
      challanTypeId: "",
      fullName: "",
      statusId: 0,
      loggerId: ""
    };
    this.feeHeadCBList = [];
    this.programCBList = [];
    this.feeHeadList = [];
    this.ProgramList = [];

    this.$modal.hide("add-edit-model");
    this.$emit("submit");
  }

  saveModel() {

     debugger;
    //this.sessionName = this.se.find(s => s.sessionId == this.data.sessionId).fullName;
    if (this.concessionName == '+ New Concession') {

      if (this.checkVal == true) {
        this.zoneName = this.zoneList.find(s => s.zoneId == this.data.zoneId).fullName;
        this.shiftName = this.ShiftList.find(s => s.shiftId == this.data.shiftId).fullName;
      } else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Please Fill the required Fields",
          title: "warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      if (this.IsNewRecord) {
        this.concessionList = [];
        this.concessionDetailList = [];
        this.scholarshipList = []

        this.admissionTypeCBList.filter(s => s.isChecked).forEach(at => {
        //feeStructureVMListTemp is filtered by programs
        this.feeStructureVMListTemp.forEach(e => {
          var concessionid = helper.newGuid();
          this.concessionList.push({
            concessionId: concessionid,
            zoneId: e.zoneId,
            sessionId: e.sessionId,
            programId: e.programId,
            shiftId: e.shiftId,
            challanTypeId: this.challanTypeId,
            fullName: this.data.fullName,
            statusId: 1,
            loggerId: helper.newGuid(),
            admissionTypeId: at.id
          });
          console.log(JSON.stringify(this.concessionList));
          //feeStructureVMList contains head wise data
          this.feeStructureVMList
            .filter(s => s.programId == e.programId)
            .forEach(j => {
              this.concessionDetailList.push({
                concessionDetailId: helper.newGuid(),
                concessionId: concessionid,
                feeHeadId: j.feeHeadId,
                percentage: j.percentage,
                feeAmount: j.amount,
                statusId: 1,
                loggerId: helper.newGuid()
              });
            });
        });
      });
       

       // var admisstypenName = this.admissionTypeList.find(s => s.admissionTypeId == this.admissionTypeId).fullName;

       

        var data = JSON.stringify(this.concessionList) + "?"
          + JSON.stringify(this.concessionDetailList) + "?"
          + JSON.stringify(this.continuationPolicyCBList.filter(s => s.isChecked))
          + "?" + this.scholarshipTypeId + "?" + this.marksPer + "?" + this.attendancePercentage
          + "?" + this.data.shiftId;
        // this.checkValidation();
        
        if (this.checkValidation == true) {
          this.concessionDetailRepo.AddBulkConcessionEx(data)
            .then(r => {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record has been added successfully",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
              });
              this.cancel();
            })
        }
        else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Please Fill the required Fields",
            title: "warning",
            messageTypeId: PayloadMessageTypes.warning
          });
        }

      }
    }
    /// when old concession and new scholarshipcriteria
    else {


      console.log('hi')
      console.log(this.feeStructureVMList.length)
      // var concessionid=this.existingConcsessionList.find(s=>s.providedString==this.concessionName).;
      // Enter concession Detail for new program
      if (this.feeStructureVMList.length > 0) {
        this.concessionList = [];
        this.concessionDetailList = [];
        this.scholarshipList = []

        this.admissionTypeCBList.filter(s => s.isChecked).forEach(at => {
        this.feeStructureVMListTemp.forEach(e => {
          var concessionid = helper.newGuid();
          this.concessionList.push({
            concessionId: concessionid,
            zoneId: e.zoneId,
            sessionId: e.sessionId,
            programId: e.programId,
            shiftId: e.shiftId,
            challanTypeId: this.challanTypeId,
            fullName: this.concessionName,
            statusId: 1,
            loggerId: helper.newGuid(),
            admissionTypeId: at.id
          });
          //feeStructureVMList contains head wise data
          this.feeStructureVMList
            .filter(s => s.programId == e.programId)
            .forEach(j => {
              this.concessionDetailList.push({
                concessionDetailId: helper.newGuid(),
                concessionId: concessionid,
                feeHeadId: j.feeHeadId,
                percentage: j.percentage,
                feeAmount: j.amount,
                statusId: 1,
                loggerId: helper.newGuid()
              });
            });
        });
      });

        var data = JSON.stringify(this.concessionList) + "?"
          + JSON.stringify(this.concessionDetailList) + "?"
          + JSON.stringify(this.continuationPolicyCBList.filter(s => s.isChecked)) 
          + "?" + this.scholarshipTypeId + "?" + this.marksPer + "?" + this.attendancePercentage
          + "?" + this.data.shiftId;

        this.concessionDetailRepo.AddBulkConcessionEx(data)
          .then(r => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Record has been added successfully",
              title: "Success",
              messageTypeId: PayloadMessageTypes.success
            });
            this.cancel();
          })
      }
      // Enter only scholarship criteria
      else {
        // var key = JSON.stringify(this.continuationPolicyCBList.filter(s => s.isChecked)) + "?"
        //   + this.concessionName + "?" + this.data.zoneId + "?" + this.sessionId + "?" + this.data.shiftId + "?" +
        //   this.challanTypeId + "?" + this.admissionTypeId + "?" + this.scholarshipTypeId + "?" + this.marksPer + "?"
        //   + this.attendancePercentage

        // this.concessionDetailRepo.AddBulkScholarshipCriteria(key)
        //   .then(r => {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //       text: "Record has been added successfully",
        //       title: "Success",
        //       messageTypeId: PayloadMessageTypes.success
        //     });
            this.cancel();
          // })
      }

    }



  }
  get checkValidation() {


    return (this.concessionDetailList.length > 0 &&
      this.data.fullName.length > 0 &&
      // this.scholarshipList.length > 0 &&
      this.admissionTypeCBList.filter(s => s.isChecked).length > 0

    )

  }

  get checkVal() {
    return (this.data.zoneId.length > 0 &&
      this.data.shiftId.length > 0)
  }

  $v: Vuelidate<any>;
}



export interface ICheckBoxModel {
  id: string;
  name: string;
  isChecked: boolean;
}
