/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IFeeFeeHead, IMinimumPaidDate } from '../../../../models';
import { FeeFeeHeadService } from '../../../../service';
import { MinimumPaidDateService } from '../../../../service/Fee/minimumpaiddate';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class MinimumPaidDateDelete extends Vue {
    private repository: MinimumPaidDateService;
    private data: IMinimumPaidDate = {
        minimumPaidDateId: '',
        subCityId: '',
        minDays: 0,
        statusId: 1,
    }; private title: string = 'Delete Record';

    created() {
        this.repository = new MinimumPaidDateService(this.$store);
    }

    beforeModalOpen(event) {
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        this.$modal.hide('delete-model');

    }

    deleteModel() {
        this.data.statusId = 2;
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