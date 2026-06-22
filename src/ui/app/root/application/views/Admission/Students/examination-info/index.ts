/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IAdmissionStudents, IAttendanceAttendanceStudentInfo, IExamMonthlyReport, IExamMonthlyReportExx } from '../../../../models';
import { AdmissionStudentsService } from '../../../../service';

@Component({
    name: 'delete-modal',
    template: require('./index.html'),
    props: ["data"]
})
export class ExamStudents extends Vue {
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
    private title: string = 'AttendenceDetail';
    private rollNo: string = '';
    private referenceNo: string = '';
    private name: string = '';

    private data: Array<IExamMonthlyReportExx> = (<any>this).data;

    created() {
        this.repository = new AdmissionStudentsService(this.$store);
    }

    // beforeModalOpen(event) {
    //     this.data = event.params.model as Array<IExamMonthlyReport>;
    //     if (this.data) {
    //         if (this.data.length > 0) {
    //             this.rollNo = this.data[0].rollNo;
    //             this.referenceNo=this.data[0].refferenceNo;
    //             this.name = this.data[0].studentName;
    //         }
    //     }

    // }


    mounted() {
        if (this.data) {
            if (this.data.length > 0) {
                this.rollNo = this.data[0].rollNo;
                //this.referenceNo=this.data[0].refferenceNo;
                this.name = this.data[0].studentName;
            }
        }
    }


    cancel() {
        this.$modal.hide('exam-model');
        this.$emit("submit");
    }

    // deleteModel() {
    //     this.data.statusId=2;
    //     this.repository.Update(this.data)
    //         .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
    //             text: 'Record has been Deleted successfully',
    //             title: 'Deleted',
    //             messageTypeId: PayloadMessageTypes.warning
    //         })
    //         this.cancel();
    //     });

    //     this.cancel();
    // }
}