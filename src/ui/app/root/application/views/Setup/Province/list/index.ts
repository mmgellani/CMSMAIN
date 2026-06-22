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

import { ISetupProvince, ISetupProvinceVM, ISetupBoard, ISetupCity } from '../../../../models';
import { SetupProvinceService, SetupBoardService, SetupCityService } from '../../../../service';

import { SetupProvinceAddEdit } from '../add-edit';
import { SetupProvinceDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Province-add-edit-model': SetupProvinceAddEdit,
        'delete-model': SetupProvinceDelete
    }
})

export class SetupProvinceList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupProvinceService;
    private data: Array<ISetupProvinceVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private boardModel: Array<ISetupBoard> = [];
    private repoboard: SetupBoardService;
    private cityModel: Array<ISetupCity> = [];
    private repocity: SetupCityService;
    private columns = [
        { key: 'fullName', caption: "FullName" },
        { key: 'code', caption: "Code" },
        { key: 'description', caption: "Description" },
        { key: 'countryName', caption: 'CountryName' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupProvinceService(this.$store);
        this.repoboard = new SetupBoardService(this.$store);
        this.repocity = new SetupCityService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getboard();
        this.getcity();
    }

    getboard() {
        this.boardModel = [];
        this.repoboard.GetFindBy('e => e.StatusId!=2')
            .then(response => this.boardModel = (response as Array<ISetupBoard>));
    }

    getcity() {
        this.cityModel = [];
        this.repocity.GetFindBy('e => e.StatusId!=2')
            .then(response => this.cityModel = (response as Array<ISetupCity>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupProvince' in this.user.claims) == true) {
                if (this.user.claims['setupProvince'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupProvince'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupProvince'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupProvince'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAllActive()
            .then(response => this.data = (response as Array<ISetupProvinceVM>));

    }

    insertModel() {
        this.$modal.show('Province-add-edit-model', { model: { provinceId: '', fullName: '', code: '', description: '', countryId: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupProvince) {
        this.$modal.show('Province-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupProvince) {
        if (this.boardModel.filter(e => e.provinceId == model.provinceId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped (So cannot be deleted)",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }
        else if (this.cityModel.filter(e => e.provinceId == model.provinceId).length > 0) {
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