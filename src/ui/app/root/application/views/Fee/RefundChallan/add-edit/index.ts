/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/
 
import * as helper from '../../../../helper';
 
import { AllalreadyRefundChallan, DDLGroupModel, DDLModel , IRefundChallanFee, ISetupCampus, ISetupCampusProgramVM, ISetupGender,ICampusBank} from '../../../../models';
import { FeeBankService, FeeCampusBankLinkService,FeeStudentChallanService,FeeStudentFeeStructureService } from '../../../../service';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, required,minValue } from 'vuelidate/lib/validators';
 
import Component from 'vue-class-component';
import { FeeBankAddEdit } from '../../Bank/add-edit';
import { PayloadMessageTypes } from '../../../../../../model';
import { SetupCampusAddEdit } from '../../../Setup/Campus/add-edit';
import { StoreTypes } from '../../../../../../store';
 
import Vue from 'vue';
import moment from 'moment';
import { debug } from 'console';
 import { Prop } from 'vue-property-decorator';

type ValidateFeeCampusBankLink = { data: IRefundChallanFee, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeCampusBankLink> = {
    data: {
       
        refundAmount: { required },
        refundDate: { required }
 
    }
};
 
@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
})
export class RefundChalanAddEdit extends Vue {
@Prop({ type: Function, default: null })
  public readonly onSuccess!: (() => void) | null;
    private repository: FeeCampusBankLinkService;
    private repo1:FeeStudentFeeStructureService;
       private FeeChallanrepository: FeeStudentChallanService;
    GenderList: Array<ISetupGender> = [];
    CampusList: Array<ISetupCampus> = [];
    private isActive: boolean = true;
    private campusId = '';
    private cityId = '';
     private refundAmount:number=0;
    private data: IRefundChallanFee = {
        refundAmount: 0 , refundDate: new Date()
    };
    //new FeeBankService
    private IsNewRecord: boolean = true;
    private title: string = '';
    private studentRefundChallanId: string = '';
        private Detail: string = '';
private StudentFeedata : any=[];
    private feeHeadId: string = '';
    private adhocChallanId:string='';
    private studentChallanId:string='';
    private  bankName:string='';
    private totalamount:number=0;
    private userId:Number;
    private ddl: Array<DDLModel> = [];
  private refundDate: Date = new Date();
    private campusBankList: Array<ICampusBank> = [];

  private  chequeIssueDate: Date = new Date();
     private RefundChallan:Array<AllalreadyRefundChallan> = [];
    private chequeNo: string = '';
private payeeName: string = '';
private  campusBankLinkId: string = '';
    ids: any = [];
    created() {
       
        this.repo1 = new FeeStudentFeeStructureService(this.$store);
         this.FeeChallanrepository = new FeeStudentChallanService(this.$store);

 
    }
 
    beforeModalOpen(event) {
       debugger;
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Edit Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        this.userId=event.params.userId;
        this.studentRefundChallanId=event.params.model.refundChallanId;
       let  detail = event.params.model.detail || [];
    console.log('detail',detail);
    detail = JSON.parse(detail);
    
    this.StudentFeedata = detail.map(x => ({
        feeHeadId: x.FeeHeadId,
        feeHead: x.FeeHead,
        stfeeamount: x.FeeAmount || 0
    }));

    console.log('data4456',this.StudentFeedata);

        this.feeHeadId=event.params.feeheadId;
        this.totalamount=event.params.totalamount;
        this.studentChallanId=event.params.model.studentChallanId;
                    this.payeeName=event.params.model.payName;
                    this.chequeNo=event.params.model.chequeNumber;
               this.chequeIssueDate=event.params.model.chequeDate;
                              this.bankName=event.params.model.bank;
                              this.campusBankLinkId=event.params.model.campusBankLinkId;

this.campusBankList=event.params.campusBankList;



        if (!this.IsNewRecord) {
            this.data.refundAmount=event.params.model.refundAmount;
          this.data.refundDate=event.params.model.refundDate;


        }
    }




