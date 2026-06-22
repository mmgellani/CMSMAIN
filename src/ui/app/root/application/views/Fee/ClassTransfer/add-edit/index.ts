
import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';
import * as helper from '../../../../helper';
import { ISetupCampusProgramVM, DDLGroupModel, DDLModel, IAdmissionAdmissionFormCplVM, ICampusCityVM, IRegistrationSectionCourseLinkList } from '../../../../models';
import { SetupCampusProgramLinkService, FeeStudentFeeStructureService, SetupCampusService, RegistrationSectionCourseLinkService } from '../../../../service';


@Component({
    mixins: [validationMixin],
    name: 'add-edit-model',
    template: require('./index.html')
})
export class AddEditProgramTransfer extends Vue {
    private title: string = '';
    private campusProgramId: string = '';
    private studentfeerepo: FeeStudentFeeStructureService = null;
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = [];
    private TempCPLVM: Array<IAdmissionAdmissionFormCplVM> = [];
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    private SectionCourseLinkService: RegistrationSectionCourseLinkService = null;
    private cityDDL: Array<DDLGroupModel> = [];
    private campusddl: Array<DDLModel> = [];
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
    private campusCityList: Array<ICampusCityVM> = [];
    SectionCourselinkId: string = '';
    removerollno: boolean = false;
    SectionCourseLinkLIst: Array<IRegistrationSectionCourseLinkList> = [];
    indicator: number = 0;
    cities = [];

    private campusId: string = ''
    private sessionid: string = ''
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)




    beforeModalOpen(event) {
        this.TempCPLVM = [];
        this.campusId = event.params.campusId;
        this.sessionid = event.params.sessionid;
        this.TempCPLVM = event.params.modelVM as Array<IAdmissionAdmissionFormCplVM>;
        this.studentfeerepo = new FeeStudentFeeStructureService(this.$store);
        this.SectionCourseLinkService = new RegistrationSectionCourseLinkService(this.$store);
        this.loadCityCampus();
    }
    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM()
            .then(r => {
                this.campusCityList = r as Array<ICampusCityVM>;
                this.cities = [];
                this.campusCityList.forEach(element => {
                    if (this.cities.indexOf(element.cityName) == -1) {
                        this.cities.push(element.cityName);
                    }
                });
            })
    }

    loadProgramsOfCampus() {
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionid + '?' + this.campusId
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
        });
    }

    loadSectionsList() {
        if (this.TempCPLVM) {
            if (this.TempCPLVM.length > 0) {
                var key = this.campusProgramId + '?' + this.TempCPLVM[0].admissionFormId;
                this.SectionCourseLinkService.GetSectionListEX(key).then(
                    r => {
                        this.SectionCourseLinkLIst = r as Array<IRegistrationSectionCourseLinkList>

                    }
                )

            }

        }

    }
  
    ProgramTransfer() {
        this.indicator = 0;

        var programdetailid = this.campusProgramLinkList.find(e => e.campusProgramId == this.campusProgramId && e.campusId == this.campusId && e.sessionId == this.sessionid).programDetailId

        if (this.removerollno)

            this.indicator = 1;



        if (this.TempCPLVM) {
            if (this.TempCPLVM.length > 0) {
                var key = this.TempCPLVM[0].admissionFormId + '?' + this.campusProgramId + '?' + this.indicator+'?'+this.SectionCourselinkId

                var response = confirm('Are you sure to transfer Program')
                if (response) {
                    this.studentfeerepo.ProgramTransfernew(key).then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been updated successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });

                    this.cancel();
                }
            }

        }





        //var key = this.TempCPLVM[0].admissionFormId + '?' + this.sessionid + '?' + programdetailid + '?' + this.campusId + '?' + '-I'


    }


}