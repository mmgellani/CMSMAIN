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

import { ITransportationRouteStopLink, ISetupZone, ISetupSession, ISetupCity, ISetupSubCity, VMTransportationRouteStopLink } from '../../../../models';
import { TransportationRouteStopLinkService, SetupZoneService, SetupSessionService, SetupCityService, SetupSubCityService } from '../../../../service';

import { TransportationRouteStopLinkAddEdit } from '../add-edit';
import { TransportationRouteStopLinkDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': TransportationRouteStopLinkAddEdit,
        'delete-model': TransportationRouteStopLinkDelete
    }
})

export class TransportationRouteStopLinkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: TransportationRouteStopLinkService;
    private data: Array<ITransportationRouteStopLink> = [];
    private datas: Array<VMTransportationRouteStopLink> = [];
    private filterString: string = '';
    private zoneId = ''
    private sessionId = ''
    private cityId = ''
    private subcityId = ''
    private addresFilter = ''

    private zoneList: Array<ISetupZone> = []
    private sessionList: Array<ISetupSession> = []
    private cityList: Array<ISetupCity> = []
    private subcityList: Array<ISetupSubCity> = []

    private zoneRepo: SetupZoneService = new SetupZoneService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private cityRepo: SetupCityService = new SetupCityService(this.$store)
    private subcityRepo: SetupSubCityService = new SetupSubCityService(this.$store)

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    created() {
        this.repository = new TransportationRouteStopLinkService(this.$store);
        this.loadZone();
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
            if (('routeStopLink' in this.user.claims) == true) {
                if (this.user.claims['routeStopLink'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['routeStopLink'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['routeStopLink'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['routeStopLink'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ITransportationRouteStopLink>));



        this.datas = [];
        if (this.zoneId.length > 0 && this.cityId.length > 0 && this.subcityId.length > 0) {
            var key = this.zoneId + '?' + this.cityId + '?' + this.subcityId;
            this.repository.GetAllVM(key)
                .then(response => this.datas = (response as Array<VMTransportationRouteStopLink>));
        }
    }

        loadZone() {
            this.zoneRepo.GetFindBy('e=>e.StatusId==1')
                .then(r => {
                    this.zoneList = r as Array<ISetupZone>
                })
        }

        loadCity() {
            this.cityRepo.GetFindBy('e=>e.ZoneId.ToString()=="' + this.zoneId + '" ')
                .then(r => {
                    this.cityList = r as Array<ISetupCity>
                })
        }

        loadSubCity() {
            this.subcityRepo.GetFindBy('e=>e.CityId.ToString()=="' + this.cityId + '" ')
                .then(r => {
                    this.subcityList = r as Array<ISetupSubCity>
                })
        }

        insertModel() {
            this.$modal.show('add-edit-model', { model: { routeStopLinkIId: '', routeId: '', vehicleId: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
        }

        editModel(model : ITransportationRouteStopLink) {
            this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
        }

        deleteModel(model : ITransportationRouteStopLink) {
            this.$modal.show('delete-model', { model: model });
        }
    }