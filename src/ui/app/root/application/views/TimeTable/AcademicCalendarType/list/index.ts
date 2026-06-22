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

import { RegistrationSectionCourseLinkService } from '../../../../service';

import { AcademicCalendarTypeAddEdit } from '../add-edit';
import { AcademicCalendarTypeDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { AcademicCalendarTypeService } from '../../../../service/AcademicCalendar/AcademicCalendarType';
import { IAcademicCalendarType } from '../../../../models/academiccalendar/academicCalendarType';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': AcademicCalendarTypeAddEdit,
        'delete-model': AcademicCalendarTypeDelete
    }
})

export class AcademicCalendarType extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private data: Array<IAcademicCalendarType> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private reposectioncourse: RegistrationSectionCourseLinkService;
    private repository: AcademicCalendarTypeService = new AcademicCalendarTypeService(this.$store);

    private columns = [
        { key: 'fullName', caption: 'Full Name' },
        { key: 'code', caption: "Code" },
        { key: 'isHoliday', caption: "Holiday" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.reposectioncourse = new RegistrationSectionCourseLinkService(this.$store);
    }


    mounted() {
        this.validatePage();
        this.refreshData();
        // this.getsectioncourse();
    }
    // getsectioncourse() {
    //     this.sectioncourseModel = [];
    //     this.reposectioncourse.GetFindBy('e => e.StatusId!=2')
    //         .then(response => this.sectioncourseModel = (response as Array<IRegistrationSectionCourseLinkVM>));
    // }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('academicCalendarType' in this.user.claims) == true) {
                if (this.user.claims['academicCalendarType'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['academicCalendarType'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['academicCalendarType'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['academicCalendarType'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<IAcademicCalendarType>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { academicCalendarTypeId: '', fullName: '', code: '', statusId: 0, isHoliday: true, }, IsNewRecord: true });
    }

    editModel(model: IAcademicCalendarType) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IAcademicCalendarType) {
        this.$modal.show('delete-model', { model: model });

    }
}