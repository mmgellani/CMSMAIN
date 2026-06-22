import Vue from "vue";
import Component from "vue-class-component";
import { IFeeStudentFeeStructureVM, IFeeStudentFeeStructure, DDLModel, DDLGroupModel } from "../../../../models";
import { FeeStudentFeeStructureService } from "../../../../service";
import { SetupSessionService } from "../../../../service/Setup/Session";
import { ISetupSession } from "../../../../models/Setup/Session";
import { SetupCampusService } from "../../../../service/Setup/Campus";
import { ISetupCampus, ICampusCityVM } from "../../../../models/Setup/Campus";
import { SetupCampusProgramLinkService } from "../../../../service/Setup/CampusProgramLink";
import { ISetupCampusProgramVM } from "../../../../models/Setup/CampusProgramLink";
import { CustomFeeEdit } from "../add-edit";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": CustomFeeEdit
    //     'delete-model': FeeStudentFeeStructureDelete
  }
})
export class CustomFee extends Vue {
  private filterString: string = "";

  private service: FeeStudentFeeStructureService;
  private model: Array<IFeeStudentFeeStructureVM> = [];
  private sessionService: SetupSessionService;
  private sessionModel: Array<ISetupSession> = [];
  private campusService: SetupCampusService;
  private campusModel: Array<ISetupCampus> = [];
  private programService: SetupCampusProgramLinkService;
  private programModel: Array<ISetupCampusProgramVM> = [];
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
  private campusCityList: Array<ICampusCityVM> = []
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store)


  private campus: string = "";
  private session: string = "";
  private program: string = "";

  private ddl: Array<DDLModel> = []
  private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    private programDDL: Array<DDLGroupModel> = []

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

  loadProgramsOfCampus() {
    this.ddl = [];
    this.programDDL = [];
    let oldObj: ISetupCampusProgramVM;
    var key = this.session + '?' + this.campus
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
            //  console.log(JSON.stringify(this.programDDL))



        })
}

  loadData(key) {
    var programDetailid = this.campusProgramLinkList.find(s => s.campusProgramId == this.program).programDetailId
    key = this.session + "," + this.campus + "," + programDetailid;
    this.service
      .GetAllFilterData(key)
      .then(
        response => (this.model = response as Array<IFeeStudentFeeStructureVM>)
      );
  }

  insert(temp: IFeeStudentFeeStructure) {
    //alert(temp.admissionFormId)
    this.$modal.show("add-edit-model", { admissionFormId: temp.admissionFormId });
   // alert(this.model[0].admissionFormId)
  }
}
