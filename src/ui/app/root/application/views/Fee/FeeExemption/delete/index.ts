/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IFeeStudentChallan } from '../../../../models';
import { FeeStudentChallanService } from '../../../../service';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class FeeStudentChallanDelete extends Vue {
    private repository: FeeStudentChallanService;
    private data: IFeeStudentChallan = { studentChallanId: '', admissionFormId: '', classId: '', installmentNo: 0, challanNo: '', feeAmount: 0, dueDate: new Date(), paidDate: new Date(), statusId: 0, loggerId: '',challanTypeId:'',fine:0,collectorId:''  };
    private title: string = 'Delete Record';

    created() {
        this.repository = new FeeStudentChallanService(this.$store);
    }

    beforeModalOpen(event) {
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        this.$modal.hide('delete-model');
        this.$emit("submit");
    }

    deleteModel() {
        this.repository.Delete(this.data)
            .then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Record has been Deleted successfully',
                title: 'Deleted',
                messageTypeId: PayloadMessageTypes.warning
            }));

        this.cancel();
    }
}