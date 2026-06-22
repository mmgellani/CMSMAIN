import Vue from 'vue';
import Component from 'vue-class-component';
import { StoreTypes } from '../../../../../../store';
import { IMessage, ISms, IVWCustomData, ITemplates, ISmsAPI } from '../../../../models/Message/message';
import { MessageService } from '../../../../service/Message/message-service';
import { PayloadMessageTypes, IUser } from '../../../../../../model';
import { SetupSessionService, SetupCampusService, SetupProgramDetailsService, SetupClassService, SetupSectionService, SetupCampusProgramLinkService, TransportationVehicleInfoService, RegistrationEnrollmentsService, notificationService } from '../../../../service';
import { ISetupSession, ISetupCampus, DDLModel, DDLGroupModel, ISetupClass, ICampusCityVM, ISetupCampusProgramVM, ISetupSection, IRegistrationSectionCourseLinkVM } from '../../../../models';
import { gunzip } from 'zlib';
import { dateFormat } from 'highcharts';
import { IRootStoreState, RootStoreTypes } from '../../../../../store';
import { State } from 'vuex-class';
import { escapeSelector } from 'jquery';
import moment from 'moment';
import * as helper from '../../../../helper';

//notification code start
export interface INotificationTypes {
    notificationtype: string;
}
export interface INotificationCredntials {

    sesseion: string;
    campus: string;
    program: string;
    classstudent: string;
    section: string;
    rollno: string;
    // notificationObject: {
    notification: string;
    type: string;
    title: string;
    image: string;
    // }

    //notification code end

}
@Component({
    template: require("./index.html")
})

export class PushNotification extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    check: boolean = true;
    condition: boolean = true;
    enableTemplate: boolean = false;
    viewNotification: boolean = false;
    datestring2 = new Date();


    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    showall = false;
    private campusRepo: SetupCampusService;
    private sectionRepo: SetupSectionService;
    private sessionRepo: SetupSessionService;
    private classRepo: SetupClassService;
    private programRepo: SetupProgramDetailsService;

    private smsapid: string = '';
    private issection = false;

    private sendToogle = false;



    private sessionModel: Array<ISetupSession> = [];
    private campusModel: Array<ISetupCampus> = [];
    private cityDDL: Array<DDLGroupModel> = [];
    private campusddl: Array<DDLModel> = [];
    private campusCityList: Array<ICampusCityVM> = [];
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private campusProgramId = '';

    private sectionModel: Array<ISetupSection> = [];
    private datas: Array<IVWCustomData> = [];
    private smsapilist: Array<ISmsAPI> = [];
    private pdfFile: boolean = false;
    private repository: MessageService;
    sectionCourseLinkId = ''


    campusProgramLinkList: Array<ISetupCampusProgramVM> = [];

    smsbulk: any = [];
    contactList: any[];
    classList: Array<ISetupClass> = [];
    programDetailId: string = "";
    ddl: Array<DDLModel> = [];
    programDDL: Array<DDLGroupModel> = [];
    sessionId: string = "";
    campusId: string = "";
    classId: string = "";
    private quedDate: Date = new Date();
    private sendDate: Date = new Date();
    private useTemplate = false;
    private chCount: number = 0;
    private mxCount: number = 0;
    private Messaage: string = '';
    private imagename: string = '';
    private fileName: string = '';

    private data: ISms = {
        messageId: "",
        messageNo: "",
        messageText: "",
        quedDate: new Date(),
        sendDate: new Date(),
        sendTo: "",
        status: 0,
        smsApId: ""
    };
    reader = new FileReader();
    model: IMessage = {
        messageText: "",
        sendToList: ""
    };
    service: MessageService = new MessageService(this.$store)
    enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)

    private templateList: Array<ITemplates> = [];

    //start notification code
    private datanoti: any = [];
    private notificationRepo: MessageService = new MessageService(this.$store);
    typeid = '';
    titletxt = '';
    imagetxt = '';
    imageurl = '';
    //start end
    templateId = ''
    private tempdepartmentlist = [{ hub: "Cms" }, { hub: "Hadaf" }];
    private hubmodel = '';
    private tag = '';
    private title = '';
    private messageText = '';
    private viewDatapicker: boolean = false;
    datestring = new Date();
    private repoNotification: notificationService = new notificationService(this.$store)

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    mounted() {

        this.validatePage();

    }


    validatePage() {
        if (this.user.roles.indexOf("admin") >= 0) {
          this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        } else {
          if ("pushNotification" in this.user.claims == true) {
            if (this.user.claims["pushNotification"].indexOf("R") >= 0) {
              this.canRead = true;
            }
            if (this.user.claims["pushNotification"].indexOf("C") >= 0) {
              this.canAdd = true;
            }
            if (this.user.claims["pushNotification"].indexOf("U") >= 0) {
              this.canEdit = true;
            }
            if (this.user.claims["pushNotification"].indexOf("D") >= 0) {
              this.canDelete = true;
            }
          } else {
            this.$router.push("Home");
          }
        }
      }




    created() {

        this.sessionRepo = new SetupSessionService(this.$store);
        this.campusRepo = new SetupCampusService(this.$store);
        this.programRepo = new SetupProgramDetailsService(this.$store);
        this.classRepo = new SetupClassService(this.$store);
        this.sectionRepo = new SetupSectionService(this.$store);
        this.repository = new MessageService(this.$store)
    }

    CheckValidate() {
        if (this.title.length > 0 && this.tag.length > 0 && this.hubmodel.length > 0 && this.messageText.length > 0) {
            return false;
        }
        else {
            return true;
        }
    }

    // saveModel(){
    //     console.log(JSON.stringify(this.hubmodel+"------"+this.tag+"---------"+this.title+"----------"+this.messageText))
    // }

    saveModel() {

        if (this.hubmodel == 'Cms') {

            this.repoNotification.pushNotification(this.title + "?" + this.messageText + "?" + this.tag)

                .then(r => {

                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: r,
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                })
        }
        if (this.hubmodel == 'Hadaf') {
            this.repoNotification.pushNotificationHadaf(this.title + "?" + this.messageText + "?" + this.tag)

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
