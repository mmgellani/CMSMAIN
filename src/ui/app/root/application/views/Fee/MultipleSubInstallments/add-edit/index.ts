/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import * as helper from "../../../../helper";

import { FeeCampusBankLinkService, FeeCampusChallanNoteLinkService, AdmissionAdmissionFormService,FeeChallanTypeService, FeeStudentChallanService, SetupClassService } from "../../../../service";
import {
  ICampusBank,
  IFeeCampusChallanNoteLinkVM,
  IFeeChallanType,
  SubInstallmentNo,
  IFeeStudentChallan,
  IFeeStudentChallanVM,
  IFeeSubinstallmentVM,
  StudentChallanReport,
  StudentReportData,
  ISetupClass
} from "../../../../models";
import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";
import { maxLength, required } from "vuelidate/lib/validators";

import Component from "vue-class-component";
import { IRootStoreState } from "../../../../../store";
import { IVWConcessionRemarksVM } from "../../../../models/Setup/ConcessionRemarks";
import { ReportEngine } from "../../../../../../components";
import { ReportsService } from "../../../../service/Reports/AdmissionReports";
import { SetupConcessionRemarksService } from "../../../../service/Setup/ConcessionRemarks";
import { State } from "vuex-class";
import { StoreTypes } from "../../../../../../store";
import Vue from "vue";
import { isNull } from "lodash";

