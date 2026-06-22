/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { ITransportationRouteDetailInfo } from '../../../../models';
import { TransportationRouteDetailInfoService } from '../../../../service';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class TransportationRouteDetailInfoDelete extends Vue {
    private repository: TransportationRouteDetailInfoService;
    private data: ITransportationRouteDetailInfo = { routeDetailId: '', routeId: '', stopName: '', startingPoint: '', endingPoint: '', fare: 0, statusId: 0, loggerId: '', latitude:'',longitude:''  };
    private title: string = 'Delete Record';

    created() {
        this.repository = new TransportationRouteDetailInfoService(this.$store);
    }

    beforeModalOpen(event) {
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        this.$modal.hide('delete-model');
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