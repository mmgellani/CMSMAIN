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

import { ISetupSection, IRegistrationSectionCourseLink } from '../../../../models';
import { SetupSectionService, RegistrationSectionCourseLinkService } from '../../../../service';

import { SetupSectionAddEdit } from '../add-edit';
import { SetupSectionDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Section-add-edit-model': SetupSectionAddEdit,
        'delete-model': SetupSectionDelete
    }
})

export class SetupSectionList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupSectionService;
    private data: Array<ISetupSection> = [];
    private filterString: string = '';
    private dataEx: Array<IRegistrationSectionCourseLink> = [];
    private sectionRepo: RegistrationSectionCourseLinkService;

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'description', caption: "Description" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupSectionService(this.$store);
        this.sectionRepo = new RegistrationSectionCourseLinkService(this.$store);
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
            if (('setupSection' in this.user.claims) == true) {
                if (this.user.claims['setupSection'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupSection'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupSection'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupSection'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    loadSectionCourseLink() {
        this.dataEx = [];
        this.sectionRepo.GetFindBy('e => e.StatusId!=2')
            .then(r => {
                r = this.dataEx as Array<IRegistrationSectionCourseLink>
            });
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e => e.StatusId!=2')
            .then(response => this.data = (response as Array<ISetupSection>));
    }

    insertModel() {
        this.$modal.show('Section-add-edit-model', { model: { sectionId: '', fullName: '', description: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupSection) {
        this.$modal.show('Section-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupSection) {
        this.dataEx = [];
        this.sectionRepo.GetFindBy('e => e.StatusId!=2')
            .then(r => {
                this.dataEx = (r as Array<IRegistrationSectionCourseLink>)
                var parentData = 0;
                parentData = this.dataEx.filter(e => e.sectionId == model.sectionId).length
                if (parentData > 0) {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: "This Parent Child Relation Cannot be Deleted",
                        title: "Warning",
                        messageTypeId: PayloadMessageTypes.warning
                    });
                }
                else {
                    this.$modal.show('delete-model', { model: model });
                }
            });

    }
}