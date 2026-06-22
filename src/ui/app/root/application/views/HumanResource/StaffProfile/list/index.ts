/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';
import Vue from 'vue';
import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { IUser } from '../../../../../../model';
import { State } from 'vuex-class';
import { ITeacherProfileList } from '../../../../models';
import { HumanResourceStaffService } from '../../../../service';
import { HumanResourceStaffProfileAddEdit } from '../add-edit';

@Component({

    name: 'Staff-Profile',
    template: require('./index.html'),
    components: {
        'add-edit': HumanResourceStaffProfileAddEdit
    }
})
export class HumanResourceStaffProfile extends Vue {

    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: HumanResourceStaffService;
    private data: Array<ITeacherProfileList> = [];
    private filterString: string = '';
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;




    private columns = [
        { key: 'teacherName', caption: 'Teacher Name' },
        { key: 'email', caption: 'Email' },
        { key: 'action', caption: 'Action', width: 120 }
    ];



    created() {
        this.repository = new HumanResourceStaffService(this.$store);
    }

    mounted() {
        this.validatePage();
    }

    getTeacherProfile() {
        this.data = [];
        this.repository.GetTeacherProfile(this.filterString + "?" + this.user.userId + "?")
            .then(response => this.data = (response as Array<ITeacherProfileList>
            )
            );

    }
    
    // editModel(model: IVWStudentsProfileEx) {
    //     var classname=this.classList.find(e=>e.classId==this.classId).fullName;
    //     this.$modal.show('add-edit-model', { model: model, IsNewRecord: false,CLASSID:this.classId,CLASSNAME:classname});
    // }

    getAddress(item) {
        var k = JSON.parse(item);

        return k;


    }

    editModel(model: ITeacherProfileList) {
        this.$modal.show('add-edit', { model: model, IsNewRecord: false });
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('humanResourceStaffProfile' in this.user.claims) == true) {
                if (this.user.claims['humanResourceStaffProfile'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['humanResourceStaffProfile'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['humanResourceStaffProfile'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['humanResourceStaffProfile'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }
    getPhone(item) {
        return JSON.parse(item);
    }

}



