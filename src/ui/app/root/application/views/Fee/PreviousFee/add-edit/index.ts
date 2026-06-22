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
import { PayloadMessageTypes, IUser } from "../../../../../../model";

import {
  IAdmissionAdmissionForm,
  IAdmissionStudents,
  ISetupGender,
  IAcademicInfo,
  IAddressJsonB,
  ISetupBloodGroup,
  ISetupReligion,
  ISetupAdmissionType,
  IGuardianJsonB,
  IAdmissionAdmissionFormVM,
  ISetupCampusProgramLinkVM,
  IAdmissionEligibilityCriteria,
  IAdmissionEligibilityCriteriaVM,
  CheckFeeExist,
  ISetupBoard,
  IFeeStudentChallan,
  StudentReportData,
  ICampusCityVM,
  DDLModel,
  ISetupCampusProgramLink,
  IMarks,
  StudentChallanReport,
  ICampusBank,
  IFeeCampusChallanNoteLinkVM,
  IPreFirstYear
} from "../../../../models";
import {
  AdmissionAdmissionFormService,
  SetupGenderService,
  AdmissionStudentsService,
  SetupBloodGroupService,
  SetupReligionService,
  SetupAdmissionTypeService,
  SetupCampusProgramLinkService,
  AdmissionEligibilityCriteriaService,
  SetupBoardService,
  FeeStudentChallanService,
  SetupCampusService,
  FeeStudentFeeStructureService,
  FeeCampusBankLinkService,
  FeeCampusChallanNoteLinkService
} from "../../../../service";

import * as helper from "../../../../helper";
import { ISetupDegree } from "../../../../models/Setup/Degree";
import { ISetupGroup } from "../../../../models/Setup/Group";
import { ISetupPassStatus } from "../../../../models/Setup/PassStatus";
import { SetupDegreeService } from "../../../../service/Setup/Degree";
import { SetupGroupService } from "../../../../service/Setup/Group";
import { SetupPassStatusService } from "../../../../service/Setup/PassStatus";
import { IPhoneNumber } from "../../../Setup/Address/add-edit";
import { JwtBearerFlow } from "client-oauth2";
import { DEFAULT_ECDH_CURVE } from "tls";
import { StringifyOptions } from "querystring";
import { ReportsService } from "../../../../service/Reports/AdmissionReports";
import { ReportEngine } from "../../../../../../components/report/report-engine";
import { IRootStoreState } from "../../../../../store";
import { State } from "vuex-class";
import { Model } from "vue-property-decorator";

type ValidateAdmissionAdmissionForm = {
  model: IAdmissionAdmissionForm;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateAdmissionAdmissionForm> = {
  model: {
    fullName: { required },
    fatherName: { required }
  }
};

export interface IAdmissionCollect {
  AdmissionForm: IAdmissionAdmissionForm;
  Student: IAdmissionStudents;
  FeeHead: string;
}

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
  components: {
    // "report-engine": ReportEngine
  }
})
export class PreviousFeeAddEdit extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private studentChallanRepo: FeeStudentChallanService = new FeeStudentChallanService(this.$store);
  private studentData: IAdmissionAdmissionFormVM = {
    academicInfo: '', admissionFormId: '', address: '', admissionTypeId: ''
    , bloodGroupId: '', campusProgramId: '', dateOfBirth: new Date(), fatherName: '', fullName: '', genderId: '',
    guardians: '', loggerId: '', parentCNIC: '', parentContactNo: '', refferenceNo: '', religionId: '', rollNo: '',
    statusId: 1, studentCNIC: '', studentContactNo: '', studentId: '', studentLoggerId: '',studentType:'',formNo:""
  };
  private previousData: Array<IPreFirstYear> = []
  private previousDataModel: IPreFirstYear = {
    studentId: '', fatherName: '', amount: '', challanNo: '', fatherCnic: '',
    name: '', recievedDate: ''
  }

  private studentId='';
  private title:string='';
  private isActive:boolean=true;
  private IsNewRecord:boolean=true;

  created() {
this.title='';


  }
  filterData(){
   Object.assign(this.previousDataModel,this.previousData.find(s=>s.studentId==this.studentId)) 
  }

  saveModel(item:any) {
    console.log(item)
    Object.assign(this.previousData,item);
    var key=this.studentData.admissionFormId+"?"+item.amount;
    console.log(key)
    this.studentChallanRepo.AddPreFirstYearChallan(key)
    .then(r=>{
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: r[0].providedString,
        title: 'Success',
        messageTypeId: PayloadMessageTypes.success
    })
    })
  }


  beforeModalOpen(event) {
    this.previousData=[]
    this.studentData = event.params.model;

    console.log(this.studentData)
    this.studentChallanRepo.GetPreviousFee(this.studentData.refferenceNo)
      .then(r => {
        this.previousData = r as Array<IPreFirstYear>;
      })
    //this.IsNewRecord = event.params.IsNewRecord;

  }

  indexId = 1;




  cancel() {
this.previousDataModel={
  studentId: '', fatherName: '', amount: '', challanNo: '', fatherCnic: '',
  name: '', recievedDate: ''
}
this.studentId=''

    this.$modal.hide("add-edit-model");
    this.$emit("submit");
  }

  $v: Vuelidate<any>;
}
