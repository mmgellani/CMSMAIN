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

import { IFeeFeeStructure, ISetupZone, ISetupSession, ISetupProgram, ISetupShift, ISetupClass } from '../../../../models';
import { FeeFeeStructureService, SetupZoneService, SetupSessionService, SetupProgramDetailsService, SetupProgramService, SetupClassService, SetupShiftService } from '../../../../service';

import { FeeFeeStructureAddEdit } from '../add-edit';
import { FeeFeeStructureDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { FeeStructureEdit } from '../add-edit/edit';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': FeeFeeStructureAddEdit,
        'delete-model': FeeFeeStructureDelete,
        'feeStructure-edit':FeeStructureEdit
    }
})

export class FeeFeeStructureSingleList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeFeeStructureService;
    private data: Array<IFeeFeeStructure> = [];
    private filterString: string = '';
    private zoneId = ''
    private sessionId = ''
    private classId = ''
    private shiftId = ''
    private programId = ''


    private zoneList: Array<ISetupZone> = []
    private sessionList: Array<ISetupSession> = []
    private classList: Array<ISetupClass> = []
    private shiftList: Array<ISetupShift> = []
    private programList: Array<ISetupProgram> = []


    private zoneRepo: SetupZoneService = new SetupZoneService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private programRepo: SetupProgramService = new SetupProgramService(this.$store)

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [
        { key: 'programName', caption: 'Program' },
        { key: 'className', caption: 'Class / Level' },
        { key: 'shiftName', caption: 'Shift' },
        { key: 'feeHeadName', caption: 'Fee Head' },
        { key: 'feeAmount', caption: 'Fee Amount' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new FeeFeeStructureService(this.$store);
        this.loadZone();
        // this.loadSession();
        // this.loadPrograms();
        // this.loadShift();
        // this.loadClass();
    }
    loadZone() {
        this.zoneRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.zoneList = r as Array<ISetupZone>
            })
    }
    // loadShift() {
    //     this.shiftRepo.GetFindBy('e=>e.StatusId==1')
    //         .then(r => {
    //             this.shiftList = r as Array<ISetupShift>

    //         })
    // }
    // loadClass() {
    //     this.classRepo.GetFindBy('e=>e.StatusId==1')
    //         .then(r => {
    //             this.classList = r as Array<ISetupClass>

    //         })
    // }
    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }
    loadPrograms() {

        this.programRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.programList = r as Array<ISetupProgram>
            })
    }
    mounted() {
        this.validatePage();
        this.refreshData();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('feeFeeStructure' in this.user.claims) == true) {
                if (this.user.claims['feeFeeStructure'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeFeeStructure'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeFeeStructure'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeFeeStructure'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        if (this.zoneId.length > 0 && this.sessionId.length > 0 && this.programId.length > 0) {
            var key = this.zoneId + '?' + this.sessionId + '?' + this.programId;
            // alert(key)
            this.repository.GetAllVM(key)
                .then(response => 
                    {
                      this.data = response as Array<IFeeFeeStructure>
                    //   alert(JSON.stringify(this.data))

                    });
    
        }

    }

    insertModel() {
        if (this.zoneId.length > 0 && this.sessionId.length > 0 && this.programId.length > 0) {
             
            this.$modal.show('add-edit-model', { model: { feeStructureId: '', zoneId: this.zoneId, sessionId: this.sessionId, programId: this.programId, shiftId: this.shiftId, classId: this.classId, feeHeadId: '', feeAmount: 0, statusId: 0, loggerId: '', }, IsNewRecord: true });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Select Drop Down Values',
                title: 'warning',
                messageTypeId: PayloadMessageTypes.error
            });
        }
    }

    editModel(model: IFeeFeeStructure) {
        this.$modal.show('edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IFeeFeeStructure) {
        this.$modal.show('delete-model', { model: model });
    }
}