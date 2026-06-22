/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { DDLGroupModel, DDLModel, HadafStudent, ICampusCityVM, IFeeConcession, IFeeConcessionDetail, IFeeConcessionDetailVM, IFeeScholarshipCriteriaVM, IRegistrationSectionCourseLinkVM, IScholarshipApplyVM, IScholarshipStudentModel, ISetupAdmissionType, ISetupCampus, ISetupCampusProgramVM, ISetupClass, ISetupGender, ISetupProgramDetails, ISetupProgramDetailsVM, ISetupSession, ISetupShift, IStudentModel, IStudentToEnrollVM, IToEnrollWithoutPaidVM } from '../../../../models';
import { FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, SetupAdmissionTypeService, SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupGenderService, SetupProgramDetailsService, SetupSessionService, SetupShiftService } from '../../../../service';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { ISetupGenderCB } from '../../../Registration/EnrollmentBulk/list';
import { MigrationService } from '../../../../service/Migration/migration-service';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

@Component({
    name: 'models-form-listEx',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class RegistrationEnrollmentBulkWithoutPaidListEx extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: MigrationService;

    private datas: any = [];
    private trans: any = [];
    private filterString: string = '';
    private chekallrec = false;
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    //private shiftId = ''
    private percentageFrom = 1
    private percentageTo = 99
    private scholarshipCriteriaId = ''
    //private selected:any;
    private campusProgramId = '';
    private classid: string = '';
    private sectionId: string = '';
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
    private genderModelCB: Array<ISetupGenderCB> = [];
    private idGender: string = "";
    admissionTypeId: string = "";
    btnshow = true;
    private admissionTypeList: Array<ISetupAdmissionType> = [];

    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private admisisonTypeRepo: SetupAdmissionTypeService;

    private columns = [
        { key: 'ReferenceNo', caption: 'Reference No.' },
        { key: 'StudentName', caption: 'Student Name' },
        { key: 'FatherName', caption: 'Father Name' },
        { key: 'Rollno', caption: 'Roll #' },
        { key: 'IsSelected', caption: 'Sected', width: 80 }
    ];


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []

    created() {
        this.repository = new MigrationService(this.$store);
        this.genderRepo = new SetupGenderService(this.$store);
        this.admisisonTypeRepo = new SetupAdmissionTypeService(this.$store);
        this.loadSession();
        this.loadClass();
        this.getGender();
        this.loadAdmissionType();
        this.loadTransfer();
        this.$watch('classid', this.loadCmsSections);
    }

    mounted() {
        this.validatePage();
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

    loadClass() {
        this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
            this.classList = res as Array<ISetupClass>

        });
    }

    loadTransfer() {
        this.repository.GetCmsTransfer()
            .then(response => this.trans = response);
    }


    loadSections() {
        if (this.classid.length > 0) {
            var key2 = this.campusProgramId + '?' + this.classid + "?" + this.admissionTypeId + "?" + this.idGender;

            this.enrollmentRepo.GetSectionList(key2)
                .then(r => {
                    this.sectionList = r as Array<IRegistrationSectionCourseLinkVM>
                    // console.log(this.sectionList==null)
                    if (this.sectionList == null) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Section not Defined',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }
                })
        }
    }
    loadCityCampus() {
        if (this.sessionId.length > 0) {
            this.campusddl = [];
            this.cityDDL = [];
            let oldObj: ICampusCityVM;
            this.campusRepo.GetCityVM().then(r => {
                this.campusCityList = r as Array<ICampusCityVM>;
            });
        }
    }

    loadProgramsOfCampus() {
        if (this.campusId.length > 0) {
            this.campusProgramId = ''
            this.ddl = [];
            this.programDDL = [];
            let oldObj: ISetupCampusProgramVM;
            var key = this.sessionId + "?" + this.campusId;
            this.campusProgramLinkRepo.GetAllVM(key).then(r => {
                this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            });
        }
    }

    cmsSec: any = [];
    SectionTitle: string = '';
    loadCmsSections() {
        if (this.classid.length > 0) {
            this.cmsSec = [];
            var foundData = this.trans.filter(e => e.toid == this.campusProgramId);
            this.repository.GetCmsSections({ "providedString": foundData[0].fromid })
                .then(e => this.cmsSec = e);
        }
    }

    getGender() {
        this.genderModelCB = []
        this.genderRepo
            .GetAll()
            .then(response => {
                this.genderModel = response as Array<ISetupGender>
                if (this.genderModel.length > 0) {
                    this.idGender = this.genderModel[0].genderId
                }
            });
    }
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
            if (('enrollmentBulk' in this.user.claims) == true) {
                if (this.user.claims['enrollmentBulk'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['enrollmentBulk'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['enrollmentBulk'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['enrollmentBulk'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {

        var foundData = this.trans.filter(e => e.toid == this.campusProgramId);
        console.log(this.campusProgramId);
        console.log(JSON.stringify(foundData));
        if (foundData) {
            var getStr = { "providedString": `combination = '` + foundData[0].fromid + `' AND SectionTitle = '` + this.SectionTitle + `' ORDER BY Rollno` };

            console.log(JSON.stringify(getStr));
            this.datas = [];

            this.repository.GetCmsData(getStr)
                .then(response => {
                    this.datas = (response as Array<HadafStudent>)

                    this.datas.forEach(element => {
                        element.IsSelected = false;
                        element.SectionTitle = this.sectionId
                        element.Class = this.classid
                        // element.AcademicInfo = element.AcademicInfo.replace(/""/g, '"');
                        // element.Address = element.Address.replace(/""/g, '"');
                        // element.Guardians = element.Guardians.replace(/""/g, '"');
                        // element.ParentContactNo = element.ParentContactNo.replace(/""/g, '"');
                        // element.StudentContactNo = element.StudentContactNo.replace(/""/g, '"');
                    });
                });
        } else {
            alert('No Data Found');
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

    CheckAll() {
        if (this.chekallrec == true) {
            this.datas.forEach(element => {
                element.IsSelected = true;
            });
        }
        if (this.chekallrec == false) {
            this.datas.forEach(element => {
                element.IsSelected = false;
            });
        }
    }

    insertModel() {

        var response = confirm('Are you sure to Transfer Cms to Ems')
        if (response) {
            this.btnshow = false;
            var list = JSON.stringify(this.datas.filter(s => s.IsSelected));

            var getStr = { "providedString": list };

            console.log('SELECT "Fee"."TransferCmsToEms"(' + list + ')');

            this.repository.InsertCmsList(getStr)
                .then(r => {
                    this.btnshow=true;
                    this.refreshData()
                }
                );
        }


    }

    editModel(model: IScholarshipApplyVM) {
        // this.$modal.show('add-edit-model', { model: this.datas.filter(s=>s.scholarshipName==model.scholarshipName)});
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }


}
