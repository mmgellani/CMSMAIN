import { DDLGroupModel, DDLModel, ICampusCityVM, ISetupCampus, ISetupCampusProgramVM, ISetupClass, ISetupSection, ISetupSession } from '../../../../models';
import { IMessage, ISms, ISmsAPI, ITemplates, IVWCustomData } from '../../../../models/Message/message';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupProgramDetailsService, SetupSectionService, SetupSessionService, TransportationVehicleInfoService } from '../../../../service';
import { IVWNotificationCustomData, IVWNotificationCustomDataex } from '../../../../models/Message/notification';
import { Approve } from './approve';
import Component from 'vue-class-component';
import { Edit } from './edit';
import { IRootStoreState, RootStoreTypes } from '../../../../../store';
import { MessageApproval } from '../../../../models/Message/message';
import { MessageService } from '../../../../service/Message/message-service';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import { UnApprove } from './unapprove/index';
import Vue from 'vue';
import { dateFormat } from 'highcharts';
import { gunzip } from 'zlib';
import moment from 'moment';
import { notificationService } from '../../../../service';
     


export interface INotificationCredntials {

    sesseion: string;
    campus: string;
    program: string;
    classstudent: string;
    section: string;
    rollno: string;
    notificationObject: {
        notification: string;
        type: string;
        title: string;
        image: string;
    }
}
export interface INotificationTypes {
    notification: string;
    type: string;
    title: string;
    image: string;

}
@Component({
    template: require("./index.html"),
    components: {
        'edit': Edit,
        'approve': Approve,
        'unapprove': UnApprove
    }
})
export class NotificationApproval extends Vue {
    private repoNotification: notificationService = new notificationService(this.$store)
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    notificationid = '';
    msgtext = '';
    datee: string = '';
    oldmsg = '';
    userid = 0;
    datestring = new Date();
    datestring1 = new Date();
    service: MessageService = new MessageService(this.$store);
    //apprvoelist: Array<MessageApproval> = [];
    //apprvoelist: Array<NotificationApprove> = [];
    private notificationRepo: MessageService = new MessageService(this.$store);
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private disablebutton: number = 0;
    private isDisabled: boolean = false;
    private showmodel: boolean = false;
    private showmodelunapprove: boolean = false;
    private showmodelid: number = 0;
    datestring2 = new Date();
    todatestring2 = new Date();
    
private modelToUnApprove=''
    private tag = '';
    private hubmodel = '';
    private titlex = '';
    chkall = false;
    chksingle = false;
    private reportData = [];
    private datas = []; //:Array<IVWNotificationCustomDataex>;

    apprvoelist: Array<IVWNotificationCustomDataex> = [];
    private columns = [
        { key: 'qdate', caption: 'Date' },
        { key: 'title', caption: 'Notification Title' },

        { key: 'messageText', caption: 'Notification Text Preview' },
        { key: 'url', caption: 'Attachement Preview' },
        { key: 'charCount', caption: 'Recipient Count' },
        { key: 'subCity', caption: 'SubCity' },
        { key: 'receiverType', caption: 'Receiver' },

        { key: 'userName', caption: 'User' },
        { key: 'action', caption: 'Racall' }
        // { key: 'isChecked', caption: 'Select' }
    ];

