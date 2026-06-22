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

import { IAttendanceAttendenceMaster, ITimeTableTimeTableVM } from '../../../../models';
import { AttendanceAttendenceMasterService, TimeTableTimeTableService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateAttendanceAttendenceMaster = { model: IAttendanceAttendenceMaster, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateAttendanceAttendenceMaster> = {
    model: {
        // attendenceMasterId: { required },
        timeTableId: { required },
        // dated: { required },
        // isApproved: { required },
        // statusId: { required },
        // loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'AttendenceMaster-add-edit-model',
    template: require('./index.html')
})
export class AttendanceAttendenceMasterAddEdit extends Vue {
    private repository: AttendanceAttendenceMasterService;
    private TimeTableRepository: TimeTableTimeTableService = null;
    private TimeTableList: Array<ITimeTableTimeTableVM> = [];
    private data: IAttendanceAttendenceMaster = {
        attendenceMasterId: '', timeTableId: '', dated: new Date(), isApproved: true, statusId: 0, loggerId: '',operation:''
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private isActive: boolean = true;
    private campusId = ''
    private sessionId = ''
    private campusProgramId = '';
    private programDetailId = '';
    private classId = ''

    created() {
        this.repository = new AttendanceAttendenceMasterService(this.$store);
        this.TimeTableRepository = new TimeTableTimeTableService(this.$store);
    }

    mounted() {
       
    }

    loadTimeTable() {
        var key = this.sessionId + '?' + this.campusId + '?' + this.programDetailId + '?' + this.classId;
        this.TimeTableRepository.GetFindByVM(key).then(res => {
            this.TimeTableList = res as Array<ITimeTableTimeTableVM>
        }
        )
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        this.campusId = event.params.model.campusId;
        this.programDetailId = event.params.model.programDetailId;
        this.classId = event.params.model.classId;
        this.sessionId = event.params.model.sessionId;
        this.loadTimeTable();
    }

    cancel() {
        this.$modal.hide('AttendenceMaster-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        if (this.IsNewRecord) {
            this.data.attendenceMasterId = helper.newGuid();
            this.data.statusId = 1;
            this.data.dated = new Date(this.data.dated);
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

        this.cancel();
    }

    get allowSubmit() {
        return (this.data.timeTableId.length > 0);
    }

    $v: Vuelidate<any>;
}