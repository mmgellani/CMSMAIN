/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { ReportEngine } from "../../../../../../components";

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';


import {
  IFeeStudentChallanEx,
  ITransportSubinstallmentVM,
  StudentReportData,
  StudentChallanReport,
  ICampusBank,
  IFeeCampusChallanNoteLinkVM,
  TransportChallanReport
} from "../../../../models";
import { FeeStudentChallanService, FeeCampusBankLinkService, FeeCampusChallanNoteLinkService } from "../../../../service";
import { State } from "vuex-class";
import { StoreTypes } from "../../../../../../store";


@Component({
  name: "student-challan-add-edit-model",
  template: require("./index.html")
})
export class TransportChallanAddEdit extends Vue {

  @State((state: IRootStoreState) => state.common.user) user: IUser;

  studentInfo: any = {};
  report: String = "";

  private repository: FeeStudentChallanService;
  private campusBankRepository: FeeCampusBankLinkService;
  private campusChallanRepository: FeeCampusChallanNoteLinkService;
  private concessionRepository: FeeStudentChallanService;
  private data: Array<ITransportSubinstallmentVM> = [];
  private campusBankList: Array<ICampusBank> = [];
  private campusChallanList: Array<IFeeCampusChallanNoteLinkVM> = [];
  private TempChallandata: Array<IFeeStudentChallanEx> = [];
  private StudentChallandata: Array<IFeeStudentChallanEx> = [];
  private installNo: number = 1;
  private StudentRecordReportList: Array<StudentReportData> = [];
  private feeChallanList: Array<TransportChallanReport> = [];
  private TempStudentRecordReportList: any = [];
  private nextChallan: any = [];
  private nextDuedate: any = [];
  private subAmount: any = [];
  private challanNote: string = '';
  private datestring: string = "";
  private subinstallmentArray: any = [];
  private challanFooter: any = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
  private challanRData: any = [];
  private subinstallmentData: any = [];
  private savedisable: boolean = true;





  //private StudentFeedata: Array<IFeeStudentChallanVM> = [];
  private FeeChallanrepository: FeeStudentChallanService = null;
  private str = '';

  created() {
    this.repository = new FeeStudentChallanService(this.$store);
    this.concessionRepository = new FeeStudentChallanService(this.$store);
    this.campusBankRepository = new FeeCampusBankLinkService(this.$store);
    this.campusChallanRepository = new FeeCampusChallanNoteLinkService(this.$store);
    this.FeeChallanrepository = new FeeStudentChallanService(this.$store);


  }

  mounted() {
    this.studentInfo = this.$parent.$parent.$props['studentInfo'];

    this.data = [];
    this.StudentChallandata = [];

    if (this.studentInfo) {
      if (this.studentInfo.admissionFormId) {
        this.repository.TransportGetFindBy(`e => (e.AdmissionFormId.ToString() == "` + this.studentInfo.admissionFormId + `") && (e.StatusId==1)`)
          .then(res => this.StudentChallandata = res as Array<IFeeStudentChallanEx>);
      }

      if (this.studentInfo.refferenceNo) {
        this.concessionRepository.TransportGetFeeByRefrenceNo(this.studentInfo.refferenceNo)
          .then(res => this.data = res as Array<ITransportSubinstallmentVM>);
      }
    }
  }

  getProperty(propertyName) {
    if (this.data) {
      if (this.data.length > 0) {
        return this.data[0][propertyName];
      }
    }
  }

  sumFeeHead(propertyName) {
    if (this.feeHeadData) {
      return this.feeHeadData.reduce((a, b) => a + b[propertyName], 0);
    }
    return 0;
  }

  sumFee(propertyName) {
    if (this.feeDetail) {
      return this.feeDetail.reduce((a, b) => a + b[propertyName], 0);
    }
    return 0;
  }

  maxInstallments = [ { item: 1}, { item: 2}, { item: 3}, { item: 4}]

  // get maxInstallments() {
  //   if (this.data) {
  //     if (this.data.length > 0) {
  //       return this.data.reduce((a, b) => Number(a.installmentNo) > Number(b.installmentNo) ? a : b).installmentNo;
  //     }
  //   }

  //   return 0;
  // }

  get feeHeadData() {
    if (this.data) {
      if (this.data.length > 0) {
        return this.data.filter(e => e.installmentNo == this.installNo).sort((n1, n2) => {
          if (n1.feeHead > n2.feeHead) { return 1; }
          if (n1.feeHead < n2.feeHead) { return -1; }
          return 0;
        });
      }
    }
  }

