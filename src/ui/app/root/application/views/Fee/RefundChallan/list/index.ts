/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { FeeCampusBankLinkService, FeeFeeHeadService, FeeStudentChallanService, SetupCollectorService } from '../../../../service';
import { AllalreadyRefundChallan, ICampusBank, IFeeCampusBankAccountVM, IFeeFeeHead, IFeeStudentChallan, IFeeStudentChallanVM, IFeeStudentFeeStructureVM, IFilterString, IFilterString2, ISetupCollector , RefundChallanofStudent} from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, minLength, minValue, required } from "vuelidate/lib/validators";

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import WidgetBox from '../../../../../home/widget-box/index';
import { MessageService } from '../../../../service/Message/message-service';
import { default as Axios } from 'axios';
import moment from 'moment';
import { Console } from 'console';
import { RefundChalanAddEdit } from '../add-edit';
type ValidateChallanNumber = { data: IFilterString2; validationGroup: string[] };

//const alphaNumCustom = (value: string) => /^[a-zA-Z0-9]+$/.test(value)

let customValidation: ValidationRuleset<ValidateChallanNumber> = {
    data: {
 
        filterString: {
            required,
            minLength: minLength(12),
            maxLength: maxLength(14)
        },
        // chequeNo:{required,minLength: minLength(6),
        //     maxLength: maxLength(12)},
        
       refundAmount:{required,minValue: minValue(0)},
       paidDate:{required},
    }

    
};

//notification code start
export interface INotificationTypes {
    notificationtype: string;
}
export interface INotificationCredntials {

    sesseion: string;
    campus: string;
    program: string;
    classstudent: string;
    section: string;
    rollno: string;
    notificationObject: {
        notification: string;
        type: string;
        title: string;
        image: string;
    }

    //notification code end

}

// ✅ YAHAN validations define hoti hain

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    
   name: 'refundchallan',
    template: require('./index.html'),
    components: {
        'add-edit-model': RefundChalanAddEdit,
        WidgetBox
    }
})

export class StudentRefundChallan extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeFeeHeadService;
    private dataEx: Array<IFeeFeeHead> = [];
    private data: IFilterString2 = {
        filterString: '',
        refundAmount:0,
        paidDate:new Date(),
    };


    private Collectorrepository: SetupCollectorService = null;
    CollectorList: Array<ISetupCollector> = [];
    private RefrenceNo: string = '';
    private Name: string = '';
    private fatherName: string = '';
    private campusName: string = '';
    private description: string = '';
    private className: string = '';
    private accountNo: string = '';
    private bankName: string = '';
    private branch: string = '';
    private code: string = '';
    private documentNo: string = '';
    private dueDate: string = '';
    private recievedDate: string = '';
    private feeHead: string = '';
    private stfeeamount: number = 0;
    private payableAmount: number = 0;
    private collectorName: string = '';
    private sectionName: string = '';
    private filterString: string = '';
    private FeeChallanrepository: FeeStudentChallanService;
    private CampusBankrepository: FeeCampusBankLinkService;
    private campusBankList: Array<ICampusBank> = [];
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private nodata: boolean = false;
    private StudetnChallanList:Array<RefundChallanofStudent> = [];
    public ClickonChallan: boolean=false;
    public challanlist: boolean=true;
    private StudentFeedata: Array<IFeeStudentChallanVM> = [];
    private TotalAmount: number = 0;
    private collectorId: string = '';
    private campusId: string = '';
    private programDetailId: string = '';
    private admissionFormId: string = '';
    private campusBankLinkId: string = '';
    private chequeNo: string = '';
    private payeeName: string = '';

    private remarks: string = '';

    private studentchallanid: string ='';
    private selectedrow:any=[];
    // campusId: string = "";
    private modelchallanData: Array<IFeeStudentChallan> = [];
    private paidDate: Date = new Date();
        private chequeIssueDate: Date = new Date();

    
    private refundAmount:number=0;
    private currentDate: Date = new Date();
    service: MessageService = new MessageService(this.$store);
    private notificationRepo: MessageService = new MessageService(this.$store);
    ChallanAmount: number = 0;
    installmentNO: number = 0;
   private valueforsearch:string='';
    isAlreadyPaid: boolean = false;
     private serachparam:string=''; 
    private session: string = '0';
    private campus: string = '0';
    private CampusProgramId: string = '0';
    private cclassid: string = '0';
    private sectionCourseLink: string = '0';
    private srollno: string = '0';
     private RefundChallan:Array<AllalreadyRefundChallan> = [];
    private Messaage: string = '0';
    private titletxt: string = '0';
    private imagetxt: string = '0';
    private notifType: string = '0';

    private columns = [
        { key: 'challanNo', caption: 'Challan No' },
        { key: 'challanType', caption: 'Challan Type' },
        { key: 'installmentNo', caption: 'Installment #' },
       { key: 'class', caption: 'Class' },
        { key: 'studentName', caption: 'Student Name' },
        { key: 'programDetail', caption: 'Program' },
        { key: 'action', caption: 'Action', width: 120 }
    ];


    created() {
        this.CampusBankrepository = new FeeCampusBankLinkService(this.$store);
        this.repository = new FeeFeeHeadService(this.$store);
        this.FeeChallanrepository = new FeeStudentChallanService(this.$store);
        this.Collectorrepository = new SetupCollectorService(this.$store);
        this.StudentFeedata = null;

    }

    mounted() {
        this.validatePage();
        this.refreshData();

    }

    serachchallanNo(row) {
        this.selectedrow = row;
        this.challanlist = true;
        this.ClickonChallan = false;
        this.data.filterString = row.challanNo;
        this.ClickonChallan = true;
        this.challanlist = false;
        this.SearchFeeConfirmation();
    }

