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

import { IStaffCourse, IHumanResourceStaff, IRegistrationCourse, IProfileStaff, StaffCourseVM } from '../../../../models';
import { StaffCourseService, HumanResourceStaffService, RegistrationCourseService, SetupCampusBuildingLinkService } from '../../../../service';

import { StaffCourseAddEdit } from '../add-edit';
import { StaffCourseDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { ISetupCampusBuildingLinkVM } from '../../../../models/Setup/CampusBuildingLinkVM';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'staffCourse-add-edit-model': StaffCourseAddEdit,
        'delete-model': StaffCourseDelete
    }
})

export class StaffCourseList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: StaffCourseService;
    private data: Array<StaffCourseVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private staffModel: Array<IHumanResourceStaff> = [];
    //private repoStaff: HumanResourceStaffService;

    private repoCourse: RegistrationCourseService = new RegistrationCourseService(this.$store)
    private repoCampusBuilding: SetupCampusBuildingLinkService = new SetupCampusBuildingLinkService(this.$store)
    private courseList: IRegistrationCourse[] = []
    private campusbuildingList: ISetupCampusBuildingLinkVM[] = []

    private repoStaff: HumanResourceStaffService = new HumanResourceStaffService(this.$store)
    private staffList: IHumanResourceStaff[] = []

    private columns = [
        { key: 'campusName', caption: 'Campus' },
        { key: 'buildingName', caption: "Building" },
        { key: 'course', caption: "Course" },
        { key: 'isPrimary', caption: "Primary Status" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];
    campusBuildingId = ''
    courseId = ''
    staffId = ''
    created() {
        this.repository = new StaffCourseService(this.$store);
        this.repoStaff = new HumanResourceStaffService(this.$store);
        // this.loadCourse();
        // this.loadCampusBuilding();
        this.loadStaff();
    }

    mounted() {
        this.validatePage();
        this.refreshData();

    }
    loadCourse() {
        this.courseList = []
        this.repoCourse.GetFindBy('s=>s.StatusId!=2')
            .then(r => {
                this.courseList = r as IRegistrationCourse[]
            })
    }
    loadStaff() {
        this.staffList = []
        this.repoStaff.GetFindBy('s=>s.StatusId!=2')
            .then(r => {
                this.staffList = r as IHumanResourceStaff[]
            })
    }
    loadCampusBuilding() {
        this.campusbuildingList = []
        this.repoCampusBuilding.GetAllActive()
            .then(r => {
                this.campusbuildingList = r as ISetupCampusBuildingLinkVM[]
            })
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('StaffCourse' in this.user.claims) == true) {
                if (this.user.claims['StaffCourse'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['StaffCourse'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['StaffCourse'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['StaffCourse'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        if (this.staffId.length > 0) {
            this.repository.GetFindByVM(this.staffId)
                .then(response => this.data = (response as Array<StaffCourseVM>));
        }

    }

    insertModel() {
        console.log(this.staffId+' insin')

        if (this.staffId.length > 0) {
            console.log('insin')
            this.$modal.show('staffCourse-add-edit-model', { model: { staffId: this.staffId, campusBuildingId: '', courseId: '', isPrimary: false, statusId: 0, staffCourseId: '', }, IsNewRecord: true });

        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select dropdown",
                title: "Warning",
                messageTypeId: PayloadMessageTypes.warning
            });
        }
    }

    editModel(model: IStaffCourse) {
        this.$modal.show('staffCourse-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IStaffCourse) {
        // if (this.staffModel.filter(e => e.designationId == model.designationId).length > 0) {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: "This Parent Child Relation Cannot be Deleted",
        //         title: "Success",
        //         messageTypeId: PayloadMessageTypes.success
        //     });
        // }else{
        this.$modal.show('delete-model-staffCourse', { model: model });
        // }
    }
}