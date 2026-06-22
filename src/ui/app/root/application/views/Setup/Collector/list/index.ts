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

import { ISetupCollector, ISetupCampus, ICampusCityVM, DDLGroupModel, DDLModel } from '../../../../models';
import { SetupCollectorService, SetupCampusService } from '../../../../service';
import { SetupCollectorAddEdit } from '../add-edit';
import { SetupCollectorDelete } from '../delete';
import { StoreTypes } from "../../../../../../store";

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupCollectorAddEdit,
        'delete-model': SetupCollectorDelete
    }
})

export class SetupCollectorList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupCollectorService;
    private data: Array<ISetupCollector> = [];
    private filterString: string = '';
    private campusId = ''
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private campusList: Array<ISetupCampus> = []
    private campusCityList: Array<ICampusCityVM> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []

    private columns = [
        { key: 'description', caption: 'Description' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    created() {
        this.repository = new SetupCollectorService(this.$store);
        // this.loadCampus();
        this.loadCityCampus();
        this.$watch('campusId', this.refreshData);
    }

    mounted() {
        this.validatePage();
    }
    loadCampus() {
        this.campusRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.campusList = r as Array<ISetupCampus>

            })
    }

    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupCollector' in this.user.claims) == true) {
                if (this.user.claims['setupCollector'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupCollector'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupCollector'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupCollector'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }


    refreshData() {
        this.data = [];
        if (this.campusId.length > 0) {
            this.repository.GetFindBy('e => e.CampusId.ToString() == "' + this.campusId + '"')
                .then(response => this.data = (response as Array<ISetupCollector>));
        }
    }

    insertModel() {
        if (this.campusId.length > 0) {
            this.$modal.show('add-edit-model', { model: { collectorId: '', description: '', campusId: this.campusId, statusId: 0, loggerId: '', }, IsNewRecord: true });
        } else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdown",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }



    }

    editModel(model: ISetupCollector) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupCollector) {
        this.$modal.show('delete-model', { model: model });
    }
}