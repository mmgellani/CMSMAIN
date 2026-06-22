import Vue from 'vue';
import Component from 'vue-class-component';
import { StoreTypes } from '../../../../../../store';
import { IMessage, ISms, IVWCustomData, ITemplates, ISmsAPI, ContactList } from '../../../../models/Message/message';
import { MessageService } from '../../../../service/Message/message-service';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { SetupSessionService, SetupCampusService, SetupProgramDetailsService, SetupClassService, SetupSectionService, SetupCampusProgramLinkService, TransportationVehicleInfoService } from '../../../../service';
import { ISetupSession, ISetupCampus, DDLModel, DDLGroupModel, ISetupClass, ICampusCityVM, ISetupCampusProgramVM, ISetupSection } from '../../../../models';
import { gunzip } from 'zlib';
import { dateFormat } from 'highcharts';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';

@Component({
    template: require("./index.html")
})
export class SmsToStudents extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    check: boolean = true;
    condition: boolean = true;
    private picked: string = "Outsider";

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)

    private campusRepo: SetupCampusService;
    private sectionRepo: SetupSectionService;
    private sessionRepo: SetupSessionService;
    private classRepo: SetupClassService;
    private programRepo: SetupProgramDetailsService;

    private smsapid: string = '';


    private sessionModel: Array<ISetupSession> = [];
    private campusModel: Array<ISetupCampus> = [];
    private cityDDL: Array<DDLGroupModel> = [];
    private campusddl: Array<DDLModel> = [];
    private campusCityList: Array<ICampusCityVM> = [];
    private sectionModel: Array<ISetupSection> = [];
    private datas: Array<IVWCustomData> = [];
    private smsapilist: Array<ISmsAPI> = [];
    private repository: MessageService;


    campusProgramLinkList: any = [];
    contactList: Array<ContactList> = [];
    classList: Array<ISetupClass> = [];
    programDetailId: string = "";
    ddl: Array<DDLModel> = [];
    programDDL: Array<DDLGroupModel> = [];
    sessionId: string = "";
    campusId: string = "";
    classId: string = "";
    private quedDate: Date = new Date();
    private sendDate: Date = new Date();
    private useTemplate = true;

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
    private templateList: Array<ITemplates> = [];
    templateId = '';
    mounted() {
        this.loadSession();
        this.loadTemplates();
        this.loadMessageAPI();
        this.validatePage();
    }


    loadMessageAPI() {
        // this.service.GetAll()
        //     .then(response => this.smsapilist = (response as Array<ISmsAPI>));

        this.service.GetSmsMask(this.user.userId.toString())
        .then(response => this.smsapilist = (response as Array<ISmsAPI>));


    }
    created() {

        this.sessionRepo = new SetupSessionService(this.$store);
        this.campusRepo = new SetupCampusService(this.$store);
        this.programRepo = new SetupProgramDetailsService(this.$store);
        this.classRepo = new SetupClassService(this.$store);
        this.sectionRepo = new SetupSectionService(this.$store);
        this.repository = new MessageService(this.$store)
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('smstostudent' in this.user.claims) == true) {
                if (this.user.claims['smstostudent'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['smstostudent'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['smstostudent'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['smstostudent'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }


    resetMessage() {
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
            .then(response => {
                this.templateList = response as Array<ITemplates>

                if (this.picked == 'Outsider') {
                    // alert('here')
                    this.templateList = this.templateList.filter(e => e.type.indexOf('!') >= 0);
                    // alert(JSON.stringify(this.templateList))
                }
            });

    }
    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionModel = r as Array<ISetupSession>
            })
    }


    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }

    getSection() {
        this.sectionRepo
            .GetAll()
            .then(response => (this.sectionModel = response as Array<ISetupSection>));
    }
    refereshData() {
        this.datas = [];
        var key = this.sessionId + '?' + this.campusId + '?' + this.programDetailId + '?' + this.classId

        this.repository.GetFilteredSmsNumbers(key).then(
            response =>
                (this.datas = response as Array<IVWCustomData>)
        );
    }

    readFile(data) {
        var file = data.target.files;
        this.reader.onload = e => console.log("load")
        this.reader.readAsText(file);
    }

    private smsNumbers: any = [];
    private countryCode: number = 92;
    private numberLength: number = 10;
    private messageText: string = "";
    keys: string = "";
    smsBody: Array<any> = [];
    uploadExcel(providedData) {
        try {
            this.smsNumbers = [];
            this.smsBody = [];
            this.keys = providedData.header;
            this.smsBody = providedData.body;
            // this.smsBody.forEach(element => {
            //     this.smsNumbers.push({ RollNo: element.RollNo, TotalMarks: element.TotalMarks, ObtainedMarks: element.ObtainedMarks, MobileNo: this.createNumber(element.MobileNo) });

            // });

            this.smsBody.forEach(element => {
                this.smsNumbers.push({C1: this.createNumber(element.C1), C2: element.C2, C3: element.C3, C4: element.C4, C5: element.C5, C6: element.C6, C7: element.C7 });

            });
            console.log(JSON.stringify(this.smsNumbers));
        }
        catch (e) {
            console.log("ërror " + e)
        }
    }

    private rollNo: any = '';
    // private countryCode: number = 92;
    // private numberLength: number = 10;
    // private messageText: string = "";
    // keys: string = "";
    // smsBody: Array<any> = [];
    uploadStudentExcel(providedData) {
        console.log(JSON.stringify(providedData))

        var type = this.templateList.find(e => e.templateId == this.templateId).type
        if (type == "ExamResult") {

            try {
                this.smsNumbers = [];
                this.smsBody = [];
                this.keys = providedData.header;
                this.smsBody = providedData.body;
                this.smsBody.forEach(element => {
                    this.smsNumbers.push({ RollNo: element.RollNo, TotalMarks: element.TotalMarks, ObtainedMarks: element.ObtainedMarks });

                });
                console.log(JSON.stringify(this.smsNumbers));
            }
            catch (e) {
                console.log("ërror " + e)
            }


        }
        else {
            try {
                this.smsNumbers = [];
                this.rollNo = [];
                this.smsBody = [];
                this.keys = providedData.header;
                this.smsBody = providedData.body;
                this.smsBody.forEach(element => {
                    this.rollNo.push(element.RollNo);
                });
                this.smsNumbers = this.rollNo;
                console.log(JSON.stringify(this.rollNo))


            }
            catch (e) {
                console.log("ërror " + e)
            }
        }
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
    loadProgramsOfCampus() {
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionId + "?" + this.campusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
        });
    }
    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }
    updateNumber(number: string) {
        return number
            .replace(/\-/g, " ")
            .replace(/\s+/g, "")
            .replace(/[^0-9a-zA-Z\xC0-\xFF \-]/g, "");
    }

    sendMessage() {
        if (this.templateId.length > 0) {
            if (this.picked == 'OnStudents') {
                var type = this.templateList.find(e => e.templateId == this.templateId).type
                if (type == "ExamResult" && this.smsNumbers.length > 0 && this.smsapid.length > 0) {
                    var key = JSON.stringify(this.smsNumbers) + "?" + this.templateId + "?" + this.smsapid;
                    this.service.GetStudentsContactExx(key)
                        .then(r => {
                            this.contactList = r as Array<ContactList>
                            console.log(JSON.stringify(this.contactList))

                            this.smsNumbers = [];
                            this.messageText = "";

                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: "Your Request has been submitted for approval",
                                title: "Success",
                                messageTypeId: PayloadMessageTypes.success
                            });
                        })


                }
                else if (this.rollNo.length > 0) {
                    var key = JSON.stringify(this.rollNo) + "?" + this.templateId;
                    this.service.GetStudentsContact(key)
                        .then(r => {
                            this.contactList = r as Array<ContactList>
                            console.log(JSON.stringify(this.contactList))

                            this.smsNumbers = [];
                            this.messageText = "";

                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: "Your Request has been submitted for approval",
                                title: "Success",
                                messageTypeId: PayloadMessageTypes.success
                            });
                        })
                }
            }
            else if (this.smsNumbers.length > 0 && this.smsapid.length > 0) {
                var key = JSON.stringify(this.smsNumbers) + "?" + this.templateId  + "?" + this.smsapid;
                this.service.GetStudentsContactEx(key)
                    .then(r => {
                        this.contactList = r as Array<ContactList>
                        console.log(JSON.stringify(this.contactList))

                        this.smsNumbers = [];
                        this.messageText = "";

                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Your Request has been submitted for approval",
                            title: "Success",
                            messageTypeId: PayloadMessageTypes.success
                        });
                    })
            }
        }


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
}
