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

import { IAttendanceAttendanceDetail, IAttendanceAttendenceMaster, IAdmissionStudents, IAdmissionAdmissionForm, IAttendanceAttendenceStatus, IAttendanceAttendenceMasterVM, IAdmissionAdmissionFormVM, VWAttendanceHistory } from '../../../../models';
import { AttendanceAttendanceDetailService, AttendanceAttendenceMasterService, AdmissionStudentsService, AttendanceAttendenceStatusService, AdmissionAdmissionFormService } from '../../../../service';

import * as helper from '../../../../helper';

import { AttendanceAttendenceMasterAddEdit } from '../../AttendenceMaster/add-edit';

type ValidateAttendanceAttendanceMaster = { model: VWAttendanceHistory, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateAttendanceAttendanceMaster> = {
    model: {

        attendanceMasterId: { required },
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'detail-model',
    template: require('./index.html')

})
export class AttendanceAttendanceHistoryDetail extends Vue {
    private repository: AttendanceAttendenceMasterService;

    private data: Array<VWAttendanceHistory>=[];
    private IsNewRecord: boolean = true;
    private title: string = 'View Details';
    private isActive: boolean = true;

    private model = {
        browserInfo: '',
        count: '',
        dated: ''
    };

    created() {
        this.repository = new AttendanceAttendenceMasterService(this.$store);
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        // this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        //Object.assign(this.data, event.params.model);
        this.model = event.params.model;

        this.loadHistory();
    }

    cancel() {
        this.$modal.hide('detail-model');
        this.$emit("submit");
    }

    loadHistory() {
        this.data = [];
        // alert(this.selectedDate)
        var params = (this.model.dated.indexOf('T') >= 0 ? this.model.dated.split('T')[0] : this.model.dated) + '?' + this.model.browserInfo;
        console.log(params);
        this.repository.GetAttendanceHistory(params)
            .then(response => this.data = (response as Array<VWAttendanceHistory>));

    }
    $v: Vuelidate<any>;
}