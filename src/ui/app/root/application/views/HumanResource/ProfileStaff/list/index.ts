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

import { IHumanResourceStaff, IProfileStaff, ISetupBloodGroup, ISetupCountry, ISetupGender, ISetupReligion } from '../../../../models';
import { HumanResourceStaffService, SetupBloodGroupService, SetupCountryService, SetupGenderService, SetupReligionService } from '../../../../service';

import { HumanResourceStaffAddEdit } from '../add-edit';
import { HumanResourceStaffDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { IAddress, IPhoneNumber } from '../../Staff/add-edit';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': HumanResourceStaffAddEdit,
        'delete-model': HumanResourceStaffDelete
    }
})

export class ProfileStaff extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;


    private data: IProfileStaff = {
        staffId: '', departmentId: '', designationId: '', countryId: '', bloodGroupId: '', religionId: '', genderId: '', fullName: '', fatherName: '', cNIC: '', dateOfBirth: new Date(), email: '', maritalStatus: true, contactNo: '', address: '', picture: '', statusId: 0, loggerId: '',
        userId: 0
    };
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private staffRepo: HumanResourceStaffService = new HumanResourceStaffService(this.$store)

    BloodGroupList: Array<ISetupBloodGroup> = [];
    CountryList: Array<ISetupCountry> = [];

    GenderList: Array<ISetupGender> = [];
    ReligionList: Array<ISetupReligion> = [];
    IPhoneList: Array<IPhoneNumber> = [];
    IAddressList: Array<IAddress> = [];

    private BloodGrouprepository: SetupBloodGroupService;
    private Countryrepository: SetupCountryService;

    private Genderrepository: SetupGenderService;
    private Religionrepository: SetupReligionService;

    created() {

        this.BloodGrouprepository = new SetupBloodGroupService(this.$store);
        this.Countryrepository = new SetupCountryService(this.$store);

        this.Genderrepository = new SetupGenderService(this.$store);
        this.Religionrepository = new SetupReligionService(this.$store);
        // this.staffRepo.GetAllVM(this.user.userId)
        //     .then(r => {
        //         this.data = r as any
        //     })
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.BloodGrouprepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.BloodGroupList = res as Array<ISetupBloodGroup>
        })
        this.Countryrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.CountryList = res as Array<ISetupCountry>
        })

        this.Genderrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.GenderList = res as Array<ISetupGender>
        })

        this.Religionrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.ReligionList = res as Array<ISetupReligion>
        })
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('profileStaff' in this.user.claims) == true) {
                if (this.user.claims['profileStaff'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['profileStaff'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['profileStaff'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['profileStaff'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = {
            staffId: '', departmentId: '', designationId: '', countryId: '', bloodGroupId: '', religionId: '', genderId: '', fullName: '', fatherName: '', cNIC: '', dateOfBirth: new Date(), email: '', maritalStatus: true, contactNo: '', address: '', picture: '', statusId: 0, loggerId: '',
            userId: 0
        };
        // this.repository.GetAll().then(res=>{
        //   this.data=res as Array<IHumanResourceStaff>

        // })

        this.staffRepo.GetAllVM(this.user.userId)
            .then(r => {
                var list2 = r as Array<IProfileStaff>
                this.data = list2[0]

                let list: Array<IPhoneNumber> = JSON.parse(this.data.contactNo)
                list.forEach(element => {
                    this.IPhoneList.push({ contactNo: element.contactNo })
                });

                let Addresslist: Array<IAddress> = JSON.parse(this.data.address)
                Addresslist.forEach(element => {
                    this.IAddressList.push({ address: element.address })
                });

            })


        // .then(response => this.data = (response as Array<IHumanResourceStaff>));
    }
    getPhone(item) {
        return JSON.parse(item);
    }
    getAddress(item) {
        return JSON.parse(item);
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
    changePasswordModel() {
        this.$modal.show('add-edit-model');

    }
    insertModel() {
        this.$modal.show('add-edit-model', { model: { staffId: '', departmentId: '', designationId: '', countryId: '', bloodGroupId: '', religionId: '', genderId: '', fullName: '', fatherName: '', cnic: '', dateOfBirth: new Date(), email: '', maritalStatus: true, contactNo: '', address: '', picture: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: IHumanResourceStaff) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IHumanResourceStaff) {
        this.$modal.show('delete-model', { model: model });
    }

    saveModel() {

        this.data.address = JSON.stringify(this.IAddressList);
        this.data.contactNo = JSON.stringify(this.IPhoneList);
        this.data.dateOfBirth = new Date(this.data.dateOfBirth);
        this.staffRepo.Update(this.data)
            .then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Record has been updated successfully',
                title: 'Success',
                messageTypeId: PayloadMessageTypes.success
            }));
    }


}