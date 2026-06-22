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

import { ISetupClass, IRegistrationSectionCourseLinkVM } from '../../../../models';
import { SetupClassService, RegistrationSectionCourseLinkService } from '../../../../service';

import { SetupClassAddEdit } from '../add-edit';
import { SetupClassDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Class-add-edit-model': SetupClassAddEdit,
        'delete-model': SetupClassDelete
    }
})

export class SetupClassList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupClassService;
    private data: Array<ISetupClass> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private sectioncourseModel : Array<IRegistrationSectionCourseLinkVM>=[];
    private reposectioncourse: RegistrationSectionCourseLinkService;

    private columns = [ 
        { key: 'fullName', caption: 'Full Name' }, 
        { key: 'description', caption: "Description" },
        { key: 'classCode', caption: "Class Code" }, 
        { key: 'isAdmissionTest', caption: "Admission Test"  },
        { key: 'isInterview', caption: "Interview"  },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupClassService(this.$store);
        this.reposectioncourse = new RegistrationSectionCourseLinkService(this.$store);
    }
    

    mounted() {
        this.validatePage();
        this.refreshData();
        // this.getsectioncourse();
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
            if (('setupClass' in this.user.claims) == true) {
                if (this.user.claims['setupClass'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupClass'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupClass'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupClass'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindByEx('e => e.StatusId!=2')
            .then(response => this.data = (response as Array<ISetupClass>));
    }

    insertModel () {
        this.$modal.show('Class-add-edit-model', { model: { classId: '', fullName: '', description: '', classCode: '', isAdmissionTest: 0, isInterview: 0, statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : ISetupClass) {
        this.$modal.show('Class-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ISetupClass) {
        if (this.sectioncourseModel.filter(e => e.classId == model.classId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }
        else {
        this.$modal.show('delete-model', { model: model });
    }
}
}