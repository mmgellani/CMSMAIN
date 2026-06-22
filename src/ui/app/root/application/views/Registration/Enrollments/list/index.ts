/*
*   Author: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IRegistrationEnrollments } from '../../../../models';
import { RegistrationEnrollmentsService } from '../../../../service';

import { RegistrationEnrollmentsAddEdit } from '../add-edit';
import { RegistrationEnrollmentsDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': RegistrationEnrollmentsAddEdit,
        'delete-model': RegistrationEnrollmentsDelete
    }
})

export class RegistrationEnrollmentsList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: RegistrationEnrollmentsService;
    private data: Array<IRegistrationEnrollments> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    created() {
        this.repository = new RegistrationEnrollmentsService(this.$store);
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
            if (('registrationEnrollments' in this.user.claims) == true) {
                if (this.user.claims['registrationEnrollments'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['registrationEnrollments'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['registrationEnrollments'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['registrationEnrollments'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAll().then(response => this.data = (response as Array<IRegistrationEnrollments>));
    }

    insertModel () {
        this.$modal.show('add-edit-model', { model: { enrollmentId: '', admissionFormId: '', sectionCourseLinkId: [], statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : IRegistrationEnrollments) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : IRegistrationEnrollments) {
        this.$modal.show('delete-model', { model: model });
    }
}