/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';
import { StoreTypes } from "../../../../../../store";
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { ITransportationRouteInfo, ISetupZone, ISetupCity, ISetupSubCity } from '../../../../models';
import { TransportationRouteInfoService, SetupZoneService, SetupCityService, SetupSubCityService } from '../../../../service';

import { TransportationRouteInfoAddEdit } from '../add-edit';
import { TransportationRouteInfoDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': TransportationRouteInfoAddEdit,
        'delete-model': TransportationRouteInfoDelete
    }
})

export class TransportationRouteInfoList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: TransportationRouteInfoService;
    private data: Array<ITransportationRouteInfo> = [];
    private filterString: string = '';
    private zoneId = '';
    private cityId = '';
    private subCityId = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private cityList: Array<ISetupCity> = []
    private zoneList: Array<ISetupZone> = []
    private subCityList: Array<ISetupSubCity> = []
    private zoneRepo: SetupZoneService = new SetupZoneService(this.$store)
    private cityRepo: SetupCityService = new SetupCityService(this.$store)
    private subCityRepo: SetupSubCityService = new SetupSubCityService(this.$store)

    private columns = [
        { key: 'routeTitle', caption: 'Route Title' },
        // { key: 'name', caption: 'Sub City Name' },
        { key: 'maxInstallmentNo', caption: 'MaxInstallment No' },
        { key: 'driverName', caption: "Driver Name" },
        { key: 'driverPhoneNo', caption: "DriverPhone No" },
        { key: 'routeStartPoint', caption: "Routestart Point" },
        { key: 'routeEndPoint', caption: "Route End Point" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new TransportationRouteInfoService(this.$store);
        this.loadZone();
        // this.loadCity();
    }

    loadZone() {
        this.zoneRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.zoneList = r as Array<ISetupZone>

            })
    }
    loadCity() {
        this.cityRepo.GetFindBy('e=>e.ZoneId.ToString()=="' + this.zoneId + '"')
            .then(r => {
                this.cityList = r as Array<ISetupCity>

            })
    }
    loadSubCity() {
        this.subCityRepo.GetFindBy('e=>e.CityId.ToString()=="' + this.cityId + '"')
            .then(r => {
                this.subCityList = r as Array<ISetupSubCity>
            })
    }
    mounted() {
        this.validatePage();
        // this.refreshData();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('routeInfo' in this.user.claims) == true) {
                if (this.user.claims['routeInfo'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['routeInfo'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['routeInfo'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['routeInfo'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e=>e.SubCityId.ToString()=="' + this.subCityId + '"')
            .then(response => this.data = (response as Array<ITransportationRouteInfo>));
    }

    insertModel() {

        if (this.zoneId.length > 0 && this.cityId.length > 0 && this.subCityId.length > 0) {
            this.$modal.show('add-edit-model', { model: { routeId: '', routeTitle: '', subCityId: this.subCityId, maxInstallmentNo: 0, driverName: '', driverPhoneNo: '', routeStartPoint: '', routeEndPoint: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdowns",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }



    }

    editModel(model: ITransportationRouteInfo) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ITransportationRouteInfo) {
        this.$modal.show('delete-model', { model: model });
    }
}