type ValidateFeeStudentChallan = {
  model: IFeeStudentChallan;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateFeeStudentChallan> = {
  model: {
    studentChallanId: { required },
    admissionFormId: { required },
    classId: { required },
    installmentNo: { required },
    challanNo: { required },
    feeAmount: { required },
    dueDate: { required },
    statusId: { required },
    loggerId: { required }
  }
};

interface IFeeStudentChallanVMSubInstallments extends IFeeStudentChallan {
  exemptedAmount: number;
}

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "student-challan-add-edit-model",
  template: require("./index.html"),
  components: {
    // "report-engine": ReportEngine
  }
})
export class FeeStudentChallanAddEdit extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private repository: FeeStudentChallanService;
  private campusBankRepository: FeeCampusBankLinkService;
  private campusChallanRepository: FeeCampusChallanNoteLinkService;

  private ManualExemptionlist2 = [];
  disabled='0';



  private TotalinsAmount = 0;

  private data: Array<IFeeSubinstallmentVM> = [];
  private Tempdata: Array<IFeeSubinstallmentVM> = [];
  private TempChallandata: Array<IFeeStudentChallan> = [];
  private AdmissionformService: AdmissionAdmissionFormService;
  private ManualExemptionList: Array<
    IFeeStudentChallanVMSubInstallments
  > = [];

  private SelectedExemptionList: Array<
    IFeeStudentChallanVMSubInstallments
  > = [];
  private tempManualInstallmentList: Array<
    IFeeStudentChallanVMSubInstallments
  > = [];
  private StudentChallandata: Array<IFeeStudentChallan> = [];
  private finalManualInstallmentList: Array<
    IFeeStudentChallanVMSubInstallments
  > = [];
  private installNo: number = 1;
  private concessionmarkrepository: SetupConcessionRemarksService;
  private concessionremarksmarkslist: Array<IVWConcessionRemarksVM> = [];
  private challanfeeamount: number = 0;
  private ChallanNo: string = "";
  private classId = '';
  private challlanNo: string = "";
  private program: string = "";
  private StudentRecordReportList: Array<StudentReportData> = [];
  private remarksconcess: string = '';
  private TempStudentRecordReportList: any = [];
  private TempStudentChallan: any = [];
  private printChallan: any = [];
  private nextChallan: any = [];
  private nextDuedate: any = [];
  private subAmount: any = [];
  private subinstallmentArray: any = [];
  private jugaar: any = [];
  private feeChallanList: Array<StudentChallanReport> = [];
  private campusBankList: Array<ICampusBank> = [];
  private campusChallanList: Array<IFeeCampusChallanNoteLinkVM> = [];
  private challanNote: string = '';
  private challanFooter: any = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
  private challanRData: any = [];
  private subinstallmentData: any = [];
  private ChallanTypeList: Array<IFeeChallanType> = [];

  private checkconcession  : Array <SubInstallmentNo>= [];
  private FeeChallanTypeService: FeeChallanTypeService = null;
  private classService: SetupClassService = new SetupClassService(this.$store);

  private challanType: string = '';
  private campusid: string = '';
  private classlist: Array<ISetupClass> = [];
  classid = '';






  private FeeSum: number = 0;
  private subIntallmentNo: number = 0;
  private showSubinstallment: boolean = false;
  private manualSubinstallment: boolean = false;
  private amountnew: number = 0;
  private sum: number = 0;
  private report: String = "";

  private admissionformid: string = '';

  private ChallanNoList: Array<String> = [];
  private RefrenceNo: string = "";
  private FullName: string = "";
  private title: string = "Edit student challan";

  created() {
    this.repository = new FeeStudentChallanService(this.$store);
    this.campusBankRepository = new FeeCampusBankLinkService(this.$store);
    this.campusChallanRepository = new FeeCampusChallanNoteLinkService(this.$store);
    this.concessionmarkrepository = new SetupConcessionRemarksService(this.$store);
    this.AdmissionformService=new AdmissionAdmissionFormService(this.$store);

    this.FeeChallanTypeService = new FeeChallanTypeService(this.$store);
    this.FeeChallanTypeService.GetFindBy('e=>e.StatusId==1').then(r => {
      this.ChallanTypeList = r as Array<IFeeChallanType>
      if (this.ChallanTypeList.length > 0) {
        this.challanType = this.ChallanTypeList.find(s => s.fullName.toLowerCase().startsWith('edu')).challanTypeId;
      }
    })


    this.GetClass();


  }


  getfilterData(){
    console.log(this.data[0]);
    debugger;
var key =  this.data[0].admissionFormId+ '?' +this.data[0].classId + '?' + 'Installment' ;
console.log(key);
this.AdmissionformService.GetCheckInstallment(key).then(r =>{
  debugger;
this.checkconcession = r as Array<SubInstallmentNo>;
if(this.checkconcession &&this.checkconcession.length != 0)
{

    this.maxInstallments=[];
    this.checkconcession.forEach(element => {
        this.maxInstallments.push({item:+element.checkInstallment});
    });
    

}
else {
this.maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }]

}
})


}


  maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }];

  beforeModalOpen(event) {
    this.remarksconcess = '';

    this.data = [];
    this.ChallanNoList = [];
    this.data = event.params.modelVM as Array<IFeeSubinstallmentVM>;
    if (this.data.length > 0) {
      this.admissionformid = this.data[0].admissionFormId;
      this.RefrenceNo = this.data[0].refferenceNo;
      this.program = this.data[0].description;
      this.FullName = this.data[0].fullName;
      this.campusid = this.data[0].campusId;
    }
    this.repository.GetData(this.admissionformid).then(res => {
      this.StudentChallandata = res as Array<IFeeStudentChallan>;
     this. getfilterData()
      this.filterData()
      
    });





  }

  isPaid(paidDate) {
    return new Date(paidDate).getFullYear() > 1900;
  }

  checkMarks(option1, option2) {
    if (+option2 > +option1) {
      return true;
    }
    else {
      return false;
    }
  }




  filterData() {

    this.ManualExemptionlist2 = [];
    this.TempChallandata = [];
    this.Tempdata = this.data.filter(
      e =>
        e.installmentNo == this.installNo &&
        e.refferenceNo == this.RefrenceNo &&
        e.statusId == 1 && e.challanTypeId == this.challanType && e.classId == this.classid
    );
    this.TempChallandata = this.StudentChallandata.filter(
      e =>
        e.installmentNo == this.installNo && e.challanTypeId == this.challanType && e.classId == this.classid
    );
    var find = this.TempChallandata.filter(e => e.paidDate == null && e.classId==this.classid).length;



    if (find == 1) {
      this.ChallanNo = this.TempChallandata.find(e => e.paidDate == null && e.classId==this.classid).challanNo;
      this.TempChallandata.push({
        studentChallanId: helper.newGuid(),
        admissionFormId: this.TempChallandata[0].admissionFormId,
        classId: this.TempChallandata[0].classId,
        installmentNo: this.TempChallandata[0].installmentNo,
        challanNo: '000000000000',
        feeAmount: 0,
        fine: 0,
        dueDate: new Date(Date.now()),
        paidDate: null,
        statusId: 1,
        collectorId: null,
        loggerId: helper.newGuid(),
        challanTypeId: this.TempChallandata[0].challanTypeId
      }, {
        studentChallanId: helper.newGuid(),
        admissionFormId: this.TempChallandata[0].admissionFormId,
        classId: this.TempChallandata[0].classId,
        installmentNo: this.TempChallandata[0].installmentNo,
        challanNo: '000000000000',
        feeAmount: 0,
        fine: 0,
        dueDate: new Date(Date.now()),
        paidDate: null,
        statusId: 1,
        collectorId: null,
        loggerId: helper.newGuid(),
        challanTypeId: this.TempChallandata[0].challanTypeId
      });
    }

    for (var i = 0; i < this.TempChallandata.length; i++) {
      if (this.TempChallandata[i].feeAmount < 0) {
        this.TempChallandata[i].feeAmount = 0;
      }
    }

    //this.challlanNo = this.TempChallandata[0].challanNo;
  }

  add() {
    if (this.TempChallandata.length > 0) {
      this.TempChallandata.push({
        studentChallanId: helper.newGuid(),
        admissionFormId: this.TempChallandata[0].admissionFormId,
        classId: this.TempChallandata[0].classId,
        installmentNo: this.TempChallandata[0].installmentNo,
        challanNo: '000000000000',
        feeAmount: 0,
        fine: 0,
        dueDate: new Date(Date.now()),
        paidDate: null,
        statusId: 1,
        collectorId: null,
        loggerId: helper.newGuid(),
        challanTypeId: this.TempChallandata[0].challanTypeId
      });
    }
  }

  GetSubinstallmentNo() {
    this.showSubinstallment = true;
  }