    mounted() {
        this.validatePage();
       // this.Getdata();
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

    // Getdata() {
    //     var key = moment(this.datestring).format("YYYY/MM/DD");
    //     this.service.SmsApproval(key).then(r => {
    //         this.apprvoelist = r as Array<MessageApproval>

    //     })

    // }
    Getdata() {

        this.chkall = false;
        this.isDisabled = false;
        this.datas = [];
        //this.checkAll = false;
        // this.date=new Date(this.date);
        var fromdateconvert = moment(this.datestring).format('YYYY-MM-DD')
        var todateconvert = moment(this.datestring1).format('YYYY-MM-DD')
        if (fromdateconvert != null && todateconvert != null) {
            debugger;
            var key = fromdateconvert+'?'+todateconvert;
            this.notificationRepo.BulkNotificationSelectionList(key)
                .then(response => {
                    this.datas = (response as Array<IVWNotificationCustomDataex>)
                    // alert(JSON.stringify(this.datas))
                });

        }
    }

    toggle() {

        this.showmodel = !this.showmodel;
        this.showmodelid = this.showmodelid++;
        console.log(this.showmodel);
    }

    // generate() {
    //     var key = moment(this.datestring).format("YYYY/MM/DD");
    //     this.service.GetSmsReport(key).then(r => {
    //         this.reportData = r as any;
    //         this.$store.dispatch(RootStoreTypes.reportOperation, {
    //             data: this.reportData as any,
    //             path: '/assets/Reports/Resource/Enrolled/sms-summary.xml',
    //             show: true
    //         });

    //     })
    // }
    edit(model: IVWNotificationCustomDataex) {


        this.$modal.show('edit', { viewId: model.bulkNotificationId, MsgTxt: model.messageText, datee: model.quedDate, USERID: model.userId, operation: model.operation });

        //this.$modal.show('edit', { model: model });
        // alert(JSON.stringify(model.bulknotificationId))
        //this.$modal.show('edit', { model: model });


    }
    approve(model: any) {
        this.$modal.show('approve', { model: model });

    }
    bulknotificationId: any;
    
    passModel(model: any) {
        this.bulknotificationId='';
        this.showmodelunapprove=!this.showmodelunapprove;
        this.bulknotificationId = model.bulkNotificationId;
    }
    unapprove() {
        this.notificationRepo.UnApproveNotification(this.bulknotificationId)
            .then(r => {

                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Notification UnApproved SuccessFully',
                    title: '',
                    messageTypeId: PayloadMessageTypes.success
                });
                this.Getdata();
                this.showmodelunapprove=false;
                this.showmodel=false;
            })
        //this.$modal.show('unapprove', { model: model });


    }


    updatechek() {

        if (this.datas.filter(e => e.isChecked == true).length > 0) {
            this.isDisabled = true;
            this.chkall = false;
        }
        else {
            this.isDisabled = false;
            this.chkall = false;
        }
    }
    updall() {
        if (this.chkall == true) {
            this.datas.forEach(element => {
                element.isChecked = true;
            });
            this.isDisabled = true;
        }
        if (this.chkall == false) {
            this.datas.forEach(element => {
                element.isChecked = false;
            });
            this.isDisabled = false;
        }


    }
    // updatedata() {
    //     
    //     this.apprvoelist = this.apprvoelist.filter(e => e.isChecked == true);
    //     this.apprvoelist.forEach(e => this.updMicrosoftPass(e));
    //     this.$store.dispatch(StoreTypes.updateStatusBar, {
    //         text: 'Message approved successfully',
    //         title: '',
    //         messageTypeId: PayloadMessageTypes.success
    //     });

    // }
    pushNotification(keyy,hub) {
debugger
        var key = keyy;

        console.log(key)

        console.log(window.location.hostname)

        if (window.location.hostname == 'localhost') {
            console.log(window.location.hostname)


        }

        else if (window.location.hostname == 'cms360.thetowertech.com') {
            console.log(window.location.hostname)


        }
        else {

            if (hub.toLowerCase() == 'cms') {

                console.log('cms')

               // BELOW CODE TO UNCOMMENT ON LIVE BUILD ONLY

                // this.repoNotification.pushNotification(key)

                //     .then(r => {

                //         this.$store.dispatch(StoreTypes.updateStatusBar, {
                //             text: r,
                //             title: 'Success',
                //             messageTypeId: PayloadMessageTypes.success
                //         })
                //     })
            }
            if (hub.toLowerCase() == 'hadaf') {

                console.log('hadaf')

                // BELOW CODE TO UNCOMMENT ON LIVE BUILD ONLY


                // this.repoNotification.pushNotificationHadaf(key)

                //     .then(r => {

                //         this.$store.dispatch(StoreTypes.updateStatusBar, {
                //             text: r,
                //             title: 'Success',
                //             messageTypeId: PayloadMessageTypes.success
                //         })
                //     })

            }
        }
        this.Getdata();
        this.showmodel = false;
    }
    updatedata() {
        this.chkall = false;
        this.isDisabled = false;
        this.datas = this.datas.filter(e => e.isChecked == true);
        this.datas.forEach(e => this.updMicrosoftPass(e));
        this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'Notification approved successfully',
            title: '',
            messageTypeId: PayloadMessageTypes.success
            
        });
        
    }
    updMicrosoftPass(message: IVWNotificationCustomDataex) {
debugger;
        var key = message.bulkNotificationId + '?' + message.messageText + '?' + moment(message.qDate).format("YYYY/MM/DD") + '?' + this.user.userId;
        var convert = message.bulkNotificationId;
        var serialize = JSON.parse(message.operation);

        this.service.NotificationApprove(key).then(r => {
            if (message.tagName.length > 0) {
                this.pushNotification(message.title + '?' + message.messageText + '?' + message.tagName + '?' + message.receiverType,serialize.hub);
            }
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Notification Approved SuccessFully',
                title: '',
                messageTypeId: PayloadMessageTypes.success
            });
        })
        // var key1 = convert;
        // this.notificationRepo.GetNotificationSelectionSend(key1)
        //     .then(response => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Notification Approved SuccessFully',
                    title: '',
                    messageTypeId: PayloadMessageTypes.success
                });

            // });


    }

    generate() {
        var key = moment(this.datestring).format("YYYY/MM/DD") + "?" + moment(this.datestring1).format("YYYY/MM/DD")
        // alert(JSON.stringify(key))
        this.service.GetNotificationReport(key).then(r => {

            console.log(r,'Response data')
            if (r == null || r == [] || r == 0) {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "No Record Found",
                    title: "Warning",
                    messageTypeId: PayloadMessageTypes.warning
                });
            } else {
            this.reportData = r as any;
            // alert(JSON.stringify(this.reportData))
            this.$store.dispatch(RootStoreTypes.reportOperation, {
                data: this.reportData as any,
                path: '/assets/Reports/Resource/Enrolled/NotificationHistoryReport.xml',
                show: true
            });
        }

        })
    }
    cancel() {
        
        this.showmodel = false;
        this.showmodelunapprove= false;
        this.showmodelid = this.showmodelid++;
        console.log(this.showmodel);
    }

    changedate(){

        if(this.datestring1<this.datestring)
        {
            this.datestring1=null
        }
    }

}