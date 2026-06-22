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
import { PayloadMessageTypes } from '../../../../../../model';

import { IFeeConcession, ISetupZone, ISetupSession, ISetupProgram, ISetupShift, IFeeChallanType } from '../../../../models';
import { FeeConcessionService, SetupZoneService, SetupSessionService, SetupProgramService, SetupShiftService, FeeChallanTypeService } from '../../../../service';

import * as helper from '../../../../helper';

import { FeeChallanTypeAddEdit } from '../../ChallanType/add-edit';
import { SetupShiftAddEdit } from '../../../Setup/Shift/add-edit';
import { SetupProgramAddEdit } from '../../../Setup/Program/add-edit';
import { SetupSessionAddEdit } from '../../../Setup/Session/add-edit';
import { SetupZoneAddEdit } from '../../../Setup/Zone/add-edit';

type ValidateFeeConcession = { data: IFeeConcession, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeConcession> = {
    data: {
        // concessionId: {
        //     required
        // },
        zoneId: {
            required
        },
        sessionId: {
            required
        },
        programId: {
            required
        },
        shiftId: {
            required
        },
        challanTypeId: {
            required
        },
        fullName: {
            required,
            maxLength: maxLength(50)
        },
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'Concession-add-edit-model',
    template: require('./index.html'),
    components: {
        'ChallanType': FeeChallanTypeAddEdit,
        'Shift': SetupShiftAddEdit,
        'Zone': SetupZoneAddEdit,
        'Program': SetupProgramAddEdit,
        'Session': SetupSessionAddEdit
    }
})
export class FeeConcessionAddEdit extends Vue {
    private repository: FeeConcessionService;
    private zonerepository: SetupZoneService = null;
    private zoneList: Array<ISetupZone> = [];
    private Sessionrepository: SetupSessionService = null;
    private SessionList: Array<ISetupSession> = [];
    private Programrepository: SetupProgramService = null;
    private ProgramList: Array<ISetupProgram> = [];
    private shiftrepository: SetupShiftService = null;
    private ShiftList: Array<ISetupShift> = [];
    private ChallanTyperepositry: FeeChallanTypeService = null;
    private ChallantypeList: Array<IFeeChallanType> = [];
    private isActive: boolean = true;
    private data: IFeeConcession = {
        concessionId: '', zoneId: '', sessionId: '', programId: '', shiftId: '', challanTypeId: '', fullName: '', statusId: 0, loggerId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new FeeConcessionService(this.$store);
        this.zonerepository = new SetupZoneService(this.$store);
        this.zonerepository.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.zoneList = res as Array<ISetupZone>

        })
        this.Sessionrepository = new SetupSessionService(this.$store);
        this.Sessionrepository.GetFindBy('e=>e.StatusId!=2').then(res => { this.SessionList = res as Array<ISetupSession> })

        this.Programrepository = new SetupProgramService(this.$store);
        this.Programrepository.GetFindBy('e=>e.StatusId!=2').then(res => { this.ProgramList = res as Array<ISetupProgram> })

        this.shiftrepository = new SetupShiftService(this.$store);
        this.shiftrepository.GetFindBy('e=>e.StatusId!=2').then(res => { this.ShiftList = res as Array<ISetupShift> })

        this.ChallanTyperepositry = new FeeChallanTypeService(this.$store);
        this.ChallanTyperepositry.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.ChallantypeList = res as Array<IFeeChallanType>
        })
    }

    addNewChallanType() {
        this.$modal.show('ChallanType-add-edit-model', { IsNewRecord: true });

    }
    loadChallanType() {
        this.ChallanTyperepositry.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.ChallantypeList = res as Array<IFeeChallanType>
        });

    }

    addNewShift() {
        this.$modal.show('Shift-add-edit-model', { IsNewRecord: true });

    }
    loadShift() {
        this.shiftrepository.GetFindBy('e=>e.StatusId!=2').then(res => { this.ShiftList = res as Array<ISetupShift> });

    }

    addNewZone() {
        this.$modal.show('Zone-add-edit-model', { IsNewRecord: true });

    }
    loadZone() {
        this.zonerepository.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.zoneList = res as Array<ISetupZone>

        });

    }

    addNewProgram() {
        this.$modal.show('Program-add-edit-model', { IsNewRecord: true });

    }
    loadProgram() {
        this.Programrepository.GetFindBy('e=>e.StatusId!=2').then(res => { this.ProgramList = res as Array<ISetupProgram> });

    }

    addNewSession() {
        this.$modal.show('Session-add-edit-model', { IsNewRecord: true });

    }
    loadSession() {
        this.Sessionrepository.GetFindBy('e=>e.StatusId!=2').then(res => { this.SessionList = res as Array<ISetupSession> });

    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        this.isActive = this.data.statusId == 1 ? true : false;
    }

    cancel() {
        this.$modal.hide('Concession-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.concessionId = helper.newGuid();
                this.data.statusId = 1;
                this.data.loggerId = helper.newGuid();
                
                this.repository.AddOne(this.data)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been inserted successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });
            } else {
                if (this.isActive == true) {
                    this.data.statusId = 1
                }
                else {
                    this.data.statusId = 0
                }
                this.repository.Update(this.data)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been updated successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });
            }
        }
    }
    get allowSubmit() {
        return (this.data.zoneId.length > 0) && (this.data.sessionId.length > 0) && (this.data.programId.length > 0) && (this.data.shiftId.length > 0) && (this.data.challanTypeId.length > 0) && (this.data.fullName.length > 0);
    }
    $v: any;
}