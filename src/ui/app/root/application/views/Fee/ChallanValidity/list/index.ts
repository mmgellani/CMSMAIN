/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

// import Vue from 'vue';
// import { State } from 'vuex-class';
// import Component from 'vue-class-component';

// import { IUser } from '../../../../../../model';
// import { IRootStoreState } from '../../../../../store';

// import { IFeeChallanValidity, ICampusChallanValidityVM, ISetupCampus, ICampusCityVM, DDLGroupModel, DDLModel } from '../../../../models';
// import { FeeChallanValidityService, SetupCampusService } from '../../../../service';

// import { FeeChallanValidityAddEdit } from '../add-edit';
// import { FeeChallanValidityDelete } from '../delete';

// import { Grid } from '../../../../../../components'

// @Component({
//     name: 'models-form-list',
//     template: require('./index.html'),
//     components: {
//         'add-edit-model': FeeChallanValidityAddEdit,
//         'delete-model': FeeChallanValidityDelete,
//         'grid': Grid
//     }
// })

// export class FeeChallanValidityList extends Vue {
//     @State((state: IRootStoreState) => state.common.user) user: IUser;

//     private repository: FeeChallanValidityService;
//     private data: Array<ICampusChallanValidityVM> = [];
//     private filterString: string = '';
//     private campusId = '';
//     private campusList: Array<ISetupCampus> = []
//     private campusCityList: Array<ICampusCityVM> = []

//     private cityDDL: Array<DDLGroupModel> = []
//     private campusddl: Array<DDLModel> = []
//     private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
//     private canRead: boolean = false;
//     private canAdd: boolean = false;
//     private canEdit: boolean = false;
//     private canDelete: boolean = false;

//     // private columns = ['campusId', 'installmentNo', 'fromDate', 'toDate', 'statusId']

//     private columns = [
//         { key: 'installmentNo', caption: 'InstallmentNo' },
//         { key: 'fromDate', caption: 'FromDate' },
//         { key: 'toDate', caption: "ToDate" },
//         { key: 'statusId', caption: 'Status' },
//         { key: 'action', caption: 'Action', width: 120 }
//     ];

//     created() {
//         this.repository = new FeeChallanValidityService(this.$store);
//         this.loadCityCampus();
//     }
//     loadCityCampus() {
//         this.campusddl = [];
//         this.cityDDL = [];
//         let oldObj: ICampusCityVM;
//         this.campusRepo.GetCityVM().then(r => {
//             this.campusCityList = r as Array<ICampusCityVM>;
//         });
//     }




//     loadCampus() {
//         this.campusRepo.GetFindBy('e=>e.StatusId == 1')
//             .then(r => {
//                 this.campusList = r as Array<ISetupCampus>
//             })
//     }
//     mounted() {
//         this.validatePage();
//         this.loadCampus();
//     }

//     validatePage() {
//         if (this.user.roles.indexOf('admin') >= 0) {
//             this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
//         }
//         else {
//             if (('feeChallanValidity' in this.user.claims) == true) {
//                 if (this.user.claims['feeChallanValidity'].indexOf('R') >= 0) {
//                     this.canRead = true;
//                 }
//                 if (this.user.claims['feeChallanValidity'].indexOf('C') >= 0) {
//                     this.canAdd = true;
//                 }
//                 if (this.user.claims['feeChallanValidity'].indexOf('U') >= 0) {
//                     this.canEdit = true;
//                 }
//                 if (this.user.claims['feeChallanValidity'].indexOf('D') >= 0) {
//                     this.canDelete = true;
//                 }
//             } else {
//                 this.$router.push('Home');
//             }
//         }
//     }

//     refreshData() {
//         this.data = [];
//         this.repository.GetFindBy('e => e.CampusId.ToString() == \"' + this.campusId + '\" && e.StatusId != 2')
//             .then(response => this.data = (response as Array<ICampusChallanValidityVM>));
//     }

//     insertModel() {
//         if (this.campusId.length > 0) {
//             this.$modal.show('add-edit-model', { model: { challanValidityId: '', campusId: this.campusId, installmentNo: 0, fromDate: new Date(), toDate: new Date(), statusId: 0, loggerId: '', }, IsNewRecord: true });
//         }
//         else {
//             alert('Please Select Values First')
//         }
//     }