    isHiddenFeeHead(item: any): boolean {
    if (!item || !item.feeHead) {
        return false;
    }

    const name = item.feeHead.toLowerCase();

    return (
        name.includes('exemption') ||
        name.includes('already paid') ||
        name.includes('pre 1st year adjustment')
    );
}
get visibleStudentFeeData(): any[] {
    return this.StudentFeedata.filter(
        x => !this.isHiddenFeeHead(x)
    );
}
calculateTotal(): void {
    let total = 0;

    this.visibleStudentFeeData.forEach(x => {
        total += Number(x.stfeeamount || 0);
    });

    this.data.refundAmount = total;

    if (total > this.totalamount) {
            this.refundAmount = this.totalamount

      {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Refund Amount cannot be greater than Total Amount',
          title: 'Error',
          messageTypeId: PayloadMessageTypes.warning
        });
        return;
      }
    } else {
      this.refundAmount = total
    }
}

// isRefundDisabled(item: any): boolean {
//     if (!item || !item.feeHead) {
//         return false;
//     }

//     const name = item.feeHead.toLowerCase();

//     return (
//         name.includes('exemption') ||
//         name.includes('already paid') ||
//         name.includes('pre 1st year adjustment')
//     );
// }

// calculateTotal(): void {
//     let total = 0;

//     this.StudentFeedata.forEach(x => {
//         if (!this.isRefundDisabled(x)) {
//             total += Number(x.stfeeamount || 0);
//         }
//     });

//     this.data.refundAmount = total;
// }



 
 
    cancel() {
         this.data.refundAmount=0;
         this.data.refundDate=new Date();
        this.$emit("submit");
        this.$modal.hide('add-edit-model');
    }
  goBack(){
    debugger
   this.$emit("submit");
    this.$modal.hide('add-edit-model');
    
}


  saveModel() {
this.$v.$touch();
if (!this.$v.$invalid) {
  this.ids = [];
    if (this.data.refundAmount > 0) {
      if (this.data.refundAmount > this.totalamount) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Refund Amount cannot be greater than Total Amount',
          title: 'Error',
          messageTypeId: PayloadMessageTypes.warning
        });
        return;
      }

      debugger;

                   if(this.payeeName.length <= 0 ||this.chequeNo.length <=0 || this.campusBankLinkId.length<=0 || this.data.refundAmount<=0 || !this.data.refundDate || !this.chequeIssueDate
){
              
                 this.$store.dispatch(StoreTypes.updateStatusBar, {
                     text: 'Please select All Mandatory Fields',
                     title: 'Error',
                     messageTypeId: PayloadMessageTypes.warning


                 });
                 return;
             }
let refundDt = this.data.refundDate;
if (!(refundDt instanceof Date)) {
    refundDt = new Date(refundDt);  // convert string to Date
}
let chequedate = this.chequeIssueDate;
if (!(chequedate instanceof Date)) {
    chequedate = new Date(chequedate);  // convert string to Date
}

debugger;
      // var dated = this.data.refundDate.getFullYear() + '/' + (this.data.refundDate.getMonth() + 1) + '/' + this.data.refundDate.getDate();
      var dated = refundDt.getFullYear() + '/' + (refundDt.getMonth() + 1) + '/' + refundDt.getDate();
            var chequeIssueDate = chequedate.getFullYear() + '/' + (chequedate.getMonth() + 1) + '/' + chequedate.getDate();

      var key = this.studentRefundChallanId + '?' + this.data.refundAmount + '?' + dated + '?' + this.userId + '?' + this.payeeName+ '?' + this.chequeNo+ '?' + chequeIssueDate + '?' + this.campusBankLinkId+ '?' +  JSON.stringify(this.StudentFeedata);
      this.FeeChallanrepository.UpdateRefundChalan(key).then(r => {
        if (r.returnValue === 1) {

          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'Refund Challan Updated Successfully',
            title: 'Success',
            messageTypeId: PayloadMessageTypes.success


          });
          
          // this.StudentFeedata = [];
          // if (this.onSuccess) this.onSuccess();
          this.goBack();

        }
        else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'Error',
            title: 'Failed',
            messageTypeId: PayloadMessageTypes.error
          });
        }

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
}


    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any

    
}

