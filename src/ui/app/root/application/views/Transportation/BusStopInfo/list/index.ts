/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { ITransportationBusStopInfo } from '../../../../models';
import { TransportationBusStopInfoService } from '../../../../service';

import { TransportationBusStopInfoAddEdit } from '../add-edit';
import { TransportationBusStopInfoDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': TransportationBusStopInfoAddEdit,
        'delete-model': TransportationBusStopInfoDelete
    }
})

export class TransportationBusStopInfoList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: TransportationBusStopInfoService;
    private data: Array<ITransportationBusStopInfo> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    created() {
        this.repository = new TransportationBusStopInfoService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('busStopInfo' in this.user.claims) == true) {
                if (this.user.claims['busStopInfo'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['busStopInfo'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['busStopInfo'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['busStopInfo'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAll()
            .then(response => this.data = (response as Array<ITransportationBusStopInfo>));
    }

    insertModel () {
        this.$modal.show('add-edit-model', { model: { busStopId: '', busStopName: '', routeId: '', feeAmount: 0, sessionId: '', statusId: 0, loggerId: '', vehicleId: '',  }, IsNewRecord: true });
    }

    editModel (model : ITransportationBusStopInfo) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ITransportationBusStopInfo) {
        this.$modal.show('delete-model', { model: model });
    }
}