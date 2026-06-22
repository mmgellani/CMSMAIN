/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';
import { IFeeFeeStructure, ISetupZone, IFeeFeeHead, ISetupClass, ISetupProgram, ISetupSession, ISetupZoneCityLink, ISetupZoneCityLinkVM, IFeeFeeHeadCheckBox, ISetupShift, ISetupCity, ISetupClassCheckBox, IFeeChallanType } from '../../../../models';
import { FeeFeeStructureService, SetupZoneService, FeeFeeHeadService, SetupClassService, SetupProgramService, SetupSessionService, SetupZoneCityLinkService, SetupShiftService, SetupCityService, FeeChallanTypeService } from '../../../../service';

import * as helper from '../../../../helper';
import { FeeDetail } from './FeeDetail';

import { SetupSessionAddEdit } from '../../../Setup/Session/add-edit';
import { SetupZoneAddEdit } from '../../../Setup/Zone/add-edit';
import { FeeChallanTypeAddEdit } from '../../ChallanType/add-edit';

type ValidateFeeFeeStructure = { model: IFeeFeeStructure, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeFeeStructure> = {
    model: {
        feeStructureId: { required },
        zoneId: { required },
        sessionId: { required },
        programId: { required },
        shiftId: { required },
        classId: { required },
        feeHeadId: { required },
        feeAmount: { required },
        statusId: { required },
        loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'fee-detail': FeeDetail,
        'Zone': SetupZoneAddEdit,
        'Session': SetupSessionAddEdit,
        'ChallanType-add-edit-model': FeeChallanTypeAddEdit
    }
})
export class FeeFeeStructureAddEdit extends Vue {
    private isSave: boolean = false;
    private zoneList: Array<ISetupZone> = []
    private feeHeadList: Array<IFeeFeeHead> = []
    private feeHeadListCB: Array<IFeeFeeHeadCheckBox> = []
    private feeHeadDataListCB: Array<IFeeFeeHeadCheckBox> = []

    private ClassDataListCB: Array<ISetupClassCheckBox> = []
    private TempClassDataListCB: Array<ISetupClassCheckBox> = []

    private classList: Array<ISetupClass> = []
    private programList: Array<ISetupProgram> = []
    private sessionList: Array<ISetupSession> = []
    private zoneCityList: Array<ISetupZoneCityLinkVM> = []
    private shiftList: Array<ISetupShift> = []
    private cityList: Array<ISetupCity> = [];

    private zoneRepo: SetupZoneService = new SetupZoneService(this.$store)
    private feeHeadRepo: FeeFeeHeadService = new FeeFeeHeadService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private programRepo: SetupProgramService = new SetupProgramService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private zoneCityRepo: SetupZoneCityLinkService = new SetupZoneCityLinkService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private cityRepo: SetupCityService = new SetupCityService(this.$store)

    private FeeChallanTypeList: Array<IFeeChallanType> = [];
    private challanTypeRepository: FeeChallanTypeService;


    private repository: FeeFeeStructureService;
    private data: IFeeFeeStructure = {
        feeStructureId: '', zoneId: '', sessionId: '', programId: '', shiftId: '', classId: '', feeHeadId: '', feeAmount: 0, statusId: 0, loggerId: '', isApproved: false,
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    zoneId = '';
    sessionId = '';
    feeHeadId = '';
    classId = '';
    programId = '';
    challanTypeId = '';
    installmentNo = 3
    tempCheckStatus: number = 0;
    tempFeeHead: IFeeFeeHead = null;
    model: ISetupClassCheckBox = null;

    created() {
        this.repository = new FeeFeeStructureService(this.$store);
        this.challanTypeRepository = new FeeChallanTypeService(this.$store);


    }

    loadCity() {
        this.cityRepo.GetFindBy("s=>s.StatusId!=2 && s.ZoneId.ToString()==\"" + this.zoneId + "\"")
            .then(r => {
                this.cityList = r as Array<ISetupCity>
            })
    }
    reloadFeaHead(feehead: IFeeFeeHead) {
        var oldLength = this.feeHeadDataListCB.length
        this.feeHeadDataListCB = this.feeHeadListCB.filter(s => s.isChecked).sort((a, b) => { if (a.orderBy > b.orderBy) { return 1; } if (a.orderBy < b.orderBy) { return -1; } return 0; })
        var newLength = this.feeHeadDataListCB.length
        this.tempCheckStatus = newLength > oldLength ? 1 : 0
        this.tempFeeHead = feehead;
    }

    reloadClassList(model: ISetupClassCheckBox) {
        this.TempClassDataListCB = this.ClassDataListCB.filter(s => s.isChecked).sort((a, b) => { if (Number(a.classCode) > Number(b.classCode)) { return 1; } if (Number(a.classCode) < Number(b.classCode)) { return -1; } return 0; })
    }

    loadZoneCity() {
        this.zoneCityRepo.GetAllVMByZone(this.zoneId)
            .then(r => {
                this.zoneCityList = r as Array<ISetupZoneCityLinkVM>
            })
    }

    loadShifts() {
        this.shiftRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => {
                this.shiftList = r as Array<ISetupShift>
            })
    }
    addNewSession() {
        this.$modal.show('Session-add-edit-model', { IsNewRecord: true });

    }
    loadSession() {
        this.sessionRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }
    addNewZone() {
        this.$modal.show('Zone-add-edit-model', { IsNewRecord: true });

    }

