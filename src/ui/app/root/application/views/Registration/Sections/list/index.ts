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

import { IRegistrationSections, IRegistrationProgramCourseLink, IRegistrationSectionCourseLinkVM } from '../../../../models';
import { RegistrationSectionsService, RegistrationSectionCourseLinkService } from '../../../../service';

import { RegistrationSectionsAddEdit } from '../add-edit';
import { RegistrationSectionsDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': RegistrationSectionsAddEdit,
        'delete-model': RegistrationSectionsDelete
    }
})

export class RegistrationSectionsList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: RegistrationSectionsService;
    private data: Array<IRegistrationSections> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private sectioncourseModel : Array<IRegistrationSectionCourseLinkVM>=[];
    private reposectioncourse: RegistrationSectionCourseLinkService;

    created() {
        this.repository = new RegistrationSectionsService(this.$store);
        this.reposectioncourse = new RegistrationSectionCourseLinkService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getsectioncourse();
    }
    getsectioncourse() {
        this.sectioncourseModel = [];
        this.reposectioncourse.GetFindBy('e => e.StatusId!=2')
            .then(response => this.sectioncourseModel = (response as Array<IRegistrationSectionCourseLinkVM>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('registrationSections' in this.user.claims) == true) {
                if (this.user.claims['registrationSections'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['registrationSections'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['registrationSections'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['registrationSections'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<IRegistrationSections>));
    }

    insertModel () {
        this.$modal.show('add-edit-model', { model: { sectionId: '', fullName: '', statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : IRegistrationSections) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : IRegistrationSections) {
        if (this.sectioncourseModel.filter(e => e.sectionId == model.sectionId).length > 0) {
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