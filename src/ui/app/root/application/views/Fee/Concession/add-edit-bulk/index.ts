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

import { IFeeConcession, ISetupZone, ISetupSession, ISetupProgram, ISetupShift, IFeeChallanType, IFeeContinuationPolicy, ISetupAdmissionType, IFeeScholarshipCriteria, TBLGrades, DDLGroupModel, DDLModel, ICampusCityVM, ISetupCampusProgramLink, ISetupCampusProgramLinkVM, ISetupCampusProgramVM, IFeeContinuationPolicyCB } from '../../../../models';
import { FeeConcessionService, SetupZoneService, SetupSessionService, SetupProgramService, SetupShiftService, FeeChallanTypeService, FeeContinuationPolicyService, SetupAdmissionTypeService, FeeScholarshipCriteriaService, SetupCampusService, SetupCampusProgramLinkService } from '../../../../service';

import * as helper from '../../../../helper';

import { FeeChallanTypeAddEdit } from '../../ChallanType/add-edit';
import { SetupShiftAddEdit } from '../../../Setup/Shift/add-edit';
import { SetupProgramAddEdit } from '../../../Setup/Program/add-edit';
import { SetupSessionAddEdit } from '../../../Setup/Session/add-edit';
import { SetupZoneAddEdit } from '../../../Setup/Zone/add-edit';
import { FeeContinuationPolicyAddEdit } from '../../ContinuationPolicy/add-edit';
import { ICheckBoxModel } from '../../ConcessionBulk/add-edit';

