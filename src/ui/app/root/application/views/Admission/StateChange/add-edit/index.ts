
import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';
import * as helper from '../../../../helper';
import { ISetupCampusProgramVM, DDLGroupModel, DDLModel, IAdmissionAdmissionFormCplVM, ISetupAdmissionType } from '../../../../models';
import { SetupCampusProgramLinkService, FeeStudentFeeStructureService, SetupAdmissionTypeService } from '../../../../service';

type ValidateSetupAdmissionType = { admissionTypeId: ISetupAdmissionType; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupAdmissionType> = {
    admissionTypeId: { required },
};
@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class AddEditProgramTransfer extends Vue {
    private title: string = '';
    private admissionTypeId: string = '';
    private campusProgramId: string = '';
    private studentfeerepo: FeeStudentFeeStructureService = null;
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = [];
    private TempCPLVM: Array<IAdmissionAdmissionFormCplVM> = [];
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private admisisonTypeRepo: SetupAdmissionTypeService = new SetupAdmissionTypeService(
        this.$store
    );

    private campusid: string = ''
    private sessionid: string = ''
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private admissionTypeList: Array<ISetupAdmissionType> = [];




    beforeModalOpen(event) {
        this.$v.$reset();
        this.TempCPLVM = [];
        this.admissionTypeList = [];
        this.campusid = event.params.campusid;
        this.sessionid = event.params.sessionid;
        this.TempCPLVM = event.params.modelVM as Array<IAdmissionAdmissionFormCplVM>;

        this.studentfeerepo = new FeeStudentFeeStructureService(this.$store);

        // this.loadProgramsOfCampus()
        this.loadAdmissionType();

    }
    cancel() {
        this.$emit("submit");
        this.$modal.hide('add-edit-model');

    }
    loadProgramsOfCampus() {
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionid + '?' + this.campusid

        this.campusProgramLinkRepo.GetAllVM(key)
            .then(r => {
                this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>

                oldObj = this.campusProgramLinkList[0]
                this.campusProgramLinkList.forEach(e => {

                    if (e.programId == oldObj.programId) {

                        this.ddl.push({ id: e.campusProgramId, text: e.description })
                    }
                    else {

                        this.programDDL.push({ title: this.campusProgramLinkList[this.campusProgramLinkList.indexOf(e) - 1].programName, group: this.ddl })
                        this.ddl = []
                        this.ddl.push({ id: e.campusProgramId, text: e.description })
                    }
                    oldObj = e;
                })
                this.programDDL.push({ title: oldObj.programName, group: this.ddl })
                // console.log(JSON.stringify(this.programDDL))
            })
    }
    loadAdmissionType() {
        this.admisisonTypeRepo.GetFindBy("s=>s.StatusId==1").then(r => {
            this.admissionTypeList = r as Array<ISetupAdmissionType>;
        });
    }

    StateChange() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            var key = this.admissionTypeId + '?' + this.TempCPLVM[0].admissionFormId;
            this.studentfeerepo.StateChange(key).then(() => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been updated successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                })
                this.cancel();
            });

            // this.cancel();
        }
    }
    $v: any;
}