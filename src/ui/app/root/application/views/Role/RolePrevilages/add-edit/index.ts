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
import { PayloadMessageTypes, IUser } from '../../../../../../model';

import { IRolePrevilages, ISetupZone, ISetupSession, DDLGroupModel, DDLModel, ICampusCityVM, ISetupCampus, ISetupCampusProgramVM, ISetupProgram, IRoles, ISetupShift, ISetupClass, IRoleAssignedList, IUserList, PrevilagesData, ISetupSubCity, ISetupCity } from '../../../../models';
import { RolePrevilagesService, SetupZoneService, SetupSessionService, SetupCampusService, SetupCampusProgramLinkService, SetupProgramService, SetupShiftService, SetupClassService, SetupSubCityService, SetupCityService } from '../../../../service';

import * as helper from '../../../../helper';

import { TreeItem } from '../../../../../../components';

type ValidateRolePrevilages = { model: IRolePrevilages, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateRolePrevilages> = {
    model: {
        roleId: { required }
    }
};
interface IUserRoleAssign {

    id: string;
    name: string;
    ischeck: boolean;
}

interface ModuleList {
    id: string;
}
interface ModuleList2 extends ModuleList {
    userid: number;
}

interface IRolesEx extends IRoles {
    isAssigned: boolean;
}

interface ISetupSessionEx extends ISetupSession {
    isAssigned: boolean;
}

@Component({
    name: 'add-edit-model',
    template: require('./index.html')
})
export class RolePrevilagesAddEdit extends Vue {
    campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    private repository: RolePrevilagesService;
    private zoneId: string = '';
    private userid: number = 0;
    private sessionId: string = '';
    private campusProgramId: string = '';
    private campusId: string = '';
    private isNew: boolean = true;

    private RolePrivilagesData: Array<IRolePrevilages> = [];

    private UserRoleList: Array<IUserRoleAssign> = [];
    private TempUserRoleList: Array<IUserRoleAssign> = [];
    private zoneList: Array<ISetupZone> = [];
    private sessionList: Array<ISetupSessionEx> = [];
    private campusList: Array<ISetupCampus> = [];
    private ProgramList: Array<ISetupProgram> = [];
    private ZoneRepo: SetupZoneService = new SetupZoneService(this.$store);
    private SessionRepo: SetupSessionService = new SetupSessionService(this.$store);
    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
    private ProgramRepo: SetupProgramService = new SetupProgramService(this.$store);
    private RolePrevRepo: RolePrevilagesService = new RolePrevilagesService(this.$store);
    private RoleList: Array<IRolesEx> = [];
    private TempRoleList: Array<IRolesEx> = [];
    private Rolename: string = '';
    private tempdata: IUserList = null;
    private ModuleTypeList: Array<ModuleList2> = [];
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    ListType: string = '';
    private classid: string = '';
    private shiftid: string = '';
    private shiftList: Array<ISetupShift> = [];
    private ClassList: Array<ISetupClass> = [];
    private subcityList: Array<ISetupSubCity> = [];
    private cityList: Array<ISetupCity> = [];
    private RolePrevilagesList: Array<PrevilagesData> = [];

    //private rsu: Array<TreeItem> = [];

    private rsu: TreeItem = null;

    datas = [];

    private ShiftRepo: SetupShiftService = new SetupShiftService(this.$store);
    private ClassReop: SetupClassService = new SetupClassService(this.$store);
    private SubcityRepo: SetupSubCityService = new SetupSubCityService(this.$store);
    private cityRepo: SetupCityService = new SetupCityService(this.$store);

    private data: IRolePrevilages = {
        userId: 0,
        moduleStore: '',
        rolePrevilagesLinkId: ''
    }

    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new RolePrevilagesService(this.$store);
    }

    isCheckeded(id) {
        let foundOne: boolean = false;
        this.RolePrevilagesList.forEach(element => {
            if (element.id == id) {
                foundOne = true;
            }
        });
        return foundOne;
    }

    GetData() {
        this.datas = [];
        this.repository.GetAllPrevilages(this.userid).then(
            resultdata => {
                this.rsu = resultdata as TreeItem
            });
        this.RolePrevilagesList = [];
        this.repository.GetAll(this.userid).then(
            resultdata => {
                this.RolePrevilagesList = resultdata;

                this.RolePrevRepo.GetAllRoles().then(
                    res => {
                        this.RoleList = [];
                        res.forEach(element => {
                            this.RoleList.push({
                                roleId: element.roleId,
                                parentRoleId: element.parentRoleId,
                                enabled: element.enabled,
                                name: element.name,
                                createdBy: element.createdBy,
                                createdOn: element.createdOn,
                                lastUpdatedBy: element.lastUpdatedBy,
                                lastUpdatedOn: element.lastUpdatedOn,
                                roleId1: element.roleId1,
                                isAssigned: this.isCheckeded(element.roleId)
                            });
                        });
                    }
                );

                this.SessionRepo.GetFindBy("e=> e.StatusId == 1").then(
                    res => {
                        this.sessionList = [];
                        res.forEach(element => {
                            this.sessionList.push({
                                sessionId: element.sessionId,
                                code: element.code,
                                fullName: element.fullName,
                                description: element.description,
                                workingDays: element.workingDays,
                                statusId: element.statusId,
                                loggerId: element.loggerId,
                                isAssigned: this.isCheckeded(element.sessionId)
                            })
                        });
                    }
                );
            });
    }

    beforeModalOpen(event) {
        this.UserRoleList = []
        this.ListType = '';
        this.Rolename = '';
        this.IsNewRecord = true;

        this.IsNewRecord = event.params.IsNewRecord;
        this.userid = event.params.UserID;
        this.title = 'User Management';

        this.GetData();
    }

    beforeModalClose() {
    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    templist = [];
    getChecked(element) {
        if (element.children.length > 0) {
            element.children.forEach(elemente => {
                this.getChecked(elemente);
            });
        } else {
            if (element.isChecked == true) {
                this.templist.push(element);
            }
        }
    }

    saveModel() {
        var array = Array.prototype.slice.call(this.rsu);
        var final = JSON.stringify(array).replace(/[.*+?^${}()|[\]\\]/g, '');
        final = final.replace(new RegExp(',"children":,', 'g'), '},{');
        final = final.replace(new RegExp(',"children":', 'g'), '},{');
        final = '[{' + final.substr(0, final.length - 2) + ']';

       var processed = JSON.parse(final);

        var forStore = [];
        processed.filter(e => e.isChecked == true).forEach(element => {
            forStore.push({ model: element.caption, id: element.id });
        });


        this.sessionList.filter(e => e.isAssigned == true).forEach(element => {
            forStore.push({ model: 'Session', id: element.sessionId });
        })


        this.TempRoleList = this.RoleList.filter(e => e.isAssigned == true);

        this.ModuleTypeList = [];
        for (var i = 0; i < this.TempRoleList.length; i++) {
            this.ModuleTypeList.push({
                id: this.TempRoleList[i].roleId,
                userid: this.userid
            })
        }

        var temp = this.sessionList.filter(e => e.isAssigned == true);

        this.data.userId = this.userid;

        this.data.rolePrevilagesLinkId = helper.newGuid();
        this.data.moduleStore = JSON.stringify(forStore);

        Promise.all([
            this.repository.AddOne(this.data),
            this.repository.AddManyRoles(this.ModuleTypeList)
        ]).then(() => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Record has been inserted successfully',
                title: 'Success',
                messageTypeId: PayloadMessageTypes.success
            });
            this.cancel();
        });
    }

    $v: Vuelidate<any>;
}