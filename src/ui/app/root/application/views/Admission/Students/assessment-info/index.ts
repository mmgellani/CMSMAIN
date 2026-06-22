/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IAdmissionStudents, IAttendanceAttendanceStudentInfo, IExamMonthlyReport, IExamMonthlyReportExx ,IStudentProfileCourseView,IStudentProfileApproved} from '../../../../models';
import { AdmissionStudentsService } from '../../../../service';
import { AssessmentSchemeMasterService } from "../../../../service/Assessment/AssesmentMaster";

@Component({
    name: 'delete-modal',
    template: require('./index.html'),
    props: ["data"]
})
export class AssessmentInfo extends Vue {
    private repository: AssessmentSchemeMasterService;
    private title: string = 'AttendenceDetail';
    private rollNo: string = '';
    private referenceNo: string = '';
    private name: string = '';
    
    private data: Array<IStudentProfileCourseView> = (<any>this).data; 
    created() {
        this.repository = new AssessmentSchemeMasterService(this.$store);
    }
 

    mounted() {
        if (this.data) {
            if (this.data.length > 0) { 
                 
            }
        }
    }


    cancel() {
        this.$modal.hide('exam-model');
        this.$emit("submit");
    }
 
}