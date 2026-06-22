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

import { ISetupShift, ISetupProgramDetails, IFeeConcessionVM, IFeeScholarshipCriteriaVM } from '../../../../models';
import { SetupShiftService, SetupProgramDetailsService, FeeConcessionService, FeeScholarshipCriteriaService, TimeTableSlotsService } from '../../../../service';

import { SetupShiftAddEdit } from '../add-edit';
import { SetupShiftDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { ITimeTableSlotsVM } from '../../../../models/TimeTable/SlotsVM';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Shift-add-edit-model': SetupShiftAddEdit,
        'delete-model': SetupShiftDelete
    }
})

export class SetupShiftList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupShiftService;
    private data: Array<ISetupShift> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private programDetailsModel: Array<ISetupProgramDetails> = [];
    private repositoryProgramDetails: SetupProgramDetailsService;
    private concessionModel: Array<IFeeConcessionVM> = [];
    private repoconcession: FeeConcessionService;
    private scholarshipCriteriaModel: Array<IFeeScholarshipCriteriaVM> = [];
    private repositoryScholarshipCriteria: FeeScholarshipCriteriaService;
    private slotsModel: Array<ITimeTableSlotsVM> = [];
    private repositorySlots: TimeTableSlotsService;

    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'code', caption: "Code" },
        { key: 'description', caption: "Description" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupShiftService(this.$store);
        this.repositoryProgramDetails = new SetupProgramDetailsService(this.$store);
        this.repoconcession = new FeeConcessionService(this.$store);
        this.repositoryScholarshipCriteria = new FeeScholarshipCriteriaService(this.$store);
        this.repositorySlots = new TimeTableSlotsService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getProgramDetails();
        this.getconcession();
        this.getScholarshipCriteria();
        this.getSlots();
    }

    getconcession() {
        this.concessionModel = [];
        this.repoconcession.GetFindBy('e => e.StatusId!=2')
            .then(response => this.concessionModel = (response as Array<IFeeConcessionVM>));
    }

    getProgramDetails() {
        this.programDetailsModel = [];
        this.repositoryProgramDetails.GetFindBy('e => e.StatusId!=2')
            .then(response => this.programDetailsModel = (response as Array<ISetupProgramDetails>));
    }

    getScholarshipCriteria() {
        this.scholarshipCriteriaModel = [];
        this.repositoryScholarshipCriteria.GetFindBy('e => e.StatusId!=2')
            .then(response => this.scholarshipCriteriaModel = (response as Array<IFeeScholarshipCriteriaVM>));
    }

    getSlots() {
        this.slotsModel = [];
        this.repositorySlots.GetFindBy('e => e.StatusId!=2')
            .then(response => this.slotsModel = (response as Array<ITimeTableSlotsVM>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupShift' in this.user.claims) == true) {
                if (this.user.claims['setupShift'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupShift'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupShift'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupShift'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupShift>));
    }

    insertModel() {
        this.$modal.show('Shift-add-edit-model', { model: { shiftId: '', fullName: '', code: '', description: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupShift) {
        this.$modal.show('Shift-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupShift) {
        if (this.programDetailsModel.filter(e => e.shiftId == model.shiftId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped (So cannot be deleted)",
                title: "Success",
                messageTypeId: PayloadMessageTypes.warning
            });
        }
        else if (this.concessionModel.filter(e => e.shiftId == model.shiftId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped (So cannot be deleted)",
                title: "Success",
                messageTypeId: PayloadMessageTypes.warning
            });
        }
        else if (this.scholarshipCriteriaModel.filter(e => e.shiftId == model.shiftId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped (So cannot be deleted)",
                title: "Success",
                messageTypeId: PayloadMessageTypes.warning
            });
        }

        else if (this.slotsModel.filter(e => e.shiftId == model.shiftId).length > 0) {
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