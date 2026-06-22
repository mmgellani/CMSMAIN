/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';


import { ISetupCity, ISetupInstitution, IFeeConcessionVM } from '../../../../models';
import { SetupCityService, SetupInstitutionService, FeeConcessionService } from '../../../../service';
import { ISetupZone, ISetupZoneCityLink } from '../../../../models';
import { SetupZoneService, SetupZoneCityLinkService } from '../../../../service';

import { SetupZoneAddEdit } from '../add-edit';
import { SetupZoneDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Zone-add-edit-model': SetupZoneAddEdit,
        'delete-model': SetupZoneDelete
    }
})

export class SetupZoneList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupZoneService;
    private data: Array<ISetupZone> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private cityModel: Array<ISetupCity> = [];
    private repocity: SetupCityService;
    private zoneModel: Array<ISetupZoneCityLink> = [];
    private repositoryZone: SetupZoneCityLinkService;
    private institutionModel: Array<ISetupInstitution> = [];
    private repositoryInstitution: SetupInstitutionService;
    private concessionModel: Array<IFeeConcessionVM> = [];
    private repoconcession: FeeConcessionService;
    private concessionbulkModel: Array<IFeeConcessionVM> = [];
    private repoconcessionbulk: FeeConcessionService;

    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'description', caption: "Description" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupZoneService(this.$store);
        this.repocity = new SetupCityService(this.$store);
        this.repositoryZone = new SetupZoneCityLinkService(this.$store);
        this.repositoryInstitution = new SetupInstitutionService(this.$store);
        this.repoconcession = new FeeConcessionService(this.$store);
        this.repoconcessionbulk = new FeeConcessionService(this.$store);
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
            if (('setupZone' in this.user.claims) == true) {
                if (this.user.claims['setupZone'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupZone'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupZone'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupZone'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e=>e.StatusId!=2')
            .then(response => this.data = (response as Array<ISetupZone>));
    }

    insertModel() {
        this.$modal.show('Zone-add-edit-model', { model: { zoneId: '', fullName: '', description: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupZone) {
        this.$modal.show('Zone-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupZone) {
        if (this.cityModel.filter(e => e.zoneId == model.zoneId).length > 0 || this.zoneModel.filter(e => e.zoneId == model.zoneId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped (So cannot be deleted)",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }
        else if (this.concessionModel.filter(e => e.zoneId == model.zoneId).length > 0) {

            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped (So cannot be deleted)",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }
        else if (this.concessionbulkModel.filter(e => e.zoneId == model.zoneId).length > 0) {

            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped (So cannot be deleted)",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }

        else {
            this.$modal.show('delete-model', { model: model });
        }
    }
}
