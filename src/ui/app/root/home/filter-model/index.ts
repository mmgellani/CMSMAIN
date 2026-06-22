/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../src/ui/app/store/index';
import { PayloadMessageTypes } from '../../../../../../src/ui/app/model/index';
import { RegistrationCourseService, RolePrevilagesService, SetupCampusProgramLinkService, SetupCityService, SetupClassService, SetupSessionService } from '../../application/service';
import { IOperation, IRegistrationCourse, ISetupCity, ISetupClass, ISetupSession, TodoList, VWCampusProgramLevel, VWProgramLevel } from '../../application/models';

import * as helper from '../../../../app/root/application/helper/index';



// type ValidateToDoList = { data: TodoList, validationGroup: string[] };
let customValidation: ValidationRuleset<any> = {
    // sessionId: { required },
    // cityId: { required },
    // levelName: { required },
    // programId: { required },
    // programDetailId: { required },
    // fromDateEx: { required },
    // toDateEx: { required },
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'toDoList-add-edit-model',
    template: require('./index.html')
})
export class FilterModel extends Vue {
    private repository: RegistrationCourseService;
    isActive: boolean = true;
    private IsNewRecord: boolean = true;
    private title: string = '';
    private roleDasboardId: string = '';
    private userId: string = '';
    private cityList: Array<ISetupCity> = []
    private cityId = '';
    private classId = '';
    private sessionList: Array<ISetupSession> = [];
    private operationlist: Array<IOperation> = [];
    private cityIdEx = '';
    private LevelList = []
    private fromDate = new Date(new Date().setDate(new Date().getDate() - 20));
    private toDate = new Date();
    private fromDateEx = new Date(new Date().setDate(new Date().getDate() - 7));
    private toDateEx = new Date();
    private levelName = '';
    private programDetailId = '';
    private sessionId: string = '';
    private programDetailIdEx = '';
    private classList: Array<ISetupClass> = [];
    private programId = '';
    private viewCities: boolean = false;
    private campusProgramLinkList: Array<VWCampusProgramLevel> = [];
    private ProgramLinkList: Array<VWProgramLevel> = [];
    private currDate: Date = new Date();
    private rolePrivilagesRepo: RolePrevilagesService = null;
    // this.repositorySession = new SetupSessionService(this.$store);
    private repositorySession: SetupSessionService = new SetupSessionService(this.$store)
    private cityRepo: SetupCityService = new SetupCityService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store);
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store);


    created() {
        this.repository = new RegistrationCourseService(this.$store);
        this.rolePrivilagesRepo = new RolePrevilagesService(this.$store);
        this.getSession();
        this.loadCity();
        // this.loadPrograms();
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.roleDasboardId = event.params.roleDasboardId;
        this.userId = event.params.userId;
        this.LevelList = [{ levelName: "Intermediate" }, { levelName: "Graduation" }]
    }
    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }
    loadProgramsOfCampus() {
        if (this.programId.length > 0) {
            // this.ddl = [];
            // this.programDDL = [];
            // let oldObj: VWCampusProgramCity;
            var key = this.programId;
            this.campusProgramLinkRepo.GetLevelProgram(key).then(r => {
                this.campusProgramLinkList = r as Array<VWCampusProgramLevel>;
            });
        }
    }

    loadPrograms() {
        if (this.levelName.length > 0) {
            // this.ddl = [];
            // this.programDDL = [];
            // let oldObj: VWCampusProgramCity;
            var key = this.levelName;
            this.campusProgramLinkRepo.GetLevel(key).then(r => {
                this.ProgramLinkList = r as Array<VWProgramLevel>;
            });
        }
    }

    loadCity() {
        this.cityRepo.GetAllEx()
            .then(r => {
                this.cityList = r as Array<ISetupCity>

                // console.log(JSON.stringify(this.cityList))
                // console.log(this.cityList.length)

                // const items = [1, 2, 3, 4, 5]

                // var allcity = { cityId: "00000000-0000-0000-0000-000000000000", fullName: "All", cityCode: "582", statusId: 1, loggerId: "629e9e0b-6214-4959-9084-dc8d48f076c3", provinceId: "7138babf-2549-4106-8499-ef23cdd03ff2", zoneId: "f260b0cd-8767-410f-b8cb-ee1a481928d7" };

                // const insert = (arr, index, newItem) => [
                //   ...arr.slice(0, index),
                //   newItem,
                //   ...arr.slice(index)
                // ]

                // const result = insert(this.cityList, 0, allcity)


                // this.cityList = result;

            })
    }
    getSession() {
        this.sessionList = [];
        this.repositorySession
            .GetFindBy("e => e.StatusId == 1")
            .then(
                response => {
                    this.sessionList = response as Array<ISetupSession>
                    this.sessionList.sort((a: any, b: any) => b.fullName - a.fullName);
                    // this.sessionId = this.sessionList[0].sessionId;
                    this.sessionId = this.sessionList.find(e => e.fullName == '2021').sessionId;
                    //   this.refreshData();
                }
            );
    }
    cancel() {
        this.$modal.hide('filter-model');
        this.$emit("submit");
        this.clear();

    }
    clear() {
        this.cityId = '';
        this.levelName = '';
        this.programId = '';
        this.programDetailId = '';

    }
    // disabledDates(){

    // }
    private operation: IOperation = {
        link: ''
    }

    saveModel() {
        this.$v.$touch();
        // if (!this.$v.$invalid) {
        if (this.fromDateEx != null && this.toDateEx != null && this.sessionId.length > 0 && this.cityId.length > 0 && this.levelName.length > 0 && this.programId.length > 0 && this.programDetailId.length > 0) {
            this.cityIdEx = this.cityId.toString().replace('"', '');
            this.operation.link = this.sessionId + "$" + this.cityId + "$" + this.levelName + "$" + this.programId + "$" + this.programDetailId + "$" + helper.formateDate(this.fromDateEx) + "$" + helper.formateDate(this.toDateEx)

            var key = this.roleDasboardId + "?" + this.userId + "?" + JSON.stringify(this.operation);
            this.rolePrivilagesRepo.addUserDashboard(key)
                .then(() => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Filters has been inserted successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                    this.cancel();
                });
        } else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Select Dropdowns',
                title: 'Error',
                messageTypeId: PayloadMessageTypes.error
            })
        }

        // }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any;
}