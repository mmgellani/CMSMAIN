/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { ReportEngine } from "../../../../../../components";

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState, RootStoreTypes } from '../../../../../store';

import {
  IFeeStudentChallan,
  IFeeSubinstallmentVM,
  StudentReportData,
  StudentChallanReport,
  ICampusBank,
  IFeeCampusChallanNoteLinkVM,
  IFeeStudentChallanVM,
  IFeeChallanType,
  StudentChallanReportEx,
  IFeeBulkModel,
  ISetupClass,
  IFeeBulkModels,
  IFeeStudentChallans
} from "../../../../models";
import { FeeStudentChallanService, FeeCampusBankLinkService, FeeCampusChallanNoteLinkService, FeeChallanTypeService, SetupClassService } from "../../../../service";
import { State } from "vuex-class";
import { StoreTypes } from "../../../../../../store";

@Component({
  name: "student-challan-add-edit-model",
  template: require("./index.html")
})
export class FeeStudentChallanAddEdit extends Vue {

  @State((state: IRootStoreState) => state.common.user) user: IUser;
  @State((state: IRootStoreState) => state.feeStudentInfo) studentInfo: any;

  //studentInfo: any = {};
  report: String = "";

  private repository: FeeStudentChallanService;
  private campusBankRepository: FeeCampusBankLinkService;
  private campusChallanRepository: FeeCampusChallanNoteLinkService;
  private concessionRepository: FeeStudentChallanService;
  private data: Array<IFeeSubinstallmentVM> = [];
  private campusBankList: Array<ICampusBank> = [];
  private campusChallanList: Array<IFeeCampusChallanNoteLinkVM> = [];
  private TempChallandata: Array<IFeeStudentChallans> = [];
  private StudentChallandata: Array<IFeeStudentChallans> = [];
  private installNo: number = 1;
  private challanType: string = '';
  private StudentRecordReportList: Array<StudentReportData> = [];
  private feeChallanList: Array<StudentChallanReportEx> = [];
  private TempStudentRecordReportList: any = [];
  private nextChallan: any = [];
  private nextDuedate: any = [];
  private subAmount: any = [];
  private challanNote: string = '';
  private bankNote: string = '';
  private datestring: string = "";
  private subinstallmentArray: any = [];
  private challanFooter: any = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
  private challanRData: any = [];
  private subinstallmentData: any = [];
  private savedisable: boolean = true;

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  private ChallanTypeList: Array<IFeeChallanType> = [];
  private classList: Array<ISetupClass> = []
  private classId = '';


  private classRepo: SetupClassService = new SetupClassService(this.$store)


  private StudentFeedata: Array<IFeeStudentChallanVM> = [];
  private FeeChallanrepository: FeeStudentChallanService = null;
  private FeeChallanTypeService: FeeChallanTypeService = null;
  private str = '';

  created() {
    this.repository = new FeeStudentChallanService(this.$store);
    this.concessionRepository = new FeeStudentChallanService(this.$store);
    this.campusBankRepository = new FeeCampusBankLinkService(this.$store);
    this.FeeChallanTypeService = new FeeChallanTypeService(this.$store);
    this.campusChallanRepository = new FeeCampusChallanNoteLinkService(this.$store);
    this.FeeChallanrepository = new FeeStudentChallanService(this.$store);
  }
  private bulkModel: IFeeBulkModels = { feeStudentChallans: [], feeSubinstallmentVM: [] }

  mounted() {
    this.FeeChallanTypeService.GetFindBy('e=>e.StatusId==1').then(r => {
      this.ChallanTypeList = r as Array<IFeeChallanType>
      if (this.ChallanTypeList.length > 0) {
        this.challanType = this.ChallanTypeList.find(s => s.fullName.toLowerCase().startsWith('edu')).challanTypeId;
      }
      this.validatePage();
    });
    this.classRepo.GetFindBy('s=>s.StatusId==1')
    .then(r => {
    this.classList = r as Array<ISetupClass>
    this.classId = this.classList.find(s => s.fullName == 'Part-I').classId;

      this.data = [];
      this.StudentChallandata = [];
      if (this.studentInfo) {
        if (this.studentInfo.admissionFormId) {
          if (this.studentInfo.refferenceNo) {
            var key = this.studentInfo.refferenceNo + "?" + this.studentInfo.admissionFormId + "?" + this.classId
            this.repository.GetBulkModels(key)
              .then(r => {
                this.bulkModel = r as IFeeBulkModels;
                debugger
                this.StudentChallandata = this.bulkModel.feeStudentChallans;
                this.data = this.bulkModel.feeSubinstallmentVM;
              });
          }
        }
      }



    });
  }

