/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IRegistrationCourse, IStaffCourse } from '../../../../models';
import { RegistrationCourseService, SetupCampusBuildingLinkService, StaffCourseService } from '../../../../service';

import * as helper from '../../../../helper';
import { ISetupCampusBuildingLinkVMEx } from '../../../../models/Setup/CampusBuildingLinkVM';

type ValidateStaffCourse = { data: IStaffCourse, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateStaffCourse> = {
    data: {
        courseId: { required },
        campusBuildingId: { required },
        // category: { required },
        // statusId: { required },
        // loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'staffCourse-add-edit-model',
    template: require('./index.html')
})
export class StaffCourseAddEdit extends Vue {
    private repository: StaffCourseService;
    private isActive: boolean = true;
    private data: IStaffCourse = { staffId: '', campusBuildingId: '', courseId: '', isPrimary: false, statusId: 0, staffCourseId: '', }
    private IsNewRecord: boolean = true;
    private title: string = '';
    private repoCourse: RegistrationCourseService = new RegistrationCourseService(this.$store)
    private repoCampusBuilding: SetupCampusBuildingLinkService = new SetupCampusBuildingLinkService(this.$store)
    private courseList: IRegistrationCourse[] = []
    private campusbuildingList: ISetupCampusBuildingLinkVMEx[] = []
    created() {
        this.repository = new StaffCourseService(this.$store);
    }

    beforeModalOpen(event) {
        this.loadCampusBuilding();
        this.loadCourse();
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else {
            this.isActive = false;
        }
    }
    loadCourse() {
        this.courseList = []
        this.repoCourse.GetFindBy('s=>s.StatusId!=2')
            .then(r => {
                this.courseList = r as IRegistrationCourse[]
            })
    }

    loadCampusBuilding() {
        this.campusbuildingList = []
        this.repoCampusBuilding.GetAllActiveEx()
            .then(r => {
                this.campusbuildingList = r as ISetupCampusBuildingLinkVMEx[]
            })
    }
    cancel() {
        this.$modal.hide('staffCourse-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.staffCourseId = helper.newGuid();
                this.data.statusId = 1;
                //this.data.loggerId = helper.newGuid();
                this.repository.AddOne(this.data)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been inserted successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });
            } else {
                if (this.isActive == true) {
                    this.data.statusId = 1;
                }
                else {
                    this.data.statusId = 0;
                }
                this.repository.Update(this.data)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been updated successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });
            }
            this.cancel();
        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}