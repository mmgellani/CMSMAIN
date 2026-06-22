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

import { IHumanResourceStaff, ITimeTableTimeTableVM, ISetupZone, ISetupCity, ISetupSubCity } from '../../../../models';
import { HumanResourceStaffService, TimeTableTimeTableService, SetupZoneService, SetupCityService, SetupSubCityService } from '../../../../service';

import { HumanResourceStaffAddEdit } from '../add-edit';
import { HumanResourceStaffDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Staff-add-edit-model': HumanResourceStaffAddEdit,
        'delete-model': HumanResourceStaffDelete
    }
})

export class HumanResourceStaffList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: HumanResourceStaffService;
    private data: Array<IHumanResourceStaff> = [];
    private filterString: string = '';
    private zoneId = ''
    private cityId = ''
    private subcityId = ''

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private timeTableModel: Array<ITimeTableTimeTableVM> = [];
    private repositoryTimeTable: TimeTableTimeTableService;

    private zoneRepo: SetupZoneService = new SetupZoneService(this.$store);
    private cityRepo: SetupCityService = new SetupCityService(this.$store);
    private subcityRepo: SetupSubCityService = new SetupSubCityService(this.$store);

    private cityList: Array<ISetupCity> = [];
    // private subcityList: Array<ISetupSubCity> = [];
    private zoneList: Array<ISetupZone> = [];

    private columns = [
        { key: 'fullName', caption: 'Full Name' },
        { key: 'fatherName', caption: `Father's Name` },
        { key: 'cnic', caption: 'CNIC' },
        { key: 'dateOfBirth', caption: 'Date Of Birth' },
        { key: 'email', caption: 'Email' },
        { key: 'maritalStatus', caption: 'Marital Status' },
        { key: 'contactNo', caption: 'Contact No' },
        { key: 'address', caption: "Address" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new HumanResourceStaffService(this.$store);
        this.repositoryTimeTable = new TimeTableTimeTableService(this.$store);
        this.$watch('zoneId', this.loadCity);
        this.$watch('cityId', this.refreshData);
    }

    mounted() {
        this.validatePage();
        this.loadZone();
    }
    loadZone() {
        this.zoneRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.zoneList = r as Array<ISetupZone>
            })
    }
    loadCity() {
    
        this.cityRepo.GetFindBy('e=>e.ZoneId.ToString()=="' + this.zoneId + '" && e.StatusId == 1')
            .then(r => {
                this.cityList = r as Array<ISetupCity>
            })
    }

    // getTimeTable() {
    //     this.timeTableModel = [];
    //     this.repositoryTimeTable.GetFindBy('e => e.StatusId!=2')
    //         .then(response => this.timeTableModel = (response as Array<ITimeTableTimeTableVM>));
    // }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('humanResourceStaff' in this.user.claims) == true) {
                if (this.user.claims['humanResourceStaff'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['humanResourceStaff'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['humanResourceStaff'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['humanResourceStaff'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        var key = this.cityId;
        this.repository.GetFindByVM(key)

            .then(res => { this.data = res as Array<IHumanResourceStaff> });
    }
    getPhone(item) {
        return JSON.parse(item);
    }
    getAddress(item) {
        return JSON.parse(item);
    }

    insertModel() {

        if (this.zoneId.length > 0 && this.cityId.length > 0) {
            this.$modal.show('Staff-add-edit-model', { model: { staffId: '', departmentId: '', designationId: '', countryId: '', bloodGroupId: '', religionId: '', genderId: '', fullName: '', fatherName: '', cnic: '', dateOfBirth: new Date(), email: '', maritalStatus: true, contactNo: '', address: '', picture: '', statusId: 0, loggerId: '', subcityId: '', cityId: this.cityId, }, IsNewRecord: true, zoneid: this.zoneId });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdowns",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }




    }

    editModel(model: IHumanResourceStaff) {
        this.$modal.show('Staff-add-edit-model', { model: model, IsNewRecord: false, cityId: this.cityId, zoneid: this.zoneId });
        // alert(this.cityId)
    }

    deleteModel(model: IHumanResourceStaff) {

        // if (this.timeTableModel.filter(e => e.staffId == model.staffId).length > 0) {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: "This Parent Child Relation Cannot be Deleted",
        //         title: "Success",
        //         messageTypeId: PayloadMessageTypes.success
        //     });
        // }

        // else {
        this.$modal.show('delete-model', { model: model });
        // }
    }
}