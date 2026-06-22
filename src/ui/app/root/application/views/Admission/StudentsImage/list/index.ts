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

import { IAdmissionStudentsImage, IAdmissionStudentsImageVM } from '../../../../models';
import { AdmissionStudentsImageService } from '../../../../service';

import { AdmissionStudentsImageAddEdit } from '../add-edit';
import { AdmissionStudentsImageDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': AdmissionStudentsImageAddEdit,
        'delete-model': AdmissionStudentsImageDelete
    }
})

export class AdmissionStudentsImageList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: AdmissionStudentsImageService;
    private data: Array<IAdmissionStudentsImage> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [ 
        { key: 'fullName', caption: 'Student' }, 
        { key: 'image', caption: "Image" },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new AdmissionStudentsImageService(this.$store);
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
            if (('admissionStudentsImage' in this.user.claims) == true) {
                if (this.user.claims['admissionStudentsImage'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['admissionStudentsImage'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['admissionStudentsImage'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['admissionStudentsImage'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        if (this.data.length>0) {
        this.repository.GetAll()
            .then(response => this.data = (response as Array<IAdmissionStudentsImageVM>));
    }
    else {
        console.log("Error in RefreshData()");
    }
}

    insertModel () {
        this.$modal.show('add-edit-model', { model: { studentsImageId: '', studentId: '', image: '', statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : IAdmissionStudentsImage) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : IAdmissionStudentsImage) {
        this.$modal.show('delete-model', { model: model });
    }
}