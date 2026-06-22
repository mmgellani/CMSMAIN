
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Component from 'vue-class-component';
import { FeeCampusBankLinkService } from '../../../../service';
import { IFeeCampusBankLink } from '../../../../models';
import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class FeeCampusBankLinkDelete extends Vue {
    private repository: FeeCampusBankLinkService;
    private data: IFeeCampusBankLink = {
        campusBankLinkId: '', campusId: '', programDetailId: '', bankId: '', statusId: 0, loggerId: '',
        genderId: '',showInChallan:true
    }; private title: string = 'Delete Record';

    created() {
        this.repository = new FeeCampusBankLinkService(this.$store);
    }

    beforeModalOpen(event) {
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        this.$modal.hide('delete-model');
        this.$emit("submit");
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