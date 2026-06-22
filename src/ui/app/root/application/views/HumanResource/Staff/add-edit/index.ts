/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { HumanResourceDepartmentsService, HumanResourceDesignationsService, HumanResourceStaffService, SetupBloodGroupService, SetupCityService, SetupCountryService, SetupGenderService, SetupReligionService, SetupSubCityService, StaffCourseService } from '../../../../service';
import { IHumanResourceDepartments, IHumanResourceDesignations, IHumanResourceStaff, ISetupBloodGroup, ISetupCity, ISetupCountry, ISetupGender, ISetupReligion, ISetupSubCity, IStaffCourse, IStaffCourseDeptVM, teachercheckmodel } from '../../../../models';
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
import moment from 'moment';
import { StaffCourseAddEdit } from '../../StaffCourse/add-edit';
import { StaffCourseDelete } from '../../StaffCourse/delete';
import { StaffCourseAddEditList } from '../../StaffCourse/add-edit-list';

type ValidateHumanResourceStaff = { data: IHumanResourceStaff, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateHumanResourceStaff> = {
    data: {
        // staffId: { required },
        departmentId: { required },
        designationId: { required },
        genderId: { required },
        fullName: { required },
        fatherName: { required },
        cnic: { required },
        email: {
            required,
            email
        },
        dateOfBirth: { required },
        // maritalStatus: { required },
        contactNo: { required },
        address: { required },
        //  contact1: { required },


        bloodGroupId: { required },
        empolyeeCode: { required },
        cityId: { required },
        subCityId: { required },
        // loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'Staff-add-edit-model',
    template: require('./index.html'),
    components: {
        'Departments': HumanResourceDepartmentsAddEdit,
        'Designations': HumanResourceDesignationsAddEdit,
        DrawerArea,
        'staff-course-add-edit': StaffCourseAddEdit,
        'staff-course-delete': StaffCourseDelete,
        'staff-add-edit-list': StaffCourseAddEditList
    }
})
export class HumanResourceStaffAddEdit extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private auth: AuthenticationService;
    private repository: HumanResourceStaffService;
    private BloodGrouprepository: SetupBloodGroupService;
    private Countryrepository: SetupCountryService;
    private Departmentrepository: HumanResourceDepartmentsService;
    private Designationrepository: HumanResourceDesignationsService;
    private Genderrepository: SetupGenderService;
    private Religionrepository: SetupReligionService;
    checkteachermodel:Array<teachercheckmodel> = [];
    maildisable = false;
    showTopPop: boolean = false;

    private data: IHumanResourceStaff = {
        staffId: '', departmentId: '', designationId: '', countryId: '', bloodGroupId: '', religionId: '', genderId: '', fullName: '', fatherName: '', cnic: '', dateOfBirth: new Date(), email: '', maritalStatus: true, contactNo: '', address: '', picture: '', statusId: 0, loggerId: '', empolyeeCode: null, subCityId: '', cityId: ''
    };
    BloodGroupList: Array<ISetupBloodGroup> = [];
    CountryList: Array<ISetupCountry> = [];
    DepartmentList: Array<IHumanResourceDepartments> = [];
    DesignationList: Array<IHumanResourceDesignations> = [];
    GenderList: Array<ISetupGender> = [];
    ReligionList: Array<ISetupReligion> = [];
    IPhoneList: Array<IPhoneNumber> = [];
    IAddressList: Array<IAddress> = [];
    private IsNewRecord: boolean = true;
    private isActive: boolean = true;
    private title: string = '';
    private subcityList: Array<ISetupSubCity> = [];

    private subcityRepo: SetupSubCityService = new SetupSubCityService(this.$store);
    private cityId = '';
    private subcityId = '';
    private cityList: Array<ISetupCity> = [];

    private cityRepo: SetupCityService = new SetupCityService(this.$store);
    zoneId: any = '';

    private canAddDepartment: boolean = false;
    private canAddDesignation: boolean = false;

    private address2 = '';
    private contact2 = '';
    private transferEl=false;
    private showDrawer: boolean = false;
    private staffCourseDepVMList: IStaffCourseDeptVM[] = []
    private staffCourse: IStaffCourse = { staffId: '', campusBuildingId: '', courseId: '', isPrimary: false, statusId: 1, staffCourseId: '', }
    created() {
        this.repository = new HumanResourceStaffService(this.$store);
        this.BloodGrouprepository = new SetupBloodGroupService(this.$store);
        this.Countryrepository = new SetupCountryService(this.$store);
        this.Departmentrepository = new HumanResourceDepartmentsService(this.$store);
        this.Designationrepository = new HumanResourceDesignationsService(this.$store);
        this.Genderrepository = new SetupGenderService(this.$store);
        this.Religionrepository = new SetupReligionService(this.$store);
        this.auth = new AuthenticationService(this.$store);

        this.validatePage();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAddDepartment = this.canAddDesignation = true;
        }
        else {
            if (('humanResourceDepartments' in this.user.claims) == true) {
                if (this.user.claims['humanResourceDepartments'].indexOf('C') >= 0) {
                    this.canAddDepartment = true;
                }
            }

            if (('humanResourceDesignations' in this.user.claims) == true) {
                if (this.user.claims['humanResourceDesignations'].indexOf('C') >= 0) {
                    this.canAddDesignation = true;
                }
            }
        }
    }
    loadCity() {
        this.cityRepo.GetFindBy('e=>e.ZoneId.ToString()=="' + this.zoneId + '" && e.StatusId == 1')
            .then(r => {
                this.cityList = r as Array<ISetupCity>
            })
    }
    loadSubCity() {

        this.subcityRepo.GetFindBy('e=>e.CityId.ToString()=="' + this.data.cityId + '" && e.StatusId == 1').then(r => {
            this.subcityList = r as Array<ISetupSubCity>
        })



    }

    loadStaffCourseDepVM() {
        this.staffCourseDepVMList = []
        if (this.data.staffId.length > 0) {
            this.repository.GetStaffCourseDepVM(this.data.staffId)
                .then(r => {
                    this.staffCourseDepVMList = r as IStaffCourseDeptVM[]
                })
        }

    }
    isNewStaffAdd = false
    // addNewStaffCourse() {
    //     this.isNewStaffAdd = true;
    // }
    insertModel() {
        console.log(this.data.staffId + ' insin')

        if (this.data.staffId.length > 0) {
            console.log('insin')
            this.$modal.show('staffCourse-add-edit-model', { model: { staffId: this.data.staffId, campusBuildingId: '', courseId: '', isPrimary: false, statusId: 0, staffCourseId: '', }, IsNewRecord: true });

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
    // cancel() {
    //     this.$modal.hide('delete-model-staffCourse');
    //     this.$emit("submit");
    // }
    beforeModalOpen(event) {
        this.isNewStaffAdd=false;
        this.showTopPop = false;

        this.staffCourse={ staffId: '', campusBuildingId: '', courseId: '', isPrimary: false, statusId: 1, staffCourseId: '', }
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        if (this.IsNewRecord == true) {
            this.maildisable = false;
        }
        if (this.IsNewRecord == false) {
            this.maildisable = true;

        }
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        this.staffCourse.staffId = this.data.staffId
        this.loadStaffCourseDepVM()

        this.cityId = event.params.cityId;
        if (this.IsNewRecord == false) { this.loadSubCity(); }


        // alert(this.cityId)
        this.zoneId = event.params.zoneid;
        this.loadCity();
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else {
            this.isActive = false;
        }

        this.BloodGrouprepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.BloodGroupList = res as Array<ISetupBloodGroup>
        })
        this.Countryrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.CountryList = res as Array<ISetupCountry>
        })
        this.Departmentrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.DepartmentList = res as Array<IHumanResourceDepartments>
        })
        this.Designationrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.DesignationList = res as Array<IHumanResourceDesignations>
        })
        this.Genderrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.GenderList = res as Array<ISetupGender>
        })

        this.Religionrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.ReligionList = res as Array<ISetupReligion>
        })

        if (this.IsNewRecord) {


            this.IPhoneList = [];
            this.IAddressList = [];
            // this.IPhoneList.push({ contactNo: '' })
            // this.IPhoneList.push({ contactNo: '' })
            // this.IAddressList.push({ address: '' })
            // this.IAddressList.push({ address: '' })
            this.data.empolyeeCode = null;
        }
        else {
            this.IPhoneList = [];
            this.IAddressList = [];


            let list: Array<IPhoneNumber> = JSON.parse(this.data.contactNo)
            if (list.length > 0) {
                if (list.length > 1) {
                    this.data.contactNo = list[0].contactNo;
                    this.contact2 = list[1].contactNo;
                } else {
                    this.data.contactNo = list[0].contactNo;
                }
            }
            // list.forEach(element => {
            //     this.IPhoneList.push({ contactNo: element.contactNo })
            // });

            let Addresslist: Array<IAddress> = JSON.parse(this.data.address)
            // Addresslist.forEach(element => {
            //     this.IAddressList.push({ address: element.address })
            // });
            if (Addresslist.length > 0) {
                if (Addresslist.length > 1) {
                    this.data.address = Addresslist[0].address;
                    this.address2 = Addresslist[1].address;
                } else {
                    this.data.address = Addresslist[0].address;
                }
            }



        }

    }

    ClosethePopUp(){
        this.showTopPop = false;
      }
    addNewDepartments() {
        this.$modal.show('Departments-add-edit-model', { IsNewRecord: true });

    }
    loadDepartments() {
        this.Departmentrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.DepartmentList = res as Array<IHumanResourceDepartments>
        });

    }

    addNewDesignations() {
        this.$modal.show('Designations-add-edit-model', { IsNewRecord: true });

    }
    loadDesignations() {
        this.Designationrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.DesignationList = res as Array<IHumanResourceDesignations>
        });

    }

    cancel() {
        this.data = {
            staffId: '', departmentId: '', designationId: '', countryId: '', bloodGroupId: '', religionId: '', genderId: '', fullName: '', fatherName: '', cnic: '', dateOfBirth: new Date(), email: '', maritalStatus: true, contactNo: '', address: '', picture: '', statusId: 0, loggerId: '', empolyeeCode: null, subCityId: '', cityId: ''
        };
        this.contact2 = '';
        this.address2 = ''
        this.$modal.hide('Staff-add-edit-model');
        this.$emit("submit");

    }
    addPhoneNo() {
        this.IPhoneList.push({ contactNo: '' })
    }

    delPhoneNo(model: IPhoneNumber) {
        var index = this.IPhoneList.indexOf(model);
        this.IPhoneList.splice(index, 1)
    }

    addAddress() {
        this.IAddressList.push({ address: '' })
    }

    delAddress(model: IAddress) {
        var index = this.IAddressList.indexOf(model);
        this.IAddressList.splice(index, 1)
    }
    signup: ISignupOptions = {
        confirmPassword: '',
        displayName: null,
        userName: null,
        password: ''
    };


    private repoStaffCourse: StaffCourseService = new StaffCourseService(this.$store)
    get isValidStaffCourse(){
        return this.staffCourse.campusBuildingId.length>0 
        && this.staffCourse.courseId.length>0
    }
    saveModel() {
        debugger
        this.IAddressList = []
        this.IPhoneList = []
        this.IAddressList.push({ address: this.data.address })
        this.IAddressList.push({ address: this.address2 })
        this.IPhoneList.push({ contactNo: this.data.contactNo })
        this.IPhoneList.push({ contactNo: this.contact2 })
        this.$v.$touch();
        if (!this.$v.$invalid) {
           var key = this.data.staffId+'?'+this.data.email
           this.repository.CheckTeacherexist(key)
           .then(r => {
              this.checkteachermodel=r;
               //this.cancel();
               if (this.checkteachermodel.length>0){
                 this.showTopPop=true;
               }
        else{
            if (this.IsNewRecord) {
                if(this.isNewStaffAdd && !this.isValidStaffCourse){ 
                    alert('Please fill staff course')
                    return ;
                }

                this.data.staffId = helper.newGuid();
                this.data.statusId = 1;
                this.data.address = JSON.stringify(this.IAddressList);
                this.data.contactNo = JSON.stringify(this.IPhoneList);
                this.data.dateOfBirth = new Date(moment(this.data.dateOfBirth).format('YYYY-MM-DD'))
                this.data.picture = "mypic"
                this.data.countryId = 'e005fb7c-38ff-4889-b252-40c4ed7eee1a';
                this.data.religionId = '5d34f74b-53eb-413e-b012-f3a768191087';
                this.data.loggerId = helper.newGuid();
                //this.data.subCityId = helper.newGuid();

                var z = JSON.stringify(this.data);


                if (this.isNewStaffAdd) {

                    if(this.transferEl==true)
                    {
                        var j='[' + z + ']' + '?' + '0'+'?'+this.data.email+'?'+'1';

                    }
                    else
                    {

                        var j='[' + z + ']' + '?' + '0'+'?'+this.data.email+'?'+'0';

                    }

                    this.repository.AddOne(j)
                        .then(r => {
                            this.staffCourse.staffId=this.data.staffId
                            this.staffCourse.staffCourseId=helper.newGuid();
                            this.repoStaffCourse.AddOne(this.staffCourse)
                                .then(r => {

                                })
                            this.$store.dispatch(StoreTypes.updateStatusBar, {

                                text: r,
                                title: '',
                                messageTypeId: PayloadMessageTypes.success
                            })
                            //this.cancel();


                        })
                } else {

                    if(this.transferEl==true)
                    {
                        var j='[' + z + ']' + '?' + '0'+'?'+this.data.email+'?'+'1';

                    }
                    else
                    {

                        var j='[' + z + ']' + '?' + '0'+'?'+this.data.email+'?'+'0';

                    }

                    // alert (JSON.stringify(j))

                    
                    this.repository.AddOne(j)
                        .then(r => {
                          
                            this.$store.dispatch(StoreTypes.updateStatusBar, {

                                text: r,
                                title: '',
                                messageTypeId: PayloadMessageTypes.success
                            })
                            //this.cancel();


                        })
                }





              
            } else {

                if (this.isActive == true) {
                    this.data.statusId = 1
                }
                else {
                    this.data.statusId = 0
                }
                this.data.address = JSON.stringify(this.IAddressList);
                this.data.contactNo = JSON.stringify(this.IPhoneList);
                this.data.dateOfBirth = new Date(moment(this.data.dateOfBirth).format('YYYY-MM-DD'))
                var z = JSON.stringify(this.data)
               
                if(this.transferEl==true)
                {
                   var j= '[' + z + ']' + '?' + '1'+'?'+this.data.email+'?'+'1'
                }
                else
                {
                   var j= '[' + z + ']' + '?' + '1'+'?'+this.data.email+'?'+'0'
                }


                this.repository.AddOne(j)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been updated successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        //this.cancel();
                    });
            }
        }
           })

           
        

        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}



export interface IPhoneNumber {
    contactNo: string
}
export interface IAddress {
    address: string
}

