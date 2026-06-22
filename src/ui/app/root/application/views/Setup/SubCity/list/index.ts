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

import { ISetupSubCity, ISetupCampus } from '../../../../models';
import { SetupSubCityService, SetupCampusService } from '../../../../service';

import { SetupSubCityAddEdit } from '../add-edit';
import { SetupSubCityDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
// import { ISetupSubCity } from '../../../../models/Setup/SubCity';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'subCity-add-edit-model': SetupSubCityAddEdit,
        'delete-model': SetupSubCityDelete
    }
})

export class SetupSubCityList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupSubCityService;
    private data: Array<ISetupSubCity> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private campusModel: Array<ISetupCampus> = [];
    private repocampus: SetupCampusService;

    private columns = [ 
        // { key: 'code', caption: 'Code' }, 
        { key: 'name', caption: 'FullName' }, 
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupSubCityService(this.$store);
        this.repocampus = new SetupCampusService (this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getcampus();
    }
    getcampus() {
        this.campusModel = [];
        this.repocampus.GetFindBy('e => e.StatusId!=2')
            .then(response => this.campusModel = (response as Array<ISetupCampus>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupSubCity' in this.user.claims) == true) {
                if (this.user.claims['setupSubCity'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupSubCity'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupSubCity'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupSubCity'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupSubCity>));
    }

    insertModel () {
        this.$modal.show('subCity-add-edit-model', { model: {  subCityId: '', name: '', statusId: 0, loggerId: '',cityId:'' }, IsNewRecord: true });
    }

    editModel (model : ISetupSubCity) {
        this.$modal.show('subCity-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ISetupSubCity) {
        if(this.campusModel.filter(e => e.subCityId == model.subCityId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped (So cannot be deleted)",
                title: "Success",
                messageTypeId: PayloadMessageTypes.warning
              });
            // alert("This Parent Child Relation Cannot be Deleted");
        }
        else{
        this.$modal.show('delete-model', { model: model });
    }
}
}