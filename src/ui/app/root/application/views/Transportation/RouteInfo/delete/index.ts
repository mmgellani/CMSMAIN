/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { ITransportationRouteInfo } from '../../../../models';
import { TransportationRouteInfoService } from '../../../../service';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class TransportationRouteInfoDelete extends Vue {
    private repository: TransportationRouteInfoService;
    private data: ITransportationRouteInfo = { routeId: '', routeTitle: '', subCityId: '', maxInstallmentNo: 0, driverName: '', driverPhoneNo: '', routeStartPoint: '', routeEndPoint: '', statusId: 0, loggerId: '', vehicleId: '', longitude: '', latitude: '' };
    private title: string = 'Delete Record';

    created() {
        this.repository = new TransportationRouteInfoService(this.$store);
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