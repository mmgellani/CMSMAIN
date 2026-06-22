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

import { ITransportationVehicleInfo } from '../../../../models';
import { TransportationVehicleInfoService } from '../../../../service';

import { TransportationVehicleInfoAddEdit } from '../add-edit';
import { TransportationVehicleInfoDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': TransportationVehicleInfoAddEdit,
        'delete-model': TransportationVehicleInfoDelete
    }
})

export class TransportationVehicleInfoList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: TransportationVehicleInfoService;
    private data: Array<ITransportationVehicleInfo> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'vehicleName', caption: 'VehicleName' },
         { key: 'vehicleCapacity', caption: "VehicleCapacity" },
        // { key: 'vehicleNumberPlate', caption: "VehicleNumberPlate" }, 
          { key: 'registrationNo', caption: "RegistrationNo" }, 
         { key: 'parking', caption: "Parking" },        
         { key: 'statusId', caption: 'Status' },
         { key: 'action', caption: 'Action', width: 120 }
     ];

    created() {
        this.repository = new TransportationVehicleInfoService(this.$store);
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
            if (('vehicleInfo' in this.user.claims) == true) {
                if (this.user.claims['vehicleInfo'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['vehicleInfo'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['vehicleInfo'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['vehicleInfo'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ITransportationVehicleInfo>));
    }

    insertModel () {
        this.$modal.show('add-edit-model', { model: { vehicleId: '', vehicleName: '', vehicleCapacity: 0, vehicleNumberPlate: '', registrationNo: '', statusId: 0, loggerId: '', parking: '',  }, IsNewRecord: true });
    }

    editModel (model : ITransportationVehicleInfo) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ITransportationVehicleInfo) {
        this.$modal.show('delete-model', { model: model });
    }
}