type ValidateFeeConcession = { model: IFeeConcession, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeConcession> = {
    model: {
        concessionId: { required },
        zoneId: { required },
        sessionId: { required },
        programId: { required },
        shiftId: { required },
        challanTypeId: { required },
        fullName: { required },
        statusId: { required },
        loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'Concession-add-edit-bulk-model',
    template: require('./index.html'),
    components: {
        'ChallanType': FeeChallanTypeAddEdit,
        'Shift': SetupShiftAddEdit,
        'Zone': SetupZoneAddEdit,
        'Program': SetupProgramAddEdit,
        'Session': SetupSessionAddEdit,
        'ContinuationPolicy': FeeContinuationPolicyAddEdit
    }
})
export class FeeConcessionAddEditBulk extends Vue {
    private repository: FeeConcessionService;
    private zonerepository: SetupZoneService = null;
    private zoneList: Array<ISetupZone> = [];
    private Sessionrepository: SetupSessionService = null;
    private SessionList: Array<ISetupSession> = [];
    private Programrepository: SetupCampusProgramLinkService = null;
    private ProgramList: Array<ISetupCampusProgramVM> = [];
    private shiftrepository: SetupShiftService = null;
    private ShiftList: Array<ISetupShift> = [];
    private ChallanTyperepositry: FeeChallanTypeService = new FeeChallanTypeService(this.$store);
    private ChallantypeList: Array<IFeeChallanType> = [];
    private isActive: boolean = true;
    private isScholarship = false;
    scholarshiptype: string = "00000000-0000-0000-0000-000000000000";
    private scholarshipId = "00000000-0000-0000-0000-000000000000";
    private scholarshipCriteriaRepository: FeeScholarshipCriteriaService = new FeeScholarshipCriteriaService(this.$store);

    GradesList: Array<TBLGrades> = [];
    private gradeRepository: FeeScholarshipCriteriaService = new FeeScholarshipCriteriaService(this.$store);

    private programCBList: Array<ICheckBoxModel> = [];
    private concessionList: Array<IFeeConcession> = [];
    private scholarshipList: Array<IFeeScholarshipCriteria> = [];
    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []
    //private campusProgramId = '';
    private campusId = '';
    private zoneName = '';
    private sessionName = '';
    private programeName = '';
    private shiftname = '';


    private bulkData: IFeeScholarshipCriteria = {
        scholarshipCriteriaId: "",
        campusProgramId: "",
        admissionTypeId: "",
        attendancePercentage: 0,
        scholarshipTypeId: "00000000-0000-0000-0000-000000000000",
        marksPer: 0,
        continuationPolicyId: "",
        concessionId: "",
        fullName: "",
        statusId: 0,
        loggerId: "", isScholarhsip:false
    };

    admissionTypeList: Array<ISetupAdmissionType> = [];
    private admissionTypeRepo: SetupAdmissionTypeService = new SetupAdmissionTypeService(this.$store);
    continuationPolicyList: Array<IFeeContinuationPolicy> = [];
    continuationPolicyCBList: Array<IFeeContinuationPolicyCB> = [];

    private continuationPolicyRepo: FeeContinuationPolicyService = new FeeContinuationPolicyService(
        this.$store
    );
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)

    private data: IFeeConcession = {
        concessionId: '',
        zoneId: '',
        sessionId: '',
        programId: '',
        shiftId: '',
        challanTypeId: '',
        fullName: '',
        statusId: 0,
        loggerId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new FeeConcessionService(this.$store);
        this.zonerepository = new SetupZoneService(this.$store);
        this.loadChallanType();

        this.loadAdmissionType();
        this.loadGrades();
        this.loadCityCampus();
        this.zonerepository.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.zoneList = res as Array<ISetupZone>

        })
        this.Sessionrepository = new SetupSessionService(this.$store);
        this.Sessionrepository.GetFindBy('e=>e.StatusId!=2').then(res => { this.SessionList = res as Array<ISetupSession> })

        this.Programrepository = new SetupCampusProgramLinkService(this.$store);
        this.Programrepository.GetFindBy('e=>e.StatusId!=2').then(res => { this.ProgramList = res as Array<ISetupCampusProgramVM> })

        this.shiftrepository = new SetupShiftService(this.$store);
        this.shiftrepository.GetFindBy('e=>e.StatusId!=2').then(res => { this.ShiftList = res as Array<ISetupShift> })


    }

    addNewChallanType() {
        this.$modal.show('ChallanType-add-edit-model', { IsNewRecord: true });

    }
    loadChallanType() {
        this.ChallantypeList = [];
        this.ChallanTyperepositry.GetFindBy('e=>e.StatusId!=2')
            .then(res => {
                this.ChallantypeList = res as Array<IFeeChallanType>
            });
    }

    addNewShift() {
        this.$modal.show('Shift-add-edit-model', { IsNewRecord: true });

    }
    loadShift() {
        this.ShiftList = [];
        this.shiftrepository.GetFindBy('e=>e.StatusId!=2')
            .then(res => {
                this.ShiftList = res as Array<ISetupShift>
            });
    }

    addNewZone() {
        this.$modal.show('Zone-add-edit-model', { IsNewRecord: true });

    }
    loadZone() {
        this.zonerepository.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.zoneList = res as Array<ISetupZone>

        });

    }
    loadGrades() {
        this.gradeRepository.GetAllGrades()
            .then(res => {
                this.GradesList = res as Array<TBLGrades>;
            });
    }

    addNewProgram() {
        this.$modal.show('Program-add-edit-model', { IsNewRecord: true });

    }
    // loadProgram() {
    //     this.Programrepository.GetFindBy('e=>e.StatusId!=2').then(res => { this.ProgramList = res as Array<ISetupProgram> });

    // }

    addNewSession() {
        this.$modal.show('Session-add-edit-model', { IsNewRecord: true });

    }
    loadSession() {
        this.Sessionrepository.GetFindBy('e=>e.StatusId!=2').then(res => { this.SessionList = res as Array<ISetupSession> });

    }

    loadContinuationPolicy() {
        this.continuationPolicyList = [];
        this.continuationPolicyCBList = [];
        this.continuationPolicyRepo.GetFindBy("e=>e.StatusId==1").then(r => {
            this.continuationPolicyList = r as Array<IFeeContinuationPolicy>;
            this.continuationPolicyList.forEach(e => {
                this.continuationPolicyCBList.push({
                    continuationPolicyId: e.continuationPolicyId,
                    fullName: e.fullName,
                    isChecked: false
                })
            })
        });
    }

    addNewContinuationPolicy() {
        this.$modal.show("ContinuationPolicy-add-edit-model", {
            IsNewRecord: true
        });
    }

    loadAdmissionType() {
        this.admissionTypeRepo.GetFindBy("e=>e.StatusId==1").then(r => {
            this.admissionTypeList = r as Array<ISetupAdmissionType>;
        });
    }
    addNewAdmissionType() {
        this.$modal.show("AdmissionType-add-edit-model", { IsNewRecord: true });
    }
    checkScholarship() {
        if (
            this.admissionTypeList.find(s => s.fullName.search("Sch") != -1)
                .admissionTypeId == this.bulkData.admissionTypeId
        ) {
            this.isScholarship = true;

        } else {
            this.isScholarship = false;
            this.bulkData.scholarshipTypeId = "00000000-0000-0000-0000-000000000000"

        }
    }

    loadProgram() {
        this.ProgramList = []
        this.programCBList = [];
        if (this.campusId.length > 0 && this.data.sessionId.length > 0 && this.data.shiftId.length > 0) {       // this.campusCityList.find(s=>s.)
            var key = this.data.sessionId + "?" + this.campusId + "?" + this.data.shiftId;
            this.Programrepository.GetAllVMActive(key).then(res => {
                this.ProgramList = res as Array<ISetupCampusProgramVM>;
                // this.campusProgramId= this.ProgramList.find(s=>s.campusId==this.campusId).campusProgramId
                this.ProgramList.forEach(e => {

                    this.programCBList.push({
                        id: e.programId,
                        name: e.programName,
                        isChecked: false
                    });
                });
            });
        }
    }
    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM()
            .then(r => {
                this.campusCityList = r as Array<ICampusCityVM>

                oldObj = this.campusCityList[0]
                this.campusCityList.forEach(e => {

                    if (e.cityName == oldObj.cityName) {

                        this.campusddl.push({ id: e.campusId, text: e.campusName })
                    }
                    else {

                        this.cityDDL.push({ title: this.campusCityList[this.campusCityList.indexOf(e) - 1].cityName, group: this.campusddl })
                        this.campusddl = []
                        this.campusddl.push({ id: e.campusId, text: e.campusName })
                    }
                    oldObj = e;
                })
                this.cityDDL.push({ title: oldObj.cityName, group: this.campusddl })
            })
    }

    generateName() {
        this.bulkData.fullName = this.sessionName + ' ' + this.zoneName + '-' + this.data.fullName + '-' + 'ProgramName' + this.shiftname
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        this.loadProgram();
        this.loadContinuationPolicy();
    }

    cancel() {
        this.campusId = '';
        this.data = {
            concessionId: '',
            zoneId: '',
            sessionId: '',
            programId: '',
            shiftId: '',
            challanTypeId: '',
            fullName: '',
            statusId: 0,
            loggerId: '',
        };


        this.bulkData = {
            scholarshipCriteriaId: "",
            campusProgramId: "",
            admissionTypeId: "",
            attendancePercentage: 0,
            scholarshipTypeId: "00000000-0000-0000-0000-000000000000",
            marksPer: 0,
            continuationPolicyId: "",
            concessionId: "",
            fullName: "",
            statusId: 0,
            loggerId: "",isScholarhsip:false
        };
        this.$modal.hide('Concession-add-edit-bulk-model');
        this.$emit("submit");



    }
    saveModel() {
        var validFlag=true;
        if(this.admissionTypeList.find(s=>s.admissionTypeId==this.bulkData.admissionTypeId).fullName.toLowerCase().search('scholarship')!=-1)
        {
            if(this.bulkData.scholarshipTypeId=='00000000-0000-0000-0000-000000000000'){
                validFlag=false;
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Please Select Grade First",
                    title: "Error",
                    messageTypeId: PayloadMessageTypes.error
                });
            }

           
        }
        if(validFlag){
            this.sessionName = this.SessionList.find(s => s.sessionId == this.data.sessionId).fullName;
            this.zoneName = this.zoneList.find(s => s.zoneId == this.data.zoneId).fullName;
            this.shiftname = this.ShiftList.find(s => s.shiftId == this.data.shiftId).fullName;
            if (this.IsNewRecord) {
                this.concessionList = [];
                this.scholarshipList = [];
    
                this.programCBList.filter(s => s.isChecked).forEach(e => {
                    this.concessionList.push({
                        challanTypeId: this.data.challanTypeId,
                        concessionId: helper.newGuid(),
                        fullName: this.data.fullName,
                        programId: e.id,
                        sessionId: this.data.sessionId,
                        loggerId: helper.newGuid(),
                        shiftId: this.data.shiftId,
                        statusId: 1,
                        zoneId: this.data.zoneId
                    })
                })
    
                this.concessionList.forEach(e => {
                    this.continuationPolicyCBList.filter(a => a.isChecked).forEach(s => {
                        this.scholarshipList.push({
                            admissionTypeId: this.bulkData.admissionTypeId,
                            statusId: 1,
                            attendancePercentage: this.bulkData.attendancePercentage,
                            loggerId: helper.newGuid(),
                            campusProgramId: this.ProgramList.find(s => s.programId == e.programId).campusProgramId,
                            concessionId: e.concessionId,
                            continuationPolicyId: s.continuationPolicyId,
                            fullName: this.sessionName + ' ' + this.zoneName + '-' + this.data.fullName + '-' + this.ProgramList.find(a => a.programId == e.programId).programName + '-' + this.shiftname.substring(0, 3).toUpperCase(),
                            marksPer: this.bulkData.marksPer,
                            scholarshipCriteriaId: helper.newGuid(),
                            scholarshipTypeId: this.bulkData.scholarshipTypeId,isScholarhsip:false
                        })
                    })
    
                })
                console.log(JSON.stringify(this.concessionList));
                console.log(JSON.stringify(this.scholarshipList));
                this.repository.AddMany(this.concessionList).then(r => {
                    this.scholarshipCriteriaRepository.AddMany(this.scholarshipList).then(r => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Record has been inserted successfully",
                            title: "Success",
                            messageTypeId: PayloadMessageTypes.success
                        });
                    });
                    this.cancel();
                });
            } else {
                if (this.isActive == true) {
                    this.data.statusId = 1
                }
                else {
                    this.data.statusId = 0
                }
                this.repository.Update(this.data)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been updated successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });
            }
    
            this.cancel();
        }

      
    }
    get allowSubmit() {

      //  return(this.admissionTypeList.find(s=>s.admissionTypeId==this.bulkData.admissionTypeId).fullName.toLowerCase()=='regular') && this.bulkData.admissionTypeId!='';
        
        return (this.data.zoneId.length > 0) && 
        (this.programCBList.filter(s=> s.isChecked).length > 0) && 
        (this.data.shiftId.length > 0) && 
        (this.data.challanTypeId.length > 0) && 
        (this.data.fullName.length > 0) && 
        (this.bulkData.admissionTypeId.length>0) &&
        (this.continuationPolicyCBList.filter(e=>e.isChecked).length>0) ;
    }
    $v: Vuelidate<any>;
}