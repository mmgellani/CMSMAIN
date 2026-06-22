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

import { SetupConcessionRemarksAddEdit } from '../add-edit';
import { SetupConcessionRemarksDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { SetupConcessionRemarksService } from '../../../../service/Setup/ConcessionRemarks';
import { ISetupConcessoinRemarks, IVWConcessionRemarksVM } from '../../../../models/Setup/ConcessionRemarks';
import { DDLGroupModel, DDLModel, ICampusCityVM } from '../../../../models';
import { SetupCampusService } from '../../../../service';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Concession-Remarks-add-edit-model': SetupConcessionRemarksAddEdit,
        'delete-model': SetupConcessionRemarksDelete
    }
})

export class SetupConcessionRemarksList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupConcessionRemarksService;
    private data: Array<IVWConcessionRemarksVM> = [];
    private filterString: string = '';


    private cityDDL: Array<DDLGroupModel> = [];
    private campusId: string = "";
    private campusddl: Array<DDLModel> = [];
    private campusCityList: Array<ICampusCityVM> = [];
    private campusRepo: SetupCampusService;

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'campusName', caption: "Campus Name" },
        { key: 'remarks', caption: "Remarks" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupConcessionRemarksService(this.$store);
        this.campusRepo = new SetupCampusService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.loadCityCampus();
        this.$watch('campusId', this.refreshData);
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
            if (('setupConcessionRemarks' in this.user.claims) == true) {
                if (this.user.claims['setupConcessionRemarks'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupConcessionRemarks'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupConcessionRemarks'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupConcessionRemarks'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        var key = this.campusId;
        this.repository.GetAllActiveEx(key)
            .then(response => this.data = (response as Array<IVWConcessionRemarksVM>));
    }

    insertModel() {

        if (this.campusId.length > 0) {
            this.$modal.show('Concession-Remarks-add-edit-model', { model: { concessionRemarksId: '', campusId: this.campusId, remarks: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdown",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }


    }

    editModel(model: ISetupConcessoinRemarks) {
        this.$modal.show('Concession-Remarks-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupConcessoinRemarks) {

        this.$modal.show('delete-model', { model: model });

    }
}