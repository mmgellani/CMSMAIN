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

import { ISetupStatus, IFeeFeeStructure } from '../../../../models';
import { SetupStatusService, FeeFeeStructureService } from '../../../../service';

import * as helper from '../../../../helper';



@Component({
    
    name: 'add-edit-single-model',
    template: require('./index.html')
})
export class FeeStructureSingleAddEdit extends Vue {
    private repository: FeeFeeStructureService;
    private data: IFeeFeeStructure = { feeStructureId: '', zoneId: '', sessionId: '', programId: '', shiftId: '', classId: '', feeHeadId: '', feeAmount: 0, statusId: 0, loggerId: '', isApproved: false, };
    private title: string = 'Delete Record';
    private IsNewRecord: boolean = true;
    private statusident: number = 0;
    private statusDes: string;
    private isActive: boolean = false;

    created() {
        this.repository = new FeeFeeStructureService(this.$store);
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        
        this.$modal.hide('add-edit-single-model');
    }

    saveModel() {
        var key=this.data.feeStructureId+'?'+this.data.feeAmount+'?'+'0'
        
        this.repository.DeleteFeestructure(key)
        .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'Record has been Updated successfully',
            title: 'Deleted',
            messageTypeId: PayloadMessageTypes.warning
        })
        this.cancel();
    });
        
        this.cancel();
    }
    // get allowSubmit() {
    //     return  (this.data.status.length > 0);
    //   }
    $v: Vuelidate<any>;
}