//     editModel(model: ICampusChallanValidityVM) {
//         this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
//     }

//     deleteModel(model: ICampusChallanValidityVM) {
//         this.$modal.show('delete-model', { model: model });
//     }
// }


import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IFeeChallanValidity, ICampusChallanValidityVM, ISetupCampus, ICampusCityVM, DDLGroupModel, DDLModel, ISetupSession, ISetupClass } from '../../../../models';
import { FeeChallanValidityService, SetupCampusService, SetupSessionService, SetupClassService } from '../../../../service';

import { FeeChallanValidityAddEdit } from '../add-edit';
import { FeeChallanValidityDelete } from '../delete';
import { StoreTypes } from "../../../../../../store";

import { Grid } from '../../../../../../components'

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': FeeChallanValidityAddEdit,
        'delete-model': FeeChallanValidityDelete,
        'grid': Grid
    }
})

export class FeeChallanValidityList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeChallanValidityService;
    private data: Array<ICampusChallanValidityVM> = [];
    private filterString: string = '';
    private campusId = '';
    private sessionid = '';
    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private Classrepository: SetupClassService = null;

    private campusCityList: Array<ICampusCityVM> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    private ClassId: string = '';
    private ClassList: Array<ISetupClass> = [];
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private instList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    private columns = [
        { key: 'installmentNo', caption: 'InstallmentNo' },
        { key: 'fromDate', caption: 'FromDate' },
        { key: 'toDate', caption: "ToDate" },
        { key: 'description', caption: "Program Detail" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new FeeChallanValidityService(this.$store);
        this.Classrepository = new SetupClassService(this.$store);
        // this.loadCityCampus();
        this.loadSessions();
    }
    loadSessions() {
        this.sessionList = [];
        this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
            this.sessionList = r as Array<ISetupSession>

        })
    }
    loadCityCampus() {
        if (this.sessionid.length > 0) {
            this.campusddl = [];
            this.cityDDL = [];
            let oldObj: ICampusCityVM;
            this.campusRepo.GetCityVM().then(r => {
                this.campusCityList = r as Array<ICampusCityVM>;
            });
        }
    }
    loadClass() {
        if (this.campusId.length > 0) {
            this.Classrepository.GetFindBy('e=>e.StatusId==1')
                .then(res =>
                    this.ClassList = res as Array<ISetupClass>);
        }
    }
    // loadCampus() {
    //     this.campusRepo.GetFindBy('e=>e.StatusId == 1')
    //         .then(r => {
    //             this.campusList = r as Array<ISetupCampus>
    //         })
    // }
    mounted() {
        this.validatePage();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('feeChallanValidity' in this.user.claims) == true) {
                if (this.user.claims['feeChallanValidity'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeChallanValidity'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeChallanValidity'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeChallanValidity'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        if (this.ClassId.length > 0) {
            this.data = [];
            this.repository.GetFindBy('e => e.CampusId.ToString() == \"' + this.campusId + '\"&& e.ClassId.ToString() == \"' + this.ClassId + '\"&& e.SessionId.ToString() == \"' + this.sessionid + '\" && e.StatusId != 2')
                .then(response => {
                    this.data = (response as Array<ICampusChallanValidityVM>)
                });
        }
    }

    insertModel() {

        if (this.sessionid.length > 0 && this.campusId.length > 0 && this.ClassId.length > 0) {
            this.$modal.show('add-edit-model', { model: { challanValidityId: '', campusId: this.campusId, installmentNo: 0, fromDate: new Date(), toDate: new Date(), statusId: 0, loggerId: '', classId: this.ClassId }, IsNewRecord: true, installmentList: this.instList, SESSIONID: this.sessionid, campusid: this.campusId });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdowns",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }


    }

    editModel(model: ICampusChallanValidityVM) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false, installmentList: this.instList, SESSIONID: this.sessionid, campusid: this.campusId });
    }

    deleteModel(model: ICampusChallanValidityVM) {
        this.$modal.show('delete-model', { model: model, SESSIONID: this.sessionid, campusid: this.campusId });
    }
}