isRefundDisabled(item) {
  if (!item || !item.feeHead) return false;

  const feeHead = item.feeHead.toLowerCase();

  // Disable if any of these conditions are true
  const feeHeadDisabled =
    feeHead.includes('exemption') ||
    feeHead.includes('already paid') ||
    feeHead.includes('pre') ||
    feeHead.includes('1st year adjustment');

  const refundChallanDisabled = this.RefundChallan && this.RefundChallan.length > 0;

  return feeHeadDisabled || refundChallanDisabled;
}



  calculateTotal(): void {
  let total = 0;

  this.StudentFeedata.forEach(item => {

    if (this.isRefundDisabled(item)) {
      item.stfeeamount = 0;
      return;
    }

    let entered = Number(item.stfeeamount) || 0;
    const payable = Number(item.payableAmount) || 0;

    // ❌ negative not allowed
    if (entered < 0) {
      entered = 0;
    }

    // ❌ fee-head level limit
    if (entered > payable) {
      entered = payable;

      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: `"${item.feeHead}" refund cannot exceed paid amount (${payable})`,
        title: 'Warning',
        messageTypeId: PayloadMessageTypes.warning
      });
    }

    item.stfeeamount = entered;
    total += entered;
  });

  // ✅ total refund auto update
  this.refundAmount = total;
}

//    calculateTotal() {
//     let sum = 0

//     this.StudentFeedata.forEach(item => {
//       let val = Number(item.stfeeamount) || 0

//       if (val < 0) val = 0
//       item.stfeeamount = val

//       sum += val
//     })
//      this .refundFeeList()



//     if (sum > this.TotalAmount) {
//       this.refundAmount = this.TotalAmount
//       {
//         this.$store.dispatch(StoreTypes.updateStatusBar, {
//           text: 'Refund Amount cannot be greater than Total Amount',
//           title: 'Error',
//           messageTypeId: PayloadMessageTypes.warning
//         });
//         return;
//       }
//     } else {
//       this.refundAmount = sum
//     }
//   }

  InsertPaidDateNew() {
    debugger;
    const payload = {
      refundAmount: this.refundAmount,
      paidDate: this.paidDate,
     chequeIssueDate: this.chequeIssueDate,

      chequeNo: this.chequeNo,
      payeeName: this.payeeName,
      bankId: this.campusBankLinkId,
      remarks: this.remarks,

      // 🔹 list as JSON
      refundFeeDetails: this.StudentFeedata
    }

    console.log('Payload =>', payload)

    // API call here
    // axios.post('/save-refund', payload)
  }




  refundFeeList() {
    debugger;

    
    return this.StudentFeedata
      .filter(i => i.stfeeamount > 0)
      .map(i => ({
        feeHead: i.feeHead,
        refundAmount: i.stfeeamount,
        payableAmount: i.payableAmount
      }))
  }