    loadZone() {
        this.zoneRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => {
                this.zoneList = r as Array<ISetupZone>
            })
    }
    loadChallanType() {
        this.challanTypeRepository.GetFindBy('e=>e.StatusId==1')
            .then(res => {
                this.FeeChallanTypeList = res as Array<IFeeChallanType>
            });
    }
    addNewChallanType() {
        this.$modal.show('ChallanType-add-edit-model', { IsNewRecord: true });

    }
    loadFeeHead() {
        this.feeHeadListCB = [];
        var key = this.challanTypeId
        this.feeHeadRepo.GetFindByChallanType(key)
            .then(r => {
                this.feeHeadList = (r as Array<IFeeFeeHead>).sort((obj1, obj2) => {
                    if (obj1.orderBy > obj2.orderBy) {
                        return 1;
                    }

                    if (obj1.orderBy < obj2.orderBy) {
                        return -1;
                    }

                    return 0;
                })
                this.feeHeadList.forEach(r => {
                    if (r.feeHeadId.toString().substr(0, 7) != '0000000') {
                        this.feeHeadListCB.push({
                            feeHeadId: r.feeHeadId,
                            statusId: r.statusId,
                            loggerId: r.loggerId,
                            fullName: r.fullName,
                            description: r.description,
                            feeType: r.feeType,
                            isChecked: false,
                            orderBy: r.orderBy,
                            challanTypeId: r.challanTypeId,
                        });
                    }
                })
            })
    }
    loadClass() {
        this.ClassDataListCB = []
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => {
                this.classList = r as Array<ISetupClass>
                this.classList.forEach(e => {
                    this.ClassDataListCB.push({
                        classCode: e.classCode, statusId: e.statusId,
                        isChecked: false, classId: e.classId, description: e.description, fullName: e.fullName
                        , isAdmissionTest: e.isAdmissionTest, isInterview: e.isInterview, loggerId: e.loggerId
                    })
                })
            })
    }
    loadProgram(model: any) {
        this.programRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => {
                this.programList = r as Array<ISetupProgram>
                Object.assign(this.data, model);
                this.programList = this.programList.filter(s => s.programId == this.data.programId)
            })
    }
    beforeModalOpen(event) {
        this.classList = [];
        this.zoneCityList = [];
        this.zoneList = [];
        this.feeHeadList = [];
        this.programList = [];
        this.sessionList = []
        this.shiftList = [];
        this.feeHeadDataListCB = [];
        this.feeHeadListCB = [];
        this.loadClass();
        this.loadZone();
        this.loadProgram(event.params.model);
        this.loadSession();
        this.loadShifts();
        this.loadChallanType();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        this.zoneId = this.data.zoneId;
        this.sessionId = this.data.sessionId;
        this.loadCity();
        this.TempClassDataListCB = [];
        this.ClassDataListCB = [];
        this.challanTypeId = '';
    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        if (this.isSave == true) {
            this.isSave = false;
        }
        this.isSave = true;
    }
    $v: Vuelidate<any>;
}

