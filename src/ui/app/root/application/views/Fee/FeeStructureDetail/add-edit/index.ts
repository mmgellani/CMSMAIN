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

import { IFeeFeeStructureDetail,IFeeFeeStructure,IFeeChallanType } from '../../../../models';
import { FeeFeeStructureDetailService,FeeFeeStructureService,FeeChallanTypeService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateFeeFeeStructureDetail = { model: IFeeFeeStructureDetail, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeFeeStructureDetail> = {
    model: {
	feeStructureDetailId: { required },
	feeStructureId: { required },
	installmentNo: { required },
	challanTypeId: { required },
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
export class FeeFeeStructureDetailAddEdit extends Vue {
    isActive:boolean=true;
    private repository: FeeFeeStructureDetailService;
    private Feerepo: FeeFeeStructureService;
    private ChallanTyperepo: FeeChallanTypeService;
    private feeStructureList: Array<IFeeFeeStructure> = [];
    private challanTypeList: Array<IFeeChallanType> = [];
    private data: IFeeFeeStructureDetail = {
        feeStructureDetailId: '', feeStructureId: '', installmentNo: 0, challanTypeId: '', feeAmount: 0, statusId: 0, loggerId: '', 
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new FeeFeeStructureDetailService(this.$store);
        this.Feerepo = new FeeFeeStructureService(this.$store);
        this.ChallanTyperepo = new FeeChallanTypeService(this.$store);
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        this.Feerepo.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.feeStructureList = res as Array<IFeeFeeStructure>

        })
        this.ChallanTyperepo.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.challanTypeList = res as Array<IFeeChallanType>

        })
    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        if (this.IsNewRecord) {
            this.data.feeStructureDetailId=helper.newGuid();
            this.data.statusId=1;
            this.data.loggerId = helper.newGuid();
            this.repository.AddOne(this.data)
                .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
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
                .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
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