getRefundChallan(){
    this.SearchFeeConfirmation();

    this.GetAllreadyRefundChallan(this.StudentFeedata[0].studentChallanId)
}

GetAllreadyRefundChallan(studentChallanId){
    debugger;
    this.RefundChallan=[];
 this.FeeChallanrepository.getAllreadyRefundChallan(studentChallanId).then(res => {
     this.RefundChallan = res as Array<AllalreadyRefundChallan>;
     if(this.RefundChallan.length > 0)

        {
    var refundamount=this.RefundChallan[0].refundAmount;
          this.payeeName=this.RefundChallan[0].payName;
                    this.chequeIssueDate=this.RefundChallan[0].chequeDate;

                              this.paidDate=this.RefundChallan[0].refundDate;

          this.chequeNo=this.RefundChallan[0].chequeNumber;
          this.remarks=this.RefundChallan[0].remarks;
        this.campusBankLinkId=this.RefundChallan[0].campusBankLinkId;



this.refundAmount = parseInt(refundamount, 10) || 0;

        }

        else

            {
                this.payeeName='';
          this.chequeNo='';
          this.remarks='';
        this.campusBankLinkId='';  
           this.chequeIssueDate=new Date();

                              this.paidDate=new Date();
            }
 
 })
}

EditRefundChallan(model:AllalreadyRefundChallan){
     const refundvalue= model.refundAmount;
        this.$modal.show('add-edit-model',{ model: model, totalamount: this.TotalAmount,campusBankList:this.campusBankList, IsNewRecord: false,userId:this.user.userId, feeheadId:this.StudentFeedata[0].feeHeadId,
        //     onSuccess: () => {
        //          console.log("studentChalfgdfgfdfgdfglanId",this.StudentFeedata[0].studentChallanId),

        //     // This function will be called from child after saving
        //     this.GetAllreadyRefundChallan(this.StudentFeedata[0].studentChallanId);
        // }

        });
}

