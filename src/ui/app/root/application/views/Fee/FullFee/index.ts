import Vue from "vue";
import Component from "vue-class-component";
import { FeeStudentFeeStructureService, SetupSessionService, SetupCampusService, SetupCampusProgramLinkService } from "../../../service";
import { IFeeStudentFeeStructureVM, ISetupSession, ISetupCampus, ISetupCampusProgramVM, IFeeStudentFeeStructure } from "../../../models";

@Component({
  name: "models-form-list",
  template: require("./index.html")
  //   components: {
  //     "add-edit-model": CustomFeeEdit
  //     //     'delete-model': FeeStudentFeeStructureDelete
  //   }
})
export class FullFee extends Vue {
  private filterString: string = "";

  private service: FeeStudentFeeStructureService;
  private model: Array<IFeeStudentFeeStructureVM> = [];
  private sessionService: SetupSessionService;
  private sessionModel: Array<ISetupSession> = [];
  private campusService: SetupCampusService;
  private campusModel: Array<ISetupCampus> = [];
  private programService: SetupCampusProgramLinkService;
  private programModel: Array<ISetupCampusProgramVM> = [];
  private campus: string = "";
  private session: string = "";
  private program: string = "";

  private columns = [
    { key: "refferenceNo", caption: "ReferenceNo" },
    { key: "fullName", caption: "StudentName" },
    { key: "fatherName", caption: "ParentName" },
    { key: "description", caption: "Program" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.sessionService = new SetupSessionService(this.$store);
    this.campusService = new SetupCampusService(this.$store);
    this.programService = new SetupCampusProgramLinkService(this.$store);
    this.service = new FeeStudentFeeStructureService(this.$store);
    this.loadSession();
  }

  loadCampus() {
    this.campusService
      .GetFindBy('e=>e.StatusId==1')
      .then(response => (this.campusModel = response as Array<ISetupCampus>));
  }

  loadSession() {
    this.sessionService
      .GetFindBy('e=>e.StatusId==1')
      .then(response => (this.sessionModel = response as Array<ISetupSession>));
  }

  loadProgram(key) {
    key = this.session + "?" + this.campus;
    this.programService
      .GetAllVM(key)
      .then(
        response =>
          (this.programModel = response as Array<ISetupCampusProgramVM>)
      );
  }

  loadData(key) {
    key = this.session + "," + this.campus + "," + this.program;
    this.service
      .GetAllFilterData(key)
      .then(
        response => (this.model = response as Array<IFeeStudentFeeStructureVM>)
      );
  }

  insert(temp: IFeeStudentFeeStructure) {
    //alert(temp.admissionFormId)
    //alert(temp.admissionFormId)

    this.$modal.show("add-edit-model", { admissionFormId: temp.admissionFormId });
    // alert(this.model[0].admissionFormId)
  }
}
