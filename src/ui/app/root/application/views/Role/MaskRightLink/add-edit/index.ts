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

import { IRolePrevilages, ISetupZone, ISetupSession, DDLGroupModel, DDLModel, ICampusCityVM, ISetupCampus, ISetupCampusProgramVM, ISetupProgram, IRoles, ISetupShift, ISetupClass, IRoleAssignedList, IUserList, PrevilagesData, ISetupSubCity, ISetupCity, ISectionCampusVM, DDLModelCB, DDLGroupModelCB, ISectionRightLink, IMaskRightLink } from '../../../../models';
import { RolePrevilagesService, SetupZoneService, SetupSessionService, SetupCampusService, SetupCampusProgramLinkService, SetupProgramService, SetupShiftService, SetupClassService, SetupSubCityService, SetupCityService } from '../../../../service';

import * as helper from '../../../../helper';

import { TreeItem } from '../../../../../../components';
import { State } from 'vuex-class';
import { IRootStoreState } from '../../../../../store';

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
    template: require('./index.html'),
})
export class SectionRightLinkAddEdit extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    private repository: RolePrevilagesService;

    private userid: number = 0;
    private sessionId: string = '';

    private campusId: string = '';
    private isNew: boolean = true;
    private parent: Array<DDLGroupModelCB> = [];
    private child: Array<DDLModelCB> = [];
    private SessionRepo: SetupSessionService = new SetupSessionService(this.$store);
    private campusCityList: Array<ICampusCityVM> = []
    private maskList: Array<DDLModelCB> = []
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
    private classId: string = '';
    private sectionPrevaligesList: Array<ISectionCampusVM> = [];
    private sessList: Array<ISetupSession> = [];
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private IsNewRecord: boolean = true;
    private title: string = '';

    private data: IMaskRightLink = { allowedMask: '', maskRightLinkId: '', userId: 0 }
    private updateList: Array<IAllowedMask> = []

    created() {
        this.repository = new RolePrevilagesService(this.$store);
    }

    checkAll() {
        //  this.updateList = [];

        this.maskList.forEach(element => {
            element.isChecked = true;

        });
    }

    insertOrUpdate(model: DDLModelCB) {

        if (model.isChecked) {
            this.updateList.push({ id: model.id, text: model.text })
        }
        else {
            var obj = this.updateList.find(s => s.id == model.id);
            var index = this.updateList.indexOf(obj);
            this.updateList.splice(index, 1);
        }
    }

    getAllowedMasks() {
        this.updateList=[];
        this.repository.GetAllowedMask(this.userid)
            .then(r => {
                if (r.length > 0) {

                    console.log(r[0].providedString);
                    this.updateList = JSON.parse(r[0].providedString);
                    console.log(this.updateList)

                }
                this.getmaskList();
            })
    }
    loadCityCampus() {

        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }
    loadSession() {
        this.SessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
            this.sessList = r as Array<ISetupSession>;
        });
    }

    // getSectionPrevilagesList() {
    //     this.parent = []
    //     this.child = [];
    //     if (this.sessionId.length > 0 && this.campusId.length > 0) {
    //         var key = this.sessionId + "?" + this.campusId + "?" + this.userid;
    //         this.repository.GetAllSectionPrevileges(key)
    //             .then(r => {
    //                 this.sectionPrevaligesList = r as Array<ISectionCampusVM>;
    //                 if (this.sectionPrevaligesList.length > 0) {
    //                     var oldObj = this.sectionPrevaligesList[0]
    //                     // for(var i=0;i<this.sectionPrevaligesList.length; i++){
    //                     //     if(thi)
    //                     // }
    //                     this.sectionPrevaligesList.forEach(e => {
    //                         if (e.classId == oldObj.classId) {
    //                             this.child.push({ id: e.sectionCourseLinkId, isChecked: e.isChecked, text: e.sectionName })
    //                         }
    //                         else {
    //                             this.parent.push({ group: this.child, title: this.sectionPrevaligesList[this.sectionPrevaligesList.indexOf(e) - 1].className })
    //                             this.child = []
    //                             this.child.push({ id: e.sectionCourseLinkId, isChecked: e.isChecked, text: e.sectionName })

    //                         }
    //                         oldObj = e;
    //                     })
    //                     this.parent.push({ group: this.child, title: this.sectionPrevaligesList[this.sectionPrevaligesList.length - 1].className })

    //                     console.log(this.parent)
    //                 }
    //             })
    //     }

    // }

    getmaskList() {

        this.repository.GetMaskList().then(r => {
            this.maskList = r as Array<DDLModelCB>;
            if (this.updateList.length > 0) {
                this.maskList.forEach(element => {
                    this.updateList.forEach(e => {
                        if (e.id == element.id) {
                            element.isChecked = true;
                        }

                    })

                });
            }
        });

    }

    canAdd: boolean = false;

    beforeModalOpen(event) {


        this.IsNewRecord = true;
        this.sectionPrevaligesList = [];
        this.parent = [];
        this.child = [];

        this.canAdd = event.params.canAdd;

        this.IsNewRecord = event.params.IsNewRecord;
        this.userid = event.params.UserID;
        this.title = 'User Management';
        // this.loadSession();
        // this.loadCityCampus();

        this.getAllowedMasks();

    }

    beforeModalClose() {
    }

    cancel() {
        this.campusId = '';
        this.sessionId = '';
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }



    saveModel() {
        let allowedSection: any = []
        this.updateList = [];
        var any2 = this.maskList.filter(e => e.isChecked == true);
        any2.forEach(element => {
            this.updateList.push({ id: element.id, text: element.text })

        });

        // this.parent.forEach(element => {
        //     element.group.filter(s => s.isChecked).forEach(item => {
        //         allowedSection.push({ id: item.id, text: item.text })
        //     }
        //     )
        // })
        this.data.allowedMask = JSON.stringify(this.updateList);
        this.data.maskRightLinkId = helper.newGuid();
        this.data.userId = this.userid;
        console.log(JSON.stringify(allowedSection));
        this.repository.AddMaskRightLink(this.data)
            .then(r => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been inserted successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                })
            })
        // this.data.allowedSection = JSON.stringify(allowedSection);
        // this.repository.AddOne(this.data)
        //     .then(() => {
        //         this.$store.dispatch(StoreTypes.updateStatusBar, {
        //             text: 'Record has been inserted successfully',
        //             title: 'Success',
        //             messageTypeId: PayloadMessageTypes.success
        //         })
        //         this.cancel();
        //     });

        this.cancel();
    }

    $v: Vuelidate<any>;
}

export interface IAllowedMask {
    id: string;
    text: string;
}