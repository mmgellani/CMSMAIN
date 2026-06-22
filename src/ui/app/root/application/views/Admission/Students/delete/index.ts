/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IAdmissionStudents, IAttendanceAttendanceStudentInfo } from '../../../../models';
import { AdmissionStudentsService } from '../../../../service';

@Component({
    name: 'delete-modal',
    template: require('./index.html'),
    props: ["data"]
})
export class AdmissionStudentsDelete extends Vue {
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
    private rollNo:string = '';
    private referenceNo:string = '';
    private name:string = '';

    private data:Array<IAttendanceAttendanceStudentInfo>= (<any>this).data;

    created() {
        this.repository = new AdmissionStudentsService(this.$store);
    }

    mounted() {
        if(this.data)
        {
            if(this.data.length>0)
            {
                this.rollNo=this.data[0].rollNo;
                this.referenceNo=this.data[0].refferenceNo;
                this.name=this.data[0].studentName;
            }
        }
    }

    getStatusClass(status) {
        if(status == "Present") {
            return 'kt-badge kt-badge--success kt-badge--inline kt-badge--pill'
        }
        if(status == "Absent") {
            return 'kt-badge kt-badge--danger kt-badge--inline kt-badge--pill'
        }
        if(status == "Leave") {
            return 'kt-badge kt-badge--warning kt-badge--inline kt-badge--pill'
        }
    }

    // beforeModalOpen(event) {
    //     this.data= event.params.model  as Array<IAttendanceAttendanceStudentInfo>;
    //     if(this.data)
    //     {
    //         if(this.data.length>0)
    //         {
    //             this.rollNo=this.data[0].rollNo;
    //             this.referenceNo=this.data[0].refferenceNo;
    //             this.name=this.data[0].studentName;
    //         }
    //     }
        
    // }

    cancel() {
        this.$modal.hide('delete-model');
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