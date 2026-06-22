/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';
import { StoreTypes } from "../../../../../../store";
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { ITransportationRouteStudentLink, ISetupSession, ISetupZone, ISetupCity, ISetupSubCity, routestudentlinkVM, routestudentlinklistVM, TransportChallanReport, ICampusBank, IFeeCampusChallanNoteLinkVM, ISetupCampusProgramVM, ISetupClass, IRouteStudentLinkEx } from '../../../../models';
import { TransportationRouteStudentLinkService, SetupZoneService, SetupSessionService, SetupCityService, SetupSubCityService, FeeStudentChallanService, FeeCampusBankLinkService, FeeCampusChallanNoteLinkService, SetupCampusService, SetupCampusProgramLinkService, SetupClassService } from '../../../../service';

import { TransportationRouteStudentLinkAddEdit } from '../add-edit';
import { TransportationRouteStudentLinkDelete } from '../delete';
import { ReportEngine } from '../../../../../../components';
import { HelperTransport } from '../../../Fee/HelperTransport';
import { GroupModel } from '../../../../models/general';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': TransportationRouteStudentLinkAddEdit,
        'delete-model': TransportationRouteStudentLinkDelete,
        // "report-engine": ReportEngine,
        //"helper-transport":HelperTransport
    }
})

export class TransportationRouteStudentLinkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    private transportFeeRepository: FeeStudentChallanService;
    private campusBankRepository: FeeCampusBankLinkService;
    private campusChallanRepository: FeeCampusChallanNoteLinkService;

    private repository: TransportationRouteStudentLinkService;
    private data: Array<ITransportationRouteStudentLink> = [];
    private datas: Array<IRouteStudentLinkEx> = [];
    private filterString: string = '';
    private zoneId = ''
    private sessionId = ''
    private campusProgramId = "";
    private classId = "";
    private cityId = ''
    private subcityId = ''
    private campusId = "";
    private addresFilter = ''
    private studentInfo: any = {};
    private zoneList: Array<ISetupZone> = []
    private sessionList: Array<ISetupSession> = []
    private cityList: Array<ISetupCity> = []
    private subcityList: Array<ISetupSubCity> = []
    private feeChallanList: Array<TransportChallanReport> = [];
    private campusBankList: Array<ICampusBank> = [];
    private campusChallanList: Array<IFeeCampusChallanNoteLinkVM> = [];
    private challanNote: string = '';
    private challanFooter: any = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
    private challanRData: any = [];
    private subinstallmentData: any = [];
    private campusSubCityModel: Array<GroupModel> = [];
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private report: String = "";

    private classrepo:SetupClassService=new SetupClassService(this.$store);
    classList:Array<ISetupClass>=[];

    private zoneRepo: SetupZoneService = new SetupZoneService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private cityRepo: SetupCityService = new SetupCityService(this.$store)
    private subcityRepo: SetupSubCityService = new SetupSubCityService(this.$store)
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)

    private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [
        { key: 'campusName', caption: 'Campus' },
        { key: 'fullName', caption: 'Student Name' },
        { key: 'refferenceNo', caption: 'Refference No' },
        { key: 'rollNo', caption: 'Roll No' },
        { key: 'address', caption: 'Address' },
        { key: 'routeTitle', caption: 'Route Title' },
        { key: 'stopName', caption: 'Route Detail' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new TransportationRouteStudentLinkService(this.$store);

        this.transportFeeRepository = new FeeStudentChallanService(this.$store);
        this.campusBankRepository = new FeeCampusBankLinkService(this.$store);
        this.campusChallanRepository = new FeeCampusChallanNoteLinkService(this.$store);
        // this.loadZone();
        this.loadSession();
        // this.loadCity();
    }

    mounted() {
        this.validatePage();
        // this.refreshData();
    }

    loadClass() {
        this.classList = [];
        this.classrepo.GetFindBy('e=>e.StatusId==1').then(r => {
            this.classList = r as Array<ISetupClass>
        })


    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('routeStudentLink' in this.user.claims) == true) {
                if (this.user.claims['routeStudentLink'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['routeStudentLink'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['routeStudentLink'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['routeStudentLink'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }
    transport(dta) {

        this.studentInfo = dta;
        this.$modal.show("helper-transport-modal");
    }

    loadCityCampus() {
        this.campusId = "";
        if (this.sessionId.length > 0) {
            this.campusRepo.GetCityVM().then(r => {
                this.campusSubCityModel = r;
            });
        }

    }
    loadProgramsOfCampus() {
        //   this.ddl = [];
        //   this.programDDL = [];
        //   let oldObj: ISetupCampusProgramVM;
        if (this.sessionId.length > 0 && this.campusId.length > 0) {
            var key = this.sessionId + "?" + this.campusId;
            this.campusProgramLinkRepo.GetAllVM(key).then(r => {
                this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            });
        }

    }

    // loadSession() {
    //     this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
    //         this.termModel = r;
    //     });
    // }
    refreshData() {
        // console.log(this.sessionId)
        // console.log(this.campusId)
        // console.log(this.campusProgramId)
        // console.log(this.classId)
        this.data = [];
        this.repository.GetAll()
            .then(response => this.data = (response as Array<ITransportationRouteStudentLink>));



        this.datas = [];
        if (this.sessionId.length > 0 && this.campusId.length > 0 && this.campusProgramId.length > 0 && this.classId.length > 0) {
            var key = this.sessionId + '?' + this.campusId + '?' + this.campusProgramId + '?' + this.classId;
            this.repository.GetRouteStudentList(key)
                .then(response => this.datas = (response as Array<IRouteStudentLinkEx>));




        }

    }

    loadZone() {
        this.zoneRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.zoneList = r as Array<ISetupZone>
            })
    }

    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }

    loadCity() {
        this.cityRepo.GetFindBy('e=>e.ZoneId.ToString()=="' + this.zoneId + '" ')
            .then(r => {
                this.cityList = r as Array<ISetupCity>
            })
    }

    loadSubCity() {
        this.subcityRepo.GetFindBy('e=>e.CityId.ToString()=="' + this.cityId + '" ')
            .then(r => {
                this.subcityList = r as Array<ISetupSubCity>
            })
    }

    insertModel() {

        if (this.sessionId.length > 0 && this.campusId.length > 0 && this.campusProgramId.length > 0 && this.classId.length > 0) {
            this.$modal.show('add-edit-model', {
                model: {
                    routeDetailId: '', admissionFormId: '', studentId: '', rollNo: '', fullName: '', address: '', campusProgramId: this.campusProgramId,
                    sessionId: this.sessionId
                    , campusId: this.campusId
                    , campusName: ''
                    , subCityId: ''
                    , subCityName: ''
                    , cityId: ''
                    , cityName: ''

                    , routeId: ''
                    , stopName: ''
                    , routeTitle: ''
                    , startingDtae: new Date()
                    , statusId: 0
                    , classId: this.classId
                }, IsNewRecord: true
            });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdowns",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }


    }

    editModel(model: routestudentlinklistVM) {



        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    printChallanModel(model: routestudentlinklistVM) {

        // alert(JSON.stringify(model.admissionFormId));



        this.feeChallanList = [];
        this.campusBankList = [];
        this.campusChallanList = [];
        this.challanNote = '';
        this.challanFooter = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
        this.subinstallmentData = [];
        this.challanRData = [];
        this.transportFeeRepository.GetTansportData(model.admissionFormId)
            .then(res => {
                this.feeChallanList = res as Array<TransportChallanReport>
                // console.log(JSON.stringify(this.feeChallanList));

                var key = this.feeChallanList[0].campusId + '?' + this.feeChallanList[0].programDetailId + '?' + this.feeChallanList[0].admissionFormId
                this.campusBankRepository.GetBankEx(key)
                    .then(res => {
                        this.campusBankList = res as Array<ICampusBank>
                        // console.log(JSON.stringify(this.campusBankList));

                        var keyy = this.feeChallanList[0].campusId + '?' + this.feeChallanList[0].challanTypeId

                        this.campusChallanRepository.GetDataVM(keyy)
                            .then(res => {
                                this.campusChallanList = res as Array<IFeeCampusChallanNoteLinkVM>
                                // console.log(JSON.stringify(this.campusChallanList));


                                var i = 0;
                                this.campusChallanList.forEach(e => {
                                    this.challanNote = this.challanNote + '<li>' + this.campusChallanList[i].description + '</li>';
                                    i++;
                                }

                                );
                                // alert(JSON.stringify(this.challanNote));

                                var docNo = this.feeChallanList[0].challanNo.substring(this.feeChallanList[0].challanNo.length - 7, this.feeChallanList[0].challanNo.length);
                                // alert(docNo);

                                var today = new Date();

                                this.challanFooter = [{ challanNote: this.challanNote, customerCode: this.feeChallanList[0].customerCode, challanNo: this.feeChallanList[0].challanNo, userName: this.user.email, docNo: docNo, today: today }];

                                // console.log(JSON.stringify(this.challanFooter));

                                this.challanRData = '[' + JSON.stringify(this.challanFooter) + ',' + JSON.stringify(this.feeChallanList) + ',' + JSON.stringify(this.campusBankList) + ']';
                                // console.log(this.challanRData);

                                this.challanRData = JSON.parse(this.challanRData);


                                this.report = "/assets/Reports/Resource/Admission/TrReport.xml";

                                // this.$parent.$parent.$emit('fire_report', { report: this.report, data: this.challanRData });

                                this.$modal.show("report-viewer-eng");
                            });

                    });
            });



        // this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }
    private reportDate: any = [];
    fireChallan(params) {
        if (params) {
            if (params.report) {
                this.reportDate = params.data as any;
                this.report = params.report;
                this.$modal.show("report-viewer-eng");
            }
        }
    }
    deleteModel(model: ITransportationRouteStudentLink) {
        this.$modal.show('delete-model', { model: model });
    }
}