/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { FeeConcessionDetailService, FeeConcessionService, FeeFeeHeadService, FeeFeeStructureService } from '../../../../service';
import { IFeeConcession, IFeeConcessionDetail, IFeeFeeHead, IFeeFeeStructure, IFeeStructureVM } from '../../../../models';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, required } from 'vuelidate/lib/validators';

import Component from 'vue-class-component';
import { FeeConcessionAddEdit } from '../../Concession/add-edit';
import { FeeFeeHeadAddEdit } from '../../FeeHead/add-edit';
import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

type ValidateFeeConcessionDetail = { data: IFeeConcessionDetail, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeConcessionDetail> = {
    data: {
        //concessionDetailId: { required },
        concessionId: { required },
        feeHeadId: { required },
        percentage: { required },
        feeAmount: { required },
        // statusId: { required },
        // loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'Concession': FeeConcessionAddEdit,
        'FeeHead': FeeFeeHeadAddEdit
    }
})
export class FeeConcessionDetailAddEdit extends Vue {
    isActive: boolean = true;
    private repository: FeeConcessionDetailService;

    private repos: FeeFeeHeadService;
    private concessionRepo: FeeConcessionService = new FeeConcessionService(this.$store)
    private feestructureRepo: FeeFeeStructureService = new FeeFeeStructureService(this.$store)

    private concessionList: Array<IFeeConcession> = [];
    private feeHeadList: Array<IFeeStructureVM> = [];
    private data: IFeeConcessionDetail = {
        concessionDetailId: '', concessionId: '', feeHeadId: '', percentage: 0, feeAmount: 0, statusId: 0, loggerId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    private zoneId = ''
    private sessionId = ''
    private programId = ''
    private shiftId = ''
    private feeAmount = 0;
    private discountError= ''
    created() {
        this.repository = new FeeConcessionDetailService(this.$store);

        this.repos = new FeeFeeHeadService(this.$store);

    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.feeAmount = 0
        this.IsNewRecord = event.params.IsNewRecord;
        this.zoneId = event.params.zoneId;
        this.sessionId = event.params.sessionId;
        this.programId = event.params.programId;
        this.shiftId = event.params.shiftId;
        this.loadConcession();
        this.loadFeeHeads();
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true;
          }
          else if (this.data.statusId == 0) {
            this.isActive = false;
          }
        if (this.IsNewRecord == true) {

            this.calculateTotalAmount();
        }

    }

    loadFeeHeads() {
        var key = this.zoneId + '?' + this.sessionId + '?' + this.programId + '?' + this.shiftId;
        this.feestructureRepo.GetFindByVMEx(key).then(res => {
            this.feeHeadList = res as Array<IFeeStructureVM>

            if (!this.IsNewRecord) {
                this.loadAmountOnUpdate();
            }
        })
    }

    loadConcession() {
        this.concessionRepo.GetFindBy('e=>e.ZoneId.ToString()=="' + this.zoneId + '" && e.SessionId.ToString()=="' + this.sessionId + '" && e.ProgramId.ToString()=="' + this.programId + '" && e.ShiftId.ToString()=="' + this.shiftId + '" && e.StatusId!=2')
            .then(res => {
                this.concessionList = res as Array<IFeeConcession>

            })
    }
    addNewConcession() {
        this.$modal.show('Concession-add-edit-model', { IsNewRecord: true });

    }
    addNewFeeHead() {
        this.$modal.show('FeeHead-add-edit-model', { IsNewRecord: true });

    }
    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    loadAmount() {
        if (this.data.feeHeadId.length > 0) {
            this.feeAmount = this.feeHeadList.find(s => s.feeHeadId == this.data.feeHeadId).feeAmount;
        }
    }

    loadAmountOnUpdate() {
        if (this.data.feeHeadId.length > 0)
            this.feeAmount = this.feeHeadList.find(s => s.feeHeadId == this.data.feeHeadId).feeAmount;
    }

    // calculatePercentage() {
    //         if (this.data.feeAmount >= this.feeAmount) {
    //     this.discountError = "Discount amount fee amount se kam hona chahiye.";
    //     return;   // Stop further calculation
    // }
    //     this.data.percentage = helper.Round(((this.data.feeAmount / this.feeAmount) * 100), 0);
     
    // }
calculatePercentage() {

    // --- Condition #1: Discount should be less than Fee ---
    if (this.data.feeAmount > this.feeAmount) {
        this.discountError = "Discount amount must be less than or equal to the fee amount.";
        return; // STOP here — no other code will run
    }

    // --- Condition pass hogayi: Error clear kar do ---
    this.discountError = "";

    // --- Percentage calculate ---
    this.data.percentage = helper.Round(
        (this.data.feeAmount / this.feeAmount) * 100,
        0
    );
}

    calculateTotalAmount() {
            this.discountError = "";

        this.data.feeAmount = helper.Round(((this.data.percentage / 100) * this.feeAmount), 0);
        if (this.data.feeAmount > this.feeAmount) {
        this.discountError = "Discount amount must be less than or equal to the fee amount.";
        return; // STOP here — no other code will run
    }
    }

    allowsubmit()
    {

          if (this.data.feeAmount > this.feeAmount) {
        this.discountError = "Discount amount must be less than or equal to the fee amount.";
        return; // STOP here — no other code will run
    }

                this.discountError = "";

     return (this.data.concessionId.length > 0) && (this.data.feeHeadId.length > 0) && (this.data.feeAmount > 0) && (this.data.percentage > 0);

                
                
               



    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.loggerId = helper.newGuid();
                this.data.concessionDetailId = helper.newGuid();
                this.data.statusId = 1;
                this.repository.AddOne(this.data)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been inserted successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });
            } else {
                if (this.isActive == true) {
                    this.data.statusId = 1
                }
                else {
                    this.data.statusId = 0
                }
                this.repository.Update(this.data)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been updated successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        // alert(JSON.stringify(this.data));
                        this.cancel();
                    });
            }
        }
        this.cancel();
    }
    
    $v: any;
}