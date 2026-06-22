/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { HumanResourceDepartmentsService, HumanResourceDesignationsService, HumanResourceStaffService, SetupBloodGroupService, SetupCityService, SetupCountryService, SetupGenderService, SetupReligionService, SetupSubCityService, StaffCourseService } from '../../../../service';
import { IHumanResourceDepartments, IHumanResourceDesignations, IHumanResourceStaff, ISetupBloodGroup, ISetupCity, ISetupCountry, ISetupGender, ISetupReligion, ISetupSubCity, IStaffCourse, IStaffCourseDeptVM, ITeacherProfileList } from '../../../../models';
import { ISignupOptions, IUser } from '../../../../../../model';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { email, maxLength, required } from 'vuelidate/lib/validators';

import { AuthenticationService } from '../../../../../../services';
import Component from 'vue-class-component';
import { DrawerArea } from "../../../../../../components/drawer"
import { HumanResourceDepartmentsAddEdit } from '../../Departments/add-edit';
import { HumanResourceDesignationsAddEdit } from '../../Designations/add-edit';
import { IRootStoreState } from '../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

@Component({
    mixins: [validationMixin],
    name: 'add-edit',
    template: require('./index.html'),
})
export class HumanResourceStaffProfileAddEdit extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private Religionrepository: SetupReligionService;
    private data: ITeacherProfileList = {
        newID: '',
        teacherId: '',
        teacherName: '',
        email: '',
        cNIC: '',
        contactNo: '""',
        department: '',
        designation: '',
        cityName: '',
        subCity: ''
    };
    created() {
        this.Religionrepository = new SetupReligionService(this.$store);

    }

    private IsNewRecord: boolean = true;
    private title: string = "";

    beforeModalOpen(event) {

        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
        Object.assign(this.data, event.params.model);
        // alert(JSON.stringify(this.data))
        console.log(this.data)
    }

    getPhone(item) {
        return JSON.parse(item);
    }

    cancel() {
        this.$modal.hide('add-edit');
        this.$emit("submit");

    }

    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}


