import Vue from 'vue';
import Component from 'vue-class-component';
import { StoreTypes } from '../../../../../../store';
import { IMessage, ISms, IVWCustomData, ITemplates, ISmsAPI } from '../../../../models/Message/message';
import { MessageService } from '../../../../service/Message/message-service';
import { PayloadMessageTypes, IUser } from '../../../../../../model';
import { SetupSessionService, SetupCampusService, SetupProgramDetailsService, SetupClassService, SetupSectionService, SetupCampusProgramLinkService, TransportationVehicleInfoService, RegistrationEnrollmentsService, SetupGenderService, notificationService } from '../../../../service';
import { ISetupSession, ISetupCampus, DDLModel, DDLGroupModel, ISetupClass, ICampusCityVM, ISetupCampusProgramVM, ISetupSection, IRegistrationSectionCourseLinkVM, ISetupGender } from '../../../../models';
import { gunzip } from 'zlib';
import { dateFormat } from 'highcharts';
import { IRootStoreState, RootStoreTypes } from '../../../../../store';
import { State } from 'vuex-class';
import { escapeSelector } from 'jquery';
import moment from 'moment';
import * as helper from '../../../../helper';
import { NotificationForAll } from "../../NotificationSendToAll/list";

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
    genderr: string;
    // notificationObject: {
    notification: string;
    type: string;
    title: string;
    image: string;
    // }

    //notification code end

}

export interface INotificationCredntialsEx extends INotificationCredntials {
    tempId: string;
    tag: string;
    hub: string;
    rc: string;

}
@Component({
    template: require("./index.html"),
    components: {
        "Notification-New-Tab": NotificationForAll,
    }
})

