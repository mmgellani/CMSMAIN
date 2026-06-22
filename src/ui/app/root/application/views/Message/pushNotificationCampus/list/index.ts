import Vue from 'vue';
import Component from 'vue-class-component';
import { StoreTypes } from '../../../../../../store';
import { IMessage, ISms, IVWCustomData, ITemplates, ISmsAPI } from '../../../../models/Message/message';
import { MessageService } from '../../../../service/Message/message-service';
import { PayloadMessageTypes, IUser } from '../../../../../../model';
import { SetupSessionService, SetupCampusService, SetupProgramDetailsService, SetupClassService, SetupSectionService, SetupCampusProgramLinkService, TransportationVehicleInfoService, RegistrationEnrollmentsService, notificationService, SetupProgramService } from '../../../../service';
import { ISetupSession, ISetupCampus, DDLModel, DDLGroupModel, ISetupClass, ICampusCityVM, ISetupCampusProgramVM, ISetupSection, IRegistrationSectionCourseLinkVM } from '../../../../models';
import { gunzip } from 'zlib';
import { dateFormat } from 'highcharts';
import { IRootStoreState, RootStoreTypes } from '../../../../../store';
import { State } from 'vuex-class';
import { escapeSelector } from 'jquery';
import moment from 'moment';
import * as helper from '../../../../helper';
import { IVWCampusBaseProgram } from '../../../../models/Setup/CampusBaseProgram';
import { JsxEmit } from 'typescript';

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

export class PushNotificationCampus extends Vue {
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
    private programId = '';

    private sectionModel: Array<ISetupSection> = [];
    private datas: Array<IVWCustomData> = [];
    private smsapilist: Array<ISmsAPI> = [];
    private pdfFile: boolean = false;
    private repository: MessageService;
    sectionCourseLinkId = ''

    private checkprogram: boolean = false;
    private checkProg: boolean = false;
    private checkclass: boolean = false;
    private checksection: boolean = false;






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

    private sectionId: string = "";

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

    private programList: Array<IVWCampusBaseProgram> = [];
    private programSRepo: SetupProgramService = new SetupProgramService(this.$store);

    private classRepository: SetupClassService = new SetupClassService(this.$store);



    mounted() {

        this.validatePage();
        this.loadSession();
        this.loadCityCampus();
        this.loadClass();

    }

    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionModel = r as Array<ISetupSession>
            })
    }


    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;

        });
    }


    loadPrograms() {
        this.programId = '';
        this.programDetailId = '';
        if (this.campusId.length > 0) {
            this.programSRepo.ProgramByCampus('e=>e.CampusId.ToString()=="' + this.campusId + '" && e.SessionId.ToString()=="' + this.sessionId + '"')
                .then(r => {
                    this.programList = r as Array<IVWCampusBaseProgram>
                })
        }

        this.CookTag();

    }


    loadProgramsOfCampus() {

        this.programDetailId = ''
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        if (this.sessionId.length > 0 && this.campusId.length > 0 && this.programId.length > 0) {
            var key = this.sessionId + '?' + this.campusId + '?' + this.programId
            this.campusProgramLinkRepo.ProgDetailByProgram(key)
                .then(r => {
                    this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>

                    oldObj = this.campusProgramLinkList[0]
                    this.campusProgramLinkList.forEach(e => {

                        if (e.programId == oldObj.programId) {

                            this.ddl.push({ id: e.programDetailId, text: e.description })
                        }
                        else {

                            this.programDDL.push({ title: this.campusProgramLinkList[this.campusProgramLinkList.indexOf(e) - 1].programName, group: this.ddl })
                            this.ddl = []
                            this.ddl.push({ id: e.programDetailId, text: e.description })
                        }
                        oldObj = e;
                    })
                    this.programDDL.push({ title: oldObj.programName, group: this.ddl })

                })
        }
    }

    CookTag() {
        this.tag = '';
        if (this.sessionId.length > 0 && this.campusId.length > 0) {
            this.tag = this.sessionModel.find(e => e.sessionId == this.sessionId).fullName;
            this.tag = this.tag + this.campusCityList.find(e => e.campusId == this.campusId).campusName;

            if (this.programDetailId.length > 0) {

                var splitted = ''
                splitted = this.campusProgramLinkList.find(e => e.programDetailId == this.programDetailId).description;
                if (splitted.indexOf("(Mor - ") != -1) {
                    splitted = splitted.split("(Mor - ")[0];



                }

                else {
                    splitted = splitted.split("(Aft - ")[0];


                }

                this.tag = this.tag + splitted;



                // splitted = this.campusProgramLinkList.find(e => e.programDetailId == this.programDetailId).description.split("(Mor - ")[0];
                // alert(splitted)
                // if (splitted.length > 0) {
                //     this.tag = this.tag + splitted;

                // }

                // else {
                //     splitted = this.campusProgramLinkList.find(e => e.programDetailId == this.programDetailId).description.split("(Aft - ")[0];
                //     this.tag = this.tag + splitted;

                // }

            }

            if (this.classId.length > 0) {
                this.tag = this.tag + this.classList.find(e => e.classId == this.classId).fullName;

            }

            if (this.sectionId.length > 0) {
                this.tag = this.tag + this.sectionList.find(e => e.sectionId == this.sectionId).sectionName;

            }

            console.log(JSON.stringify(this.tag));

            this.tag = this.tag.replace(/[^a-zA-Z0-9]/g, "");
            this.tag = this.tag.toLowerCase();

        }
    }

    checkmate() {
        if (!this.checkprogram) {
            this.programId = '';
            this.programDetailId = '';
            this.sectionId = '';
            this.checksection = false;
            this.CookTag();

        }

        if (!this.checkclass) {
            this.classId = '';
            this.sectionId = '';

            this.checksection = false;
            this.CookTag();


        }
        if (!this.checksection) {
            this.sectionId = '';
            this.CookTag();

        }
    }


    loadClass() {
        this.classRepository.GetFindBy("e=>e.StatusId==1").then(r => {
            this.classList = r as Array<ISetupClass>;
        });
    }


    loadSection() {
        this.sectionList = [];
        if (this.programDetailId.length > 0) {
            var cmid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;

            if (cmid.length > 0 && this.classId.length > 0) {
                var key = cmid + '?' + this.classId
                this.enrollmentRepo.GetSectionList(key)
                    .then(response => (this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>));
            }
        }
        this.CookTag();

    }

    validatePage() {
        if (this.user.roles.indexOf("admin") >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        } else {
            if ("pushNotificationCampus" in this.user.claims == true) {
                if (this.user.claims["pushNotificationCampus"].indexOf("R") >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims["pushNotificationCampus"].indexOf("C") >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims["pushNotificationCampus"].indexOf("U") >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims["pushNotificationCampus"].indexOf("D") >= 0) {
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
