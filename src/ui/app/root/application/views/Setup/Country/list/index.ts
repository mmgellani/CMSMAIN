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

import { ISetupCountry, ISetupProvince, IHumanResourceStaff } from '../../../../models';
import { SetupCountryService, SetupProvinceService, HumanResourceStaffService } from '../../../../service';

import { SetupCountryAddEdit } from '../add-edit';
import { SetupCountryDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Country-add-edit-model': SetupCountryAddEdit,
        'delete-model': SetupCountryDelete
    }
})

export class SetupCountryList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupCountryService;
    private data: Array<ISetupCountry> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private provinceModel: Array<ISetupProvince> = [];
    private repositoryProvince: SetupProvinceService;
    private staffModel: Array<IHumanResourceStaff> = [];
    private repoStaff: HumanResourceStaffService;

    private columns = [ 
        { key: 'fullName', caption: 'Full Name' }, 
        { key: 'nationality', caption: "Nationality" },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupCountryService(this.$store);
        this.repositoryProvince = new SetupProvinceService(this.$store);
        this.repoStaff = new HumanResourceStaffService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getProvince();
        this.getstaff();
    }
    getstaff() {
        this.staffModel = [];
        this.repoStaff.GetFindBy('e => e.StatusId!=2')
            .then(response => this.staffModel = (response as Array<IHumanResourceStaff>));
    }
    getProvince(){
        this.provinceModel = [];
        this.repositoryProvince.GetFindBy('e => e.StatusId!=2')
        .then(response => this.provinceModel = (response as Array<ISetupProvince>));

    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupCountry' in this.user.claims) == true) {
                if (this.user.claims['setupCountry'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupCountry'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupCountry'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupCountry'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupCountry>));
    }

    insertModel () {
        this.$modal.show('Country-add-edit-model', { model: { countryId: '', fullName: '', statusId: 0, loggerId: '', nationality: '',  }, IsNewRecord: true });
    }

    editModel (model : ISetupCountry) {
        this.$modal.show('Country-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ISetupCountry) {
        if(this.provinceModel.filter(e => e.countryId == model.countryId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped (So cannot be deleted)",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
              });
        }
        else  if (this.staffModel.filter(e => e.countryId == model.countryId).length > 0) {
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