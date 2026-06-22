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

import { IAttendanceAttendanceDetail, IAttendanceAttendenceMaster, IAdmissionStudents, IAdmissionAdmissionForm, IAttendanceAttendenceStatus, IAttendanceAttendenceMasterVM, IAdmissionAdmissionFormVM } from '../../../../models';
import { AttendanceAttendanceDetailService, AttendanceAttendenceMasterService, AdmissionStudentsService, AttendanceAttendenceStatusService, AdmissionAdmissionFormService } from '../../../../service';

import * as helper from '../../../../helper';

import { AttendanceAttendenceMasterAddEdit } from '../../AttendenceMaster/add-edit';

type ValidateAttendanceAttendanceDetail = { model: IAttendanceAttendanceDetail, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateAttendanceAttendanceDetail> = {
    model: {
        attendanceDetailId: { required },
        attendanceMasterId: { required },
        admissionFormId: { required },
        attendenceStatusId: { required },
        statusId: { required },
        loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'AttendenceMaster': AttendanceAttendenceMasterAddEdit
    }
})
export class AttendanceAttendanceDetailAddEdit extends Vue {
    private repository: AttendanceAttendanceDetailService;
    private AttendenceMasterrepository: AttendanceAttendenceMasterService;
    private Admissionformrepository: AdmissionAdmissionFormService;
    private AttendenceStatusrepository: AttendanceAttendenceStatusService;

    private AttendenceMasterList: Array<IAttendanceAttendenceMasterVM> = [];
    private AdmissionformList: Array<IAdmissionAdmissionFormVM> = [];
    private AttendenceStatusList: Array<IAttendanceAttendenceStatus> = [];

    private data: IAttendanceAttendanceDetail = {
        attendanceDetailId: '', attendanceMasterId: '', admissionFormId: '', attendenceStatusId: '', statusId: 0, loggerId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private isActive: boolean = true

    created() {
        this.repository = new AttendanceAttendanceDetailService(this.$store);
        this.AttendenceMasterrepository = new AttendanceAttendenceMasterService(this.$store);
        this.Admissionformrepository = new AdmissionAdmissionFormService(this.$store);
        this.AttendenceStatusrepository = new AttendanceAttendenceStatusService(this.$store);
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);

        this.AttendenceMasterrepository.GetFindBy('e=>e.StatusId==1').then(res => {

            this.AttendenceMasterList = res as Array<IAttendanceAttendenceMasterVM>
        })

        this.Admissionformrepository.GetAll().then(res => {
            this.AdmissionformList = res as Array<IAdmissionAdmissionFormVM>
        })

        this.AttendenceStatusrepository.GetFindBy('e=>e.StatusId==1').then(res => {
        this.AttendenceStatusList = res as Array<IAttendanceAttendenceStatus>
        })


    }

    addNewAttendenceMaster() {
        this.$modal.show('AttendenceMaster-add-edit-model', { IsNewRecord: true });

    }
    loadAttendenceMaster() {
        this.AttendenceMasterrepository.GetFindBy('e=>e.StatusId==1').then(res => {

            this.AttendenceMasterList = res as Array<IAttendanceAttendenceMasterVM>
        });

    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        if (this.IsNewRecord) {
            this.data.attendanceDetailId = helper.newGuid();
            this.data.statusId = 1;
            this.data.loggerId = helper.newGuid();

            this.repository.AddOne(this.data)
                .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
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
                .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
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
        return (this.data.attendanceMasterId.length > 0) && (this.data.admissionFormId.length > 0) && (this.data.attendenceStatusId.length > 0);
    }
    $v: Vuelidate<any>;
}