/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IFeeConcessionDetail, IFeeConcession, IFeeFeeHead, IFeeFeeStructure, IFeeStructureVM, IFeeContinuationPolicy } from '../../../../models';
import { FeeConcessionDetailService, FeeConcessionService, FeeFeeHeadService, FeeFeeStructureService, FeeContinuationPolicyService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateFeeConcessionDetail = { model: IFeeConcessionDetail, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeConcessionDetail> = {
    model: {
        concessionDetailId: { required },
        concessionId: { required },
        feeHeadId: { required },
        percentage: { required },
        feeAmount: { required },
        statusId: { required },
        loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class FeeApplyConcessionBulkAddEdit extends Vue {
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
    created() {
        this.repository = new FeeConcessionDetailService(this.$store);

        this.repos = new FeeFeeHeadService(this.$store);

    }

    beforeModalOpen(event) {
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


        // this.repos.GetFindBy('e=>e.StatusId!=2').then(res => {
        //     this.feeHeadList = res as Array<IFeeFeeHead>

        // })
    }
    
    loadFeeHeads() {
        var key = this.zoneId + '?' + this.sessionId + '?' + this.programId + '?' + this.shiftId;
        this.feestructureRepo.GetFindByVM(key).then(res => {
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
    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    loadAmount() {
        this.data.feeAmount = 0;
        this.data.percentage = 0;
        this.feeAmount = this.feeHeadList.find(s => s.feeHeadId == this.data.feeHeadId).feeAmount;
    }

    loadAmountOnUpdate() {
        this.feeAmount = this.feeHeadList.find(s => s.feeHeadId == this.data.feeHeadId).feeAmount;
    }

    calculatePercentage() {
        this.data.percentage = (this.data.feeAmount / this.feeAmount * 100)
        this.data.percentage = + parseFloat(this.data.percentage.toString()).toFixed(2)
        //this.model.percentage=
    }
    calculateTotalAmount() {
        this.data.feeAmount = (this.feeAmount / 100 * this.data.percentage)
        // this.totalAmount = this.feeHeadTotal - this.totalAmount;
    }

    saveModel() {
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
                    this.cancel();
                });
        }

        this.cancel();
    }
    $v: Vuelidate<any>;
}