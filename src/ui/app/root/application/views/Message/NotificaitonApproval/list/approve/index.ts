import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../../store';
import { MessageApproval } from '../../../../../models/Message/message';
import { MessageService } from '../../../../../service/Message/message-service';
import { StoreTypes, StoreService } from '../../../../../../../store';
import { IUser, PayloadMessageTypes } from '../../../../../../../model';
import { IVWNotificationCustomData } from '../../../../../models/Message/notification';

import { IMessage, ISms, ISmsApproval, ITemplates } from '../../../../../models/Message/message';

import { default as Axios } from 'axios';
// import { GlobalConfig } from '../../../../../../../common';
// import { Store } from 'vuex';

// const BASE_URLN = GlobalConfig.uri.services + 'Notification/';





import { State } from 'vuex-class';
import Vue from 'vue';
import moment from 'moment';
import { Session } from 'inspector';
import { notificationService } from '../../../../../service';

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
    name: 'delete-modal',
    template: require('./index.html')
})



export class Approve extends Vue {
    notificationid = '';
    msgtext = '';
    datee: string = '';
    oldmsg = '';

    userid = 0;

    service: MessageService = new MessageService(this.$store);
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    private notificationRepo: MessageService = new MessageService(this.$store);
    private title: string = 'Student Notification';

    private name: string = '';
    private data: Array<IVWNotificationCustomData> = [];
    private dataOperation: Array<INotificationCredntials> = [];
    private dataObject: Array<INotificationTypes> = [];
    private tag = '';
    private hubmodel = '';
    private titlex = '';

    private repoNotification: notificationService = new notificationService(this.$store)


    created() {

    }

    beforeModalOpen(event) {


        this.notificationid = event.params.model.bulkNotificationId;
        this.msgtext = event.params.model.messageText;
        this.datee = event.params.model.quedDate;
        this.userid = event.params.USERID;
        this.tag = JSON.parse(event.params.model.operation).tag;
        this.hubmodel = JSON.parse(event.params.model.operation).hub;
        this.titlex = event.params.model.title;

        // alert(JSON.stringify(this.notificationid))

    }

    cancel() {
        this.$emit("submit");
        this.$modal.hide('approve');

    }

    pushNotification() {

        var key = this.titlex + "?" + this.msgtext + "?" + this.tag;

        console.log(key)

        console.log(window.location.hostname)

        if (window.location.hostname == 'localhost') {
            console.log(window.location.hostname)


        }

        else if (window.location.hostname == 'cms360.thetowertech.com') {
            console.log(window.location.hostname)


        }
        else {

            if (this.hubmodel.toLowerCase() == 'cms') {

                console.log('cms')
                this.repoNotification.pushNotification(this.titlex + "?" + this.msgtext + "?" + this.tag)

                    .then(r => {

                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: r,
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                    })
            }
            if (this.hubmodel.toLowerCase() == 'hadaf') {

                console.log('hadaf')

                this.repoNotification.pushNotificationHadaf(this.titlex + "?" + this.msgtext + "?" + this.tag)

                    .then(r => {

                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: r,
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                    })

            }
        }
    }

    updMicrosoftPass() {
        var key = this.notificationid + '?' + this.msgtext + '?' + moment(this.datee).format("YYYY/MM/DD") + '?' + this.user.userId;
        var convert = this.notificationid;
        this.service.NotificationApprove(key).then(r => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Notification Approved SuccessFully',
                title: '',
                messageTypeId: PayloadMessageTypes.success
            });

            this.pushNotification();
            this.cancel();
        })
        this.cancel();
        var key1 = convert;
        this.notificationRepo.GetNotificationSelectionSend(key1)
            .then(response => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Notification Approved SuccessFully',
                    title: '',
                    messageTypeId: PayloadMessageTypes.success
                });
                this.cancel();
                // this.data = (response as Array<IVWNotificationCustomData>)

                // var parsedJSON = JSON.parse(JSON.stringify(this.data.map(x => x.operation)));
                // for (var i=0;i<parsedJSON.length;i++) {
                //     this.dataOperation=parsedJSON[0];
                //    }

                // var sessions = "0";
                // var campuss = "0";
                // var CampusProgramIds = "0";
                // var cclassids = "0";
                // var sectionCourseLinks = "0";
                // var srollnos = "0";


                // var notifTypes = "Text";
                // var titles: "";
                // var images: "";

                // sessions=JSON.stringify(this.dataOperation.map(x => x.sesseion));
                // campuss=JSON.stringify(this.dataOperation.map(x => x.campus));
                // CampusProgramIds=JSON.stringify(this.dataOperation.map(x => x.program));
                // cclassids=JSON.stringify(this.dataOperation.map(x => x.classstudent));
                // sectionCourseLinks=JSON.stringify(this.dataOperation.map(x => x.section));
                // srollnos=JSON.stringify(this.dataOperation.map(x => x.rollno));


                // var parsedJSONObject = JSON.parse(JSON.stringify(this.dataOperation.map(x => x.notificationObject)));
                // for (var i=0;i<parsedJSONObject.length;i++) {
                //     this.dataObject=parsedJSONObject[0];
                //    }
                //    notifTypes=JSON.stringify(this.dataObject.map(x => x.type));
                //    titles=JSON.stringify(this.dataObject.map(x => x.title));
                //    images=JSON.stringify(this.dataObject.map(x => x.image));

                //notification api    
                //     Axios.post('https://superapp.cms.edu/api/Notification/SendNotificationToUser', {
                //         notify: {
                //             notification: this.msgtext,
                //             type: notifTypes
                //             //,title: titles,
                //             // image: images
                //         },    
                //         sesseion: sessions,
                //         campus: campuss,
                //         program: CampusProgramIds,
                //         classstudent: cclassids,
                //         section: sectionCourseLinks,
                //         rollno: srollnos
                //   })
                //   .then(response => {})
                //   .catch(e => {
                //     //this.errors.push(e)
                //     this.cancel();
                //   })

            });


    }
}


