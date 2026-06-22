import * as helper from '../../../../helper';

import { DDLGroupModel, DDLModel, IAdmissionAdmissionFormCplVM, ICampusCityVM, IRegistrationSectionCourseLinkList, ISetupCampusProgramVM, TransferList } from '../../../../models';
import { FeeStudentFeeStructureService, RegistrationSectionCourseLinkService, SetupCampusProgramLinkService, SetupCampusService } from '../../../../service';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, required } from 'vuelidate/lib/validators';

import Component from 'vue-class-component';
import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import { validations } from '../../../../../../admin/users/signup/signup-validate';

type ValidateProgramTransfer = { data: IAdmissionAdmissionFormCplVM; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateProgramTransfer> = {
    data: {
        campusId: { required },
        campusProgramId: { required },
    }
};
@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class AddEditProgramTransfer extends Vue {
    private title: string = '';
    private campusProgramId: string = '';
    private studentfeerepo: FeeStudentFeeStructureService = null;
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = [];
    private TempCPLVM: Array<TransferList> = [];
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    private SectionCourseLinkService: RegistrationSectionCourseLinkService = null;
    private cityDDL: Array<DDLGroupModel> = [];
    private campusddl: Array<DDLModel> = [];
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
    private campusCityList: Array<ICampusCityVM> = [];
    SectionCourselinkId: string = '';
    removerollno: boolean = false;
    showall=false;
    SectionCourseLinkLIst: Array<IRegistrationSectionCourseLinkList> = [];
    indicator: number = 0;
    cities = [];
    private IsNewRecord: boolean = true;
    private campusId: string = ''
    private sessionid: string = ''
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private isLoading=false;
    // options = {
    //     templateResult: this.formatFunction,
    //     templateSelection: this.formatFunction,
    //     data: []
    // };
    // private formatFunction(state) {
    //     var oneItem = this.SectionCourseLinkLIst.filter(e => e.fullName == state.id);

    //     var $state = $(
    //         oneItem ? oneItem.length > 0 ?
    //             '<span><strong>Section</strong>: ' + oneItem[0].fullName.substring(0, 5) + ' <strong>From Serial</strong>: ' + oneItem[0].fromSerial + ' <strong>To Serial</strong>: ' + oneItem[0].toSerial + '</span>' : '' : ''
    //     );
    //     return $state;
    // }
    created() {
        this.showall=false;
        this.loadCityCampus();
        // this.$watch('campusId', this.loadProgramsOfCampus);
        // this.$watch('campusProgramId', this.loadSectionsList);
    }

    beforeModalOpen(event) {
        this.removerollno=false;
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
        this.TempCPLVM = [];
        this.campusId = event.params.campusId;
        this.sessionid = event.params.sessionid;
        this.TempCPLVM = event.params.modelVM as Array<TransferList>;
        this.studentfeerepo = new FeeStudentFeeStructureService(this.$store);
        this.SectionCourseLinkService = new RegistrationSectionCourseLinkService(this.$store);
    }
    cancel() {
        this.campusId = '';
        this.campusProgramId = '';
        this.SectionCourselinkId = '';
        this.$emit("submit");
        this.$modal.hide('add-edit-model');
        this.showall=false;
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
        if (this.sessionid.length > 0 && this.campusId.length > 0) {
            var key = this.sessionid + '?' + this.campusId
            this.campusProgramLinkRepo.GetAllVM(key).then(r => {
                this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            });
        }
    }

    getCustomize()
    {
        if(this.showall==true)
        {
            var z='1';
        }
        if(this.showall==false)
        {
            var z='0';
        }


        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCampusCustomize(z)
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

    loadSectionsList() {

        if (this.TempCPLVM) {
            if (this.TempCPLVM.length > 0) {
                if (this.campusProgramId.length > 0 && this.TempCPLVM[0].admissionFormId.length > 0) {
                    var key = this.campusProgramId + '?' + this.TempCPLVM[0].admissionFormId;

                    // alert(JSON.stringify(key));
                    this.SectionCourseLinkService.GetSectionList(key).then(
                        r => {
                            this.SectionCourseLinkLIst = r as Array<IRegistrationSectionCourseLinkList>
                        }
                    )
                }
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
                    //this.SectionCourselinkId='00000000-0000-0000-0000-000000000000';
                    var key = JSON.stringify(this.TempCPLVM) + '?' + this.campusProgramId + '?' + this.indicator + '?' + this.SectionCourselinkId
                    var response = confirm('Are you sure to transfer Program')
                    if (response) {
                        this.isLoading=true;
                        this.studentfeerepo.ProgramTransferWithAlreadyPaidBulk(key).then(r => {
                            this.isLoading=false;
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: r.returnValue,
                                title: 'Success',
                                messageTypeId: PayloadMessageTypes.success
                            })
                            this.cancel();
                        });
                       // this.cancel();
                    }
                }
            }
        
      

    }
    $v: any;
}