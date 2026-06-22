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

import { IFeeChallanType, ISetupCampus, IFeeCampusChallanNoteLinkVM, IFeeConcessionVM } from '../../../../models';
import { FeeChallanTypeService, SetupCampusService, FeeCampusChallanNoteLinkService, FeeConcessionService } from '../../../../service';

import { FeeChallanTypeAddEdit } from '../add-edit';
import { FeeChallanTypeDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'ChallanType-add-edit-model': FeeChallanTypeAddEdit,
        'delete-model': FeeChallanTypeDelete
    }
})

export class FeeChallanTypeList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeChallanTypeService;
    private data: Array<IFeeChallanType> = [];
    private filterString: string = '';

    private campusId = ''
    private sessionId = ''


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private campuschallannotelinkModel: Array<IFeeCampusChallanNoteLinkVM> = [];
    private repocampuschallan: FeeCampusChallanNoteLinkService;
    private concessionModel: Array<IFeeConcessionVM>= [];
    private repoconcession:FeeConcessionService;

    private columns = [ 
        { key: 'fullName', caption: 'FullName' }, 
        { key: 'code', caption: "Code" },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new FeeChallanTypeService(this.$store);
        this.repocampuschallan = new FeeCampusChallanNoteLinkService(this.$store);
        this.repoconcession = new FeeConcessionService(this.$store);
       
    }
   
    mounted() {
        this.validatePage();
        this.refreshData();
        // this.getcampuschallannotelink();
        // this.getconcession();
    }
    getconcession() {
        this.concessionModel = [];
        this.repoconcession.GetFindBy('e => e.StatusId!=2')
            .then(response => this.concessionModel = (response as Array<IFeeConcessionVM>));
    }

    getcampuschallannotelink() {
        this.campuschallannotelinkModel = [];
        this.repocampuschallan.GetFindBy('e => e.StatusId!=2')
            .then(response => this.campuschallannotelinkModel = (response as Array<IFeeCampusChallanNoteLinkVM>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('feeChallanType' in this.user.claims) == true) {
                if (this.user.claims['feeChallanType'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeChallanType'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeChallanType'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeChallanType'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<IFeeChallanType>));
    }

    insertModel() {
        this.$modal.show('ChallanType-add-edit-model', { model: { challanTypeId: '', code: '', fullName: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: IFeeChallanType) {
        this.$modal.show('ChallanType-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IFeeChallanType) {
        if (this.campuschallannotelinkModel.filter(e => e.challanTypeId == model.challanTypeId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
              });
        }
        else if (this.concessionModel.filter(e => e.challanTypeId == model.challanTypeId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
              });
        }

        else{
        this.$modal.show('delete-model', { model: model });
    }
}
}