allowsubmit()
{


}




  GetClass() {

    this.classService.GetFindBy('e=>e.StatusId==1').then(r => {
      this.classlist = r as Array<ISetupClass>
    })
  }
















  cancel() {
    this.$modal.hide("student-challan-add-edit-model");
    this.$emit("submit");
  }
  SaveData() {
    this.disabled='0';

    this.TotalinsAmount = 0

    this.challanfeeamount = this.TempChallandata.find(e => e.challanNo == this.ChallanNo).feeAmount;

    this.ManualExemptionlist2 = this.TempChallandata.filter(e => e.challanNo == '000000000000');

    this.ManualExemptionlist2.forEach(element => {
      if(element.feeAmount==0)
      {
        this.disabled='1';

      }
      this.TotalinsAmount = +this.TotalinsAmount + (+element.feeAmount)
      element.dueDate= helper.formateDate(element.dueDate)

    });

    if (this.TotalinsAmount != this.challanfeeamount) {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Installed Amount is not equal to Total Challan Amount",
        title: "",
        messageTypeId: PayloadMessageTypes.error
      });

     




    }

    else if (this.disabled=='1')
    {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please Enter Amount greater than 0",
        title: "",
        messageTypeId: PayloadMessageTypes.error
      });

    }

    else {

      var res = (JSON.stringify(this.ManualExemptionlist2) + '?' + this.ChallanNo);

      
      this.repository.MultipleInstallments(res).then(r => {
        

        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: r.returnValue,
          title: "Success",
          messageTypeId: PayloadMessageTypes.success
        });
        this.cancel();

      })

    }





    // var response = confirm('Are you sure to Save Exemption');
    // if (response) {

    // this.repository.SaveManualExemption(admissionform + '?' + installno + '?' + amount + '?' + challanNo + '?' + this.remarksconcess + '?' + this.classid).then(r => {
    //   this.RefreshData(this.admissionformid);
    //   this.$store.dispatch(StoreTypes.updateStatusBar, {
    //     text: "Exemption Applied!",
    //     title: "Success",
    //     messageTypeId: PayloadMessageTypes.success
    //   });

    // })
    // }
  }
  click(list) {

  }

  $v: Vuelidate<any>;
}
