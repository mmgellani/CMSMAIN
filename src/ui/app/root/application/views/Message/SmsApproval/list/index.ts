import { DDLGroupModel, DDLModel, ICampusCityVM, ISetupCampus, ISetupCampusProgramVM, ISetupClass, ISetupSection, ISetupSession } from '../../../../models';
import { IMessage, ISms, ISmsAPI, ITemplates, IVWCustomData } from '../../../../models/Message/message';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupProgramDetailsService, SetupSectionService, SetupSessionService, TransportationVehicleInfoService } from '../../../../service';

import { Approve } from './approve';
import Component from 'vue-class-component';
import { Edit } from './edit';
import { IRootStoreState, RootStoreTypes } from '../../../../../store';
import { MessageApprovalex, MessageApproval } from './../../../../models/Message/message';
import { MessageService } from '../../../../service/Message/message-service';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import { UnApprove } from './unapprove/index';
import Vue from 'vue';
import { dateFormat } from 'highcharts';
import { gunzip } from 'zlib';
import moment from 'moment';

@Component({
    template: require("./index.html"),
    components: {
        'edit': Edit,
        'approve': Approve,
        'unapprove': UnApprove
    }
})
export class SmsApproval extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    datestring = new Date();
    todatestring = new Date();
    service: MessageService = new MessageService(this.$store);
    apprvoelist: Array<MessageApprovalex> = [];
    chkall = false;
    chksingle = false;

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private isDisabled: boolean = false;
    private showmodel: boolean = false;

    private showmodelid: number = 0;

    private reportData = [];
    private regex = /[^\u0000-\u00ff]/;

    private isUnicode(s: string) {
        if (s.indexOf("'") != -1) {
            return true;
        }
        else if (s.indexOf("?") != -1) {
            return true;
        }
        else {
            return this.regex.test(s);
        }
    }
    private columns = [
        { key: 'messageText', caption: 'Message Text' },
        { key: 'messageCount', caption: 'Message Count' },
        { key: 'mask', caption: 'Mask' },
        { key: 'recipients', caption: 'Recipients' },
        { key: 'displayName', caption: 'Display Name' },
        { key: 'username', caption: 'Username' },
        { key: 'action', caption: 'Action', width: 120 },
        { key: 'isChecked', caption: 'Select' }
    ];

    mounted() {
        this.showmodel = false;
        this.validatePage();
        this.Getdata();
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
    toggle() {

        this.showmodel = !this.showmodel;
        this.showmodelid = this.showmodelid++;
        console.log(this.showmodel);
    }
    cancel() {

        this.showmodel = !this.showmodel;
        this.showmodelid = this.showmodelid++;
        console.log(this.showmodel);
    }


    Getdata() {
        var key = moment(this.datestring).format("YYYY/MM/DD") + "?" + moment(this.todatestring).format("YYYY/MM/DD");
        this.service.SmsApproval(key).then(r => {
            this.apprvoelist = r as Array<MessageApprovalex>;
            this.apprvoelist.forEach(x => {

                // x.messageText = this.isUnicode(x.messageText) ?
                //     `<span class="bg-yellow">${x.messageText}</span>`
                //     : x.messageText
            })

        })

        this.chkall = false;
        this.isDisabled = false;
    }
    generate() {
        var key = moment(this.datestring).format("YYYY/MM/DD") + "?" + moment(this.todatestring).format("YYYY/MM/DD");
        this.service.GetSmsReport(key).then(r => {
            if (r == null || r == [] || r == 0) {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "No Record Found",
                    title: "Warning",
                    messageTypeId: PayloadMessageTypes.warning
                });
            } else {
          

                this.reportData = r as any;
                

                this.$store.dispatch(RootStoreTypes.reportOperation, {
                    data: this.reportData as any,
                    path: '/assets/Reports/Resource/Enrolled/sms-summary.xml',
                    show: true
                });

            
            }


        })
    }


    changedate(){

        if(this.todatestring<this.datestring)
        {
            this.todatestring=null
        }
    }


    edit(model: MessageApprovalex) {


        this.$modal.show('edit', { MsgTxt: model.messageText, datee: model.quedDate, USERID: model.userId });


    }
    approve(model: any) {
        this.$modal.show('approve', { model: model });

    }
    unapprove(model: any) {
        this.$modal.show('unapprove', { model: model });

    }
    updatechek() {
        if (this.apprvoelist.filter(e => e.isChecked == true).length > 0) {
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
            this.apprvoelist.forEach(element => {
                element.isChecked = true;
            });
            this.isDisabled = true;
        }
        if (this.chkall == false) {
            this.apprvoelist.forEach(element => {
                element.isChecked = false;
            });
            this.isDisabled = false;

        }


    }
    updatedata() {

        this.isDisabled = false;
        this.chkall = false;
        this.apprvoelist = this.apprvoelist.filter(e => e.isChecked == true);
        this.apprvoelist.forEach(e => this.updMicrosoftPass(e));
        this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'Message approved successfully',
            title: '',
            messageTypeId: PayloadMessageTypes.success
        });
    }
    updMicrosoftPass(message: MessageApprovalex) {
        var key = message.messageText.replace("'", "''") + '?' + moment(message.quedDate).format("YYYY/MM/DD") + '?' + message.userId;

        this.service.Approve(key).then(r => {
            console.log(this.apprvoelist);
            this.Getdata();
            this.showmodel = false;
        })

    }
}