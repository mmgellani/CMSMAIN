/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Component from 'vue-class-component';
import { FeeBankService } from '../../../../service';
import { IFeeBank } from '../../../../models';
import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class FeeBankDelete extends Vue {
    private repository: FeeBankService;
    private data: IFeeBank = { bankId: '',cityId:'',abbreviation: '', fullName: '', address: '', accountTitle: '', accountNo: '', statusId: 0, isEnabled: true, loggerId: '' };
    private title: string = 'Delete Record';

    created() {
        this.repository = new FeeBankService(this.$store);
    }

    beforeModalOpen(event) {
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        this.$modal.hide('delete-model');
        this.$emit("submit");
    }

    deleteModel() {
        this.data.statusId = 2
        this.repository.Update(this.data)
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