goBack(){
this.ClickonChallan=false;
this.challanlist=true;
this.refundAmount=null;
this.data.filterString=this.valueforsearch;    
}

    SearchFeeConfirmation() {
        // this.$v.data.filterString.$touch()

        this.$v.$touch();
        if (!this.$v.$invalid) {

            this.TotalAmount = 0;
            this.isAlreadyPaid = false;
            this.StudentFeedata = null;
             this.paidDate = new Date();

            this.RefrenceNo = this.Name = this.fatherName = this.campusName = this.description =
                this.className = this.bankName = this.accountNo = this.branch = this.code = this.documentNo = this.dueDate =
                this.recievedDate = this.feeHead = '';
            this.installmentNO = this.stfeeamount = this.payableAmount = 0;
            var key = this.data.filterString + "?" + this.user.userId;
            this.FeeChallanrepository.Getrefundchallan(key).then(res => {
                this.StudentFeedata = res as Array<IFeeStudentChallanVM>;
                ///alert(JSON.stringify(this.StudentFeedata))

                if (this.StudentFeedata) {
                    if (this.StudentFeedata.length > 0) {
                        this.nodata = false;
                        this.campusId = this.StudentFeedata[0].campusId;
                        this.programDetailId = this.StudentFeedata[0].programDetailId;
                        this.admissionFormId = this.StudentFeedata[0].admissionFormId;
                        this.studentchallanid=this.StudentFeedata[0].studentChallanId;
                        this.StudentFeedata = Array.from(new Set(this.StudentFeedata.map(a => a.feeHead)))
                            .map(id => {
                                return this.StudentFeedata.find(a => a.feeHead === id)
                            });

                        this.RefrenceNo = this.StudentFeedata[0].refferenceNo;
                        this.Name = this.StudentFeedata[0].fullName;
                        this.installmentNO = this.StudentFeedata[0].installmentNo;
                        this.fatherName = this.StudentFeedata[0].fatherName;
                        this.campusName = this.StudentFeedata[0].campusName;
                        this.description = this.StudentFeedata[0].description;
                        this.className = this.StudentFeedata[0].className;
                        this.bankName = this.StudentFeedata[0].bankName;
                        this.accountNo = this.StudentFeedata[0].accountNo;
                        this.branch = this.StudentFeedata[0].branch;
                        this.code = this.StudentFeedata[0].code;
                        this.documentNo = this.StudentFeedata[0].documentNo;
                        this.dueDate = this.StudentFeedata[0].dueDate;
                        this.recievedDate = this.StudentFeedata[0].paidDate;
                        this.feeHead = this.StudentFeedata[0].feeHead;
                        this.stfeeamount = this.StudentFeedata[0].stfeeamount;
                        this.payableAmount = this.StudentFeedata[0].payableAmount;
                        this.collectorName = this.StudentFeedata[0].collectorName;

                        this.session = "" + this.StudentFeedata[0].sessionId + "";
                        this.campus = "" + this.StudentFeedata[0].campusId + "";
                        this.CampusProgramId = "" + this.StudentFeedata[0].campusProgramId + "";
                        this.cclassid = "" + this.StudentFeedata[0].classId + "";
                        this.sectionCourseLink = "" + this.StudentFeedata[0].sectionCourseLinkId + "";
                        this.srollno = "" + this.StudentFeedata[0].rollNo; + "";
                        //this.notifType = "" + notifType2 + "";
                        this.FeeChallanrepository.GetFeeByChallanNo(this.data.filterString).then(
                            res => {

                                this.Collectorrepository.GetFindBy('e=>e.CampusId.ToString()=="' + this.campusId + '" && e.StatusId == 1').then(
                                    res => {
                                        this.CollectorList = res as Array<ISetupCollector>


                                        this.CampusBankrepository.GetBankAll(this.campusId + "?" + this.programDetailId + "?" + this.admissionFormId)
                                            .then(response => {
                                                this.campusBankList = response as Array<ICampusBank>
                                                this.campusBankList.forEach(element => {
                                                    element.bankName = element.bankName + ' - (' + element.accountNo + ')';

                                                });
                                            }
                                            )

                                    }
                                )
                                this.modelchallanData = res as Array<IFeeStudentChallan>
                                this.ChallanAmount = this.modelchallanData[0].feeAmount;

                                if (this.modelchallanData) {
                                    if (this.modelchallanData.length > 0) {
                                        if (this.modelchallanData[0].paidDate != null) {
                                            this.isAlreadyPaid = true;
                                        }

                                        this.TotalAmount = this.modelchallanData[0].feeAmount;
                                    }
                                }
                            }
                        )

                    }
                    else {
                        this.nodata = true
                    }
                    this.GetAllreadyRefundChallan(this.StudentFeedata[0].studentChallanId);
                }

            });


        }
    }


    reset()
    {
       this.chequeNo=''; 
        this.payeeName=''; 
       this.remarks=''; 
       this.campusBankLinkId=''; 

    }
 onPasteNumber(event) {
    const paste = event.clipboardData.getData('text');
    // Reject if paste contains non-digits
    if (!/^\d+$/.test(paste)) {
      event.preventDefault();
    }
  }


  resetForm() {
    // text fields
    this.payeeName = '';
    this.chequeNo = '';
    this.remarks = '';

    // dropdown / ids
    this.campusBankLinkId = '';

    // numbers
    this.refundAmount = 0;

    // dates (optional)
    this.paidDate = new Date();
    this.chequeIssueDate = new Date();

    // grid data
    this.StudentFeedata = [];

    // totals
    this.TotalAmount = 0;

    // optional: validation reset
   
  }



    InsertPaidDate() {
        debugger;

               if(this.payeeName.length <= 0 ||this.chequeNo.length <=0 || this.campusBankLinkId.length<=0 || this.refundAmount<=0 || !this.paidDate || !this.chequeIssueDate
){
              
                 this.$store.dispatch(StoreTypes.updateStatusBar, {
                     text: 'Please select All Mandatory Fields',
                     title: 'Error',
                     messageTypeId: PayloadMessageTypes.warning


                 });
                 return;
             }
      
         if(this.refundAmount > 0){
             if (this.refundAmount > this.TotalAmount) {
                 this.$store.dispatch(StoreTypes.updateStatusBar, {
                     text: 'Refund Amount cannot be greater than Total Amount',
                     title: 'Error',
                     messageTypeId: PayloadMessageTypes.warning


                 });
                 return;
             }

             
        this.FeeChallanrepository.GetFindBy3(this.data.filterString).then(
            res => {
                this.modelchallanData = res as Array<IFeeStudentChallan>;
                var dated = this.paidDate.getFullYear() + '/' + (this.paidDate.getMonth() + 1) + '/' + this.paidDate.getDate();
                                var chequeIssueDated = this.chequeIssueDate.getFullYear() + '/' + (this.chequeIssueDate.getMonth() + 1) + '/' + this.chequeIssueDate.getDate();

                var key = this.StudentFeedata[0].studentChallanId + '?' + this.refundAmount + '?' + dated + '?' + this.user.userId + '?' + this.StudentFeedata[0].feeHeadId  + '?' + chequeIssueDated + '?' + this.chequeNo + '?' + this.payeeName + '?' + this.remarks+ '?' + this.campusBankLinkId+ '?' +  JSON.stringify(this.StudentFeedata);      
                this.FeeChallanrepository.InsertRefundChalan(key).then(r => {
                    if (r.returnValue === 1) {

                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Refund Challan Created Successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success


                        });
                            // this.resetForm();

                        this.StudentFeedata = [];
                        this.SearchFeeConfirmation(); 
                        this.GetAllreadyRefundChallan(this.StudentFeedata[0].studentChallanId);
// this.reset();
                    }
                    
                    else {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Something went wrong. Please try again.',
                            title: 'Failed',
                            messageTypeId: PayloadMessageTypes.error
                        });
                    }

                })
            })
        }
         else {
             this.$store.dispatch(StoreTypes.updateStatusBar, {
                 text: 'The entered amount is invalid. Please enter an amount greater than 0.',
                 title: 'Error',
                 messageTypeId: PayloadMessageTypes.warning
 });
        }
    }
