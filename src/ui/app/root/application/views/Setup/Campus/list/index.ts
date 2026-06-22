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

import { ISetupCampus, ISetupCampusBuildingLink, IFeeCampusBankLink, IFeeCampusChallanNoteLinkVM, IFeeChallanValidity, ITimeTableSlots, ISetupCampusProgramLink } from '../../../../models';
import { SetupCampusService, SetupCampusBuildingLinkService, FeeCampusBankLinkService, FeeCampusChallanNoteLinkService, FeeChallanValidityService, TimeTableSlotsService, SetupCampusProgramLinkService, TransportationVehicleInfoService } from '../../../../service';

import { SetupCampusAddEdit } from '../add-edit';
import { SetupCampusDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { ITimeTableSlotsVM } from '../../../../models/TimeTable/SlotsVM';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Campus-add-edit-model': SetupCampusAddEdit,
        'delete-model': SetupCampusDelete
    }
})

export class SetupCampusList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupCampusService;
    private data: Array<ISetupCampus> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private campusbuildinglinkModel: Array<ISetupCampusBuildingLink> = [];
    private repocampusbldlink: SetupCampusBuildingLinkService;
    private campusbankModel: Array<IFeeCampusBankLink> = [];
    private repocampusbank: FeeCampusBankLinkService;
    private campuschallannotelinkModel: Array<IFeeCampusChallanNoteLinkVM> = [];
    private repocampuschallan: FeeCampusChallanNoteLinkService;
    private challanvalidityModel: Array<IFeeChallanValidity> = [];
    private repochallan: FeeChallanValidityService;
    private CampusProgramlinkser: SetupCampusProgramLinkService = null;
    private slotsModel: Array<ITimeTableSlotsVM> = [];
    private campusprogramlis: Array<ISetupCampusProgramLink> = [];
    private repositorySlots: TimeTableSlotsService;

    private columns = [
        { key: 'fullName', caption: 'Full Name' },
        { key: 'code', caption: "Code" },
        { key: 'description', caption: "Description" },
        { key: 'digitCode', caption: "Digit Code" },
        { key: 'logo', caption: "Logo" },
        { key: 'emailPrefix', caption: 'Email Prefix' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupCampusService(this.$store);
        this.repocampusbldlink = new SetupCampusBuildingLinkService(this.$store);
        this.repocampusbank = new FeeCampusBankLinkService(this.$store);
        this.repocampuschallan = new FeeCampusChallanNoteLinkService(this.$store);
        this.repochallan = new FeeChallanValidityService(this.$store);
        this.repositorySlots = new TimeTableSlotsService(this.$store);
        this.CampusProgramlinkser = new SetupCampusProgramLinkService(this.$store);
        this.refreshData();

    }

    mounted() {
        this.validatePage();
        // this.refreshData();
        // this.getcampusbuildinglink();
        // this.getcampusbank();
        // this.getcampuschallannotelink();
        // this.getchallanvalidity();
        // this.getSlots();
    }

    getchallanvalidity() {
        this.challanvalidityModel = [];
        this.repochallan.GetFindBy('e => e.StatusId!=2')
            .then(response => this.challanvalidityModel = (response as Array<IFeeChallanValidity>));
    }

    getcampuschallannotelink() {
        this.campuschallannotelinkModel = [];
        this.repocampuschallan.GetFindBy('e => e.StatusId!=2')
            .then(response => this.campuschallannotelinkModel = (response as Array<IFeeCampusChallanNoteLinkVM>));
    }

    getcampusbank() {
        this.campusbankModel = [];
        this.repocampusbank.GetFindBy('e => e.StatusId!=2')
            .then(response => this.campusbankModel = (response as Array<IFeeCampusBankLink>));
    }

    getcampusbuildinglink() {
        this.campusbuildinglinkModel = [];
        this.repocampusbldlink.GetFindBy('e => e.StatusId!=2')
            .then(response => this.campusbuildinglinkModel = (response as Array<ISetupCampusBuildingLink>));
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
            if (('setupCampus' in this.user.claims) == true) {
                if (this.user.claims['setupCampus'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupCampus'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupCampus'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupCampus'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupCampus>));
    }

    insertModel() {
        this.$modal.show('Campus-add-edit-model', { model: { campusId: '', fullName: '', code: '', franchiseId: '', description: '', addressId: '', institutionId: '', digitCode: '', subCityId: '', statusId: 0, logo: '', loggerId: '', customerCode: '', smsApId: '',isEbook:false }, IsNewRecord: true });
    }

    editModel(model: ISetupCampus) {

        this.$modal.show('Campus-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupCampus) {

        if (this.campusbuildinglinkModel.filter(e => e.campusId == model.campusId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }

        else if (this.campusbankModel.filter(e => e.campusId == model.campusId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }

        else if (this.campuschallannotelinkModel.filter(e => e.campusId == model.campusId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }

        // this.CampusProgramlinkser.GetFindBy('e=> e.campusId' + this.campusId).then(r=>
        //     {
        //         this.campusprogramlis=r as Array<ISetupCampusProgramLink>
        //     })

        // else if (this.challanvalidityModel.filter(e => e.campusId == model.campusId).length > 0) {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: "This Parent Child Relation Cannot be Deleted",
        //         title: "Success",
        //         messageTypeId: PayloadMessageTypes.success
        //     });
        // }

        // else if (this.slotsModel.filter(e => e.campusId == model.campusId).length > 0) {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: "This Parent Child Relation Cannot be Deleted",
        //         title: "Success",
        //         messageTypeId: PayloadMessageTypes.success
        //     });
        // }

        else {
            this.$modal.show('delete-model', { model: model });
        }
    }
}