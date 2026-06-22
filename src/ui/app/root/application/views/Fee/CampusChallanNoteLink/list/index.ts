/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IFeeCampusChallanNoteLink, IFeeCampusChallanNoteLinkVM } from '../../../../models';
import { FeeCampusChallanNoteLinkService } from '../../../../service';

import { FeeCampusChallanNoteLinkAddEdit } from '../add-edit';
import { FeeCampusChallanNoteLinkDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': FeeCampusChallanNoteLinkAddEdit,
        'delete-model': FeeCampusChallanNoteLinkDelete
    }
})

export class FeeCampusChallanNoteLinkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeCampusChallanNoteLinkService;
    private data: Array<IFeeCampusChallanNoteLinkVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [ 
        { key: 'campusName', caption: 'Campus' },
        { key: 'description', caption: 'ChallanNote' },
        { key: 'installmentNo', caption: 'InstallmentNo' }, 
        { key: 'fullName', caption: "ChallanType" },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new FeeCampusChallanNoteLinkService(this.$store);
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
            if (('feeCampusChallanNoteLink' in this.user.claims) == true) {
                if (this.user.claims['feeCampusChallanNoteLink'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeCampusChallanNoteLink'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeCampusChallanNoteLink'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeCampusChallanNoteLink'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAll()
            .then(response => this.data = (response as Array<IFeeCampusChallanNoteLinkVM>));
    }

    insertModel () {
        this.$modal.show('add-edit-model', { model: { campusChallanNoteLinkId: '', campusId: '', challanNoteId: '', installmentNo: 0, challanTypeId: '', statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : IFeeCampusChallanNoteLink) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : IFeeCampusChallanNoteLink) {
        this.$modal.show('delete-model', { model: model });
    }
}