  loadClassData() {
        this.data = [];
        this.StudentChallandata = [];
        if (this.studentInfo) {
          if (this.studentInfo.admissionFormId) {
            if (this.studentInfo.refferenceNo) {
              var key = this.studentInfo.refferenceNo + "?" + this.studentInfo.admissionFormId + "?" + this.classId
              this.repository.GetBulkModels(key)
                .then(r => {
                  this.bulkModel = r as IFeeBulkModels;
                  this.StudentChallandata = this.bulkModel.feeStudentChallans;
                  this.data = this.bulkModel.feeSubinstallmentVM;
                });
            }
          }
        }
  }
  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    }
    else {
      if (('feeStudentChallans' in this.user.claims) == true) {
        if (this.user.claims['feeStudentChallans'].indexOf('R') >= 0) {
          this.canRead = true;
        }
        if (this.user.claims['feeStudentChallans'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims['feeStudentChallans'].indexOf('U') >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims['feeStudentChallans'].indexOf('D') >= 0) {
          this.canDelete = true;
        }
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
  maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 },{ item: 5 },  { item: 6 }]

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
        return this.data.filter(e => e.installmentNo == this.installNo && e.challanTypeId == this.challanType).sort((n1, n2) => {
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

        return this.StudentChallandata.filter(e => e.installmentNo == this.installNo && e.challanTypeId == this.challanType).sort((n1, n2) => {
          if (n1.dueDate > n2.dueDate) { return 1; }
          if (n1.dueDate < n2.dueDate) { return -1; }
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
      var temparry = this.StudentChallandata.filter(s => s.installmentNo < this.installNo && s.challanTypeId == this.challanType);
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
    var key = challanNo + "?" + this.challanType + "?" + this.user.email;
    this.repository.PrChallanEx(key)
      .then(r => {
        if (r) {
          if (r.length > 0) {
            // alert(JSON.stringify(r[0].general.campusName))
            if (r[0].general.campusName.indexOf('Step') != -1) {

              // alert('step')
              this.$store.dispatch(RootStoreTypes.reportOperation, {
                data: r as any,
                path: '/assets/Reports/Resource/Admission/student-challan-step.xml',
                show: true
              });

            }
            else {
              // alert('else')
              this.$store.dispatch(RootStoreTypes.reportOperation, {
                data: r as any,
                path: '/assets/Reports/Resource/Admission/student-challan-ex.xml',
                show: true
              });
            }
          } else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'No record Found',
              title: 'Failed',
              messageTypeId: PayloadMessageTypes.warning
            });
          }
        }
      })


  }
  generateChallanReportOld(challanNo: any) {
    this.savedisable = false;
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
                  ) {

                    this.subinstallmentData.push({
                      nextChallan: this.TempChallandata[k].challanNo,
                      nextDuedate: this.TempChallandata[k].dueDate,
                      subAmount: this.TempChallandata[k].feeAmount
                    });


                  }
                }
                if (this.subinstallmentData.length == 0 && this.feeChallanList[0].campusName == 'Campus of Information Technology Lahore Main') {
                }

                if (this.subinstallmentData.length == 0) {

                  var subinstallmentDatas = {
                    "nextChallan": "-",
                    "nextDuedate": "-",
                    "subAmount": "-"
                  }

                  this.challanRData = '[' + JSON.stringify(this.challanFooter) + ',' + JSON.stringify(this.feeChallanList) + ',' + JSON.stringify(this.campusBankList) + ',' + JSON.stringify(subinstallmentDatas) + ']';

                  this.challanRData = JSON.parse(this.challanRData);


                  this.report = "/assets/Reports/Resource/Admission/Reportsubinstallment.xml";

                  this.$store.dispatch(RootStoreTypes.reportOperation, {
                    data: this.challanRData as any,
                    path: '/assets/Reports/Resource/Admission/Reportsubinstallment.xml',
                    show: true
                  });




                }


                else {


                  this.challanRData = '[' + JSON.stringify(this.challanFooter) + ',' + JSON.stringify(this.feeChallanList) + ',' + JSON.stringify(this.campusBankList) + ',' + JSON.stringify(this.subinstallmentData) + ']';

                  this.challanRData = JSON.parse(this.challanRData);


                  this.report = "/assets/Reports/Resource/Admission/Reportsubinstallment.xml";

                  this.$store.dispatch(RootStoreTypes.reportOperation, {
                    data: this.challanRData as any,
                    path: '/assets/Reports/Resource/Admission/Reportsubinstallment.xml',
                    show: true
                  });


                }

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
