/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';


import { SeatingPlanDateSheetService } from '../../../../service';
import { ISeatingPlanDateSheet, SeatingPlanDateSheetVM } from '../../../../models/Seating Plan/datesheet';
import { IUser } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';
import { DateSheetAddEdit } from '../add-edit';
import { SetupDateSheetDelete } from '../delete';



@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'datesheet-add-edit-model': DateSheetAddEdit,
        'delete-model': SetupDateSheetDelete
    }
})

export class seatingPlanDateSheetList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SeatingPlanDateSheetService;
    private data: Array<SeatingPlanDateSheetVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [
        { key: 'examName', caption: 'Exam' },
        { key: 'roomName', caption: "Room" },
        { key: 'buildingName', caption: "Building" },
        { key: 'statusId', caption: "Status" },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SeatingPlanDateSheetService(this.$store);
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
            if (('seatingPlanDateSheetList' in this.user.claims) == true) {
                if (this.user.claims['seatingPlanDateSheetList'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['seatingPlanDateSheetList'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['seatingPlanDateSheetList'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['seatingPlanDateSheetList'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAllDateSheetVM()
            .then(response => this.data = (response as Array<SeatingPlanDateSheetVM>));
    }

    insertModel() {

        this.$modal.show('datesheet-add-edit-model', { model: { dateSheetId: '', campusProgramId: '', examName: '', roomBuildingLinkId: '', statusId: 0 }, IsNewRecord: true });
    }

    editModel(model: SeatingPlanDateSheetVM) {



        this.$modal.show('datesheet-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: SeatingPlanDateSheetVM) {
        this.$modal.show('delete-model', { model: model });
    }
}