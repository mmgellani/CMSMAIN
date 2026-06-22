/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IAdmissionStudents } from '../../../../models';
import { AdmissionStudentsService } from '../../../../service';
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


export class AdmissionStudentsPassword extends Vue {
    private repository: AdmissionStudentsService;
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

    created() {
        this.repository = new AdmissionStudentsService(this.$store);
    }

    beforeModalOpen(event) {
        this.data.studentid = event.params.model.studentId;
        this.data.refferenceNo = event.params.model.refferenceNo;
        this.data.rollNo = event.params.model.rollNo;
        this.data.password = event.params.PASSWORD;
        this.data.fullName = event.params.model.fullName;



    }

    cancel() {
        this.$modal.hide('student-password-model');

    }

    sendMessage() {
        var z = "Hello, You can now login to el.cms.edu with your username: " + this.data.rollNo + "@cms.edu.pk  and password : " + this.data.password + "."

        this.repository.AddMessage(this.data.studentid + '?' + z).then(
            r => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Messge has been Sended successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                })
                  this.cancel();
               


            })
    }


}


