import { IUser, PayloadMessageTypes } from '../../../../../../../model';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../../store';
import { MessageService } from '../../../../../service/Message/message-service';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../../store';
import Vue from 'vue';
import { parse } from 'querystring';
import moment from 'moment';
import { INotificationCredntials } from '../../../Sms/list';

/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/









@Component({
    name: 'delete-modal',
    template: require('./index.html')
})


export class Edit extends Vue {
    //@State((state: IRootStoreState) => state.common.user) user: IUser;

    @State((state: IRootStoreState) => state.common.user) user: IUser;
service: MessageService = new MessageService(this.$store);
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

   
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
    viewId='';
    msgtext='';
    datee:string='';
    oldmsg='';
    
    userid=0;
    operation:INotificationCredntials= {
        sesseion: '',
        campus: '',
        program: '',
        classstudent: '',
        section: '',
        rollno: '',
        genderr: '',
        // notificationObject: {
        notification:'',
        type: '',
        title: '',
        image: ''
        // }
    };
    private NotificationType='';
    private NotificationTitle=''
    datanoti:any=[{
        typeid: "1",
        typeName: "Admission"
    },
    {
        typeid: "2",
        typeName: "Attendance"
    },
    {
        typeid: "3",
        typeName: "Exam"
    },
    {
        typeid: "4",
        typeName: "Fee"
    },
    {
        typeid: "5",
        typeName: "General"
    }

    ]
    
    mounted()
    {



    }

    created() {
        this.validatePage();
      
    }
    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('notificationApproval' in this.user.claims) == true) {
                if (this.user.claims['notificationApproval'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['notificationApproval'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['notificationApproval'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['notificationApproval'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    beforeModalOpen(event) {
      //  this.notificationid=event.params.bulkNotificationId;
        //this.NotificationId=event.params.bulkNotificationId;
        // this.notificationid=event.params.model.viewId;
        // this.msgtext=event.params.model.messageText;
        // this.datee=event.params.model.quedDate;
        // this.userid=event.params.model.USERID;
        // this.oldmsg=event.params.model.;

        this.viewId=event.params.viewId;
        this.msgtext=event.params.MsgTxt;
        this.datee=event.params.datee;
        this.userid=event.params.USERID;
        this.oldmsg=event.params.MsgTxt;
        this.operation=JSON.parse(event.params.operation)
        

    }

    cancel() {
       // this.$emit("submit");
        this.$modal.hide('edit');

    }

    updMicrosoftPass() {
        this.operation.notification=this.msgtext;
        var key=this.viewId+'?'+this.msgtext+'?'+this.oldmsg+'?'+ moment(this.datee).format("YYYY/MM/DD")+'?'+this.user.userId+"?"+JSON.stringify(this.operation);
////alert(key)
        

        this.service.NotificationSave(key).then(r=>{
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Notification updated successfully',
                title: '',
                messageTypeId: PayloadMessageTypes.success
            });
            this.$emit("submit");
            this.cancel();
        })
        
        //this.cancel();

        
    }


}


