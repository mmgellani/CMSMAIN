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

import { IAttendanceAttendanceDetail, IAttendanceAttendenceMaster, IAdmissionStudents, IAdmissionAdmissionForm, IAttendanceAttendenceStatus, IAttendanceAttendenceMasterVM, IAdmissionAdmissionFormVM, IRegistrationProgramCourseLink, RegistrationProgramCourseLinkVM } from '../../../../models';
import { AttendanceAttendanceDetailService, AttendanceAttendenceMasterService, AdmissionStudentsService, AttendanceAttendenceStatusService, AdmissionAdmissionFormService, RegistrationProgramCourseLinkService } from '../../../../service';

import * as helper from '../../../../helper';

import { AttendanceAttendenceMasterAddEdit } from '../../AttendenceMaster/add-edit';
import { IAttendanceLeaves, LeaveInfo } from '../../../../models/Attendance/Attendenceleave';
import { State } from 'vuex-class';
import { IRootStoreState } from '../../../../../store';
import { LeaveManagementAddEdit } from '../add-edit';
import { LeaveManagementCommon } from '../addedit-leave';

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
export interface ValtoPass {
    clsid: string;
    progrmdtlid: string;
    adfrmid: string;

}
@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'view-leave-model',
    template: require('./index.html'),
    components: {
        'add-edit-leave': LeaveManagementCommon
    },

})

export class LeaveManagementViewLeave extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private classid: string = '';
    private programdetailid: string = '';
    private admissionformid: string = '';
    Leaveinfolist: Array<IAttendanceLeaves> = [];
    TempLeaveinfolist: Array<IAttendanceLeaves> = [];
    private attendanceDetailRepo: AttendanceAttendanceDetailService = new AttendanceAttendanceDetailService(this.$store)
    public editLeave: boolean = false;

    private obj: ValtoPass = {
        clsid: '',
        progrmdtlid: '',
        adfrmid: ''
    }




    beforeModalOpen(event) {
        this.editLeave = false;
        this.Leaveinfolist = [];
        this.admissionformid = event.params.AdmissionFormID;
        this.attendanceDetailRepo.GetLeaveInfo(this.admissionformid).then(
            r => {
                this.Leaveinfolist = r as Array<IAttendanceLeaves>
            }

        )
        this.classid = event.params.ClassID;
        this.programdetailid = event.params.ProgramDetailID;
        this.obj.adfrmid = this.admissionformid;
        this.obj.clsid = this.classid;
        this.obj.progrmdtlid = this.programdetailid;
    }




    oopen() {

        this.$modal.show('add-edit-model');
    }
    getDays(fromDate: any, ToDate: any) {
        var date2 = new Date(ToDate);
        var date1 = new Date(fromDate);
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        return dayDifference;

    }
    cancel() {
        this.$modal.hide('view-leave-model');
    }
    private editModel: any= {
        leaveId: '', admissionFormId: '', fromDate: new Date(), toDate: new Date(), isPartial: false, isApproved: false, programCourseLinkId: '', information: ''
    }; 
    edit(data) {
        this.editLeave = true;
        Object.assign(this.editModel, data);
        console.log(JSON.stringify(this.editModel))
        // this.$modal.hide('view-leave-model',);
    }

    saveModel() {
    }

}



