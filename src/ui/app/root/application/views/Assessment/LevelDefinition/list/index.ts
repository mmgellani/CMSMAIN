// /*
// *   Auther: H.Muhammad Kamran
// *   email: hmuhdkamran@gmail.com
// *   contact: +92 (313 / 333) 9112 845
// */

// import Vue from 'vue';
// import { State } from 'vuex-class';
// import Component from 'vue-class-component';

// import { IUser, PayloadMessageTypes } from '../../../../../../model';
// import { IRootStoreState } from '../../../../../store';

// import { IExaminationExamType, IExaminationExamMasterVM } from '../../../../models';
// import { ExaminationExamTypeService, ExaminationExamMasterService } from '../../../../service';

// import { LevelDefinitionAddEdit } from '../add-edit';
// import { LevelDefinitionDelete } from '../delete';
// import { StoreTypes } from '../../../../../../store';
// import { LevelDefinitionService } from '../../../../service/Assessment/LevelDefinition';
// import { ILevelDefinition } from '../../../../models/Assessment/LevelDefinition';

// @Component({
//     name: 'models-form-list',
//     template: require('./index.html'),
//     components: {
//         'LevelDefinition-add-edit-model': LevelDefinitionAddEdit,
//         'delete-model': LevelDefinitionDelete
//     }
// })

// export class LevelDefinition extends Vue {
//     @State((state: IRootStoreState) => state.common.user) user: IUser;

//     private repository: LevelDefinitionService;
//     private data: Array<ILevelDefinition> = [];
//     private filterString: string = '';

//     private canRead: boolean = false;
//     private canAdd: boolean = false;
//     private canEdit: boolean = false;
//     private canDelete: boolean = false;
//     // private levelDefinitionModel: Array<IExaminationExamMasterVM> = [];
//     private repositoryExamMaster: ExaminationExamMasterService;

//     private columns = [
//         { key: 'fullName', caption: "FullName" },
//         { key: 'code', caption: 'Code' },
//         { key: 'statusId', caption: 'Status' },
//         { key: 'action', caption: 'Action', width: 120 }
//     ];

//     created() {
//         this.repository = new LevelDefinitionService(this.$store);
//         this.repositoryExamMaster = new ExaminationExamMasterService(this.$store);
//     }

//     mounted() {
//         this.validatePage();
//         this.refreshData();
//         // this.getExamMaster();
//     }

//     // getExamMaster() {
//     //     this.examMasterModel = [];
//     //     this.repositoryExamMaster.GetFindBy('e => e.StatusId!=2')
//     //         .then(response => this.examMasterModel = (response as Array<IExaminationExamMasterVM>));
//     // }

//     validatePage() {
//         if (this.user.roles.indexOf('admin') >= 0) {
//             this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
//         }
//         else {
//             if (('LevelDefinition' in this.user.claims) == true) {
//                 if (this.user.claims['LevelDefinition'].indexOf('R') >= 0) {
//                     this.canRead = true;
//                 }
//                 if (this.user.claims['LevelDefinition'].indexOf('C') >= 0) {
//                     this.canAdd = true;
//                 }
//                 if (this.user.claims['LevelDefinition'].indexOf('U') >= 0) {
//                     this.canEdit = true;
//                 }
//                 if (this.user.claims['LevelDefinition'].indexOf('D') >= 0) {
//                     this.canDelete = true;
//                 }
//             } else {
//                 this.$router.push('Home');
//             }
//         }
//     }

//     refreshData() {
//         this.data = [];
//         this.repository.GetFindBy('e=> e.StatusId != 2')
//             .then(response => this.data = (response as Array<ILevelDefinition>));
            
//     }

//     insertModel() {
//         this.$modal.show('LevelDefinition-add-edit-model', { model: { examTypeId: '', code: '', fullName: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
//     }

//     editModel(model: ILevelDefinition) {
//         this.$modal.show('LevelDefinition-add-edit-model', { model: model, IsNewRecord: false });
//     }

//     deleteModel(model: ILevelDefinition) {

//         // if (this.examMasterModel.filter(e => e.levelId == model.levelId).length > 0) {
//         //     this.$store.dispatch(StoreTypes.updateStatusBar, {
//         //         text: "This Parent Child Relation Cannot be Deleted",
//         //         title: "Success",
//         //         messageTypeId: PayloadMessageTypes.success
//         //     });
//         // }

//         // else {
//         //     this.$modal.show('delete-model', { model: model });
//         // }

//     }
// }
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

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

import { IExaminationExamType, IExaminationExamMasterVM } from '../../../../models';
import { ExaminationExamTypeService, ExaminationExamMasterService } from '../../../../service';

// import { ExaminationExamTypeAddEdit, LevelDefinitionAddEdit } from '../add-edit';
// import { ExaminationExamTypeDelete, LevelDefinitionDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { LevelDefinitionService } from '../../../../service/Assessment/LevelDefinition';
import { ILevelDefinition } from '../../../../models/Assessment/LevelDefinition';
import { LevelDefinitionAddEdit } from '../add-edit';
import { LevelDefinitionDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'LevelDefinition-add-edit-model': LevelDefinitionAddEdit,
        'delete-model': LevelDefinitionDelete
    }
})

export class LevelDefinition extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: LevelDefinitionService;
    private data: Array<ILevelDefinition> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    // private examMasterModel: Array<IExaminationExamMasterVM> = [];
    private levelModel: Array<ILevelDefinition> = [];
    // private repositoryExamMaster: ExaminationExamMasterService;

    private columns = [
        { key: 'fullName', caption: "Level Name" },
        { key: 'code', caption: 'Code' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new LevelDefinitionService(this.$store);
        // this.repositoryExamMaster = new ExaminationExamMasterService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        // this.getExamMaster();
    }

    // getExamMaster() {
    //     this.examMasterModel = [];
    //     this.repositoryExamMaster.GetFindBy('e => e.StatusId!=2')
    //         .then(response => this.examMasterModel = (response as Array<IExaminationExamMasterVM>));
    // }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('levelDefinition' in this.user.claims) == true) {
                if (this.user.claims['levelDefinition'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['levelDefinition'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['levelDefinition'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['levelDefinition'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e=>e.StatusId != 2')
            .then(response => this.data = (response as Array<ILevelDefinition>));
            
    }

    insertModel() {
        this.$modal.show('LevelDefinition-add-edit-model', { model: { levelId: '', code: '', fullName: '', statusId: 0 }, IsNewRecord: true });
    }

    editModel(model: ILevelDefinition) {
        this.$modal.show('LevelDefinition-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ILevelDefinition) {

        if (this.levelModel.filter(e => e.levelId == model.levelId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }

        else {
            this.$modal.show('delete-model', { model: model });
        }

    }
}