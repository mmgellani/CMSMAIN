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

import { IExaminationCampusGradingPolicyLink } from '../../../../models';
import { ExaminationCampusGradingPolicyLinkService } from '../../../../service';

import { ExaminationCampusGradingPolicyLinkAddEdit } from '../add-edit';
import { ExaminationCampusGradingPolicyLinkDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': ExaminationCampusGradingPolicyLinkAddEdit,
        'delete-model': ExaminationCampusGradingPolicyLinkDelete
    }
})

export class ExaminationCampusGradingPolicyLinkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: ExaminationCampusGradingPolicyLinkService;
    private data: Array<IExaminationCampusGradingPolicyLink> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    created() {
        this.repository = new ExaminationCampusGradingPolicyLinkService(this.$store);
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
            if (('examinationCampusGradingPolicyLink' in this.user.claims) == true) {
                if (this.user.claims['examinationCampusGradingPolicyLink'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['examinationCampusGradingPolicyLink'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['examinationCampusGradingPolicyLink'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['examinationCampusGradingPolicyLink'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        if(this.data.length>0) { 
        this.repository.GetAll()
            .then(response => this.data = (response as Array<IExaminationCampusGradingPolicyLink>));
    }
    else {
        console.log("Error in RefreshData()");
    }
}

    insertModel () {
        this.$modal.show('add-edit-model', { model: { campusGradingPolicyLinkId: '', campusProgramLinkId: '', gradingPolicyId: '', statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : IExaminationCampusGradingPolicyLink) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : IExaminationCampusGradingPolicyLink) {
        this.$modal.show('delete-model', { model: model });
    }
}