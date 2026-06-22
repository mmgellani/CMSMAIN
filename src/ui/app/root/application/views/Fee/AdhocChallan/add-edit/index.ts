/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { DDLGroupModel, DDLModel , ISetupCampus, ISetupCampusProgramVM, ISetupGender,IFeeHead,IAdhocChallanFee } from '../../../../models';
import { FeeBankService, FeeCampusBankLinkService,FeeStudentFeeStructureService } from '../../../../service';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, required,minValue,maxValue } from 'vuelidate/lib/validators';

import Component from 'vue-class-component';
import { FeeBankAddEdit } from '../../Bank/add-edit';
import { PayloadMessageTypes } from '../../../../../../model';
import { SetupCampusAddEdit } from '../../../Setup/Campus/add-edit';
import { StoreTypes } from '../../../../../../store';

import Vue from 'vue';
import moment from 'moment';

type ValidateFeeCampusBankLink = { data: IAdhocChallanFee, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeCampusBankLink> = {
    data: {
        feeHeadId: { required },
        amount: { required ,maxValue: maxValue(10000000) },
        toDate: { required },
        remarks: { required }

        // genderId: { required }

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'Bank': FeeBankAddEdit,
        'Campus': SetupCampusAddEdit
    }
})
export class AdhocChallanAddEdit extends Vue {
    private repository: FeeCampusBankLinkService;
    private repo1:FeeStudentFeeStructureService;
    
    // private Campusrepository: SetupCampusService = null;
    // private GenderRepo: SetupGenderService = new SetupGenderService(this.$store);
    // GenderSelectedList: Array<SelectedGender> = [];
    GenderList: Array<ISetupGender> = [];
    CampusList: Array<ISetupCampus> = [];
    private isActive: boolean = true;
    private campusId = '';
    private cityId = '';
    private data: IAdhocChallanFee = {
        feeHeadId: '', campusId: '', amount: 0, toDate: new Date() ,remarks:''
    };
    //new FeeBankService
    private IsNewRecord: boolean = true;
    private title: string = '';
        private staffId: string = '';
    private remarks: string = '';

    private feeHeadId: string = '';
    private adhocChallanId:string='';
    private userId:Number;
    private ddl: Array<DDLModel> = [];
    // private programDDL: Array<DDLGroupModel> = [];
    // private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    //     this.$store
    // );
   private feeHeadList: Array<IFeeHead> = [];

    // private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    ids: any = [];
    // private campusbankRepo: FeeCampusBankLinkService = new FeeCampusBankLinkService(this.$store);
    created() {
               debugger;

        this.repo1 = new FeeStudentFeeStructureService(this.$store);

        this.GetFeeHead();

    }

    beforeModalOpen(event) {
        debugger;
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        this.campusId = event.params.model.campusid;
        this.data.feeHeadId='';
        
        // this.feeHeadId=event.params.feeHeadId;
        this.adhocChallanId=event.params.model.adhocChallanId
        this.userId=event.params.userId;
        this.staffId=event.params.staffid;
        if (!this.IsNewRecord) {
           this.data.feeHeadId=event.params.model.feeHeadId;
           this.data.amount=event.params.model.feeAmount,
           this.data.toDate=event.params.model.dueDate,
                   this.staffId =event.params.staffId;

        }
    }
  GetFeeHead() {
        this.repo1.GetFeeHeadId().then(r => {
            this.feeHeadList = r as Array<IFeeHead>;
            console.log('values',this.feeHeadList)
        });
    }
limitToOneCrore(event) {
        let value = event.target.value;

        // non-digits हटाओ
        value = value.replace(/[^0-9]/g, '');

        // Number बनाओ
        let num = Number(value);

        // अगर 1 crore से ऊपर गया → रोक दो
        if (num > 10000000) {
            value = value.slice(0, -1); // आखिरी digit हटाओ
            num = Number(value);
        }

        this.data.amount = value;
    }

    cancel() {
        this.data.amount=0;
                this.data.remarks='';

        this.data.toDate=new Date();
        this.$emit("submit");
        this.$modal.hide('add-edit-model');
    }

    saveModel() {
        
        this.$v.$touch();
        if (!this.$v.$invalid) {
            this.ids = [];
            if (this.IsNewRecord) {
                debugger;
                console.log('values',this.data)
                if(this.data.feeHeadId.length > 0 && this.data.amount >= 10 )
                {
                     const payload = {
                    CampusId:  this.campusId,
                    Amount: this.data.amount,

                    FeeHeadId: this.data.feeHeadId,
                    DueDate: new Date(helper.formateDate(new Date(this.data.toDate))),
                     StaffId:this.staffId,
                    Remarks: this.data.remarks,

                };
                   
                    this.repo1.AddAdhocChallan(payload)
                    .then((r) => {
                        debugger;
                        if(r){
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been inserted successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })

                        this.cancel();
                    }
                    else{
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: r.message.text,
                            title: 'Error',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    }
                    })
                }
                else

                {
                    if (this.data.feeHeadId.length < 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Please Select Fee Head',
                            title: 'Error',
                            messageTypeId: PayloadMessageTypes.warning
                        })
                    }
                    if (this.data.amount === 0 || this.data.amount === null || this.data.amount < 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Please Enter Amount',
                            title: 'Error',
                            messageTypeId: PayloadMessageTypes.warning
                        })
                    }      
              if ( this.data.amount < 10) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'The entered amount is invalid. Please enter a value of 10 or greater',
                            title: 'Error',
                            messageTypeId: PayloadMessageTypes.warning
                        })
                    }    
                }
             ;}
             else {
                  const payload = {
                    adhocchallanid:  this.adhocChallanId,
                    amount: this.data.amount,   
                    duedate: new Date(helper.formateDate(new Date(this.data.toDate))),
                    Remarks: this.data.remarks,
                    isdelete:false
                }
                if (this.data.amount <10 ){
                    
                 this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'The entered amount is invalid. Please enter a value of 10 or greater',
                            title: 'Error',
                            messageTypeId: PayloadMessageTypes.warning
                        })
                }
                else{
                this.repo1.UpdateAdhocChallan(payload)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been updated successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });
                }
            }
        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}