  get feeDetail() {
    if (this.StudentChallandata) {
      if (this.StudentChallandata.length > 0) {
        return this.StudentChallandata.filter(e => e.installmentNo == this.installNo).sort((n1, n2) => {
          if (n1.challanNo > n2.challanNo) { return 1; }
          if (n1.challanNo < n2.challanNo) { return -1; }
          return 0;
        });
      }
    }
  }

  isPaid(paidDate) {
    return new Date(paidDate).getFullYear() > 1900;
  }

  getMinDate(pdueDate) {
    if (this.feeDetail.length > 0) {
      var temparry = this.StudentChallandata.filter(s => s.installmentNo < this.installNo);
      if (temparry.length > 0) {
        for (var v = 0; v < temparry.length; v++) {
          if (temparry[v].paidDate == null) {
            return false;
          }
        }
      }

    }
    //  if(this.StudentChallandata.filter(e => e.installmentNo == this.installNo))
    if (this.feeDetail.filter(e => e.paidDate == null)) {
      if (this.feeDetail.filter(e => e.paidDate == null).length > 0) {
        var dueDate = this.feeDetail.filter(e => e.paidDate == null).reduce((min, item) => item.dueDate < min ? item.dueDate : min, this.feeDetail.filter(e => e.paidDate == null)[0].dueDate);

        if (pdueDate == dueDate) {
          return true;
        }
      }
    }

    return false;
  }

  generateChallanReport(challanNo: any) {
    this.savedisable = false;
    // alert(JSON.stringify(model.admissionFormId));



    this.feeChallanList = [];
    this.campusBankList = [];
    this.campusChallanList = [];
    this.challanNote = '';
    this.challanFooter = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
    this.subinstallmentData = [];
    this.challanRData = [];
    this.repository.GetTansportData(challanNo)
      .then(res => {
        this.feeChallanList = res as Array<TransportChallanReport>
        // console.log(JSON.stringify(this.feeChallanList));

        var key = this.feeChallanList[0].campusId + '?' + this.feeChallanList[0].programDetailId + '?' + this.feeChallanList[0].admissionFormId
        this.campusBankRepository.GetBankEx(key)
          .then(res => {
            this.campusBankList = res as Array<ICampusBank>
            // console.log(JSON.stringify(this.campusBankList));

            var keyy = this.feeChallanList[0].campusId + '?' + this.feeChallanList[0].challanTypeId

            this.campusChallanRepository.GetDataVM(keyy)
              .then(res => {
                this.campusChallanList = res as Array<IFeeCampusChallanNoteLinkVM>
                // console.log(JSON.stringify(this.campusChallanList));


                var i = 0;
                this.campusChallanList.forEach(e => {
                  this.challanNote = this.challanNote + '<li>' + this.campusChallanList[i].description + '</li>';
                  i++;
                }

                );
                // alert(JSON.stringify(this.challanNote));

                var docNo = this.feeChallanList[0].challanNo.substring(this.feeChallanList[0].challanNo.length - 7, this.feeChallanList[0].challanNo.length);
                // alert(docNo);

                var today = new Date();

                this.challanFooter = [{ challanNote: this.challanNote, customerCode: this.feeChallanList[0].customerCode, challanNo: this.feeChallanList[0].challanNo, userName: this.user.email, docNo: docNo, today: today }];

                // console.log(JSON.stringify(this.challanFooter));

                this.challanRData = '[' + JSON.stringify(this.challanFooter) + ',' + JSON.stringify(this.feeChallanList) + ',' + JSON.stringify(this.campusBankList) + ']';
                // console.log(this.challanRData);

                this.challanRData = JSON.parse(this.challanRData);


                this.report = "/assets/Reports/Resource/Admission/TrReport.xml";

                this.$parent.$parent.$emit('fire_report', { report: this.report, data: this.challanRData });

                //this.$modal.show("report-viewer-eng");
              });

          });
      });


    this.savedisable = true;

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
    this.repository.GetStudentReportData().then(res => {
      this.StudentRecordReportList = res as Array<StudentReportData>;
      this.TempStudentRecordReportList = this.StudentRecordReportList.filter(
        e => e.challanNo == challlanNo && e.statusId == 1
      );

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
      console.log(JSON.stringify(this.TempStudentRecordReportList));

      this.report = "assets/Reports/Resource/Admission/Report1.xml";

      this.$parent.$parent.$emit('fire_report', { report: this.report, data: this.TempStudentRecordReportList });
      // this.$modal.show("report-viewer-eng");
    });
  }
}
