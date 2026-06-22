/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IExaminationGradingPolicy } from '../../../../models';
import { ExaminationGradingPolicyService } from '../../../../service';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class ExaminationGradingPolicyDelete extends Vue {
    private repository: ExaminationGradingPolicyService;
    private data: IExaminationGradingPolicy =  {
        gradingPolicyId: '', fullName: '', fromRange: 0, toRange: 0, statusId: 0, loggerId: '',remarks: '',classId:'',sectionId:'',campusProgramId:'', 
    };
    private title: string = 'Delete Record';

    created() {
        this.repository = new ExaminationGradingPolicyService(this.$store);
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