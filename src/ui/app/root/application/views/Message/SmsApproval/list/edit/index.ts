import { IUser, PayloadMessageTypes } from '../../../../../../../model';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../../store';
import { MessageService } from '../../../../../service/Message/message-service';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../../store';
import Vue from 'vue';
import { parse } from 'querystring';
import moment from 'moment';

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
    msgtext='';
    datee:string='';
    oldmsg='';
    
    userid=0;

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
            if (('smsapproval' in this.user.claims) == true) {
                if (this.user.claims['smsapproval'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['smsapproval'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['smsapproval'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['smsapproval'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    beforeModalOpen(event) {
        this.msgtext=event.params.MsgTxt;
        this.datee=event.params.datee;
        this.userid=event.params.USERID;
        this.oldmsg=event.params.MsgTxt;



    }

    cancel() {
        this.$emit("submit");
        this.$modal.hide('edit');

    }

    updMicrosoftPass() {
        var key=this.msgtext.replace("'","''")+'?$'+this.oldmsg.replace("'","''")+'?$'+ moment(this.datee).format("YYYY/MM/DD")+'?$'+this.userid;

        

        this.service.Save(key).then(r=>{
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Message Edited SuccessFully',
                title: '',
                messageTypeId: PayloadMessageTypes.success
            });

            this.cancel();
        })
        
        this.cancel();

        
    }


}


