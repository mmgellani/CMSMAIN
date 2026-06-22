/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import vSelect from "vue-select";

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IRegistrationSectionCourseLink, ISetupClass, ISetupSection, IRegistrationCourse, ISetupCampusProgramLinkVM, ICourseSelected, IRegistrationRoom, IRegistrationSectionCourseLink1 ,IRegistrationSectionCourseLinkVM,ISetupSectionListData} from '../../../../models';
import { RegistrationSectionCourseLinkService, SetupCampusProgramLinkService, SetupClassService, SetupSectionService, RegistrationCourseService ,RegistrationEnrollmentsService} from '../../../../service';

import * as helper from '../../../../helper';

import { RegistrationCourseAddEdit } from '../../Course/add-edit';
import { SetupClassAddEdit } from '../../../Setup/Class/add-edit';
import { SetupSectionAddEdit } from '../../../Setup/Section/add-edit';
import { SetupRoomAddEdit } from '../../../Setup/Room/add-edit';

type ValidateRegistrationSectionCourseLink = { data: IRegistrationSectionCourseLink, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateRegistrationSectionCourseLink> = {
    data: {
        // sectionCourseLinkId: { required },
        //campusProgramId: { required },
        classId: { required },
        //courseId: { required },
        sectionId: { required },
        fromSerial: { required, maxLength: maxLength(5) },
        toSerial: { required, maxLength: maxLength(5) },
        // statusId: { required },
        // loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'Class': SetupClassAddEdit,
        'Section': SetupSectionAddEdit,
        'Course': RegistrationCourseAddEdit,
        'Room': SetupRoomAddEdit,
        'v-select': vSelect

    }
})
export class RegistrationSectionCourseLinkAddEdit extends Vue {
    isActive: boolean = true;
    private repository: RegistrationSectionCourseLinkService;
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)

    private repo: SetupClassService;
    private repo1: SetupSectionService;
    private repo2: RegistrationCourseService;
    private CampusId: string = '';
    private campusprogramid: string = '';
    private classId: string = '';
    // private sectionlistdata: Array<ISetupSectionListData> = []
    private filteredSectionList: ISetupSectionListData[] = [];

    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];

    private ISectionCourseLinkList: Array<IRegistrationSectionCourseLink> = [];
    classList: Array<ISetupClass> = []
    private roomList: Array<IRegistrationRoom> = [];
   private  sectionlistdata: Array<ISetupSection> = []
    courseList: Array<IRegistrationCourse> = []
    private data: IRegistrationSectionCourseLink = {
        sectionCourseLinkId: '', campusProgramId: '', classId: '', sectionId: '', fromSerial: 0, toSerial: 0, statusId: 0, loggerId: '',
    };
    // private data: IRegistrationSectionCourseLink1 = {
    //     sectionCourseLinkId: '', campusProgramId: '', classId: '', sectionId: '', fromSerial: 0, toSerial: 0, statusId: 0, loggerId: '',roomBuildingLinkId:'',
    // };



    private IsNewRecord: boolean = true;
    private title: string = '';
    private CourseSelectedList: Array<ICourseSelected> = [];
    created() {
        this.repository = new RegistrationSectionCourseLinkService(this.$store);

        this.repo = new SetupClassService(this.$store);
        this.repo1 = new SetupSectionService(this.$store);
        this.repo2 = new RegistrationCourseService(this.$store);

    }

    beforeModalOpen(event) {
debugger;
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.CampusId = event.params.CampusId; /////////
        this.campusprogramid = event.params.model.campusProgramId; /////////
        this.loadSectionList();
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';

        Object.assign(this.data, event.params.model);

        // if (this.CampusId.length>0 ){

        //     this.loadRooms();

        // }
this.loadClass();
// this.loadSection();
// this.loadCourse();

    }

    addNewClass() {
        this.$modal.show('Class-add-edit-model', { IsNewRecord: true });

    }
    // loadSectionList() {
    //     debugger;

    //     this.repo1.GetAllSection().then(res => {
    //         this.sectionlistdata = res as Array<ISetupSectionListData>
    //         // this.filteredSectionList = [...this.sectionlistdata]; // clone full list initially


    //     });

    // }
    // filterSections(searchText: string) {
    //     debugger;
    //     if (!searchText) {
    //       this.filteredSectionList = [...this.sectionlistdata];
    //       return;
    //     }
    
    //     const lower = searchText.toLowerCase();
    //     this.filteredSectionList = this.sectionlistdata.filter(section =>
    //       section.section.toLowerCase().includes(lower)
    //     );
    //   }
    
    loadClass() {
        debugger;

        this.repo.GetFindBy('e=>e.StatusId==1').then(res => {
            this.classList = res as Array<ISetupClass>


        });

    }
    addNewSection() {
        this.$modal.show('Section-add-edit-model', { IsNewRecord: true });

    }
    loadSectionList() {
        debugger;
        this.repo1.GetFindBy('e=>e.StatusId ==1').then(res => {
            this.sectionlistdata = res as Array<ISetupSection>

        });

    }

    addNewCourse() {
        this.$modal.show('Course-add-edit-model', { IsNewRecord: true });

    }
    loadCourse() {
        debugger;
        this.repo2.GetFindBy('e=>e.StatusId== 1').then(res => {
            this.courseList = res as Array<IRegistrationCourse>

        });
    }
    // addNewRoom() {
    //     this.$modal.show('Room-add-edit-model', { IsNewRecord: true });
    // }

    // loadRooms() {

    //      this.roomList = [];
    //      this.repository.GetBuildingRooms( this.CampusId)
    //          .then(response => {

    //              this.roomList = response as Array<IRegistrationRoom>
    //              this.roomList.forEach(element => {
    //                  element.roomName = element.roomName 
    //              }); 
    //          })

    //  }

    cancel() {
        this.data = {
            sectionCourseLinkId: '', campusProgramId: '', classId: '', sectionId: '', fromSerial: 0, toSerial: 0, statusId: 0, loggerId: '',
        };
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }
    // cancel() {
    //     this.data = {
    //         sectionCourseLinkId: '', campusProgramId: '', classId: '', sectionId: '', fromSerial: 0, toSerial: 0, statusId: 0, loggerId: '',roomBuildingLinkId:'',
    //     };
    //     this.$modal.hide('add-edit-model');
    //     this.$emit("submit");
    // }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.data.fromSerial > this.data.toSerial) {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'From Serial Cannot be greater than To Serial',
                    title: 'Error',
                    messageTypeId: PayloadMessageTypes.error
                })
            } else if (this.data.fromSerial < 0 || this.data.toSerial < 0) {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'From Serial, To Serial Cannot be negative',
                    title: 'Error',
                    messageTypeId: PayloadMessageTypes.error
                })
            } else {
                if (this.IsNewRecord) {
                    this.data.sectionCourseLinkId = helper.newGuid();
                    this.data.statusId = 1;
                    this.data.loggerId = helper.newGuid();
                    this.repository.AddOne(this.data)
                        .then(res1 => { 
                            if (res1 === 'Data Already Exist') {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: 'Section Already Exists',
                                    title: 'Error',
                                    messageTypeId: PayloadMessageTypes.error
                                })
                            }
                            else {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: 'Record has been inserted successfully',
                                    title: 'Success',
                                    messageTypeId: PayloadMessageTypes.success
                                })
                            }
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
                        .then(res1 => {
                            if (res1 === 'Data Already Exist') {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: 'Section Already Exists',
                                    title: 'Error',
                                    messageTypeId: PayloadMessageTypes.error
                                })
                                this.cancel();
                            }
                            else {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: 'Record has been updated successfully',
                                title: 'Success',
                                messageTypeId: PayloadMessageTypes.success
                            })
                            this.cancel();
                        }
                            this.cancel();
                        });
                }
            }

        }

        // this.cancel();
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
        // return (this.data.classId.length > 0) && (this.data.sectionId.length > 0) && (this.data.fromSerial > 0) && (this.data.toSerial > 0);
    }
    $v: any;
}