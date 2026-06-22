/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import * as helper from "../../../../helper";

import { FeeCampusBankLinkService, FeeCampusChallanNoteLinkService, FeeChallanTypeService, FeeStudentChallanService } from "../../../../service";
import {
  ICampusBank,
  IFeeCampusChallanNoteLinkVM,
  IFeeChallanType,
  IFeeStudentChallan,
  IFeeStudentChallanVM,
  IFeeSubinstallmentVM,
  StudentChallanReport,
  StudentChallanReportEx,
  StudentReportData
} from "../../../../models";
import { IRootStoreState, RootStoreTypes } from "../../../../../store";
import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";
import { maxLength, required } from "vuelidate/lib/validators";

import Component from "vue-class-component";
import { ReportEngine } from "../../../../../../components";
import { ReportsService } from "../../../../service/Reports/AdmissionReports";
import { State } from "vuex-class";
import { StoreTypes } from "../../../../../../store";
import Vue from "vue";

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

interface IFeeStudentChallanVMSubInstallments extends IFeeStudentChallanVM {
  subinstallmentAmount: number;
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
  private modaldata: any = {};


  private repositories: ReportsService;

  private data: Array<IFeeSubinstallmentVM> = [];
  private Tempdata: Array<IFeeSubinstallmentVM> = [];
  private TempChallandata: Array<IFeeStudentChallan> = [];
  private ManualInstallmentList: Array<
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
  private count: number = 0;
  private ChallanNo: string = "";
  private challlanNo: string = "";
  private program: string = "";
  private StudentRecordReportList: Array<StudentReportData> = [];
  private TempStudentRecordReportList: any = [];
  private TempStudentChallan: any = [];
  private printChallan: any = [];
  private nextChallan: any = [];
  private nextDuedate: any = [];
  private subAmount: any = [];
  private subinstallmentArray: any = [];
  private jugaar: any = [];
  private feeChallanList: Array<StudentChallanReportEx> = [];
  private campusBankList: Array<ICampusBank> = [];
  private campusChallanList: Array<IFeeCampusChallanNoteLinkVM> = [];
  private challanNote: string = '';
  private challanFooter: any = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
  private challanRData: any = [];
  private subinstallmentData: any = [];
  private ChallanTypeList: Array<IFeeChallanType> = [];
  private FeeChallanTypeService: FeeChallanTypeService = null;
  private challanType: string = '';






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
  private title: string = "Student Fee Structure";

  created() {
    this.repository = new FeeStudentChallanService(this.$store);
    this.campusBankRepository = new FeeCampusBankLinkService(this.$store);
    this.campusChallanRepository = new FeeCampusChallanNoteLinkService(this.$store);
    this.FeeChallanTypeService = new FeeChallanTypeService(this.$store);
    this.FeeChallanTypeService.GetFindBy('e=>e.StatusId==1').then(r => {
      this.ChallanTypeList = r as Array<IFeeChallanType>
      if (this.ChallanTypeList.length > 0) {
        this.challanType = this.ChallanTypeList.find(s => s.fullName.toLowerCase().startsWith('edu')).challanTypeId;
      }
    })

    this.repositories = new ReportsService(this.$store);


  }

  beforeModalOpen(event) {

    this.data = [];
    this.ChallanNoList = [];
    this.data = event.params.modelVM as Array<IFeeSubinstallmentVM>;
    if (this.data.length > 0) {
      this.admissionformid = this.data[0].admissionFormId;
    }
    this.repository.GetData(this.admissionformid).then(res => {
      this.StudentChallandata = res as Array<IFeeStudentChallan>;


      this.filterData()
    });


    this.RefrenceNo = this.data[0].refferenceNo;
    this.program = this.data[0].description;
    this.FullName = this.data[0].fullName;

  }

  isPaid(paidDate) {
    return new Date(paidDate).getFullYear() > 1900;
  }

  filterData() {

    this.Tempdata = this.data.filter(
      e =>
        e.installmentNo == this.installNo &&
        e.refferenceNo == this.RefrenceNo &&
        e.statusId == 1 && e.challanTypeId == this.challanType
    );


    this.TempChallandata = this.StudentChallandata.filter(
      e =>
        e.installmentNo == this.installNo && e.challanTypeId == this.challanType
      //  &&
      //  e.admissionFormId == this.data[0].admissionFormId
    );
    // alert(JSON.stringify(this.Tempdata))

    for (var i = 0; i < this.TempChallandata.length; i++) {
      if (this.TempChallandata[i].feeAmount < 0) {
        this.TempChallandata[i].feeAmount = 0;
      }
    }

    this.challlanNo = this.TempChallandata[0].challanNo;
  }

  GetSubinstallmentNo() {
    this.showSubinstallment = true;
  }


  maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }];

  generateChallanReport(challanNo: any) {
    this.feeChallanList = [];
    this.campusBankList = [];
    this.campusChallanList = [];
    this.challanNote = '';
    this.challanFooter = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
    this.challanRData = [];
    this.subinstallmentData = [];
    this.repository.GetFeeRData(challanNo)
      .then(res => {
        this.feeChallanList = res as Array<StudentChallanReportEx>
        var key = this.feeChallanList[0].campusId + '?' + this.feeChallanList[0].programDetailId + '?' + this.feeChallanList[0].admissionFormId
        this.campusBankRepository.GetBankEx(key)
          .then(res => {
            this.campusBankList = res as Array<ICampusBank>
            var keyscrap = this.feeChallanList[0].campusId + "?" + this.installNo;
            this.campusChallanRepository.GetData(keyscrap)
              .then(res => {
                this.campusChallanList = res as Array<IFeeCampusChallanNoteLinkVM>
                var i = 0;
                this.campusChallanList.forEach(e => {
                  this.challanNote = this.challanNote + '<li>' + this.campusChallanList[i].description + '</li>';
                  i++;
                }

                );
                var docNo = this.feeChallanList[0].challanNo.substring(this.feeChallanList[0].challanNo.length - 7, this.feeChallanList[0].challanNo.length);
                var today = new Date();

                this.challanFooter = [{ challanNote: this.challanNote, customerCode: this.feeChallanList[0].customerCode, challanNo: this.feeChallanList[0].challanNo, userName: this.user.email, docNo: docNo, today: today, zoneNote: this.feeChallanList[0].zoneNote }];
                this.TempChallandata = this.StudentChallandata.filter(
                  e =>
                    e.installmentNo == this.installNo

                );


                this.nextChallan = [];
                this.nextDuedate = [];
                this.subAmount = [];

                for (var k = 0; k < this.TempChallandata.length; k++) {
                  if (
                    this.TempChallandata[k].challanNo != challanNo &&
                    !this.TempChallandata[k].paidDate &&
                    this.TempChallandata[k].challanTypeId == this.challanType
                    // && this.TempChallandata[k].challanNo > challanNo
                  ) {

                    this.subinstallmentData.push({
                      nextChallan: this.TempChallandata[k].challanNo,
                      nextDuedate: this.TempChallandata[k].dueDate,
                      subAmount: this.TempChallandata[k].feeAmount
                    });


                  }
                }

                // alert(JSON.stringify(this.subinstallmentData));

                if (this.subinstallmentData.length == 0 && this.feeChallanList[0].campusName == 'Campus of Information Technology Lahore Main') {

                  // alert('here')


                  // var subinstallmentDatas = {
                  //   "nextChallan": "-",
                  //   "nextDuedate": "-",
                  //   "subAmount": "-"
                  // }

                  // this.challanRData = '[' + JSON.stringify(this.challanFooter) + ',' + JSON.stringify(this.feeChallanList) + ',' + JSON.stringify(this.campusBankList) + ',' + JSON.stringify(subinstallmentDatas) + ']';

                  // this.challanRData = JSON.parse(this.challanRData);


                  // this.report = "/assets/Reports/Resource/Admission/Reportsubinstallment.xml";

                  // this.$parent.$parent.$emit('fire_report', { report: this.report, data: this.challanRData });




                }

                if (this.subinstallmentData.length == 0) {

                  // alert('if loop');
                  var subinstallmentDatas = {
                    "nextChallan": "-",
                    "nextDuedate": "-",
                    "subAmount": "-"
                  }

                  this.challanRData = '[' + JSON.stringify(this.challanFooter) + ',' + JSON.stringify(this.feeChallanList) + ',' + JSON.stringify(this.campusBankList) + ',' + JSON.stringify(subinstallmentDatas) + ']';
                  //   console.log(this.challanRData);

                  this.challanRData = JSON.parse(this.challanRData);


                  this.report = "/assets/Reports/Resource/Admission/Reportsubinstallment.xml";

                  this.$store.dispatch(RootStoreTypes.reportOperation, {
                    data: this.challanRData as any,
                    path: '/assets/Reports/Resource/Admission/Reportsubinstallment.xml',
                    show: true
                  });

                  // this.$modal.show("report-viewer-eng");



                }


                else {

                  // alert('else loop');

                  this.challanRData = '[' + JSON.stringify(this.challanFooter) + ',' + JSON.stringify(this.feeChallanList) + ',' + JSON.stringify(this.campusBankList) + ',' + JSON.stringify(this.subinstallmentData) + ']';
                  // console.log(this.challanRData);

                  this.challanRData = JSON.parse(this.challanRData);


                  this.report = "/assets/Reports/Resource/Admission/Reportsubinstallment.xml";

                  this.$store.dispatch(RootStoreTypes.reportOperation, {
                    data: this.challanRData as any,
                    path: '/assets/Reports/Resource/Admission/Reportsubinstallment.xml',
                    show: true
                  });

                  // this.$modal.show("report-viewer-eng");

                }

              });

          });
      });


  }







  getStudentReportData(challlanNo: any) {
    var l = 0;
    this.nextChallan = [];
    this.nextDuedate = [];
    this.subAmount = [];

    for (var k = 0; k < this.TempChallandata.length; k++) {
      if (
        this.TempChallandata[k].challanNo != challlanNo &&
        this.TempChallandata[k].challanNo > challlanNo
      ) {
        this.nextChallan[l] = this.TempChallandata[k].challanNo;
        this.nextDuedate[l] = this.TempChallandata[k].dueDate;
        this.subAmount[l] = this.TempChallandata[k].feeAmount;

        l++;
      }
    }

    this.TempStudentRecordReportList = [];

    this.repository.GetStudentReportDatas(challlanNo).then(res => {

      this.TempStudentRecordReportList = res as Array<StudentReportData>;

      if (this.nextChallan != 0) {
        var o = 0;
        for (var u = 0; u < this.nextChallan.length; u++) {
          this.subinstallmentArray = {
            nextChallan: this.nextChallan[o],
            nextDuedate: this.nextDuedate[o],
            subAmount: this.subAmount[o]
          };

          this.TempStudentRecordReportList.push(this.subinstallmentArray);

          o++;
        }
      }
      this.repositories = this.TempStudentRecordReportList;

      this.report = "assets/Reports/Resource/Admission/Report1.xml";
      this.$modal.show("report-viewer-eng");
    });
  }

  RefreshData(admissionFormId: any) {
    this.repository.GetData(this.admissionformid).then(res => {
      this.StudentChallandata = res as Array<IFeeStudentChallan>;

      this.filterData()
    });


  }

  SaveSubInstallment() {
    var totalamount = 0;
    //     alert(this.manualSubinstallment)

    if (this.manualSubinstallment == false) {
      var key =
        this.Tempdata[0].admissionFormId +
        "?" +
        this.TempChallandata[0].challanNo +
        "?" +
        this.Tempdata[0].installmentNo +
        "?" +
        this.subIntallmentNo +
        "?" +
        totalamount;

      this.repository.GenerateSubInstallment(key).then(res => {
        () => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Sub Installment has been Generated successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
          //     alert(this.manualSubinstallment)
        };
        this.cancel();
      });
    } else if (this.manualSubinstallment == true) {
      // this.finalManualInstallmentList = [];
      //this.sum = 0

      // for (var i = 0; i < 2; i++) {
      //     for (var j = 0; j < this.tempManualInstallmentList.length; j++) {
      //         this.finalManualInstallmentList.push({
      //             feeHeadId: this.tempManualInstallmentList[j].feeHeadId,
      //             studentFeeStructureId: this.tempManualInstallmentList[j].studentFeeStructureId,
      //             campusId: this.tempManualInstallmentList[j].campusId,
      //             admissionFormId: this.tempManualInstallmentList[j].admissionFormId,
      //             studentChallanId: this.tempManualInstallmentList[j].studentChallanId,
      //             concessionDetailId: this.tempManualInstallmentList[j].concessionDetailId,
      //             programDetailId: this.tempManualInstallmentList[j].programDetailId,
      //             installmentNo: this.tempManualInstallmentList[j].installmentNo,
      //             challanNo: this.tempManualInstallmentList[j].challanNo,
      //             fullName: this.tempManualInstallmentList[j].fullName,
      //             refferenceNo: this.tempManualInstallmentList[j].refferenceNo,
      //             fatherName: this.tempManualInstallmentList[j].fatherName,
      //             campus: this.tempManualInstallmentList[j].campus,
      //             description: this.tempManualInstallmentList[j].description,
      //             feeAmount: i == 0 ? Math.round(this.tempManualInstallmentList[j].subinstallmentAmount) : Math.round(this.tempManualInstallmentList[j].payableAmount) - Math.round(this.tempManualInstallmentList[j].subinstallmentAmount),
      //             payableAmount: this.tempManualInstallmentList[j].payableAmount,
      //             dueDate: this.tempManualInstallmentList[j].dueDate,
      //             paidDate: this.tempManualInstallmentList[j].paidDate,
      //             feeHead: this.tempManualInstallmentList[j].feeHead,
      //             statusId: this.tempManualInstallmentList[j].statusId,
      //             subinstallmentAmount: this.tempManualInstallmentList[j].subinstallmentAmount,
      //             loggerId: this.tempManualInstallmentList[j].loggerId

      //         })

      //     }
      // }

      this.subIntallmentNo = 2;
      var key =
        this.Tempdata[0].admissionFormId +
        "?" +
        this.TempChallandata[0].challanNo +
        "?" +
        this.Tempdata[0].installmentNo +
        "?" +
        this.subIntallmentNo +
        "?" +
        this.sum;

      this.repository.GenerateSubInstallment(key).then(res => {
        () =>
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Sub Installment has been Generated successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
      });
    }

    this.cancel();
  }

  cancel() {
    this.$modal.hide("student-challan-add-edit-model");
    this.$emit("submit");
  }

  PassValueToModal(option: any) {
    Object.assign(this.modaldata, option)


  }
  RemovePaidDate(challlanNo: any, ChallanId: any, admissionFormId: any) {

    // var response = confirm('Are you sure to Remove Paid Date');
    // if (response) {

    this.repository.RemovePaidDate(challlanNo + '?' + ChallanId).then(r => {
      this.RefreshData(this.admissionformid);
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Paid Date Removed Successfully",
        title: "Success",
        messageTypeId: PayloadMessageTypes.success
      });

    })
    //}



  }

  $v: Vuelidate<any>;
}
