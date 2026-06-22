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

import { ITransportationRouteDetailInfo } from '../../../../models';
import { TransportationRouteDetailInfoService } from '../../../../service';

import { TransportationRouteDetailInfoAddEdit } from '../add-edit';
import { TransportationRouteDetailInfoDelete } from '../delete';
import { IRouteDetailVW } from '../../../../models/Transportation/RouteDetailVW';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': TransportationRouteDetailInfoAddEdit,
        'delete-model': TransportationRouteDetailInfoDelete
    }
})

export class TransportationRouteDetailInfoList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: TransportationRouteDetailInfoService;
    private data: Array<ITransportationRouteDetailInfo> = [];
    private VMData: Array<IRouteDetailVW> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'routeTitle', caption: 'Route Title' },
         { key: 'stopName', caption: "Stop Name" },
         { key: 'startingPoint', caption: "Starting Point" }, 
         { key: 'endingPoint', caption: "Ending Point" }, 
         { key: 'fare', caption: "Fare" },        
         { key: 'statusId', caption: 'Status' },
         { key: 'action', caption: 'Action', width: 120 }
     ];


    created() {
        this.repository = new TransportationRouteDetailInfoService(this.$store);
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
            if (('routeDetailInfo' in this.user.claims) == true) {
                if (this.user.claims['routeDetailInfo'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['routeDetailInfo'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['routeDetailInfo'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['routeDetailInfo'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.VMData = [];
        this.repository.GetAllVM()
            .then(response => this.VMData = (response as Array<IRouteDetailVW>));
    }

    insertModel () { 
        this.$modal.show('add-edit-model', { model: { routeDetailId: '', routeId: '', stopName: '', startingPoint: '', endingPoint: '', fare: 0, statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : ITransportationRouteDetailInfo) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ITransportationRouteDetailInfo) {
        this.$modal.show('delete-model', { model: model });
    }
}