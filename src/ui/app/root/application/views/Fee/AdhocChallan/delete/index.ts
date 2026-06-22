
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Component from 'vue-class-component';
import {FeeStudentFeeStructureService } from '../../../../service';
import { IFeeCampusBankLink,IAdhocChallanFee } from '../../../../models';
import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class AdhocChallanDelete extends Vue {
        private repo1:FeeStudentFeeStructureService;
        private adhocChallanId:string='';

 private data: IAdhocChallanFee = {
         feeHeadId: '', campusId: '', amount: 0, toDate: new Date() ,remarks:''
     };
    
    private title: string = 'Delete Record';

    created() {
        this.repo1 = new FeeStudentFeeStructureService(this.$store);
    }

    beforeModalOpen(event) {
        Object.assign(this.data, event.params.model);
        this.data.amount=event.params.model.feeAmount,
           this.data.toDate=event.params.model.dueDate,
           this.adhocChallanId=event.params.model.adhocChallanId

    }

    cancel() {
        this.$modal.hide('delete-model');
        this.$emit("submit");
    }

    deleteModel() {

        const payload = {
                    adhocchallanid:  this.adhocChallanId,
                    amount: this.data.amount,   
                    duedate: this.data.toDate,
                    isdelete:true
                }
        this.repo1.UpdateAdhocChallan(payload)
            .then(() => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been Deleted successfully',
                    title: 'Deleted',
                    messageTypeId: PayloadMessageTypes.warning
                })
                this.cancel();
            });
    }
}