SearchStudentChallantoRefund(){
   
    this.StudetnChallanList=[];
    if (this.data.filterString.length>0 || this.data.filterString !== ""){
    this.valueforsearch=this.data.filterString;
     var key=this.data.filterString;
     
     this.FeeChallanrepository.GetStudentPaidChallanTorefund(key).then(res => {
      if(res !==undefined){
      this.StudetnChallanList=res;
     }
    }
    
    
     )
    }
    else{
        this.StudetnChallanList=[];
        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Please Enter the Enter Ref No./ Roll No. ',
                            title: 'Failed',
                            messageTypeId: PayloadMessageTypes.error
                        });
    }
}
   

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('refundchallan' in this.user.claims) == true) {
                if (this.user.claims['refundchallan'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['refundchallan'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['refundchallan'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['refundchallan'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.dataEx = [];
        this.repository.GetAll()
            .then(response => this.dataEx = (response as Array<IFeeFeeHead>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { feeHeadId: '', fullName: '', description: '', feeType: 0, statusId: 0, loggerId: '', orderBy: 0, }, IsNewRecord: true });
    }

    // editModel(model: IFeeFeeHead) {
    //     this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    // }

    deleteModel(model: IFeeFeeHead) {
        this.$modal.show('delete-model', { model: model });
    }
    $v: any;
}