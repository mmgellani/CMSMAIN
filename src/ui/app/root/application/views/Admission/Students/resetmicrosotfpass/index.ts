import { AdmissionStudentsService } from '../../../../service';
import Component from 'vue-class-component';
import { IAdmissionStudents } from '../../../../models';
import { MigrationService } from './../../../../service/Migration/migration-service';
import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/








export interface studentPasswordInfo {
    refferenceNo: string;
    rollNo: string;
    password: string;
    studentid: string;
    fullName: string;


}

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})


export class StudentMicrosoftPassword extends Vue {
    private repository: AdmissionStudentsService;
    private migrep:MigrationService;
    // private data: IAttendanceAttendanceStudentInfo = { newID: '',
    // admissionFormId: '',
    // studentName: '',
    // dated: '',
    // dayName: '',
    // refferenceNo: '',
    // campusName: '',
    // sessionName: '',
    // rollNo: '',
    // description: '',
    // programName: '',
    // sectionName: '',
    // className: '',
    // shiftName: '',
    // courseName: '',
    // attendanceStatus: '',};
    private title: string = 'Student Message ';

    private name: string = '';

    private data: studentPasswordInfo = {
        refferenceNo: '',
        rollNo: '',
        password: '',
        studentid: '',
        fullName: ''

    }
    sessionName: any='';
    fullName: any='';

    created() {
        this.repository = new AdmissionStudentsService(this.$store);
        this.migrep = new MigrationService(this.$store);
    }

    beforeModalOpen(event) {
        this.data.studentid = event.params.model.studentId;
        this.data.refferenceNo = event.params.model.refferenceNo;
        this.data.rollNo = event.params.model.rollNo+"@cms.edu.pk";
        this.data.password = '';
        this.data.fullName = event.params.model.fullName;

        this.sessionName = event.params.model.sessionName
        this.fullName = event.params.model.fullName

    }

    cancel() {
        this.$modal.hide('microsof-password-model');

    }

    updMicrosoftPass() {

        this.migrep.UpdateMicrosoftPas(this.data.rollNo + '?' +this.fullName).then(
            r => {

                alert(JSON.stringify(r))
                // this.$store.dispatch(StoreTypes.updateStatusBar, {
                //     text: r.Code,
                //     title: 'Success',
                //     messageTypeId: PayloadMessageTypes.success
                // })
                  this.cancel();
               


            })
    }

    CreateMicrosoftUser() {

        this.migrep.CreateMicrosoftUser(this.data.rollNo + '?' +this.fullName+'?'+ this.data.password+'?'+this.sessionName).then(
            r => {

                alert(JSON.stringify(r))
                // this.$store.dispatch(StoreTypes.updateStatusBar, {
                //     text: r.Code,
                //     title: 'Success',
                //     messageTypeId: PayloadMessageTypes.success
                // })
                  this.cancel();
               


            })
    }


}


