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

import { IELModelPapers } from '../../../../models';
import { ELModelPapersService } from '../../../../service';

import { ELModelPapersAddEdit } from '../add-edit';
import { ELModelPapersDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': ELModelPapersAddEdit,
        'delete-model': ELModelPapersDelete
    }
})

export class ELModelPapersList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: ELModelPapersService;
    private data: Array<IELModelPapers> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [ 
        { key: 'fullName', caption: 'FullName' },
        { key: 'totalMarks', caption: 'TotalMarks' },
        { key: 'correctCredit', caption: 'CorrectCredit' },
        { key: 'incorrectCredit', caption: 'IncorrectCredit' },
        { key: 'skippedCredit', caption: 'SkippedCredit' }, 
        { key: 'testTime', caption: "TestTime" },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new ELModelPapersService(this.$store);
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
            if (('elModelPapers' in this.user.claims) == true) {
                if (this.user.claims['elModelPapers'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['elModelPapers'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['elModelPapers'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['elModelPapers'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('s=>s.StatusId==1')
            .then(response => this.data = (response as Array<IELModelPapers>));
    }

    insertModel () {
        this.$modal.show('add-edit-model', { model: { modelPaperId: '', fullName: '', totalMarks: 0, correctCredit: 0, incorrectCredit: 0, skippedCredit: 0, testTime: 0, isActive: 0,  }, IsNewRecord: true });
    }

    editModel (model : IELModelPapers) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : IELModelPapers) {
        this.$modal.show('delete-model', { model: model });
    }
}