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
  IFeeScholarshipCriteria,
  ISetupAdmissionType,
  IFeeConcession,
  IFeeContinuationPolicy,
  ISetupShift,
  TBLGrades
} from "../../../../models";
import {
  FeeScholarshipCriteriaService,
  SetupAdmissionTypeService,
  FeeConcessionService,
  FeeContinuationPolicyService,
  SetupShiftService
} from "../../../../service";

import * as helper from "../../../../helper";

import { SetupShiftAddEdit } from "../../../Setup/Shift/add-edit";
import { SetupAdmissionTypeAddEdit } from "../../../Setup/AdmissionType/add-edit";
import { FeeConcessionAddEdit } from "../../Concession/add-edit";
import { FeeContinuationPolicyAddEdit } from "../../ContinuationPolicy/add-edit";

type ValidateFeeScholarshipCriteria = {
  data: IFeeScholarshipCriteria;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateFeeScholarshipCriteria> = {
  data: {
    campusProgramId: { required },
    admissionTypeId: { required },
    continuationPolicyId: { required },
    concessionId: { required },
    fullName: { required },
    attendancePercentage: {
      required,
      maxLength: maxLength(4)
    }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
  components: {
    Shift: SetupShiftAddEdit,
    AdmissionType: SetupAdmissionTypeAddEdit,
    Concession: FeeConcessionAddEdit,
    ContinuationPolicy: FeeContinuationPolicyAddEdit
  }
})
export class FeeScholarshipCriteriaAddEditBulk extends Vue {
  private isActive: boolean = true;
  admissionTypeList: Array<ISetupAdmissionType> = [];
  concessionList: Array<IFeeConcession> = [];
  continuationPolicyList: Array<IFeeContinuationPolicy> = [];
  shiftList: Array<ISetupShift> = [];
  GradesList: Array<TBLGrades> = [];
  scholarshiptype: string = "00000000-0000-0000-0000-000000000000";
  private selectedconcessionlist=[];

  private repository: FeeScholarshipCriteriaService;
  private admissionTypeRepo: SetupAdmissionTypeService = new SetupAdmissionTypeService(
    this.$store
  );
  private concessionRepo: FeeConcessionService = new FeeConcessionService(
    this.$store
  );
  private continuationPolicyRepo: FeeContinuationPolicyService = new FeeContinuationPolicyService(
    this.$store
  );
  private shiftRepo: SetupShiftService = new SetupShiftService(this.$store);

  private data: IFeeScholarshipCriteria = {
    scholarshipCriteriaId: "",
    campusProgramId: "",
    admissionTypeId: "",
    attendancePercentage: 0,
    scholarshipTypeId: "00000000-0000-0000-0000-000000000000",
    marksPer: 0,
    continuationPolicyId: "",
    concessionId: "",
    fullName: "",
    statusId: 0,
    loggerId: "", isScholarhsip: false
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private sessionId = "";
  private programId = "";
  private shiftId = "";
  private zoneId = "";
  private isScholarship = false;

  created() {
    this.repository = new FeeScholarshipCriteriaService(this.$store);
    this.loadAdmissionType();
    //this.loadConcession();
    this.loadGrades();
    this.loadContinuationPolicy();
    this.loadShift();
  }

  // addNewShift() {
  //   this.$modal.show("Shift-add-edit-model", { IsNewRecord: true });
  // }

  loadShift() {
    this.shiftRepo.GetFindBy("s=>s.StatusId!=2").then(r => {
      this.shiftList = r as Array<ISetupShift>;
    });
  }
  // addNewAdmissionType() {
  //   this.$modal.show("AdmissionType-add-edit-model", { IsNewRecord: true });
  // }
  loadAdmissionType() {
    this.admissionTypeRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.admissionTypeList = r as Array<ISetupAdmissionType>;
    });
  }
  // addNewConcession() {
  //   this.$modal.show("Concession-add-edit-model", { IsNewRecord: true });
  // }
  loadConcession() {
    this.selectedconcessionlist=[];
    this.concessionList=[];
    this.concessionRepo
      .GetFindBy(
        'e=>e.ZoneId.ToString()=="' +
        this.zoneId +
        '" && e.SessionId.ToString()=="' +
        this.sessionId +
        '" && e.ProgramId.ToString()=="' +
        this.programId +
        '" && e.ShiftId.ToString()=="' +
        this.shiftId +
        '" &&   e.StatusId==1'
      )
      .then(r => {
        this.concessionList = r as Array<IFeeConcession>;
        this.concessionList.forEach(element => {
          this.selectedconcessionlist.push(
            {
              concessionid:element.concessionId,
              concessionname:element.fullName,
              ischecked:false
            }
          )
          
        });
       
      });
  }
  // addNewContinuationPolicy() {
  //   this.$modal.show("ContinuationPolicy-add-edit-model", {
  //     IsNewRecord: true
  //   });
  // }
  loadContinuationPolicy() {
    this.continuationPolicyRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.continuationPolicyList = r as Array<IFeeContinuationPolicy>;
    });
  }

  loadGrades() {
    this.repository.GetAllGrades().then(res => {
      this.GradesList = res as Array<TBLGrades>;
    });
  }
  beforeModalOpen(event) {
    this.selectedconcessionlist=[];
    this.$v.$reset();
    this.isScholarship = false;
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    this.sessionId = event.params.sessionid;
    this.programId = event.params.programid;
    this.zoneId = event.params.zoneid;
    this.shiftId = event.params.shiftid;
    this.data.scholarshipTypeId = this.scholarshiptype;

    // if (this.admissionTypeList
    //   .find(s => s.admissionTypeId == this.data.admissionTypeId)
    //   .fullName.toLowerCase()
    //   .search("sch") != -1
    // ) {
    //   this.isScholarship = true;
    // }
    this.loadConcessionOnEdit();
    if (this.data.statusId == 1) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }

  }
  loadConcessionOnEdit() {
    this.concessionRepo
      .GetFindBy(
        'e=>e.ZoneId.ToString()=="' +
        this.zoneId +
        '" && e.SessionId.ToString()=="' +
        this.sessionId +
        '" && e.ProgramId.ToString()=="' +
        this.programId +
        '" && e.ShiftId.ToString()=="' +
        this.shiftId +
        '" &&   e.StatusId==1'
      )
      .then(r => {
        this.concessionList = r as Array<IFeeConcession>;
      });
  }
  cancel() {
    this.selectedconcessionlist=[];
    this.data.fullName='';
    this.data.campusProgramId='';
    this.data.admissionTypeId='';
    this.data.continuationPolicyId='';
    this.data.concessionId='';
    this.data.attendancePercentage = 0;
    this.shiftId='';


    this.$modal.hide("add-edit-bulk-model");
    this.$emit("submit");
  }
  checkScholarship() {
    // alert(this.admissionTypeList.find(s=>s.fullName.toLowerCase().search('scholarship')!=-1).admissionTypeId)
    // if (this.shiftId.length > 0) {
    if (
      this.admissionTypeList.find(s => s.fullName.search("Sch") != -1)
        .admissionTypeId == this.data.admissionTypeId
    ) {
      this.isScholarship = true;
    } else {
      this.isScholarship = false;
    }
    // }
  }

  allowenter()
  {
    if(this.shiftId.length>0)
    {
      return false;
    }

    return true;


  }
  saveModel() {
    var z =JSON.stringify(this.selectedconcessionlist.filter(e=>e.ischecked==true));
    var res=this.data.campusProgramId+'?'+this.data.admissionTypeId+'?'+this.data.continuationPolicyId+'?'+z+'?'+this.data.fullName+'?'+this.data.scholarshipTypeId+'?'+this.data.marksPer+'?'+this.data.attendancePercentage
    console.log(res);
    this.repository.AddBulkScholarship(res).then(r=>{

      

      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text:r,
        title: "Success",
        messageTypeId: PayloadMessageTypes.success
      });
      
    
    
    
    })
    this.cancel();

    
  }

  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }
  $v: any
}
