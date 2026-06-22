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

import { IFeeFeeActivity, IFeeFeeHead } from '../../../../models';
import { FeeFeeActivityService, FeeFeeHeadService } from '../../../../service';

import * as helper from '../../../../helper';

import { FeeFeeHeadAddEdit } from '../../FeeHead/add-edit';

type ValidateFeeFeeActivity = { model: IFeeFeeActivity, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeFeeActivity> = {
    model: {
        feeActivityId: { required },
        studentChallanId: { required },
        dated: { required },
        description: { required },
        statusId: { required },
        loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'FeeHead': FeeFeeHeadAddEdit
    }
})
export class FeeFeeActivityAddEdit extends Vue {
    private repository: FeeFeeActivityService;
    private FeeHeadrepository: FeeFeeHeadService = null;
    HeadList: Array<IFeeFeeHead> = [];
    private isActive: boolean = true;

    private data: IFeeFeeActivity = {
        feeActivityId: '', studentChallanId: '', dated: new Date(), description: '', statusId: 0, loggerId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new FeeFeeActivityService(this.$store);
        this.FeeHeadrepository = new FeeFeeHeadService(this.$store);
        this.FeeHeadrepository.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.HeadList = res as Array<IFeeFeeHead>

        });
    }


    addNewFeeHead() {
        this.$modal.show('FeeHead-add-edit-model', { IsNewRecord: true });

    }
    loadFeeHead() {
        this.FeeHeadrepository.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.HeadList = res as Array<IFeeFeeHead>

        });

    }
    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        if (this.IsNewRecord) {
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

    get allowSubmit() {
        return (this.data.description.length > 0);
    }
    $v: Vuelidate<any>;
}