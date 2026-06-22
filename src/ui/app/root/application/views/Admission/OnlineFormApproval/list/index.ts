import * as helper from '../../../../helper';

import { AdmissionAdmissionFormService, FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, RegistrationSectionCourseLinkService, SetupAdmissionTypeService, SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupGenderService, SetupProgramDetailsService, SetupSessionService, SetupShiftService } from '../../../../service';
import { DDLGroupModel, DDLModel, ElMigrationVM, ICampusCityVM, IFeeConcession, IFeeConcessionDetail, IFeeConcessionDetailVM, IFeeScholarshipCriteriaVM, IRegistrationSectionCourseLinkVM, IScholarshipApplyVM, IScholarshipStudentModel, ISetupAdmissionType, ISetupCampus, ISetupCampusProgramVM, ISetupClass, ISetupGender, ISetupProgramDetails, ISetupProgramDetailsVM, ISetupSession, ISetupShift, IStudentEnrolledVM, IStudentModel, IStudentToEnrollVM, KinshipStudent, OnlineApprovalStudent, admissionStatus, KinshipConcession } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { ElUpdation } from '../elupdate';
import { Helper } from '../../../Fee/Helper';
import { IRootStoreState } from '../../../../../store';
import { MigrationService } from '../../../../service/Migration/migration-service';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import axios from 'axios';
import { data } from 'jquery';
import { or } from 'vuelidate/lib/validators';

//import { axios } from 'axios';

/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/


















export interface IParams {
    grant_type: string;
    client_id: string;
    client_secret: string;
    scope: string;
    userName: string;
    password: string;

}
@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': ElUpdation
    }
})

