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

import { IFeeChallanNote, IFeeCampusChallanNoteLinkVM } from '../../../../models';
import { FeeChallanNoteService, FeeCampusChallanNoteLinkService } from '../../../../service';

import { FeeChallanNoteAddEdit } from '../add-edit';
import { FeeChallanNoteDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'ChallanNote-add-edit-model': FeeChallanNoteAddEdit,
        'delete-model': FeeChallanNoteDelete
    }
})

export class FeeChallanNoteList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeChallanNoteService;
    private data: Array<IFeeChallanNote> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private campuschallannotelinkModel: Array<IFeeCampusChallanNoteLinkVM> = [];
    private repocampuschallan: FeeCampusChallanNoteLinkService;

    private columns = [ 
        { key: 'fullName', caption: 'FullName' }, 
        { key: 'description', caption: "Description" },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new FeeChallanNoteService(this.$store);
        this.repocampuschallan = new FeeCampusChallanNoteLinkService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        // this.getcampuschallannotelink();
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
            if (('feeChallanNote' in this.user.claims) == true) {
                if (this.user.claims['feeChallanNote'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeChallanNote'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeChallanNote'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeChallanNote'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<IFeeChallanNote>));
    }

    insertModel () {
        this.$modal.show('ChallanNote-add-edit-model', { model: { challanNoteId: '', description: '', statusId: 0, loggerId: '', fullName: '',  }, IsNewRecord: true });
    }

    editModel (model : IFeeChallanNote) {
        this.$modal.show('ChallanNote-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : IFeeChallanNote) {
        if (this.campuschallannotelinkModel.filter(e => e.challanNoteId == model.challanNoteId).length > 0) {
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