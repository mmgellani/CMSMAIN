/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { DDLGroupModel, DDLModel, ICampusCityVM, IFeeConcession, IFeeConcessionDetail, IFeeConcessionDetailVM, IFeeScholarshipCriteriaVM, IRegistrationSectionCourseLinkVM, IScholarshipApplyVM, IScholarshipStudentModel, ISetupAdmissionType, ISetupCampus, ISetupCampusProgramVM, ISetupClass, ISetupGender, ISetupProgramDetails, ISetupProgramDetailsVM, ISetupSession, ISetupShift, IStudentEnrolledVM, IStudentModel, IStudentToEnrollVM, StudentPromotionList, StudentPromotionPreList } from '../../../../models';
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

export class RegistrationClassTransferList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;
    feedefault = false;

    private repositoryVM: RegistrationSectionCourseLinkService;
    chkall = false;


    private datas: Array<StudentPromotionPreList> = [];
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

    private columns = [
        { key: 'rollNo', caption: 'Roll No' },
        { key: 'fullName', caption: 'Student Name' },
        { key: 'range', caption: 'Range' },
        { key: 'newRollNo', caption: 'Roll #' },
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
        //this.$watch('transferclassid', this.refreshData);
        // this.getGeroutnder()
        // this.loadAdmissionType();

    }

    mounted() {
        this.validatePage();
        //this.refreshData();

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

    loadClass2() {
        this.classList2 = [];

        this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
            this.classList2 = res as Array<ISetupClass>

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
        this.showRangeEx(this.sectionsAll);
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
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    loadCityCampus2() {
        this.campusddl2 = [];
        this.cityDDL2 = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList2 = r as Array<ICampusCityVM>;
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

    toloadProgramsOfCampus() {
        this.tocampusProgramId = ''
        this.ddl2 = [];
        this.programDDL2 = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.tosessionId + "?" + this.tocampusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList2 = r as Array<ISetupCampusProgramVM>;
            //this.refreshData()
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
            if (('transferClass' in this.user.claims) == true) {
                if (this.user.claims['transferClass'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['transferClass'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['transferClass'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['transferClass'].indexOf('D') >= 0) {
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

        this.datas = [];

        if (this.campusProgramId.length > 0 && this.classid.length > 0 && this.sectionCourseLinkId.length > 0) {
           
                var key = this.campusProgramId + '?' + this.classid + "?" + this.sectionCourseLinkId;


            
            this.enrollmentRepo.GetStudentPromotionPreList(key)
                .then(response => {
                    this.datas = (response as Array<StudentPromotionPreList>)
                    this.sectionsAll = '';



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

    enableCheckBoxEx(model: StudentPromotionPreList) {
        var start = Number(model.range.split('-')[0].toString());
        var end = Number(model.range.split('-')[1].toString());
        var rollNo = Number(model.newRollNo);
        // console.log(rollNo)

        if ((rollNo >= start) && (rollNo <= end)) {
            // console.log('true')
            return true;
        } else {
            // console.log('false')
            return false;
        }
    }
    showRange(model: IStudentToEnrollVM) {
        var range = this.sectionList.find(s => s.sectionId == model.sectionId)
        model.range = range.fromSerial + '-' + range.toSerial;
        this.check2(model)

    }


    showRangeEx(sectionid) {
        // alert(sectionid)
        var fromrange = this.TransfersectionList.find(s => s.sectionCourseLinkId == sectionid).fromSerial
        var torange = this.TransfersectionList.find(s => s.sectionCourseLinkId == sectionid).toSerial

        // alert(fromrange)
        var rangeT = fromrange + '-' + torange;

        this.datas.forEach( e=>{
            e.range = rangeT

        })
        // this.check2(model)

    }
    saveModal(list) {
        this.saveDatasList = [];
        this.saveDatasList = list;
    }
    insertModel() {
        // debugger;

        if (this.sessionId == this.tosessionId && this.sessionId.length > 0 && this.tosessionId.length > 0) {



            var z = this.datas.filter(e => e.isSelected == true && e.sectionCourseLinkId != '00000000-0000-0000-0000-000000000000');
            if (z.length > 0) {
                var key = JSON.stringify(z) + '?' + this.transferclassid;
                this.enrollmentRepo.InsertClassPrePromotion(key).then(r => {

                    if (r == 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Student Promoted Successfully!",
                            title: '',
                            messageTypeId: PayloadMessageTypes.success
                        });
                    } else {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: r + " Duplicate RollNo Found! Skipped",
                            title: '',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }


                    this.refreshData();

                })
            }
            else {

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