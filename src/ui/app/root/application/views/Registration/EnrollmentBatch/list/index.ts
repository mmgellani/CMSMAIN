/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { DDLGroupModel, DDLModel, ICampusCityVM, IFeeConcession, IFeeConcessionDetail, IFeeConcessionDetailVM, IFeeScholarshipCriteriaVM, IRegistrationSectionCourseLinkVM, IScholarshipApplyVM, IScholarshipStudentModel, ISetupAdmissionType, ISetupCampus, ISetupCampusProgramVM, ISetupClass, ISetupGender, ISetupProgramDetails, ISetupProgramDetailsVM, ISetupSession, ISetupShift, IStudentModel, IStudentToEnrollVM, IStudentsToEnrolledPercentageVM } from '../../../../models';
import { FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, SetupAdmissionTypeService, SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupGenderService, SetupProgramDetailsService, SetupSessionService, SetupShiftService } from '../../../../service';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { ISetupGenderCB } from '../../EnrollmentBulk/list';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class EnrollmentBatch extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;

    private datas: Array<IStudentsToEnrolledPercentageVM> = [];
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
    private genderModelCB: Array<ISetupGenderCB> = [];
    private idGender: string = "";
    admissionTypeId: string = "";
    private admissionTypeList: Array<ISetupAdmissionType> = [];

    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private admisisonTypeRepo: SetupAdmissionTypeService;

    // private selectAll: boolean = false;
    // private isSelected: boolean = false;

    private columns = [
        { key: 'refferenceNo', caption: 'Reference No.' },
        { key: 'fullName', caption: 'Student Name' },
        { key: 'percentage', caption: 'Percentage', sort: true },
        { key: 'range', caption: 'Range' },
        { key: 'rollNo', caption: 'Roll #' },
        { key: 'isSelected', caption: 'Selected', width: 80 }
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
        this.loadSession();

    }

    mounted() {
        this.validatePage();
        this.loadAdmissionType();
        this.loadGender();

    }

    loadClass() {
        if (this.campusProgramId.length > 0) {
            this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
                this.classList = res as Array<ISetupClass>
            });
        }

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

    loadSections(key: string) {
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
                // this.refreshData()
            });
        }

    }
    loadGender() {
        this.genderModelCB = []
        this.genderRepo
            .GetFindBy("s=>s.StatusId==1")
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
            if (('enrollmentBatch' in this.user.claims) == true) {
                if (this.user.claims['enrollmentBatch'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['enrollmentBatch'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['enrollmentBatch'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['enrollmentBatch'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        if (this.admissionTypeId.length > 0) {
            this.datas = []
            if (this.campusProgramId.length > 0 && this.classid.length > 0 && this.admissionTypeId.length > 0 && this.idGender.length > 0) {
                var key = this.campusProgramId + '?' + this.classid + "?" + this.admissionTypeId + "?" + this.idGender;
                this.enrollmentRepo.GetStudentsToBatchEnroll(key)
                    .then(response => {
                        this.datas = (response as Array<IStudentsToEnrolledPercentageVM>)
                        if (this.datas.length > 0) {
                        this.loadSections(key);
                        }
                    });
            }
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

    // checkAll() {
    //     if (this.selectAll == true) {
    //         this.datas.forEach(element => {
    //             element.isSelected = true;
    //         });
    //     }
    //     else {
    //         this.datas.forEach(element => {
    //             element.isSelected = false;
    //         });
    //     }
    // }

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
    private sectionId = ''
    showRange() {
        console.log('hey in here')
        var range = this.sectionList.find(s => s.sectionId == this.sectionId)
        // model.range = range.fromSerial + '-' + range.toSerial;
        //this.check2(model)
        var index = 0;
        var dataLength = this.datas.length;
        for (var i = range.fromSerial; i <= range.toSerial; i++) {
            //check if students list is less than range list than break to avoid error
            if (index == dataLength) { console.log('i am breaking ' + index); break; }
            this.datas[index].rollNo = i.toString();
            this.datas[index].isSelected = true;
            this.datas[index].isDisabled = false;
            this.datas[index].range = range.fromSerial + '-' + range.toSerial;
            this.datas[index].sectionId = this.sectionId
            index++;
        }
        console.log('index value ' + index)



    }

    allowsubmit()
    {

        return  this.sessionId.length>0 && this.campusId.length>0  &&  this.campusProgramId.length>0
                && this.classid.length>0 && this.idGender.length>0  && this.admissionTypeId.length>0 
                && this.sectionId.length>0
    }
    insertModel() {
      
        var list = this.datas.filter(s => s.isSelected);
        if (list.length == 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please select the Check Boxes',
                title: 'Danger',
                messageTypeId: PayloadMessageTypes.error
            });
        } else {
            this.enrollmentRepo.InsertBulkEnrolment(JSON.stringify(list))
                .then(r => {
                    var count = r as number;
                    if (count == 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Enrollment saved successfully',
                            title: '',
                            messageTypeId: PayloadMessageTypes.success
                        });
                    } else {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: count + ' Duplicate Roll Numbers were found',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }
                    this.refreshData();
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