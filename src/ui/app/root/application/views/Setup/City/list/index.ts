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

import { ISetupCity, ISetupAddress, ISetupSubCity } from '../../../../models';
import { SetupCityService, SetupAddressService, SetupSubCityService } from '../../../../service';

import { SetupCityAddEdit } from '../add-edit';
import { SetupCityDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'City-add-edit-model': SetupCityAddEdit,
        'delete-model': SetupCityDelete
    }
})

export class SetupCityList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupCityService;
    private data: Array<ISetupCity> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private addressModel: Array<ISetupAddress> = [];
    private repoadd: SetupAddressService;
    private subCityModel: Array<ISetupSubCity> = [];
    private repositorySubCity: SetupSubCityService;


    private columns = [
        { key: 'fullName', caption: 'Full Name' },
        { key: 'cityCode', caption: "City Code" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupCityService(this.$store);
        this.repoadd = new SetupAddressService(this.$store);
        this.repositorySubCity = new SetupSubCityService(this.$store);

    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getadd();
        this.getSubCity();
    }

    getadd() {
        this.addressModel = [];
        this.repoadd.GetFindBy('e => e.StatusId!=2')
            .then(response => this.addressModel = (response as Array<ISetupAddress>));
    }

    getSubCity() {
        this.subCityModel = [];
        this.repositorySubCity.GetFindBy('e => e.StatusId!=2')
            .then(response => this.subCityModel = (response as Array<ISetupSubCity>));

    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupCity' in this.user.claims) == true) {
                if (this.user.claims['setupCity'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupCity'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupCity'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupCity'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e => e.StatusId!=2')
            .then(response => this.data = (response as Array<ISetupCity>));
    }

    insertModel() {
        this.$modal.show('City-add-edit-model', { model: { cityId: '', fullName: '', cityCode: '', statusId: 0, loggerId: '', provinceId: '', zoneId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupCity) {
        this.$modal.show('City-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupCity) {
        if (this.addressModel.filter(e => e.cityId == model.cityId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped (So cannot be deleted)",
                title: "Success",
                messageTypeId: PayloadMessageTypes.warning
            });
        }
        else if (this.subCityModel.filter(e => e.cityId == model.cityId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped (So cannot be deleted)",
                title: "Success",
                messageTypeId: PayloadMessageTypes.warning
            });
        }
        else {
            this.$modal.show('delete-model', { model: model });
        }
    }
}