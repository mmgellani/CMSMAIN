/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IFeeConcessionDetail, IFeeConcessionDetailVM, ISetupSession, ISetupShift, ISetupCampus, IStudentModel, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupProgramDetailsVM, IFeeConcession, IFeeScholarshipCriteriaVM, ISetupAdmissionType, ISetupCampusProgramVM, IScholarshipStudentModel, IScholarshipApplyVM, IStudentToEnrollVM, IRegistrationSectionCourseLinkVM, ISetupClass, ICampusCityVM, ISetupGender, IStudentEnrolledVM, IAdmissionAdmissionFormCpl4VM, DuplicateAdmission } from '../../../../models';
import { FeeConcessionDetailService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, SetupClassService, SetupGenderService, RegistrationSectionCourseLinkService, AdmissionAdmissionFormService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import { Helper } from '../../../Fee/Helper';
import * as helper from '../../../../helper';
import { MigrationService } from '../../../../service/Migration/migration-service';


// export interface ISetupGenderCB {
//     genderId: string;
//     description: string;
//     statusId: number;
//     loggerId: string;
//     isChecked: boolean;

// }
@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class AdmissionDuplicateRemoveList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;

    private repositoryVM: RegistrationSectionCourseLinkService;


    private datas: Array<DuplicateAdmission> = [];
    private saveDatasList: Array<IStudentEnrolledVM> = [];
    private filterString: string = '';
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
    private sectionCourseLinkId: string = "";

    admissionTypeId: string = "";
    private admissionTypeList: Array<ISetupAdmissionType> = [];

    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private admissionRepo: AdmissionAdmissionFormService = new AdmissionAdmissionFormService(this.$store)
    private migrationRepo: MigrationService = new MigrationService(this.$store)

    private admisisonTypeRepo: SetupAdmissionTypeService;
    private data: any = [];

    private columns = [
        { key: 'refferenceNo', caption: 'Reference No.' },
        { key: 'fullName', caption: 'Student Name' },
        { key: 'fatherName', caption: 'Father Name' },
        { key: 'contactNo', caption: 'ContactNo' },
        { key: 'boardRollNo', caption: 'Board RollNo' },
        { key: 'isChecked', caption: "Select" }
    ];


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
        this.$watch('campusProgramId', this.refreshData);
        this.$watch('classid', this.loadSections);
        this.$watch('sectionCourseLinkId', this.refreshData);
        // this.getGeroutnder()
        // this.loadAdmissionType();

    }

    mounted() {
        this.validatePage();
        // this.refreshData();

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

    loadProgramsOfCampus() {
        this.campusProgramId = ''
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionId + "?" + this.campusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            this.refreshData()
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
            if (('admissionDuplicateRemove' in this.user.claims) == true) {
                if (this.user.claims['admissionDuplicateRemove'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['admissionDuplicateRemove'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['admissionDuplicateRemove'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['admissionDuplicateRemove'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {

        this.datas = [];

        if (this.campusProgramId.length > 0) {
            var key = this.campusProgramId;
            this.admissionRepo.GetDpData(key)
                .then(response => {
                    this.datas = (response as Array<DuplicateAdmission>)

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
    saveModal(list) {
        this.saveDatasList = [];
        this.saveDatasList = list;
    }
    insertModel() {
        var z = this.datas.filter(e => e.isChecked == true);
        this.migrationRepo.DeleteStudentEnrooll(JSON.stringify(z)).then(r => {
            // alert(r)
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: r,
                title: 'warning',
                messageTypeId: PayloadMessageTypes.success
            });
            this.refreshData();
        })



    }

    editModel(model: IScholarshipApplyVM) {
        // this.$modal.show('add-edit-model', { model: this.datas.filter(s=>s.scholarshipName==model.scholarshipName)});
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }


}