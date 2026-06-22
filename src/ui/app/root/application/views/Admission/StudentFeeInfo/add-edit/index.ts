/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { required, maxLength, minLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes, IUser } from "../../../../../../model";

import { ISetupAddress, ISetupCity, IStudentOfSection, IFeeBulkModel, StudentChallanReportEx, ICampusBank, IFeeCampusChallanNoteLinkVM, IFeeStudentChallan, IStudentModel, IFeeStudentChallans, IFeeBulkModels, IFeeBulkModelss } from "../../../../models";
import { SetupAddressService, AdmissionStudentsService, FeeStudentChallanService, FeeCampusBankLinkService, FeeCampusChallanNoteLinkService } from "../../../../service";

import * as helper from "../../../../helper";
import { SetupCityService } from "../../../../service/Setup/City";

import { IRootStoreState, RootStoreTypes } from "../../../../../store";
import { State } from "vuex-class";
import { IStudentChallanInfo } from "../list";

type ValidateSetupAddress = { data: ISetupAddress; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupAddress> = {
  data: {
    address: { required },
    postalCode: {
      maxLength: maxLength(5),
      minLength: minLength(5)
    },
    phoneNo: {
      maxLength: maxLength(15),
      minLength: minLength(15)
    },
    cityId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "Address-add-edit-model",
  template: require("./index.html"),

})
export class StudentFeeInfoAddEdit extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private columns = [
    { key: 'fullName', caption: 'Refference No' },
    { key: 'className', caption: 'Class' },
    { key: 'installmentNo', caption: 'Roll No' },
    { key: 'challanNo', caption: 'Student Name' },
    { key: 'dueDate', caption: 'father Name' },
    { key: 'concession', caption: 'Description' },
    { key: 'exemptionAmount', caption: 'Description' },
    { key: 'feeAmount', caption: 'Description' },
    { key: 'paidDate', caption: 'Description' }
    // { key: 'action', caption: 'Action', width: 120 }
  ];
  private studentRecord: Array<IStudentChallanInfo> = [];
  private reposstudent: AdmissionStudentsService;
  private studentName: string = '';
  private fatherName: string = '';
  private rollNo: string = '';
  private description: string = '';
  private filterString: string = '';
  private classString: string = '';
  private feeChallanList: Array<StudentChallanReportEx> = [];
  private campusBankList: Array<ICampusBank> = [];
  private campusChallanList: Array<IFeeCampusChallanNoteLinkVM> = [];
  private challanNote: string = '';
  private challanFooter: any = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
  private challanRData: any = [];
  private subinstallmentData: any = [];
  private showprintbutton: boolean=false;
  private repository2: FeeStudentChallanService = new FeeStudentChallanService(this.$store);
  private campusBankRepository: FeeCampusBankLinkService = new FeeCampusBankLinkService(this.$store);
  private campusChallanRepository: FeeCampusChallanNoteLinkService = new FeeCampusChallanNoteLinkService(this.$store);
  private TempChallandata: Array<IFeeStudentChallan> = [];
  private StudentChallandata: Array<IFeeStudentChallan> = [];
  private TempChallandatas: Array<IFeeStudentChallans> = [];
  private StudentChallandatas: Array<IFeeStudentChallans> = [];
  private nextChallan: any = [];
  private nextDuedate: any = [];
  private subAmount: any = [];
  private report = '';
  private bulkModel: IFeeBulkModel = { feeStudentChallan: [], feeSubinstallmentVM: [] }
  private bulkModels: IFeeBulkModels = { feeStudentChallans: [], feeSubinstallmentVM: [] }
  private bulkModelss: IFeeBulkModelss = { feeStudentChallans: [], feeSubinstallmentVMs: [] }
  private title = "Challan Info"
  generateChallanReportOld(challanNo: any, inst: any, challantypeid: any, refNo, admissionid) {
    //this.savedisable = false;
    this.feeChallanList = [];
    this.campusBankList = [];
    this.campusChallanList = [];
    this.challanNote = '';
    this.challanFooter = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
    this.challanRData = [];
    this.subinstallmentData = [];
    var key = refNo + "?" + admissionid
    this.repository2.GetBulkModel(key)
      .then(r => {
        this.bulkModel = r as IFeeBulkModel;
        this.StudentChallandata = this.bulkModel.feeStudentChallan;
        this.repository2.GetFeeRData(challanNo)
          .then(res => {
            this.feeChallanList = res as Array<StudentChallanReportEx>
            var key = this.feeChallanList[0].campusId + '?' + this.feeChallanList[0].programDetailId + '?' + this.feeChallanList[0].admissionFormId
            this.campusBankRepository.GetBankEx(key)
              .then(res => {
                this.campusBankList = res as Array<ICampusBank>
                var keyscr = this.feeChallanList[0].campusId + "?" + 1;
                this.campusChallanRepository.GetData(keyscr)
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

                    this.challanFooter = [{ challanNote: this.challanNote, customerCode: this.feeChallanList[0].customerCode, challanNo: this.feeChallanList[0].challanNo, userName: this.user.email, docNo: docNo, today: today }];
                    this.TempChallandata = this.StudentChallandata.filter(
                      e => e.installmentNo == inst);
                    this.nextChallan = [];
                    this.nextDuedate = [];
                    this.subAmount = [];

                    for (var k = 0; k < this.TempChallandata.length; k++) {
                      if (
                        this.TempChallandata[k].challanNo != challanNo &&
                        !this.TempChallandata[k].paidDate &&
                        this.TempChallandata[k].challanTypeId == challantypeid &&
                        this.TempChallandata[k].challanNo > challanNo
                      ) {

                        this.subinstallmentData.push({
                          nextChallan: this.TempChallandata[k].challanNo,
                          nextDuedate: this.TempChallandata[k].dueDate,
                          subAmount: this.TempChallandata[k].feeAmount
                        });
                      }
                    }

                    if (this.subinstallmentData.length == 0) {
                      this.challanRData = '[' + JSON.stringify(this.challanFooter) + ',' + JSON.stringify(this.feeChallanList) + ',' + JSON.stringify(this.campusBankList) + ']';
                      this.challanRData = JSON.parse(this.challanRData);
                      this.report = "/assets/Reports/Resource/Admission/Report1.xml";

                      this.$store.dispatch(RootStoreTypes.reportOperation, {
                        data: this.challanRData as any,
                        path: '/assets/Reports/Resource/Admission/Report1.xml',
                        show: true
                      });

                      // this.$parent.$emit('fire_report', { report: this.report, data: this.challanRData });
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

                      //this.$parent.$emit('fire_report', { report: this.report, data: this.challanRData });
                    }
                  });
              });
          });
        // this.data = this.bulkModel.feeSubinstallmentVM;
      });


    //this.savedisable = true;
  }


  generateChallanReport(challanNo: any, challantypeid: any){
    
    this.repository2.GetBulkModelinfo(challanNo)
    .then(r => {
      this.bulkModelss = r as IFeeBulkModelss;
       
      this.StudentChallandatas = this.bulkModelss.feeStudentChallans;});
       
      if(this.StudentChallandatas[0].allowButton){
        var key = challanNo + "?" + challantypeid + "?" + this.user.email;
        this.repository2.PrChallanEx(key)
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
    else{
       
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'Not Allowed Before Challan Validity Date',
        title: 'Failed',
        messageTypeId: PayloadMessageTypes.error
      });
    }
  }
  created() {
    this.reposstudent = new AdmissionStudentsService(this.$store);
  }

  mounted() {
    this.validatePage();
  }

  isDisabled(item: IStudentChallanInfo) {
   //  ;
    var index = this.studentRecord.indexOf(item);
    if (item.fullName.toLowerCase().startsWith("edu") == true) {
      if (index != 0) {
     
        if (this.studentRecord[index-1].paidDate == null && this.studentRecord[index-1].fullName.toLowerCase().startsWith("edu") == true) {
          return true;
        }
       // return false;
      }
      return false;
    }
    else
      return false;
    //var eduList = this.studentRecord.filter(s => s.fullName.toLowerCase().startsWith("edu") == true)
  }
  getstudent() {
    this.studentRecord = [];
    this.reposstudent.GetStudentFeeInfo(this.filterString + "?" + this.classString).then(r => {
      this.studentRecord = r as Array<IStudentChallanInfo>
      this.studentName = this.studentRecord[0].studentName
      this.fatherName = this.studentRecord[0].fatherName
      this.rollNo = this.studentRecord[0].rollNo
      this.description = this.studentRecord[0].description
    })
  }

  validatePage() {

  }

  beforeModalOpen(event) {
    this.filterString = event.params.filterString;
    this.classString = event.params.classString;
    this.getstudent()
  }



  cancel() {
    this.$emit("submit");
    this.$modal.hide("studentFee-info-model");
  }





}

