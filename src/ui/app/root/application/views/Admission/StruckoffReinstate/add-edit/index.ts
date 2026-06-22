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

import { AttendanceAttendenceMasterAddEdit } from '../../../Attendance/AttendenceMaster/add-edit';
import { IAttendanceLeaves, LeaveInfo } from '../../../../models/Attendance/Attendenceleave';
import { State } from 'vuex-class';
import { IRootStoreState } from '../../../../../store';
import { IStruckoffReinstate } from '../../../../models/Admission/struckoffReinstate';
import { StruckoffReinstateService } from '../../../../service/Admission/StruckoffReinstate';
import moment from 'moment';

type ValidateStruckoffReinstate = { model: IStruckoffReinstate, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateStruckoffReinstate> = {
    model: {
        struckoffDate: { required },
        shouldAbsent: { required }

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),

})
export class StruckoffReinstateAddEdit extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private model: IStruckoffReinstate = { admissionFormId: '', reinstateDate: new Date(), reinstateReason: '', shouldAbsent: false, struckoffDate: new Date(), struckoffReason: '', struckoffReinstateId: '' }
    private IsNewRecord: boolean = true;
    private title: string = '';
    private isActive: boolean = true
    private classid: string = '';
    private programdetailid: string = '';
    private admissionformid: string = '';
    private repo: StruckoffReinstateService = new StruckoffReinstateService(this.$store);
    private reinstateDateStr = '';
    private struckofList: any = [];
private struckoffdate :Date;
private Reinstatdate :Date;
private modalParams: any = {};
    created() {

    }
    

    beforeModalOpen(event) {
            this.modalParams = event.params; // ✅ save params

        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        this.classid = event.params.ClassID;
        this.programdetailid = event.params.ProgramDetailID;
        this.admissionformid = event.params.AdmissionFormID;
        this.IsNewRecord = event.params.IsNewRecord;

        if (!this.IsNewRecord) {
            Object.assign(this.model, event.params.modelVM)
            //this.reinstateDateStr = this.model.reinstateDate.toString();
            
        }
    }


 refreshData2() {
        if (this.admissionformid.length > 0) {
            this.repo.StruckofListData(this.admissionformid )
                .then(r => {
                    this.struckofList = r ;
                })

        }
    }
    cancel() {
        debugger;
        this.model = { admissionFormId: '', reinstateDate: new Date, reinstateReason: '', shouldAbsent: false, struckoffDate: new Date(), struckoffReason: '', struckoffReinstateId: '' }
        this.reinstateDateStr = '';
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
     if (this.modalParams && this.modalParams.onComplete) {
    this.modalParams.onComplete();
}
    }

    saveModel() {
debugger;
        if (this.IsNewRecord) {

            if(this.model.struckoffReason.length < 1 || this.model.struckoffDate ==null) {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Please fill in all required fields.',
                    title: 'Error',
                    messageTypeId: PayloadMessageTypes.error
                })
                return;
            }

            this.model.struckoffReinstateId = helper.newGuid();
            this.model.admissionFormId = this.admissionformid;
            this.model.struckoffDate = new Date(this.model.struckoffDate);
            if (this.reinstateDateStr.length > 0) {
                this.model.reinstateDate = new Date(this.reinstateDateStr);
            }
            else {
                this.model.reinstateDate = new Date('');
            }
            debugger;
            this.model.shouldAbsent = true;
            this.repo.CheckStruckoff(this.model.admissionFormId)
                .then(e => {
                    if (e == 0) {
                        var z =new Date(helper.formateDate(this.model.struckoffDate));
                        this.model.struckoffDate=z;

                        this.repo.AddOne(this.model)

                            .then(r => {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: 'Record has been Added successfully',
                                    title: 'Success',
                                    messageTypeId: PayloadMessageTypes.success
                                })
                                this.cancel();
  onComplete: () => {
            this.refreshData2();
        }                            })

                    }
                    else {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Student already StruckOff',
                            title: 'error',
                            messageTypeId: PayloadMessageTypes.error
                        })
                    }
                })

        }
        else {
            if(this.model.reinstateReason.length < 1 || this.model.reinstateDate==null
            ) {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Please fill in all required fields.',
                    title: 'Error',
                    messageTypeId: PayloadMessageTypes.error
                })
                return;
            }
// this.struckoffdate = moment(this.model.struckoffDate).format('YYYY-MM-DD')
//                 this.model.reinstateDate = moment(this.model.reinstateDate).format('YYYY-MM-DD')
 const reinstate = new Date(this.model.reinstateDate);
const struckoff = new Date(this.model.struckoffDate);

// remove time part
reinstate.setHours(0, 0, 0, 0);
struckoff.setHours(0, 0, 0, 0);

if (reinstate.getTime() < struckoff.getTime()) {
    this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'Reinstate date cannot be earlier than Struckoff date.',
        title: 'Error',
        messageTypeId: PayloadMessageTypes.error
    });
    return;
}


           
            this.model.struckoffDate = new Date(this.model.struckoffDate);
            // this.model.reinstateDate = new Date(this.reinstateDateStr);
            if (this.model.reinstateDate.getFullYear().toString() != '1') {
                this.model.shouldAbsent = false;
            }

            var z =new Date(helper.formateDate(this.model.reinstateDate));
            this.model.reinstateDate=z;

            this.repo.Update(this.model)
                .then(r => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Record has been Udpated successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                    this.cancel();
  onComplete: () => {
            this.refreshData2();
        }
                })
        }



    }

     

    disablePastDates(date: Date) {
        debugger;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date.getTime() < today.getTime();
}
    get allowSubmit() {
        // return (this.data.attendanceMasterId.length > 0) && (this.data.admissionFormId.length > 0) && (this.data.attendenceStatusId.length > 0);
        return true;
    }
    $v: Vuelidate<any>;
}


