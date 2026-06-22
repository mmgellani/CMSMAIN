import * as helper from '../../../../helper';

import { AdmissionAdmissionFormService, FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, RegistrationSectionCourseLinkService, SetupAdmissionTypeService, SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupGenderService, SetupProgramDetailsService, SetupSessionService, SetupShiftService } from '../../../../service';
import { DDLGroupModel, DDLModel, ElMigrationVM, ICampusCityVM, IFeeConcession, IFeeConcessionDetail, IFeeConcessionDetailVM, IFeeScholarshipCriteriaVM, IRegistrationSectionCourseLinkVM, IScholarshipApplyVM, IScholarshipStudentModel, ISetupAdmissionType, ISetupCampus, ISetupCampusProgramVM, ISetupClass, ISetupGender, ISetupProgramDetails, ISetupProgramDetailsVM, ISetupSession, ISetupShift, IStudentEnrolledVM, IStudentModel, IStudentToEnrollVM, KinshipStudent, ConcessKinBulk, KinshipConcession, ConcessKinBulkEx } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { ElUpdation } from '../elupdate';
import { Helper } from '../../../Fee/Helper';
import { IRootStoreState, RootStoreTypes } from '../../../../../store';
import { MigrationService } from '../../../../service/Migration/migration-service';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import axios from 'axios';

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

export class ConcessKinshipStdList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;

    private repositoryVM: RegistrationSectionCourseLinkService;


    private datas: Array<ConcessKinBulkEx> = [];
    private saveDatasList: Array<IStudentEnrolledVM> = [];
    private reportData: any = [];
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    //private shiftId = ''
    private percentageFrom = 0
    private percentageTo = 0
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

    private genderList: Array<ISetupGender> = [];
    private campusCityList: Array<ICampusCityVM> = []
    private genderRepo: SetupGenderService;
    private genderModel: Array<ISetupGender> = [];
    // private genderModelCB: Array<ISetupGenderCB> = [];
    private idGender: string = "";
    chkall = false;
    private scholarshipid: string = "";
    private genderId: string = '';

    admissionTypeId: string = "";
    private list: Array<KinshipConcession> = [];

    private admissionTypeList: Array<ISetupAdmissionType> = [];
    private Genderrepository: SetupGenderService;

    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private admisisonTypeRepo: SetupAdmissionTypeService;
    private admissionRepo: AdmissionAdmissionFormService = new AdmissionAdmissionFormService(this.$store)
    private migrationRepo: MigrationService = new MigrationService(this.$store)
    private data: any = [];
    private batchid: number = 1;

    private columns = [
        { key: 'formNo', caption: 'Form No' },
        { key: 'refferenceNo', caption: 'Refference No' },
        { key: 'fullName', caption: 'Student Name' },
        { key: 'fatherName', caption: 'Father Name' },
        { key: 'obtainMarks', caption: 'Obtain Marks' },
        { key: 'totalMarks', caption: 'Total Marks' },
        { key: 'percentage', caption: 'Percentage' },
        { key: 'isChecked', caption: 'Select' }
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
        this.Genderrepository = new SetupGenderService(this.$store);

        this.loadSession();
        this.$watch('sessionId', this.loadCityCampus);
        this.$watch('campusId', this.loadProgramsOfCampus);
        // this.$watch('campusProgramId', this.refreshData);


        // this.getGeroutnder()
        // this.loadAdmissionType();

    }

    mounted() {
        this.validatePage();
        // this.refreshData();

        this.Genderrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.genderList = [];
            this.genderList = res as Array<ISetupGender>
        })
    }



    loadConcessions() {
        this.admissionRepo.GetConcessionlist(this.campusProgramId).then(r => {
            this.list = r as Array<KinshipConcession>
        })
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
        if (this.chkall == true) {
            this.datas.forEach(element => {
                element.isChecked = true;

            });
        }
        if (this.chkall == false) {
            this.datas.forEach(element => {
                element.isChecked = false;

            });


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
            if (('concesskinsstdd' in this.user.claims) == true) {
                if (this.user.claims['concesskinsstdd'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['concesskinsstdd'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['concesskinsstdd'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['concesskinsstdd'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {

        this.datas = [];

        var key = `${this.campusProgramId}?${this.genderId}?${this.percentageFrom}?${this.percentageTo}`;

        this.admissionRepo.GetConcessKinsStudent(key)
            .then(response => {
                this.datas = (response as Array<ConcessKinBulkEx>)
            });
    }

    getreport() {
        // this.reportData = response as any;
        if (this.datas.length > 0) {
            this.$store.dispatch(RootStoreTypes.reportOperation, {
                data: this.datas as any,
                path: '/assets/Reports/Resource/Admission/kinshipstdlist.xml',
                show: true
            });
        }

        // var key = `${this.campusProgramId}?${this.genderId}?${this.percentageFrom}?${this.percentageTo}`;

        // this.admissionRepo.GetConcessKinsStudent(key).then(response => {
        //     this.reportData = response as any;
        //     if (this.reportData.length > 0) {
        //         this.$store.dispatch(RootStoreTypes.reportOperation, {
        //             data: this.reportData as any,
        //             path: '/assets/Reports/Resource/Admission/kinshipstdlist.xml',
        //             show: true
        //         });
        //     }


        // })
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
    UpdateElRecord(option: any, option2: any) {

        this.$modal.show('el-model', { CAMPUSPROGRAMID: option2, ADMSIONFORMID: option });


    }
    saveModal(list) {

    }
    insertModel() {

        // this.GetTokenAccess();

        var z = this.datas.filter(e => e.isChecked == true);
        var resstr = JSON.stringify(z) + '?' + this.scholarshipid
        var response = confirm('Are You Sure to Apply Bulk Concession')
        if (response) {
            this.admissionRepo.InsertBulkConessoin(resstr).then(r => {

                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Success",
                    title: 'warning',
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