export class CustomSms extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    check: boolean = true;
    condition: boolean = true;
    enableTemplate: boolean = false;
    checkCamp: boolean = false;
    viewNotification: boolean = false;
    datestring2 = new Date();
    datestring1 = new Date();
    todatestring2 = new Date();
    todatestring=new Date();
    showNotification:boolean = false;
    
    private repoNotification: notificationService = new notificationService(this.$store)
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
    private datass = [];



    private sessionModel: Array<ISetupSession> = [];
    private sessionModelEx: Array<ISetupSession> = [];

    private campusModel: Array<ISetupCampus> = [];
    private cityDDL: Array<DDLGroupModel> = [];
    private campusddl: Array<DDLModel> = [];
    private campusCityList: Array<ICampusCityVM> = [];
    private campusCityListEx: Array<ICampusCityVM> = [];

    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private sectionListEx: Array<IRegistrationSectionCourseLinkVM> = [];

    private campusProgramId = '';

    private sectionModel: Array<ISetupSection> = [];
    private datas: Array<IVWCustomData> = [];
    private smsapilist: Array<ISmsAPI> = [];
    private pdfFile: boolean = false;
    private idGender: string = "";
    private repository: MessageService;
    sectionCourseLinkId = ''


    campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    campusProgramLinkListEx: Array<ISetupCampusProgramVM> = [];

    smsbulk: any = [];
    private genderModel: Array<ISetupGender> = [];

    temparray = []
    dataNotificationTemp: INotificationCredntialsEx[] = [];
    contactList: any[];
    classList: Array<ISetupClass> = [];
    classListEx: Array<ISetupClass> = [];

    programDetailId: string = "";
    ddl: Array<DDLModel> = [];
    programDDL: Array<DDLGroupModel> = [];
    sessionId: string = "";
    campusId: string = "";
    campusIdEx: string = "";
    classId: string = "";
    private tag = '';
    sessionIdEx: string = "";
    campusIdExx: string = "";
    classIdEx: string = "";
    programDetailIdEx: string = "";
    sectionCourseLinkIdEx = ''


    private quedDate: Date = new Date();
    private sendDate: Date = new Date();
    private useTemplate = false;
    private chCount: number = 0;
    private mxCount: number = 0;
    private Messaage: string = '';
    private imagename: string = '';
    private fileName: string = '';
    private checkEntity: string = "";
    private receiver: string = "";
    checkvaluebutton: boolean = false;

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
    private genderRepo: SetupGenderService = new SetupGenderService(this.$store)


    private templateList: Array<ITemplates> = [];

    private checkunicode = false;

    //start notification code
    private datanoti: any = [];
    private notificationRepo: MessageService = new MessageService(this.$store);
    typeid = '';
    titletxt = '';
    imagetxt = '';
    imageurl = '';
    //start end
    templateId = ''
    private reportData = [];
    private viewDatapicker: boolean = false;
    datestring = new Date();

    private allowuser: boolean = false;

    private regex = /[^\u0000-\u00ff]/;
    private isUnicode(s: string) {
        return this.regex.test(s);
    }

    mounted() {
        this.loadSessionEx();
        this.loadTemplates();
        this.loadMessageAPI();
        this.getAllowuser();
        // this.loadSession(e);
        this.datanoti = "";
        this.datanoti =
            [{
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



    }


    onFileChange(e) {
        // alert(JSON.stringify(e));
        var files = e.target.files || e.dataTransfer.files;
        console.log((files))
        console.log((files[0].name))
        if (!files.length)
            return;
        this.createImage(files[0]);
    }


    CookTag() {
        debugger;
        this.tag = '';
        if (this.sessionId.length > 0 && this.campusIdEx.length > 0) {
            this.tag = this.sessionModel.find(e => e.sessionId == this.sessionId).fullName;
            this.tag = this.tag + this.campusCityList.find(e => e.campusId == this.campusIdEx).campusName;

           

            if (this.campusProgramId.length > 0) {

                var splitted = ''
                splitted = this.campusProgramLinkList.find(e => e.campusProgramId == this.campusProgramId).description;
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

            if (this.sectionCourseLinkId.length > 0) {
                this.tag = this.tag + this.sectionList.find(e => e.sectionCourseLinkId == this.sectionCourseLinkId).sectionName;

            }

            console.log(JSON.stringify(this.tag));

            this.tag = this.tag.replace(/[^a-zA-Z0-9]/g, "");
            this.tag = this.tag.toLowerCase();
            if (this.receiver == 'Parent') {
                this.tag = 'ph' + this.tag;
            }

        }
    }

    checkmate() {

        if (this.issection) {
            this.sectionCourseLinkId = '';
            this.CookTag();
            this.loadSectionsEx();

        }
    }




    createImage(file) {

        var $this = this;
        helper.resizeImage({ file: file, maxSize: 2040 })
            .then(resizeImage => {
                $this.imagetxt = resizeImage as string;

                var imagename = helper.newGuid() + '.png';

                this.service.UpLoadFileEx(imagename + "?" + this.imagetxt)
                    .then(response => {
                        response as any
                        this.imageurl = 'http://172.19.10.82:7223/step/Notification/' + imagename;
                        console.log(JSON.stringify(this.imageurl));
                    });



            });
    }

    keymonitor(e) {
        console.log(e.key);
        console.log(e.charCode);
        if (e.key == '&') {
            e.preventDefault()
        }
    }

    removeImage() {
        if (this.imagetxt.length != 0) {
            this.imagetxt = ''
            this.imageurl=''
            this.imagename=''
            ;
        }
    }
    removeItem(item: any) {
        // console.log(this.list.indexOf(item))
        this.list = this.list.filter(s => s.tempId != item.tempId)
        this.dataNotificationTemp = this.dataNotificationTemp.filter(s => s.tempId != item.tempId)
        // this.list.splice(this.list.indexOf(item),1)

        // this.dataNotificationTemp.splice(this.dataNotificationTemp.indexOf(item),1)
        console.log(this.dataNotificationTemp)

    }
    convertToBase64() {
        //Read File
        this.pdfFile = false;
        var selectedFile: any = (<HTMLInputElement>document.getElementById("AttachFile")).files;
        console.log(selectedFile)

        //Check File is not Empty
        if (selectedFile.length > 0 && selectedFile[0].size / 1024 < 1024) {
            this.fileName = selectedFile[0].name
            if (selectedFile[0].type == 'application/pdf') {
                this.pdfFile = true;
            }

            // Select the very first file from list
            var fileToLoad = selectedFile[0];
            // FileReader function for read the file.
            var fileReader = new FileReader();


            fileReader.onload = (e: any) => {
                const imgBase64Path = e.target.result;
                // console.log(imgBase64Path);
                this.imagetxt = imgBase64Path;
                this.createfiletoupload(imgBase64Path);
                // this.documentBase64 = imgBase64Path;
                // this.isImageSaved = true;
                // this.documents.content = imgBase64Path.toString();
            };
            // Convert data to base64
            fileReader.readAsDataURL(fileToLoad);

        } else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please upload less then 1mb file",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }
    }

    createfiletoupload(base64) {

        this.imagename = '';
        // console.log(base64);

        if (base64.indexOf("/pdf") == -1) {
            this.imagename = helper.newGuid() + '.png';
            // console.log('png')
        }
        else {
            this.imagename = helper.newGuid() + '.pdf';
            // console.log('pdf')
        }

        this.service.UpLoadFileEx(this.imagename + "?" + base64)
            .then(response => {
                response as any
                this.imageurl = 'https://emsuploads.cms.edu.pk/Notification/' + this.imagename;
                console.log(JSON.stringify(this.imageurl));
            });

    }


    loadMessageAPI() {
        // this.service.GetAll()
        //     .then(response => this.smsapilist = (response as Array<ISmsAPI>));

        this.service.GetSmsMask(this.user.userId.toString())
            .then(response => this.smsapilist = (response as Array<ISmsAPI>));


    }

    charCount(key) {
        var r = /[^\u0000-\u00ff]/.test(key);
        if (r) {
            this.mxCount = 180;
            return this.chCount = this.mxCount - key.length;

        }
        else {
            this.mxCount = 350;
            return this.chCount = this.mxCount - key.length;
        }
    }
    // containsNonLatinCodepoints(s) {
    //     return /[^\u0000-\u00ff]/.test(s);
    // }
    created() {
        this.getGender();
        this.sessionRepo = new SetupSessionService(this.$store);
        this.campusRepo = new SetupCampusService(this.$store);
        this.programRepo = new SetupProgramDetailsService(this.$store);
        this.classRepo = new SetupClassService(this.$store);
        this.sectionRepo = new SetupSectionService(this.$store);
        this.repository = new MessageService(this.$store)
        // this.$watch('campusIdEx', this.loadClass);
    }
    resetMessage() {
        this.enableTemplate = !this.enableTemplate;
        if (!this.useTemplate) {
            this.messageText = '';
            this.templateId = '';
        }
    }
    showTemplateMessage() {
        this.messageText = this.templateList.find(s => s.templateId == this.templateId).description;
    }
    loadTemplates() {
        this.repository.GetFindByVM()
            .then(response => this.templateList = (response as Array<ITemplates>));
    }
    loadSession() {

        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionModel = r as Array<ISetupSession>
            })
    }

    loadSessionEx() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionModelEx = r as Array<ISetupSession>
            })
    }

    getGender() {
        this.genderRepo
            .GetAll()
            .then(response => (this.genderModel = response as Array<ISetupGender>));
    }

    // generate2() {
    //     var key = moment(this.datestring2).format("YYYY/MM/DD") + "?" + moment(this.todatestring2).format("YYYY/MM/DD");;
    //     this.service.GetSmsReport(key).then(r => {
    //         this.reportData = r as any;
    //         this.$store.dispatch(RootStoreTypes.reportOperation, {
    //             data: this.reportData as any,
    //             path: '/assets/Reports/Resource/Enrolled/sms-summary.xml',
    //             show: true
    //         });

    //     })
    // }

    
    generate2() {
        var key = moment(this.datestring1).format("YYYY/MM/DD") + "?" + moment(this.todatestring).format("YYYY/MM/DD")
        // alert(JSON.stringify(key))
        this.service.GetSmsReport(key).then(r => {

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
                path: '/assets/Reports/Resource/Enrolled/sms-summary.xml',
                show: true
            });
        }

        })
    }

    
    checkvaluest(e)
    {
        debugger;

        if(e === 'All'){
           this. receiver=='All';
        }
       
    }


    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classList = r as Array<ISetupClass> });
        this.CookTag();
    }

    loadClassEx() {
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classListEx = r as Array<ISetupClass> });
    }

    getSection() {
        this.sectionRepo
            .GetAll()
            .then(response => (this.sectionModel = response as Array<ISetupSection>));
    }
    loadSections() {
        if (this.issection == true) {
            this.sectionList = [];
            this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.sessionId == this.sessionId && e.programDetailId == this.programDetailId && e.statusId == 1).campusProgramId;

            var key = this.campusProgramId + '?' + this.classId
            this.enrollmentRepo.GetSectionList(key)
                .then(r => {
                    this.sectionList = r as Array<IRegistrationSectionCourseLinkVM>;
                    // console.log(this.sectionList==null)
                    if (this.sectionList == null) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Section not Defined',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }

                    this.datas = [];
                    this.sectionCourseLinkId = '';
                })
        }
        else {

            this.sectionList = [];


        }

    }


    loadSectionsExx() {
        if (this.issection == true) {
            this.sectionListEx = [];
            this.campusProgramId = this.campusProgramLinkListEx.find(e => e.campusId == this.campusIdExx && e.sessionId == this.sessionIdEx && e.programDetailId == this.programDetailIdEx && e.statusId == 1).campusProgramId;

            var key = this.campusProgramId + '?' + this.classIdEx
            this.enrollmentRepo.GetSectionList(key)
                .then(r => {
                    this.sectionListEx = r as Array<IRegistrationSectionCourseLinkVM>;
                    // console.log(this.sectionList==null)
                    if (this.sectionListEx == null) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Section not Defined',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }

                    this.datas = [];
                    this.sectionCourseLinkIdEx = '';

                })
        }
        else {

            this.sectionListEx = [];


        }

    }

    loadSectionsEx() {
        this.CookTag();
        debugger;
        if (this.campusProgramId.length > 1) {
            this.checkCamp = true;
        }
        else {
            this.checkCamp = false;
        }
        if (this.issection == true && this.campusProgramId.length == 1) {
            this.sectionList = [];
            // this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.sessionId == this.sessionId && e.programDetailId == this.programDetailId && e.statusId == 1).campusProgramId;

            var key = this.campusProgramId + '?' + this.classId
            this.enrollmentRepo.GetSectionList(key)
                .then(r => {
                    this.sectionList = r as Array<IRegistrationSectionCourseLinkVM>;
                    // console.log(this.sectionList==null)
                    if (this.sectionList == null) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Section not Defined',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }

                    this.datas = [];
                    this.sectionCourseLinkId = '';
                    //  this.checkmate();

                })
        }
        else {

            this.sectionList = [];
            //this.checkmate();

        }
        // }else{
        //     this.checkCamp = true;
        // }


    }
    // start notification code
    refreshdropdowns() {
        // this.sessionId = "";
        this.campusId = "";
        this.campusIdEx = "";
        this.programDetailId = "";
        this.classId = "";
        this.idGender = "";
        this.sectionCourseLinkId = "";
        this.campusProgramId = "";
        //this.typeid = "";
        //this.titletxt = "";
        //this.imagetxt = "";
        this.Messaage = "";



    }


    AddNotific() {
        
        if (this.sessionId.length > 0
            // && this.campusIdEx.length > 0

        ) {
            debugger;
            // this.refreshdropdowns();
            var session = "0";
            var campus = "0";
            var CampusProgramId = "0";
            var cclassid = "0";
            var gender = "0";
            var sectionCourseLink = "0";
            var srollno = "0";
            var notifType = "General";
            var rc = "";
            var stringwithoutbraces = "0";

            if (this.sessionId.length > 0) {
                //var sessionName = this.sessionModel.find(e => e.sessionId == this.sessionId).sessionId;

                session = "" + this.sessionId + "";
            }
            if (this.receiver.length > 0) {
                //var sessionName = this.sessionModel.find(e => e.sessionId == this.sessionId).sessionId;

                rc = "" + this.receiver + "";
            }
            if (this.idGender.length > 0) {
                //var sessionName = this.sessionModel.find(e => e.sessionId == this.sessionId).sessionId;

                gender = "" + this.idGender + "";
            }

            if (this.campusIdEx.length > 0) {
                campus = "" + this.campusIdEx + "";
            }

            if (this.campusProgramId.length > 0) {
                CampusProgramId = "" + this.campusProgramId + "";
            }
            if (this.classId.length > 0) {
                cclassid = "" + this.classId + "";
            }
            if (this.typeid.length > 0) {
                var notifType2 = this.datanoti.find(e => e.typeid == this.typeid).typeName;
                notifType = "" + notifType2 + "";
            }

            if (this.sectionCourseLinkId.length > 0) {
                var str = JSON.stringify(this.sectionCourseLinkId);
                //var str = this.sectionCourseLinkId;
                var myarray = str.split(',');

                for (var i = 0; i < myarray.length; i++) {

                    stringwithoutbraces = myarray[i].replace(/[\[\]]+/g, '')
                    //stringwithoutbraces=JSON.stringify(myarray[i]).replace(/[\[\]]+/g,'')

                    //alert(stringwithoutbraces)


                    var tag = this.sessionModel.find(e => e.sessionId == this.sessionId).fullName;
                    tag = tag + this.campusCityList.find(e => e.campusId == this.campusIdEx).campusName;

                    if (this.campusProgramId.length > 0) {

                        var splitted = ''
                        splitted = this.campusProgramLinkList.find(e => e.campusProgramId == this.campusProgramId).description;
                        if (splitted.indexOf("(Mor - ") != -1) {
                            splitted = splitted.split("(Mor - ")[0];



                        }

                        else {
                            splitted = splitted.split("(Aft - ")[0];


                        }

                        tag = tag + splitted;


                    }

                    if (this.classId.length > 0) {
                        tag = tag + this.classList.find(e => e.classId == this.classId).fullName;

                    }

                    if (this.sectionCourseLinkId.length > 0) {
                        tag = tag + this.sectionList.find(e => e.sectionCourseLinkId == stringwithoutbraces.replace('\"', '').replace('\"', '')).sectionName;

                    }

                    // if (this.idGender.length > 0) {
                    //     //var sessionName = this.sessionModel.find(e => e.sessionId == this.sessionId).sessionId;

                    //     tag = tag + this.genderModel.find(e => e.genderId == this.idGender).description;
                    // }

                    console.log(JSON.stringify(tag));

                    tag = tag.replace(/[^a-zA-Z0-9]/g, "");
                    tag = tag.toLowerCase();
                    if (this.receiver == 'Parent') {
                        tag = 'ph' + tag;
                    }
        



                    var dataNotification: INotificationCredntialsEx = {
                        tempId: helper.newGuid(),
                        sesseion: session,
                        campus: campus,
                        program: CampusProgramId,
                        classstudent: cclassid,
                        section: stringwithoutbraces.replace('\"', '').replace('\"', ''),
                        rollno: srollno,
                        genderr: gender,
                        // notificationObject: {
                        notification: this.Messaage,
                        type: notifType,
                        title: this.titletxt,
                        image: this.imageurl,
                        tag: tag,
                        hub: this.checkEntity,

                        rc: this.receiver,

                        // }
                    }
                    debugger
                    this.temparray = []
                    dataNotification.campus.split(",").forEach(s => {
                        this.temparray.push(s);
                    })
                    // debugger;
                    // let dataNotificationTemp:INotificationCredntials[]=[];
                    this.temparray.forEach(s => {
                        this.dataNotificationTemp.push(
                            {
                                tempId: helper.newGuid(),
                                sesseion: dataNotification.sesseion,
                                campus: s,
                                program: dataNotification.program,
                                classstudent: dataNotification.classstudent,
                                section: dataNotification.section,
                                rollno: dataNotification.rollno,
                                genderr: dataNotification.genderr,
                                // notificationObject: {
                                notification: dataNotification.notification,
                                type: dataNotification.type,
                                title: this.titletxt,
                                image: this.imageurl,
                                tag: tag,
                                hub: this.checkEntity,
                                rc: this.receiver,

                                // }
                            }
                        )
                    })

                    if(this.receiver == 'All'){
                        var temparray = this.dataNotificationTemp;
                        this.dataNotificationTemp = [];

                        temparray.forEach(s => {
                            this.dataNotificationTemp.push(
                                {
                                    tempId: s.tempId,
                                    sesseion: s.sesseion,
                                    campus: s.campus,
                                    program: s.program,
                                    classstudent: s.classstudent,
                                    section: s.section,
                                    rollno: s.rollno,
                                    genderr: s.genderr,
                                    // notificationObject: {
                                    notification: s.notification,
                                    type: s.type,
                                    title: s.title,
                                    image: s.image,
                                    tag: s.tag,
                                    hub: s.hub,
                                    rc: 'Student',
    
                                    // }
                                }
                            )
                        })

                        temparray.forEach(s => {
                            this.dataNotificationTemp.push(
                                {
                                    tempId: s.tempId,
                                    sesseion: s.sesseion,
                                    campus: s.campus,
                                    program: s.program,
                                    classstudent: s.classstudent,
                                    section: s.section,
                                    rollno: s.rollno,
                                    genderr: s.genderr,
                                    // notificationObject: {
                                    notification: s.notification,
                                    type: s.type,
                                    title: s.title,
                                    image: s.image,
                                    tag: 'ph' +s.tag,
                                    hub: s.hub,
                                    rc: 'Parent',
    
                                    // }
                                }
                            )
                        })


                    }

                    var key = JSON.stringify(this.dataNotificationTemp) + '?' + this.user.userId + '?' + this.Messaage;
                    console.log(JSON.stringify(this.dataNotificationTemp))
                    // if (this.sessionId.length > 0) {

                    //     this.notificationRepo.BulkNotificationSelection(key)
                    //         .then(r => {
                    //             this.$store.dispatch(StoreTypes.updateStatusBar, {
                    //                 text: 'Notification sent successfully for approval',
                    //                 title: 'Success',
                    //                 messageTypeId: PayloadMessageTypes.success

                    //             })
                    //         })


                    // }

                }
                this.refreshList();
                this.refreshdropdowns();
                console.log(JSON.stringify(this.list));
            }
            else {
                var dataNotification: INotificationCredntialsEx = {
                    tempId: helper.newGuid(),
                    sesseion: session,
                    campus: campus,
                    program: CampusProgramId,
                    classstudent: cclassid,
                    section: sectionCourseLink,
                    rollno: srollno,
                    genderr: gender,
                    // notificationObject: {
                    notification: this.Messaage,
                    type: notifType,
                    title: this.titletxt,
                    image: this.imageurl,
                    tag: '',
                    hub: this.checkEntity,
                    rc: this.receiver,
                    // }
                }
                this.temparray = [];
                dataNotification.program.split(",").forEach(s => {
                    this.temparray.push(s);
                })
                debugger;
                this.temparray.forEach(s => {


                    var tag = this.sessionModel.find(e => e.sessionId == this.sessionId).fullName;
                    tag = tag + this.campusCityList.find(e => e.campusId == this.campusIdEx).campusName;

                    if (this.campusProgramId.length > 0) {

                        var splitted = ''
                        splitted = this.campusProgramLinkList.find(e => e.campusProgramId == s).description;
                        if (splitted.indexOf("(Mor - ") != -1) {
                            splitted = splitted.split("(Mor - ")[0];



                        }

                        else {
                            splitted = splitted.split("(Aft - ")[0];


                        }

                        tag = tag + splitted;


                    }

                    if (this.classId.length > 0) {
                        tag = tag + this.classList.find(e => e.classId == this.classId).fullName;

                    }

                    if (this.sectionCourseLinkId.length > 0) {
                        tag = tag + this.sectionList.find(e => e.sectionCourseLinkId == stringwithoutbraces.replace('\"', '').replace('\"', '')).sectionName;

                    }
                    // if (this.idGender.length > 0) {
                    //     //var sessionName = this.sessionModel.find(e => e.sessionId == this.sessionId).sessionId;

                    //     tag = tag + this.genderModel.find(e => e.genderId == this.idGender).description;
                    // }
                    console.log(JSON.stringify(tag));

                    tag = tag.replace(/[^a-zA-Z0-9]/g, "");
                    tag = tag.toLowerCase();
                    if (this.receiver == 'Parent') {
                        tag = 'ph' + tag;
                    }
        


                    this.list = [];
                    // this.dataNotificationTemp=[];
                    this.dataNotificationTemp.push(
                        {
                            tempId: helper.newGuid(),
                            sesseion: dataNotification.sesseion,
                            campus: dataNotification.campus,
                            program: s,
                            classstudent: dataNotification.classstudent,
                            section: dataNotification.section,
                            rollno: dataNotification.rollno,
                            genderr: dataNotification.genderr,
                            // notificationObject: {
                            notification: dataNotification.notification,
                            type: dataNotification.type,
                            title: this.titletxt,
                            image: this.imageurl,
                            tag: tag,
                            hub: this.checkEntity,
                            rc: this.receiver,
                            // }
                        }
                    )
                })

                if(this.receiver == 'All'){
                    var temparray = this.dataNotificationTemp;
                    this.dataNotificationTemp = [];

                    temparray.forEach(s => {
                        this.dataNotificationTemp.push(
                            {
                                tempId: s.tempId,
                                sesseion: s.sesseion,
                                campus: s.campus,
                                program: s.program,
                                classstudent: s.classstudent,
                                section: s.section,
                                rollno: s.rollno,
                                genderr: s.genderr,
                                // notificationObject: {
                                notification: s.notification,
                                type: s.type,
                                title: s.title,
                                image: s.image,
                                tag: s.tag,
                                hub: s.hub,
                                rc: 'Student',

                                // }
                            }
                        )
                    })

                    temparray.forEach(s => {
                        this.dataNotificationTemp.push(
                            {
                                tempId: s.tempId,
                                sesseion: s.sesseion,
                                campus: s.campus,
                                program: s.program,
                                classstudent: s.classstudent,
                                section: s.section,
                                rollno: s.rollno,
                                genderr: s.genderr,
                                // notificationObject: {
                                notification: s.notification,
                                type: s.type,
                                title: s.title,
                                image: s.image,
                                tag: 'ph' +s.tag,
                                hub: s.hub,
                                rc: 'Parent',

                                // }
                            }
                        )
                    })


                }

                // var key = JSON.stringify(this.dataNotificationTemp) + '?' + this.user.userId + '?' + this.Messaage;
                console.log(JSON.stringify(this.dataNotificationTemp))
                // if (this.sessionId.length > 0) {

                //     this.notificationRepo.BulkNotificationSelectionsss(key)
                //         .then(r => {
                //             this.$store.dispatch(StoreTypes.updateStatusBar, {
                //                 text: 'Notification sent successfully for approval',
                //                 title: 'Success',
                //                 messageTypeId: PayloadMessageTypes.success

                //             })
                //         })
                //     this.refreshdropdowns();

                // }
                this.refreshList();
                this.refreshdropdowns();
                console.log(JSON.stringify(this.list));
            }
        } else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Select Compulsory Fields",
                title: "Error",
                messageTypeId: PayloadMessageTypes.error
            })
        }
    }

    list = []
    refreshList() {
        // if(this.checkvaluebutton==true)
        // {
        //     debugger;
        //     if (this.sectionCourseLinkId.length > 0) {
        //         this.dataNotificationTemp.forEach(e => {
        //             debugger
        //             console.log(this.campusProgramLinkList.length)
        //             if (this.list.find(s => s.receiver == e.rc)
        //                 && this.list.find(s => s.sectionCourseLinkId == e.section)
        //                 && this.list.find(s => s.campusid == e.campus)
        //                 && this.list.find(s => s.campusProgramId == e.program)
        //             ) {
    
        //             }
        //             else {
        //                 this.list.push({
        //                     tempId: e.tempId,
        //                     campusProgramId: e.program,
        //                     campusid: e.campus,
        //                     sectionCourseLinkId: e.section,
        //                     sessionName: this.sessionModel.find(s => s.sessionId == e.sesseion).fullName,
        //                     // receiver: e.rc,
        //                     receiver:'Student',
        //                     campusName: this.campusCityList.find(s => s.campusId == e.campus).campusName,
        //                     programName: this.campusProgramLinkList.find(s => s.campusProgramId == e.program).description,
        //                     class: this.classList.find(s => s.classId == e.classstudent).fullName,
        //                     section: this.sectionList.find(s => s.sectionCourseLinkId == e.section).sectionName == 'undefined' ? 'heheh' : this.sectionList.find(s => s.sectionCourseLinkId == e.section).sectionName,
        //                     gender: e.genderr == '0' ? null : this.genderModel.find(s => s.genderId == e.genderr).description,
        //                     type: e.type,
        //                     title: e.title,
        //                     tag: e.tag
    
        //                 })
        //                 this.list.push({
        //                     tempId: e.tempId,
        //                     campusProgramId: e.program,
        //                     campusid: e.campus,
        //                     sectionCourseLinkId: e.section,
        //                     sessionName: this.sessionModel.find(s => s.sessionId == e.sesseion).fullName,
        //                     // receiver: e.rc,
        //                     receiver:'Parent',
        //                     campusName: this.campusCityList.find(s => s.campusId == e.campus).campusName,
        //                     programName: this.campusProgramLinkList.find(s => s.campusProgramId == e.program).description,
        //                     class: this.classList.find(s => s.classId == e.classstudent).fullName,
        //                     section: this.sectionList.find(s => s.sectionCourseLinkId == e.section).sectionName == 'undefined' ? 'heheh' : this.sectionList.find(s => s.sectionCourseLinkId == e.section).sectionName,
        //                     gender: e.genderr == '0' ? null : this.genderModel.find(s => s.genderId == e.genderr).description,
        //                     type: e.type,
        //                     title: e.title,
        //                     tag: e.tag
    
        //                 })
        //             }
    
        //         }
        //         )
        //     }
        //     else {
        //         //this.list = [];
        //         this.dataNotificationTemp.forEach(e => {
        //             console.log(this.campusProgramLinkList.length)
        //             debugger
        //             if
        //                 (
        //                 this.list.find(s => s.receiver == e.rc)
        //                 && this.list.find(s => s.campusid == e.campus)
        //                 && this.list.find(s => s.campusProgramId == e.program)
    
        //             ) 
        //              {
        //             //     //alert('test')
        //              }
        //              else 
        //             {
        //                 this.list.push({
        //                     tempId: e.tempId,
        //                     campusProgramId: e.program,
        //                     sectionCourseLinkId: e.section,
        //                     campusid: e.campus,
        //                     sessionName: this.sessionModel.find(s => s.sessionId == e.sesseion).fullName,
        //                     campusName: e.campus == '0' ? null : this.campusCityList.find(s => s.campusId == e.campus).campusName,
        //                     programName: e.program == '0' ? null : this.campusProgramLinkList.find(s => s.campusProgramId == e.program).description == 'undefined' ? 'heheh' : this.campusProgramLinkList.find(s => s.campusProgramId == e.program).description,
        //                     class: e.classstudent == '0' ? null : this.classList.find(s => s.classId == e.classstudent).fullName,
        //                     section:null,
        //                     gender: e.genderr == '0' ? null : this.genderModel.find(s => s.genderId == e.genderr).description,
        //                     type: e.type,
        //                     title: e.title,
        //                     tag: e.tag,
        //                     receiver:'Student'
        //                     // receiver: e.rc
        //                 })
        //                 this.list.push({
        //                     tempId: e.tempId,
        //                     campusProgramId: e.program,
        //                     sectionCourseLinkId: e.section,
        //                     campusid: e.campus,
        //                     sessionName: this.sessionModel.find(s => s.sessionId == e.sesseion).fullName,
        //                     campusName: e.campus == '0' ? null : this.campusCityList.find(s => s.campusId == e.campus).campusName,
        //                     programName: e.program == '0' ? null : this.campusProgramLinkList.find(s => s.campusProgramId == e.program).description == 'undefined' ? 'heheh' : this.campusProgramLinkList.find(s => s.campusProgramId == e.program).description,
        //                     class: e.classstudent == '0' ? null : this.classList.find(s => s.classId == e.classstudent).fullName,
        //                     section:null,
        //                     gender: e.genderr == '0' ? null : this.genderModel.find(s => s.genderId == e.genderr).description,
        //                     type: e.type,
        //                     title: e.title,
        //                     tag: e.tag,
        //                     receiver:'Parent'
        //                     // receiver: e.rc
        //                 })

                   
        //             }
        //         }
        // )
        //     }
        // }
        // else 
        // {

        
        // this.list = [];
        if (this.sectionCourseLinkId.length > 0) {
            this.dataNotificationTemp.forEach(e => {
                debugger
                console.log(this.campusProgramLinkList.length)
                if (this.list.find(s => s.receiver == e.rc)
                    && this.list.find(s => s.sectionCourseLinkId == e.section)
                    && this.list.find(s => s.campusid == e.campus)
                    && this.list.find(s => s.campusProgramId == e.program)
                ) {

                }
                else {
                    this.list.push({
                        tempId: e.tempId,
                        campusProgramId: e.program,
                        campusid: e.campus,
                        sectionCourseLinkId: e.section,
                        sessionName: this.sessionModel.find(s => s.sessionId == e.sesseion).fullName,
                        receiver: e.rc,
                        campusName: this.campusCityList.find(s => s.campusId == e.campus).campusName,
                        programName: this.campusProgramLinkList.find(s => s.campusProgramId == e.program).description,
                        class: this.classList.find(s => s.classId == e.classstudent).fullName,
                        section: this.sectionList.find(s => s.sectionCourseLinkId == e.section).sectionName == 'undefined' ? 'heheh' : this.sectionList.find(s => s.sectionCourseLinkId == e.section).sectionName,
                        gender: e.genderr == '0' ? null : this.genderModel.find(s => s.genderId == e.genderr).description,
                        type: e.type,
                        title: e.title,
                        tag: e.tag

                    })
                }

            }
            )
        }
        else {
            //this.list = [];
            this.dataNotificationTemp.forEach(e => {
                console.log(this.campusProgramLinkList.length)
                debugger
                if
                    (
                    this.list.find(s => s.receiver == e.rc)
                    && this.list.find(s => s.campusid == e.campus)
                    && this.list.find(s => s.campusProgramId == e.program)

                ) 
                 {
                //     //alert('test')
                 }
                 else 
                {
                    this.list.push({
                        tempId: e.tempId,
                        campusProgramId: e.program,
                        sectionCourseLinkId: e.section,
                        campusid: e.campus,
                        sessionName: this.sessionModel.find(s => s.sessionId == e.sesseion).fullName,
                        campusName: e.campus == '0' ? null : this.campusCityList.find(s => s.campusId == e.campus).campusName,
                        programName: e.program == '0' ? null : this.campusProgramLinkList.find(s => s.campusProgramId == e.program).description == 'undefined' ? 'heheh' : this.campusProgramLinkList.find(s => s.campusProgramId == e.program).description,
                        class: e.classstudent == '0' ? null : this.classList.find(s => s.classId == e.classstudent).fullName,
                        section:null,
                        gender: e.genderr == '0' ? null : this.genderModel.find(s => s.genderId == e.genderr).description,
                        type: e.type,
                        title: e.title,
                        tag: e.tag,
                        receiver: e.rc
                    })
                }
            }
    )
        }
    //}

    }
    AssignNot() {
        var notifType = ""
        if (this.typeid.length > 0) {
            var notifType2 = this.datanoti.find(e => e.typeid == this.typeid).typeName;
            notifType = "" + notifType2 + "";
        }
        this.list.forEach(s => {
            s.type = notifType,
                s.title = this.titletxt

        })

        this.dataNotificationTemp.forEach(s => {
            s.type = notifType,
                s.title = this.titletxt,
                s.image = this.imageurl
        })
    }
    SaveBulkData() {
        debugger;
        if (this.Messaage.length > 0 && this.typeid.length > 0 && this.titletxt.length > 0) {

            var notifType = ""
            if (this.typeid.length > 0) {
                var notifType2 = this.datanoti.find(e => e.typeid == this.typeid).typeName;
                notifType = "" + notifType2 + "";
            }
            this.list.forEach(s => {
                s.type = notifType,
                    s.title = this.titletxt

            })

            this.dataNotificationTemp.forEach(s => {
                s.type = notifType,
                    s.title = this.titletxt,
                    s.image = this.imageurl
            })


            var key = JSON.stringify(this.dataNotificationTemp) + '?' + this.user.userId + '?' + this.Messaage;

            if (this.sessionId.length > 0 || this.smsNumbers.length>0 ) {

                this.notificationRepo.BulkNotificationSelection(key)
                    .then(r => 
                         {

                            this.CallPushNotification();

                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Notification sent successfully ',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success

                        })
                    })
                

            }

            // }


        } else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Enter Notification",
                title: "Error",
                messageTypeId: PayloadMessageTypes.error
            })
        }

    }


    CallPushNotification(){

        this.dataNotificationTemp.forEach(s => {
            var key = s.title + '?' + this.Messaage + '?' + s.tag + '?' + s.rc
            if(s.tag.length > 0)
            {
            this.pushNotification(key,s.hub);
            }

        })


        this.refreshdropdowns();
        this.temparray = []
        this.dataNotificationTemp = []
        this.list = [];
        this.sessionId = '';
        this.checkEntity = ''
        this.receiver = ''
        this.typeid = ''
        this.titletxt = ''
        this.receiver = ''
        this.tag = ''
        this.imageurl=''
        this.imagename=''
        this.imagetxt=''
        this.smsNumbers=''

    }

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
        
                        this.repoNotification.pushNotification(key)
        
                            .then(r => {
        
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: r,
                                    title: 'Success',
                                    messageTypeId: PayloadMessageTypes.success
                                })
                            })
                    }
                    if (hub.toLowerCase() == 'hadaf') {
        
                        console.log('hadaf')
        
                        // BELOW CODE TO UNCOMMENT ON LIVE BUILD ONLY
        
        
                        this.repoNotification.pushNotificationHadaf(key)
        
                            .then(r => {
        
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: r,
                                    title: 'Success',
                                    messageTypeId: PayloadMessageTypes.success
                                })
                            })
        
                    }
                }
                //this.Getdata();
                //this.showmodel = false;
            }


    viewReport() {
        this.viewDatapicker = true;
    }

    deliveryreport() {
        //var datestring = '2020-12-03'
        var key = moment(this.datestring).format("YYYY/MM/DD");
        this.service.GetSmsDeliveryReport(key).then(r => {
            this.reportData = r as any;
            this.$store.dispatch(RootStoreTypes.reportOperation, {
                data: this.reportData as any,
                path: '/assets/Reports/Resource/Enrolled/sms-delivery.xml',
                show: true
            });

        })
    }
    // generate() {
    //     var key = moment(this.datestring2).format("YYYY/MM/DD") + "?" + moment(this.todatestring2).format("YYYY/MM/DD");
    //     // alert(JSON.stringify(key))
    //     this.service.GetNotificationReport(key).then(r => {
    //         this.reportData = r as any;
    //         // alert(JSON.stringify(this.reportData))
    //         this.$store.dispatch(RootStoreTypes.reportOperation, {
    //             data: this.reportData as any,
    //             path: '/assets/Reports/Resource/Enrolled/NotificationHistoryReport.xml',
    //             show: true
    //         });

    //     })
    // }

    CheckValueButtonex()
    {
        
        this.receiver = 'All';
    
            
    
       
    }

    generate() {
        var key = moment(this.datestring1).format("YYYY/MM/DD") + "?" + moment(this.todatestring).format("YYYY/MM/DD")
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
    // end notification code
    refereshData() {
        this.datas = [];

        if (this.issection == true) {


            var key = this.sessionId + '?' + this.campusId + '?' + this.programDetailId + '?' + this.classId + '?' + this.sectionCourseLinkId


        }
        else {
            this.sectionCourseLinkId = '00000000-0000-0000-0000-000000000000'
            var key = this.sessionId + '?' + this.campusId + '?' + this.programDetailId + '?' + this.classId + '?' + this.sectionCourseLinkId



        }

        if (this.sectionCourseLinkId.length > 0) {
            this.repository.GetFilteredSmsNumbers(key).then(
                response =>
                    (this.datas = response as Array<IVWCustomData>)
            );
        }

        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Select Section',
                title: 'warning',
                messageTypeId: PayloadMessageTypes.warning
            });

        }
    }

    readFile(data) {
        var file = data.target.files;
        this.reader.onload = e => console.log("load")
        this.reader.readAsText(file);
    }

    checkToggle() {
        this.sendToogle = false;
    }

    private smsNumbers: any = [];
    private countryCode: number = 92;
    private numberLength: number = 10;
    private RollnumberLength: number = 18;

    private messageText: string = "";
    keys: string = "";
    smsBody: Array<any> = [];
    uploadExcel(providedData) {

        try {
            this.sendToogle = false;
            this.smsNumbers = [];
            this.smsBody = [];
            this.keys = providedData.header;
            this.smsBody = providedData.body;
            this.smsBody.forEach(element => {
                this.smsNumbers.push(this.createNumber(element.MobileNo));
                // console.log(this.smsNumbers);
            });
        }
        catch (e) {
            console.log("ÃƒÆ’Ã‚Â«rror " + e)
        }
    }

    uploadExcelEx(providedData) {
debugger;
        try {
            this.sendToogle = false;
            this.smsNumbers = [];
            this.smsBody = [];
            this.keys = providedData.header;
            this.smsBody = providedData.body;
            this.smsBody.forEach(element => {
                this.smsNumbers.push(this.createNumberEx(element.RollNo));
                // console.log(this.smsNumbers);
            });
        }
        catch (e) {
            console.log("ÃƒÆ’Ã‚Â«rror " + e)
        }
    }

    AddRollNo ()
    {



debugger;
        this.showNotification= true;
        var session = "0";
        var campus = "0";
        var CampusProgramId = "0";
        var cclassid = "0";
        var gender = "0";
        var sectionCourseLink = "0";
        var srollno = "0";
        var notifType = "General";
        var rc = "Student";
        var stringwithoutbraces = "0";
         var tag="";
         this.dataNotificationTemp = [];

         this.smsNumbers.forEach(s => {
            this.dataNotificationTemp.push(
                {
                    tempId: helper.newGuid(),
                    sesseion: session,
                    campus: campus,
                    program: CampusProgramId,
                    classstudent: cclassid,
                    section: "0",
                    rollno: s,
                    genderr: "0",
                    // notificationObject: {
                    notification: '',
                    type: notifType,
                    title: this.titletxt,
                    image: this.imageurl,
                    tag: s,
                    hub: this.checkEntity,
                    rc: 'Student',

                    // }
                }

            );
        })
       

       
        
    

     }

    createNumber(number: string) {
        var providedNumberLength: number =
            this.numberLength.toString().length > 0 ? this.numberLength : 10;
        var providedCountryCode: number =
            this.countryCode.toString().length > 0 ? this.countryCode : 0;
        if (providedCountryCode == 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {

            });
            return;
        }
        var refinedNumber: string = this.updateNumber(number);
        return (
            providedCountryCode +
            refinedNumber.substring(refinedNumber.length - providedNumberLength)
        );
    }

    createNumberEx(number: string) {
        var providedNumberLength: number =
            this.RollnumberLength.toString().length > 0 ? this.RollnumberLength : 18;
       
       
        var refinedNumber: string = this.updateNumber(number);
        return (
           
            refinedNumber.substring(refinedNumber.length - providedNumberLength)
        );
    }
    loadProgramsOfCampusEx() {
        // this.campusId = this.campusId.toString().replace('"', '');
        // if(this.campusIdEx.length>1){
        //     this.checkCamp = true;
        //     this.campusProgramId = "";
        //     this.classId = "";
        //     this.sectionCourseLinkId = "";
        // }else{
        //     this.checkCamp = false;
        // }
        // // console.log(this.campusIdEx.length)
        this.ddl = [];
        this.campusProgramLinkList = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionId + "?" + this.campusIdEx;
        this.campusProgramLinkRepo.GetAllVM(key).then((r) => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            this.CookTag();
            //  this.campusProgramLinkList.forEach(s=>{
            //      console.log(s.description)
            //  })
        });
        // }
    }
    loadProgramsOfCampus() {
        if (this.campusId.length > 0) {
            this.ddl = [];
            this.programDDL = [];
            let oldObj: ISetupCampusProgramVM;
            var key = this.sessionId + "?" + this.campusId;
            this.campusProgramLinkRepo.GetAllVM(key).then((r) => {
                this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            });
        }
    }


    loadProgramsOfCampusExx() {
        if (this.campusIdExx.length > 0) {
            this.ddl = [];
            this.programDDL = [];
            let oldObj: ISetupCampusProgramVM;
            var key = this.sessionIdEx + "?" + this.campusIdExx;
            this.campusProgramLinkRepo.GetAllVM(key).then((r) => {
                this.campusProgramLinkListEx = r as Array<ISetupCampusProgramVM>;
            });
        }
    }
    loadCityCampus() {
        debugger;
        this.campusddl = [];
        this.cityDDL = [];
        this.campusCityList = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;

            if (this.checkEntity == 'CMS') {
                this.campusCityList = this.campusCityList.filter((e) =>
                    e.campusName.indexOf("Hadaf")
                );
            } else {
           this.campusRepo.GetHadafCityVM().then(r =>{
           this.campusCityList = r as Array<ICampusCityVM>;

                 })
            }
        });


    }


    loadCityCampusEx() {
        this.campusddl = [];
        this.cityDDL = [];
        this.campusCityList = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityListEx = r as Array<ICampusCityVM>;

        });


    }
    updateNumber(number: string) {
        return number
            .replace(/\-/g, " ")
            .replace(/\s+/g, "")
            .replace(/[^0-9a-zA-Z\xC0-\xFF \-]/g, "");
    }

    keyHandler() {


        if (this.isUnicode(this.messageText)) {
            this.checkunicode = true;

        }
        else {

            this.checkunicode = false;

        }



    }



    sendMessage() {

        // debugger;

        if (this.condition == true) {

            if (this.messageText.indexOf('&') != -1) {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "& is not supported!",
                    title: 'error',
                    messageTypeId: PayloadMessageTypes.error
                });
            }
            else {




                this.sendToogle = true;

                this.smsbulk = []
                this.smsNumbers.forEach(element => {
                    this.smsbulk.push({
                        messageId: this.newGuid(),
                        messageNo: element,
                        messageText: this.messageText.replace("'", "''"),
                        quedDate: new Date(),
                        sendDate: new Date(),
                        sendTo: element,
                        status: 0,
                        smsApId: this.smsapid,
                        isApproved: false,
                        userId: this.user.userId
                    })

                    // this.service.AddOne({
                    //     messageId: this.newGuid(),
                    //     messageNo: element,
                    //     messageText: this.messageText,
                    //     quedDate: new Date(),
                    //     sendDate: new Date(),
                    //     sendTo: element,
                    //     status: 0,
                    //     smsApId: this.smsapid,
                    //     isApproved: false,
                    //     userId: this.user.userId
                    // })
                });

                // console.log(JSON.stringify(this.smsbulk))


                var i, j, temparray, chunk = 2500;
                var k = 1;
                for (i = 0, j = this.smsbulk.length; i < j; i += chunk) {

                    temparray = this.smsbulk.slice(i, i + chunk);
                    console.log(temparray);



                    // setTimeout(() => {


                    // do whatever
                    this.service.InsertSmsBulk(JSON.stringify(temparray))
                        .then(r => {

                            // this.sendToogle = false;

                        })



                    // }, k * 1000);

                    k++;


                }
                this.smsNumbers = [];
                this.messageText = "";
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Your Request has been submitted for approval",
                    title: "Success",
                    messageTypeId: PayloadMessageTypes.success
                })
                this.sendToogle = true;

            }



        }
        else {
            if (this.useTemplate) {

                if (this.issection == true) {

                    var key = this.sessionIdEx + '?' + this.campusIdExx + '?' + this.programDetailIdEx + '?' + this.classIdEx + "?" + this.templateId + "?" + this.user.userId + "?" + this.sectionCourseLinkIdEx;

                }
                if (this.issection == false) {
                    this.sectionCourseLinkIdEx = '00000000-0000-0000-0000-000000000000'

                    var key = this.sessionIdEx + '?' + this.campusIdExx + '?' + this.programDetailIdEx + '?' + this.classIdEx + "?" + this.templateId + "?" + this.user.userId + "?" + this.sectionCourseLinkIdEx;

                }

                if (this.sectionCourseLinkIdEx.length > 0) {



                    this.repository.SendTemplateMsg(key)
                        .then(r => {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: "Your Request has been submitted for approval",
                                title: "Success",
                                messageTypeId: PayloadMessageTypes.success
                            })
                        })

                }
                else {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Please Select Section',
                        title: 'warning',
                        messageTypeId: PayloadMessageTypes.warning
                    });

                }

            }
            else {
                if (this.issection == true) {
                    var key = this.sessionIdEx + '?' + this.campusIdExx + '?' + this.programDetailIdEx + '?' + this.classIdEx + "?" + this.messageText + "?" + this.user.userId + "?" + this.sectionCourseLinkIdEx;


                }
                if (this.issection == false) {
                    this.sectionCourseLinkIdEx = '00000000-0000-0000-0000-000000000000'

                    var key = this.sessionIdEx + '?' + this.campusIdExx + '?' + this.programDetailIdEx + '?' + this.classIdEx + "?" + this.messageText + "?" + this.user.userId + "?" + this.sectionCourseLinkIdEx;

                }

                if (this.sectionCourseLinkIdEx.length > 0) {

                    if (this.messageText.indexOf('&') != -1) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "& is not supported!",
                            title: 'error',
                            messageTypeId: PayloadMessageTypes.error
                        });
                    }
                    else {



                        this.repository.SendMsgWithoutTemplate(key)
                            .then(r => {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: "Your Request has been submitted for approval",
                                    title: "Success",
                                    messageTypeId: PayloadMessageTypes.success
                                })

                            })









                        // this.contactList = [];
                        // this.datas.forEach(element => {
                        //     var data = null;
                        //     data = JSON.parse(element.parentContactNo);

                        //     if (data) {
                        //         var mobileNbr = data[0].phoneNo
                        //             .replace(/\s/g, '')
                        //             .replace('(', '')
                        //             .replace(')', '');

                        //         if (mobileNbr.length >= this.numberLength) {
                        //             mobileNbr = this.countryCode + mobileNbr.substring(mobileNbr.length - this.numberLength, mobileNbr.length);
                        //             this.contactList.push({ phoneNo: mobileNbr });
                        //         }
                        //     }
                        // });
                        // var key = JSON.stringify(this.contactList) + '?' + this.messageText;

                        // this.repository.Add(key).then(r => {
                        //     alert('Message Send Successfully')
                        // })
                        // alert(JSON.stringify(this.contactList));




                        this.smsNumbers = [];
                        this.messageText = "";
                    }


                }

                else {

                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Please Select Section',
                        title: 'warning',
                        messageTypeId: PayloadMessageTypes.warning
                    });
                }


                //this.service.AddOne(this.data).then()
            }
        }
    }
    getCustomize() {
        if (this.showall == true) {
            var z = '1';
        }
        if (this.showall == false) {
            var z = '0';
        }


        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCampusCustomize(z)
            .then(r => {
                this.campusCityListEx = r as Array<ICampusCityVM>;

            })




    }

    getAllowuser() {

        this.campusRepo.GetAllowUser()
            .then(r => {
                if (r[0].val == 0) {
                    this.allowuser = false
                }
                else {
                    this.allowuser = true
                }
            })




    }

    newGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    OpsInfo() {
        var BrowserDetect = {
            init: function () {
                this.browser =
                    this.searchString(this.dataBrowser) || "An unknown browser";
                this.version =
                    this.searchVersion(navigator.userAgent) ||
                    this.searchVersion(navigator.appVersion) ||
                    "an unknown version";
                this.OS = this.searchString(this.dataOS) || "an unknown OS";
                this.bit = this.searchString(this.dataBit) || " x32";
                this.OsVersion =
                    this.searchString(this.dataOsVersion) || "an unknown OS version";
            },
            searchString: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var dataString = data[i].string;
                    var dataProp = data[i].prop;
                    this.versionSearchString = data[i].versionSearch || data[i].identity;
                    if (dataString) {
                        if (dataString.indexOf(data[i].subString) != -1)
                            return data[i].identity;
                    } else if (dataProp) return data[i].identity;
                }
            },
            searchVersion: function (dataString) {
                var index = dataString.indexOf(this.versionSearchString);
                if (index == -1) return;
                return parseFloat(
                    dataString.substring(index + this.versionSearchString.length + 1)
                );
            },
            dataBrowser: [
                {
                    string: navigator.userAgent,
                    subString: "Chrome",
                    identity: "Chrome"
                },
                {
                    string: navigator.userAgent,
                    subString: "OmniWeb",
                    versionSearch: "OmniWeb/",
                    identity: "OmniWeb"
                },
                {
                    string: navigator.vendor,
                    subString: "Apple",
                    identity: "Safari",
                    versionSearch: "Version"
                },
                // {
                //     prop: window.opera,
                //     identity: "Opera",
                //     versionSearch: "Version"
                // },
                {
                    string: navigator.vendor,
                    subString: "iCab",
                    identity: "iCab"
                },
                {
                    string: navigator.vendor,
                    subString: "KDE",
                    identity: "Konqueror"
                },
                {
                    string: navigator.userAgent,
                    subString: "Firefox",
                    identity: "Firefox"
                },
                {
                    string: navigator.vendor,
                    subString: "Camino",
                    identity: "Camino"
                },
                {
                    // for newer Netscapes (6+)
                    string: navigator.userAgent,
                    subString: "Netscape",
                    identity: "Netscape"
                },
                {
                    string: navigator.userAgent,
                    subString: "MSIE",
                    identity: "Explorer",
                    versionSearch: "MSIE"
                },
                {
                    string: navigator.userAgent,
                    subString: "Gecko",
                    identity: "Mozilla",
                    versionSearch: "rv"
                },
                {
                    // for older Netscapes (4-)
                    string: navigator.userAgent,
                    subString: "Mozilla",
                    identity: "Netscape",
                    versionSearch: "Mozilla"
                }
            ],
            dataOS: [
                {
                    string: navigator.platform,
                    subString: "Win",
                    identity: "Windows"
                },
                {
                    string: navigator.platform,
                    subString: "Mac",
                    identity: "Mac"
                },
                {
                    string: navigator.userAgent,
                    subString: "iPhone",
                    identity: "iPhone/iPod"
                },
                {
                    string: navigator.platform,
                    subString: "Linux",
                    identity: "Linux"
                }
            ],
            dataBit: [
                {
                    string: navigator.userAgent,
                    subString: "Win64",
                    identity: "x64"
                },
                {
                    string: navigator.userAgent,
                    subString: "WOW64",
                    identity: "x64"
                }
            ],
            dataOsVersion: [
                {
                    string: navigator.userAgent,
                    subString: "NT 5.1",
                    identity: "XP"
                },
                {
                    string: navigator.userAgent,
                    subString: "NT 6.0",
                    identity: "Vista"
                },
                {
                    string: navigator.userAgent,
                    subString: "NT 6.1",
                    identity: "7"
                },
                {
                    string: navigator.userAgent,
                    subString: "NT 6.2",
                    identity: "8"
                }
            ]
        };
        BrowserDetect.init();

        return (
            BrowserDetect.dataBrowser +
            " on " +
            BrowserDetect.dataOS +
            " " +
            BrowserDetect.dataOsVersion +
            " " +
            BrowserDetect.dataBit
        );
    }

    changedate(){

        if(this.todatestring<this.datestring1)
        {
            this.todatestring=null
        }
    }
}