export class OnlineFormApprovalList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;

    private repositoryVM: RegistrationSectionCourseLinkService;


    private datas: Array<OnlineApprovalStudent> = [];
    private admissionstatusdatas: Array<admissionStatus> = [];
    private data: Array<OnlineApprovalStudent> = [];
    private saveDatasList: Array<IStudentEnrolledVM> = [];
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    list:Array<KinshipConcession>=[];
    //private shiftId = ''
    private percentageFrom = 1
    private percentageTo = 99
    private scholarshipCriteriaId = ''
    //private selected:any;
    private campusProgramId = '';
    private classid: string = '';
    private repoClass = new SetupClassService(this.$store);

    //private scholarhipList: Array<IScholarshipApplyVM> = []
    private campusList: Array<ISetupCampus> = []
    classList: Array<ISetupClass> = []
    private sessionList: Array<ISetupSession> = []
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private shiftList: Array<ISetupShift> = []
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []
    private genderRepo: SetupGenderService;
    private genderModel: Array<ISetupGender> = [];
    // private genderModelCB: Array<ISetupGenderCB> = [];
    private idGender: string = "";
    chkall = false;
    private selectAll = false;
    private sectionCourseLinkId: string = "";

    admissionTypeId: string = "";
    private admissionTypeList: Array<ISetupAdmissionType> = [];

    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private admisisonTypeRepo: SetupAdmissionTypeService;
    private admissionRepo: AdmissionAdmissionFormService = new AdmissionAdmissionFormService(this.$store)
    private migrationRepo: MigrationService = new MigrationService(this.$store)
    // private data: any = [];
    private batchid: number = 1;

    private columns = [
        { key: 'refferenceNo', caption: 'Refference No' },
        { key: 'fullName', caption: 'Student Name' },
        { key: 'fatherName', caption: 'Father Name' },
        { key: 'admissionDate', caption: 'Date', sort: true },
        { key: 'apllicationStatus', caption: 'Scholarship/Kinship Status', sort: true },
        // { key: 'isApproval', caption: "Select All" },
        { key: 'action', caption: 'Action', width: 120 }

    ];
    batch = [{ item: 1, show: 'Batch 1' }, { item: 2, show: 'Batch 2' }, { item: 3, show: 'Batch 3' }, { item: 4, show: 'Batch 4' }, { item: 5, show: 'Batch 5' }]

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []

    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.genderRepo = new SetupGenderService(this.$store);
        this.admisisonTypeRepo = new SetupAdmissionTypeService(this.$store);
        this.repositoryVM = new RegistrationSectionCourseLinkService(this.$store);

        this.loadSession();
        this.$watch('sessionId', this.loadCityCampus);
        this.$watch('campusId', this.loadProgramsOfCampus);
        // this.$watch('campusProgramId', this.refreshData);
        this.$watch('classid', this.loadSections);
        this.$watch('sectionCourseLinkId', this.refreshData);
        // this.getGeroutnder()
        // this.loadAdmissionType();

    }

    mounted() {
        this.validatePage();
        // this.refreshData();

    }

    checkStatus(opt) {
        if (opt == 'Concession / Scholarships'  || opt == 'Processing fee paid') {
            return true;
        }
        else { return false }
    }

    checkAll() {
        if (this.selectAll == true) {
            this.datas.forEach(element => {
                if (this.checkStatus(element.apllicationStatus)) {
                    element.isApproval = true;
                }
            });
        }
        else {
            this.datas.forEach(element => {
                element.isApproval = false;
            });
        }
        // console.log(JSON.stringify(this.datas))
    }

    loadClass() {
        this.classList = [];
        this.classid = '';
        this.sectionCourseLinkId = '';
        this.sectionList = [];
        this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
            this.classList = res as Array<ISetupClass>

        });
    }
    loadCampus() {
        this.campusRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.campusList = r as Array<ISetupCampus>

            })
    }

    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }

    get shouldSave() {
        var isEnable: boolean = false;

        if (this.datas) {
            if (this.datas.filter(s => s.isApproval)) {
                if (this.datas.filter(s => s.isApproval).length > 0) {
                    isEnable = true;
                }
            }
        }

        return isEnable;
    }


    loadSections() {
        this.sectionList = [];
        if (this.campusProgramId.length > 0 && this.classid.length > 0) {
            var key = this.campusProgramId + '?' + this.classid
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
    }
    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    updall() {
        // if(this.chkall==true)
        // {
        //     this.datas.forEach(element => {
        //         element.isChecked=true;

        //     });
        // }
        // if(this.chkall==false)
        // {
        //     this.datas.forEach(element => {
        //         element.isChecked=false;

        //     });


        // }


    }
    // replaceText(text) {
    //     let reg = 'Student Application in'
    //     return text.replace(reg, '')
    // }

    set_bgColor(item) {
        if (item.orderBy == 1) {
            return 'bg-1';
        }
        else if (item.orderBy == 2) {
            return 'bg-2';
        }
        else if (item.orderBy == 3) {
            return 'bg-3';
        }
        else if (item.orderBy == 4) {
            return 'bg-4';
        }
        else if (item.orderBy == 5) {
            return 'bg-5';
        }
        else if (item.orderBy == 6) {
            return 'bg-6';
        }
        else if (item.orderBy == 7) {
            return 'bg-7';
        }
        else if (item.orderBy == 8) {
            return 'bg-8';
        }
        else if (item.orderBy == 9) {
            return 'bg-9';
        }
        else if (item.orderBy == 10) {
            return 'bg-10';
        }
        else if (item.orderBy == 11) {
            return 'bg-11';
        }

    }

    loadProgramsOfCampus() {
        this.campusProgramId = ''
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionId + "?" + this.campusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            // this.refreshData()
        });
    }
    // getGender() {
    //     this.genderModelCB = []
    //     this.genderRepo
    //         .GetAll()
    //         .then(response => {
    //             this.genderModel = response as Array<ISetupGender>
    //             if (this.genderModel.length > 0) {
    //                 this.idGender = this.genderModel[0].genderId
    //             }


    //         });
    // }
    loadAdmissionType() {
        this.admisisonTypeRepo.GetFindBy("s=>s.StatusId==1").then(r => {
            this.admissionTypeList = r as Array<ISetupAdmissionType>;
            if (this.admissionTypeList.length > 0) {
                this.admissionTypeId = this.admissionTypeList[0].admissionTypeId
            }
        });
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('onlineFormApproval' in this.user.claims) == true) {
                if (this.user.claims['onlineFormApproval'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['onlineFormApproval'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['onlineFormApproval'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['onlineFormApproval'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }


    refreshData() {

        this.datas = [];

        if (this.campusId.length > 0) {
            var key = this.sessionId + "?" + this.campusId;
            this.admissionRepo.GetApprovalStudent(key)
                .then(response => {
                    this.datas = (response as Array<OnlineApprovalStudent>)
                    this.admissionRepo.GetAdmissionStatus(key).then(r => {
                        this.admissionstatusdatas = r as Array<admissionStatus>
                        console.log(JSON.stringify(this.admissionstatusdatas))


                    })

                    // if (this.datas.length > 0) {
                    //     this.loadSections(key);
                    // }

                });
        }
    }
    check(model: IStudentToEnrollVM) {
        if (model.rollNo.length == 0) {
            model.isSelected = false;
        }
    }
    check2(model: IStudentToEnrollVM) {
        if (model.rollNo.length > 0) {
            this.enableCheckBox(model);
        }

    }
  
    enableCheckBox(model: IStudentToEnrollVM) {
        var start = Number(model.range.split('-')[0].toString());
        var end = Number(model.range.split('-')[1].toString());
        var rollNo = Number(model.rollNo);

        if ((rollNo >= start) && (rollNo <= end)) {
            model.isDisabled = true;
            model.isDisabled = false;
        } else {
            model.isSelected = false;
            model.isDisabled = true;
        }
    }
    showRange(model: IStudentToEnrollVM) {
        var range = this.sectionList.find(s => s.sectionId == model.sectionId)
        model.range = range.fromSerial + '-' + range.toSerial;
        this.check2(model)

    }
    UpdateElRecord(option: any) {


        this.$modal.show('el-model', { REFFERENE: option });


    }
    saveModal(list) {
        this.saveDatasList = [];
        this.saveDatasList = list;
    }

    loadFilter(str) {
        (window.document.getElementById("grid_search") as HTMLInputElement).setAttribute('value', str);
        (window.document.getElementById("grid_search") as HTMLInputElement).validity;
    }

    insertModel() {

        this.data = this.datas.filter(e => e.isApproval == true);

        if (this.data.length > 0) {

            this.admissionRepo.InsertApprovalStudent(JSON.stringify(this.data))
                .then(r => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Inserted Successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    });
                    this.refreshData();
                })
        }
    }

    GetTokenAccess() {

        const axios = require('axios')
        const qs = require('querystring')
        const requestBody = {
            grant_type: "password",
            client_id: "5150c9e8-c886-436d-9304-a19e06ecb8aa",
            client_secret: "YOzKpZIS9:/g_SNGO7G49_W.?ltCOur7",
            scope: "https://graph.microsoft.com/.default",
            userName: "fahad.sattar@cms.edu.pk",
            password: "Fahad03064160085"
        }

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',

            }
        }
        const url = 'https://login.microsoftonline.com/12b221b3-0464-4223-89e5-888835778b58/oauth2/v2.0/token';
        axios.post(url, qs.stringify(requestBody), config)
            .then((result) => {
                console.log(JSON.stringify(result))
            })
            .catch((err) => {
                // Do somthing
            })
        // var data: IParams = {
        //     grant_type: "password",
        //     client_id: "5150c9e8-c886-436d-9304-a19e06ecb8aa",
        //     client_secret: "YOzKpZIS9:/g_SNGO7G49_W.?ltCOur7",
        //     scope: "https://graph.microsoft.com/.default",
        //     userName: "fahad.sattar@cms.edu.pk",
        //     password: "Fahad03064160085"
        //   };
        //   this.migrationRepo.GetAccessToken(data).then(r=>
        //     {
        //             console.log(JSON.stringify(r))

        //     })



    }

    editModel(model: IScholarshipApplyVM) {
        // this.$modal.show('add-edit-model', { model: this.datas.filter(s=>s.scholarshipName==model.scholarshipName)});
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }


}