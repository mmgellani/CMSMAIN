/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { DDLGroupModel, DDLModel, ICampusCityVM, IFeeConcession, IFeeConcessionDetail, IFeeConcessionDetailVM, IFeeScholarshipCriteriaVM, IRegistrationSectionCourseLinkVM, IScholarshipApplyVM, IScholarshipStudentModel, ISetupAdmissionType, ISetupCampus, ISetupCampusProgramVM, ISetupClass, ISetupGender, ISetupProgramDetails, ISetupProgramDetailsVM, ISetupSession, ISetupShift, IStudentEnrolledVM, IStudentModel, IStudentToEnrollVM, StudentPromotionList } from '../../../../models';
import { FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, RegistrationSectionCourseLinkService, SetupAdmissionTypeService, SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupGenderService, SetupProgramDetailsService, SetupSessionService, SetupShiftService } from '../../../../service';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { Helper } from '../../../Fee/Helper';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

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

export class CampusTransferBulk extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;
    feedefault = false;

    private repositoryVM: RegistrationSectionCourseLinkService;
    chkall = false;
    disableProgram = true;


    private datas: Array<StudentPromotionList> = [];
    private saveDatasList: Array<IStudentEnrolledVM> = [];
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    private selectedSubCityId = ''
    //private shiftId = ''
    private percentageFrom = 1
    private percentageTo = 99
    private scholarshipCriteriaId = ''
    //private selected:any;
    private campusProgramId = '';
    private programDetailIdFromCampus = '';
    private classid: string = '';
    private sectionsAll = '';
    private transferclassid: string = '';
    private repoClass = new SetupClassService(this.$store);

    //private scholarhipList: Array<IScholarshipApplyVM> = []
    private campusList: Array<ISetupCampus> = []
    classList: Array<ISetupClass> = []
    classList2: Array<ISetupClass> = []

    private sessionList: Array<ISetupSession> = []
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private campusProgramLinkList2: Array<ISetupCampusProgramVM> = []

    private shiftList: Array<ISetupShift> = []
    private programDDL: Array<DDLGroupModel> = []
    private programDDL2: Array<DDLGroupModel> = []

    private ddl: Array<DDLModel> = []
    private ddl2: Array<DDLModel> = []
    private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private TransfersectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private TransfersectionListEx: Array<IRegistrationSectionCourseLinkVM> = [];

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []
    private cityDDL2: Array<DDLGroupModel> = []
    private campusddl2: Array<DDLModel> = []
    private campusCityList2: Array<ICampusCityVM> = []
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
    private admisisonTypeRepo: SetupAdmissionTypeService;
    tosessionId = '';
    tocampusId = '';
    tocampusProgramId = '';
    private data: any = [];
    private disableprogram = true;

    private columns = [
        { key: 'rollNo', caption: 'Roll No' },
        { key: 'fullName', caption: 'Student Name' },
        { key: 'isSelected', caption: 'Select' }
    ];


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []

    created() {
        this.TransfersectionList = [];
        this.TransfersectionListEx = [];
        this.repository = new FeeConcessionDetailService(this.$store);
        this.genderRepo = new SetupGenderService(this.$store);
        this.admisisonTypeRepo = new SetupAdmissionTypeService(this.$store);
        this.repositoryVM = new RegistrationSectionCourseLinkService(this.$store);

        this.loadSession();
        this.$watch('sessionId', this.loadCityCampus);
        this.$watch('campusId', this.loadProgramsOfCampus);
        this.$watch('campusProgramId', this.refreshData);
        this.$watch('classid', this.loadSections);
        this.$watch('transferclassid', this.refreshData);
        // this.getGeroutnder()
        // this.loadAdmissionType();

    }

    mounted() {
        this.validatePage();
        //this.refreshData();

    }


    loadClass() {
        this.tocampusId = '';
        this.tocampusProgramId = '';
        this.programDetailIdFromCampus = this.campusProgramLinkList.find(f => f.campusProgramId === this.campusProgramId).programDetailId;
        this.disableprogram = true;
        this.classList = [];
        this.classid = '';
        this.disableprogram = true;
        this.sectionCourseLinkId = '';
        this.sectionList = [];
        this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
            this.classList = res as Array<ISetupClass>
            this.classList = this.classList.filter(f => f.classCode === '12');
            this.classid = this.classList.find(e => e.classCode === '12').classId;
            this.loadSections();
            this.loadClass2();
        });
    }

    loadClass2() {
        this.classList2 = [];

        this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
            this.classList2 = res as Array<ISetupClass>
            this.classList2 = this.classList2.filter(f => f.classCode === '12');
            this.transferclassid = this.classList2.find(e => e.classCode === '12').classId;
            this.LoadNewSections();
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

    AddNewSections() {

        this.datas.forEach(element => {
            element.sectionCourseLinkId = this.sectionsAll

        });
    }


    loadSections() {
        if (this.campusProgramId.length > 0 && this.classid.length > 0) {
            var key = this.campusProgramId + '?' + this.classid
            this.enrollmentRepo.GetSectionList(key)
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
    updall() {
        if (this.chkall == true) {
            this.datas.forEach(element => {
                element.isSelected = true;

            });


        }
        if (this.chkall == false) {
            this.datas.forEach(element => {
                element.isSelected = false;

            });


        }




    }
    loadCityCampus() {
        this.disableProgram = true;
        this.tosessionId = this.sessionId;
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    loadProgramsOfCampus() {
        this.disableProgram = true;
        this.campusProgramId = ''
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionId + "?" + this.campusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            this.refreshData()
        });

        this.tocampusId = this.campusId;
    }
    LoadCampusSubCityWise() {
        this.tocampusId = '';
        this.tocampusProgramId = '';
        this.disableProgram = true;
        this.campusCityList2 = [];
        this.selectedSubCityId = this.campusCityList.find(f => f.campusId === this.campusId).cityId;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList2 = r as Array<ICampusCityVM>;
            this.campusCityList2 = this.campusCityList2.filter(f => f.cityId === this.selectedSubCityId);
        });
    }
    toloadProgramsOfCampus() {
        this.tocampusProgramId = '';
        var key = this.tosessionId + "?" + this.tocampusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList2 = r as Array<ISetupCampusProgramVM>;
            this.campusProgramLinkList2 = this.campusProgramLinkList2.filter(f => f.campusId === this.tocampusId);
            const matchedItem = this.campusProgramLinkList2.find(f => f.programDetailId === this.programDetailIdFromCampus);
            this.tocampusProgramId = matchedItem ? matchedItem.campusProgramId : '';

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
            if (('campusTransferBulk' in this.user.claims) == true) {
                if (this.user.claims['campusTransferBulk'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['campusTransferBulk'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['campusTransferBulk'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['campusTransferBulk'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    LoadNewSections() {
        this.TransfersectionList = [];
        this.TransfersectionListEx = [];
        if (this.tocampusProgramId.length > 0 && this.transferclassid.length > 0) {
            var key = this.tocampusProgramId + '?' + this.transferclassid
            this.enrollmentRepo.GetSectionList(key)
                .then(r => {
                    this.TransfersectionList = r as Array<IRegistrationSectionCourseLinkVM>
                    this.TransfersectionListEx = r as Array<IRegistrationSectionCourseLinkVM>
                    // console.log(this.sectionList==null)
                    if (this.TransfersectionList == null) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Section not Defined',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }
                    this.refreshData();
                })
        }
    }

    refreshData() {
        this.disableProgram = true;
        this.datas = [];

        if (this.campusProgramId.length > 0 && this.classid.length > 0 && this.sectionCourseLinkId.length > 0) {
            if (this.feedefault == true) {
                var key = this.campusProgramId + '?' + this.classid + "?" + this.sectionCourseLinkId + '?' + '1' + '?' + this.transferclassid;
            }
            if (this.feedefault == false) {
                var key = this.campusProgramId + '?' + this.classid + "?" + this.sectionCourseLinkId + '?' + '0' + '?' + this.transferclassid;


            }
            this.enrollmentRepo.GetStudentBulckTransferList(key)
                .then(response => {
                    this.datas = (response as Array<StudentPromotionList>)



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
    ProgramDisabled() {
        var city = this.campusCityList.find(f => f.campusId === this.campusId).cityId;
        var program = this.campusProgramLinkList.find(e => e.campusProgramId === this.campusProgramId).programId;
        if (city === "4e2ed81c-fbbe-4ebf-afa9-f5ece98e41d6" || city === "d827d02c-1196-437f-91c4-54b1ce0243e2" || city === "d9d1dd96-2b2f-49ff-be35-13e045687af6" || city === "6626252c-4f27-4224-b485-e4cb07ff423f") {
            if (program === "794be36e-7608-4fe3-a357-c9ebda61368b" || program === "03a536dd-3244-49cd-ba5a-3633e6565223") {
                this.disableProgram = false;
                this.tocampusProgramId = this.tocampusProgramId;
            }
            else {
                this.tocampusProgramId = this.campusProgramId;
                this.disableProgram = true;
            }
        }
        else {
            this.tocampusProgramId = this.campusProgramId;
            this.disableProgram = true;
        }
    }

    insertModel() {
        this.AddNewSections();
        debugger
        if (this.sessionId == this.tosessionId && this.sessionId.length > 0 && this.tosessionId.length > 0) {
            var z = this.datas.filter(e => e.isSelected == true && e.sectionCourseLinkId != '00000000-0000-0000-0000-000000000000');
            if (z.length > 0) {
                var key = JSON.stringify(z) + '?' + this.transferclassid + '?' + this.tocampusProgramId + '?' + this.tocampusId;
                this.enrollmentRepo.TransferBulckCampus(key).then(r => {

                    if (r.returnValue.includes("SuccessFully")) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: r.returnValue,
                            title: '',
                            messageTypeId: PayloadMessageTypes.success
                        });
                    } else {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: r.returnValue,
                            title: '',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }


                    this.refreshData();

                })
            }
            else {
                this.refreshData();
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Please make correct Selection of Sections and Students',
                    title: '',
                    messageTypeId: PayloadMessageTypes.warning
                });



            }
        }

        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Select Same Session For Transfering Students ',
                title: '',
                messageTypeId: PayloadMessageTypes.warning
            });


        }




    }

    editModel(model: IScholarshipApplyVM) {
        // this.$modal.show('add-edit-model', { model: this.datas.filter(s=>s.scholarshipName==model.scholarshipName)});
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }


}