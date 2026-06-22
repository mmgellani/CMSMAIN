/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";

import { IAdmissionBulitanSale, ISetupCampus, ISetupSession, ICampusCityVM, DDLGroupModel, DDLModel } from "../../../../models";
import { AdmissionBulitanSaleService, SetupCampusService, SetupSessionService } from "../../../../service";

import { AdmissionInquiryAddEdit } from "../add-edit";
import { AdmissionInquiryDelete } from "../delete";
import { IAdmissionInquiry } from "../../../../models/Admission/Inquiry";
import { AdmissionInquiryService } from "../../../../service/Admission/Inquiry";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": AdmissionInquiryAddEdit,
    "delete-model": AdmissionInquiryDelete
  }
})
export class AdmissionInquiryList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AdmissionInquiryService;
  private data: Array<IAdmissionInquiry> = [];
  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  private campusId = "";
  private sessionId = "";
  private cityDDL: Array<DDLGroupModel> = []
  private campusddl: Array<DDLModel> = []

  private campusCityList: Array<ICampusCityVM> = [];
  private sessionList: Array<ISetupSession> = [];

  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private sessionRepo: SetupSessionService = new SetupSessionService(
    this.$store
  );

  private columns = [
    { key: "fullName", caption: "Full Name" },
    { key: "fatherName", caption: "Father Name" },
    { key: "contact", caption: "Contact No" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new AdmissionInquiryService(this.$store);
    this.loadSession();
  }

  loadSession() {
    this.sessionList = [];
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.sessionList = r as Array<ISetupSession>;
    });
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

  mounted() {
    this.validatePage();
    //this.refreshData();
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("admissionInquiry" in this.user.claims == true) {
        if (this.user.claims["admissionInquiry"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["admissionInquiry"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["admissionInquiry"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["admissionInquiry"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

//   refreshData() {
//     if (this.data.length > 0) {
//         this.data = [];
//         var key=this.sessionId+'?'+this.campusId
//         this.repository.GetFindBy(key)
//             .then(response => this.data = (response as Array<IRegistrationCode>));
//     }
// }

  refreshData() {
    
     //if (this.data.length > 0) {
      this.data = [];
      this.repository
        .GetFindBy("e => e.StatusId != 2")
        .then(
          response => (this.data = response as Array<IAdmissionInquiry>)
        );
    // } else {
    //   console.log("Error in refreshData()");
    // }
  }

  insertModel() {
    this.$modal.show("add-edit-model", {
      model: {
        inquiryId: "",
        campusProgramId: "",
        inquiryNo: "",
        dated: new Date(),
        reference: "",
        fullName: "",
        fatherName: "",
        institution: "",
        email: "",
        area: "",
        academicInfo: "",
        statusId: 0,
        contact: ""
      },
      IsNewRecord: true , SessionId: this.sessionId,CampusId : this.campusId
    });
  }

  editModel(model: IAdmissionInquiry) {
    this.$modal.show("add-edit-model", { model: model, IsNewRecord: false });
  }

  deleteModel(model: IAdmissionInquiry) {
    this.$modal.show("delete-model", { model: model });
  }
}
