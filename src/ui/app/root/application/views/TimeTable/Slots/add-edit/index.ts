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

import { ITimeTableSlots, ISetupCampus, ISetupShift } from '../../../../models';
import { TimeTableSlotsService, SetupCampusService, SetupShiftService } from '../../../../service';

import * as helper from '../../../../helper';
import { SetupCampusAddEdit } from '../../../Setup/Campus/add-edit';
import { SetupShiftAddEdit } from '../../../Setup/Shift/add-edit';

type ValidateTimeTableSlots = { data: ITimeTableSlots, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateTimeTableSlots> = {
    data: {
        shiftId: { required },
        startTime: { required },
        endTime: { required }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'Slots-add-edit-model',
    template: require('./index.html'),
    components: {
        'Shift': SetupShiftAddEdit,
        'Campus': SetupCampusAddEdit
    }
})
export class TimeTableSlotsAddEdit extends Vue {
    private repository: TimeTableSlotsService;
    private repo: SetupCampusService;
    private repos: SetupShiftService;
    campusList: Array<ISetupCampus> = []
    shiftList: Array<ISetupShift> = []
    isActive: boolean = true;
    private SlotsModel: Array<ITimeTableSlots> = [];
    private data: ITimeTableSlots = {
        slotId: '', shiftId: '', startTime: '', endTime: '', statusId: 0, loggerId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new TimeTableSlotsService(this.$store);
        this.repo = new SetupCampusService(this.$store);
        this.repos = new SetupShiftService(this.$store);
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else if (this.data.statusId == 0) {
            this.isActive = false;
        }
        this.repo.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.campusList = res as Array<ISetupCampus>

        });
        this.repos.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.shiftList = res as Array<ISetupShift>

        });
        this.repository.GetAll().then(
            res => {
                this.SlotsModel = res as Array<ITimeTableSlots>
            });
    }

    addNewShift() {
        this.$modal.show('Shift-add-edit-model', { IsNewRecord: true });

    }
    loadShift() {
        this.repos.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.shiftList = res as Array<ISetupShift>

        });
    }

    addNewCampus() {
        this.$modal.show('Campus-add-edit-model', { IsNewRecord: true });

    }
    loadCampus() {
        this.repo.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.campusList = res as Array<ISetupCampus>

        });

    }

    cancel() {
        this.$modal.hide('Slots-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.loggerId = helper.newGuid();
                this.data.slotId = helper.newGuid();
                this.data.statusId = 1;
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
                    this.data.statusId = 1;
                }

                else {
                    this.data.statusId = 0;
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


            this.cancel();
        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}