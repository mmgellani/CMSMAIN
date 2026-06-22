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

import { IFeeConcessionDetail, IFeeConcessionDetailVM, ISetupSession, ISetupShift, ISetupCampus, IStudentModel, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupProgramDetailsVM, IFeeConcession, IFeeScholarshipCriteriaVM, ISetupAdmissionType, ISetupCampusProgramVM, IScholarshipStudentModel, IScholarshipApplyVM, ICampusCityVM } from '../../../../models';
import { FeeConcessionDetailService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import { FeeApplyScholarshipAddEdit } from '../add-edit';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': FeeApplyScholarshipAddEdit
    }
})

export class FeeApplyScholarship extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;

    private datas: Array<IScholarshipStudentModel> = [];
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    //private shiftId = ''
    private percentageFrom = 1
    private percentageTo = 99
    private scholarshipCriteriaId = ''
    private admissionTypeId = '';
    private campusProgramId = '';

    private scholarhipList: Array<IScholarshipApplyVM> = []
    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private shiftList: Array<ISetupShift> = []
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private admissionTypeList: Array<ISetupAdmissionType> = []

    private campusCityList: Array<ICampusCityVM> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []

    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)

    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(this.$store)
    private concessionRepo: FeeConcessionService = new FeeConcessionService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private concessionDetailRepo: FeeConcessionDetailService = new FeeConcessionDetailService(this.$store)
    private scholarshipCriteriaRepo: FeeScholarshipCriteriaService = new FeeScholarshipCriteriaService(this.$store)
    private admissionTypeRepo: SetupAdmissionTypeService = new SetupAdmissionTypeService(this.$store)


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []

    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.loadCampus();
        this.loadSession();
        // this.loadProgramsOfCampus();
        this.loadShift();
        this.loadAdmissionType();
        this.loadCityCampus();

    }

    mounted() {
        this.validatePage();
        this.refreshData();
    }
    loadCampus() {
        this.campusRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.campusList = r as Array<ISetupCampus>

            })
    }

    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }
    loadAdmissionType() {
        this.admissionTypeRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.admissionTypeList = r as Array<ISetupAdmissionType>

            })
    }
    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }
    loadShift() {
        this.shiftRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.shiftList = r as Array<ISetupShift>
            })
    }

    loadScholarship() {
        // this.concessionId = ''
        this.scholarshipCriteriaList = []
        if (this.sessionId.length > 0 && this.campusId.length > 0 && this.campusProgramId.length > 0) {
            var key = this.sessionId + '?' + this.campusId + '?' + this.campusProgramLinkList.find(s => s.campusProgramId == this.campusProgramId).programDetailId + '?' + this.campusProgramLinkList.find(s => s.campusProgramId == this.campusProgramId).shiftId
            this.scholarshipCriteriaRepo.GetAllVMBy(key)
                .then(r => {
                    this.scholarshipCriteriaList = r as Array<IFeeScholarshipCriteriaVM>
                });
        }
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

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('feeApplyScholarship' in this.user.claims) == true) {
                if (this.user.claims['feeApplyScholarship'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeApplyScholarship'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeApplyScholarship'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeApplyScholarship'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {

        this.datas = [];
        this.scholarhipList = [];
        if (this.campusProgramId.length > 0 && this.admissionTypeId.length > 0) {
            var key = this.campusProgramId + '?' + this.campusProgramLinkList.find(s => s.campusProgramId == this.campusProgramId).shiftId + '?' + this.admissionTypeId;
            this.scholarshipCriteriaRepo.GetStudents(key)
                .then(response => {
                    this.datas = (response as Array<IScholarshipStudentModel>)
                    if (this.datas.length > 0) {
                        var oldObj = this.datas[0]
                        var count = 0;
                        this.datas.forEach(e => {
                            if (oldObj.scholarshipId == e.scholarshipId) {
                                count++;
                            }
                            else {
                                this.scholarhipList.push({ scholarshipName: oldObj.scholarshipName, count: count })
                                count = 1;
                            }
                            oldObj = e;
                        })
                        this.scholarhipList.push({ scholarshipName: oldObj.scholarshipName, count: count })

                        //this.loadScholarship();
                    }
                });
        }
    }
    insertModel() {

        if (this.datas.length > 0) {
            //var key =  JSON.stringify(this.datas)
            this.scholarshipCriteriaRepo.ApplyBulkScholarship(JSON.stringify(this.datas))
                .then(r => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Scholarship Applied Successfully',
                        title: 'success',
                        messageTypeId: PayloadMessageTypes.success
                    });
                    // console.log('done')
                })
        }
        // if (this.campusId.length > 0 && this.sessionId.length > 0 && this.programDetailId.length > 0) {
        //     this.$modal.show('add-edit-model', { model: { concessionDetailId: '', concessionId: '', feeHeadId: '', percentage: 0, feeAmount: 0, statusId: 0, loggerId: '', }, IsNewRecord: true, CampusId: this.campusId, sessionId: this.sessionId, ProgramDetailId: this.programDetailId });
        // }
        // else {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: 'Please Select Drop Down Values',
        //         title: 'warning',
        //         messageTypeId: PayloadMessageTypes.error
        //     });
        // }
    }

    editModel(model: IScholarshipApplyVM) {
        this.$modal.show('add-edit-model', { model: this.datas.filter(s => s.scholarshipName == model.scholarshipName) });
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }


}