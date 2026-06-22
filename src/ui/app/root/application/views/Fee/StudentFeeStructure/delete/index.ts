/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IFeeStudentFeeStructure } from '../../../../models';
import { FeeStudentFeeStructureService } from '../../../../service';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class FeeStudentFeeStructureDelete extends Vue {
    private repository: FeeStudentFeeStructureService;
    private data: IFeeStudentFeeStructure = { studentFeeStructureId: '', admissionFormId: '', classId: '', installmentNo: 0, feeHeadId: '', feeAmount: 0, concessionDetailId: '', payableAmount: 0, statusId: 0, loggerId: '',  };
    private title: string = 'Delete Record';

    created() {
        this.repository = new FeeStudentFeeStructureService(this.$store);
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
            .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Record has been Deleted successfully',
                title: 'Deleted',
                messageTypeId: PayloadMessageTypes.warning
            })
            this.cancel();
        });

        this.cancel();
    }
}