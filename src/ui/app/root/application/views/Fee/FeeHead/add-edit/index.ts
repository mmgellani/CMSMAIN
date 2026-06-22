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

import { IFeeFeeHead, IFeeChallanType } from '../../../../models';
import { FeeFeeHeadService, FeeChallanTypeService } from '../../../../service';

import * as helper from '../../../../helper';
import { FeeChallanTypeAddEdit } from '../../ChallanType/add-edit';

type ValidateFeeFeeHead = { data: IFeeFeeHead, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeFeeHead> = {
    data: {
        //feeHeadId: { required },
        fullName: { required },
        description: { required },
        feeType: { required },
        challanTypeId: { required },
        orderBy: { required }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'FeeHead-add-edit-model',
    template: require('./index.html'),
    components: {
        'ChallanType-add-edit-model': FeeChallanTypeAddEdit,
    }
})
export class FeeFeeHeadAddEdit extends Vue {
    private repository: FeeFeeHeadService;
    private data: IFeeFeeHead = {
        feeHeadId: '', fullName: '', description: '', feeType: 0, statusId: 0, loggerId: '', orderBy: 0, challanTypeId: '',
    };

    options2: [
        { text: 'Red', value: 1 },
        { text: 'Green', value: 2 },
        { text: 'Blue', value: 3 },
        { text: 'Purple', value: 4 }
    ]
    
    private IsNewRecord: boolean = true;
    private title: string = '';
    private isActive: boolean = true;

    private FeeChallanTypeList: Array<IFeeChallanType> = [];
    private challanTypeRepository: FeeChallanTypeService;

    created() {
        this.repository = new FeeFeeHeadService(this.$store);
        this.challanTypeRepository = new FeeChallanTypeService(this.$store);
    }

    addNewChallanType() {
        this.$modal.show('ChallanType-add-edit-model', { IsNewRecord: true });

    }
    loadChallanType() {
        this.challanTypeRepository.GetFindBy('e=>e.StatusId==1')
            .then(res => {
                this.FeeChallanTypeList = res as Array<IFeeChallanType>
            });
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.loadChallanType();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else {
            this.isActive = false;
        }
    }

    cancel() {
        // this.data = {
        //     feeHeadId: '', fullName: '', description: '', feeType: 0, statusId: 0, loggerId: '', orderBy: 0, challanTypeId: '',
        // };
        this.$modal.hide('FeeHead-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
       
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.feeHeadId = helper.newGuid();
                this.data.statusId = 1;
                this.data.loggerId = helper.newGuid();
                
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
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}