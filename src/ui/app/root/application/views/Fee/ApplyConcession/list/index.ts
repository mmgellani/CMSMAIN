/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";

import {
  IFeeConcessionDetail,
  IFeeConcessionDetailVM,
  ISetupSession,
  ISetupShift,
  ISetupCampus,
  IStudentModel,
  ISetupProgramDetails,
  DDLGroupModel,
  DDLModel,
  ISetupProgramDetailsVM,
  IFeeConcession,
  IFeeScholarshipCriteriaVM,
  ISetupAdmissionType,
  ICampusCityVM,
  IStudentModelCB,
  ISetupCampusProgramVM,
  IGetStudentsVM,
  IFeeContinuationPolicy
} from "../../../../models";
import {
  FeeConcessionDetailService,
  SetupCampusService,
  SetupSessionService,
  SetupShiftService,
  FeeConcessionService,
  SetupProgramDetailsService,
  FeeScholarshipCriteriaService,
  SetupAdmissionTypeService,
  SetupCampusProgramLinkService,
  FeeStudentFeeStructureService,
  AdmissionAdmissionFormService,
  FeeContinuationPolicyService
} from "../../../../service";

import { FeeApplyConcessionBulkAddEdit } from "../add-edit";
import { FeeApplyConcessionBulkDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";
import { ReportEngine } from "../../../../../../components";
import { parse } from "querystring";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": FeeApplyConcessionBulkAddEdit,
    "delete-model": FeeApplyConcessionBulkDelete,
    // "report-engine": ReportEngine
  }
})
export class FeeApplyConcession extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: FeeConcessionDetailService;

  private datas: Array<IGetStudentsVM> = [];
  private tempDatas: Array<IGetStudentsVM> = [];
  private newDatas: any = [];
  private insModel: any = {};

  private filterString: string = "";
  private campusId = "";
  private sessionId = "";
  private programDetailId = "";
  private CprogramDetailId = "";
  private shiftId = "";
  private percentageFrom = 1;
  private percentageTo = 99;
  private percentage = 0;
  private scholarshipCriteriaId = "";
  private admissionTypeId = "";

  private campusList: Array<ISetupCampus> = [];
  private sessionList: Array<ISetupSession> = [];
  private programDetailList: Array<ISetupProgramDetailsVM> = [];
  private shiftList: Array<ISetupShift> = [];
  AdmissionformService: AdmissionAdmissionFormService = null;
  private programDDL: Array<DDLGroupModel> = [];
  private ddl: Array<DDLModel> = [];
  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];
  private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = [];
  private admissionTypeList: Array<ISetupAdmissionType> = [];
  private campusCityList: Array<ICampusCityVM> = [];
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );


  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private sessionRepo: SetupSessionService = new SetupSessionService(
    this.$store
  );
  private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(
    this.$store
  );
  private concessionRepo: FeeConcessionService = new FeeConcessionService(
    this.$store
  );
  private shiftRepo: SetupShiftService = new SetupShiftService(this.$store);
  private concessionDetailRepo: FeeConcessionDetailService = new FeeConcessionDetailService(
    this.$store
  );
  private scholarshipCriteriaRepo: FeeScholarshipCriteriaService = new FeeScholarshipCriteriaService(
    this.$store
  );
  private admissionTypeRepo: SetupAdmissionTypeService = new SetupAdmissionTypeService(
    this.$store
  );
  private continuationPolicyList: Array<IFeeContinuationPolicy> = [];
  private continuationPolicyRepo: FeeContinuationPolicyService = new FeeContinuationPolicyService(this.$store);
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private selected: Array<IStudentModelCB> = [];
  private reportData: any = [];
  private report: String = "";
  private $vs: any;
  private cond = '!=null';
  private showApplied = false;
  private continuationPolicyId = '';

  created() {
    this.repository = new FeeConcessionDetailService(this.$store);
    this.AdmissionformService = new AdmissionAdmissionFormService(this.$store);
    this.loadCampus();
    this.loadSession();
    //this.loadProgramDetails();
    this.loadShift();
    this.loadAdmissionType();
    this.loadCityCampus();
    this.loadContinuationPolicy();
    // this.loadScholarship();
  }
  loadContinuationPolicy() {
    this.continuationPolicyList = [];
    this.continuationPolicyRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.continuationPolicyList = r as Array<IFeeContinuationPolicy>;
    });
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
    this.admissionTypeRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.admissionTypeList = r as Array<ISetupAdmissionType>;
    });
  }
  mounted() {
    this.validatePage();
    this.refreshData();
  }
  loadCampus() {
    this.campusRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.campusList = r as Array<ISetupCampus>;
    });
  }
  loadSession() {
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }
  loadShift() {
    this.shiftRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.shiftList = r as Array<ISetupShift>;
    });
  }

  loadScholarship() {
    // this.concessionId = ''

    // alert(JSON.stringify(this.programDetailId));

    // var programDetailid = this.campusProgramLinkList.find(
    //   s => s.campusProgramId == this.programDetailId
    // ).programDetailId;

    // this.CprogramDetailId = programDetailid;
    // alert(programDetailid)

    this.scholarshipCriteriaList = [];

    if (
      this.sessionId.length > 0 &&
      this.campusId.length > 0 &&
      this.programDetailId.length > 0 &&
      this.shiftId.length > 0 &&
      this.admissionTypeId.length > 0 &&
      this.continuationPolicyId.length > 0
    ) {
      var key =
        this.sessionId +
        "?" +
        this.campusId +
        "?" +
        this.programDetailId +
        "?" +
        this.shiftId +
        "?" +
        this.admissionTypeId +
        "?" +
        this.continuationPolicyId;
      ;


      // var programid = this.programDetailList.find(s => s.programDetailId == this.programDetailId).programId
      this.scholarshipCriteriaRepo.GetAllVMByEx(key).then(r => {
        this.scholarshipCriteriaList = r as Array<IFeeScholarshipCriteriaVM>;
        //  alert(JSON.stringify(this.scholarshipCriteriaList))
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
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("feeApplyConcessionBulk" in this.user.claims == true) {
        if (this.user.claims["feeApplyConcessionBulk"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["feeApplyConcessionBulk"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["feeApplyConcessionBulk"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["feeApplyConcessionBulk"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  refreshData() {
    this.datas = [];
    this.selected = [];
    this.newDatas = [];
    this.tempDatas = [];
    if (
      this.campusId.length > 0 &&
      this.sessionId.length > 0 &&
      this.programDetailId.length > 0 &&
      this.shiftId.length > 0 &&

      this.admissionTypeId.length > 0
    ) {
      var key =
        this.campusId +
        "?" +
        this.sessionId +
        "?" +
        this.programDetailId +
        "?" +
        this.shiftId +
        "?" +

        this.admissionTypeId;
      this.repository.GetStudentSingle(key).then(response => {
        this.datas = response as Array<IGetStudentsVM>;

        this.tempDatas.push(this.datas[0])
        var oldid = this.datas[0].refferenceNo;
        this.datas.forEach(e => {
          if (e.refferenceNo != oldid) {
            this.tempDatas.push(e)
          }

          oldid = e.refferenceNo;
        })

        this.tempDatas.forEach(e => {
          this.percentage = parseInt(e.obtained) / parseInt(e.total) * 100
          this.percentage = Math.round(this.percentage);
          if (this.percentage >= this.percentageFrom && this.percentage <= this.percentageTo) {

            this.newDatas.push({
              fullName: e.fullName,
              admissionFormId: e.admissionFormId,
              fatherName: e.fatherName,
              isChecked: false,
              percentage: this.percentage,
              referrenceNo: e.refferenceNo,
              rollNo: e.rollNo,
              studentCNIC: e.studentCNIC,
              studentContactNo: e.studentContact,
              studentId: e.studentId,
              zoneId: e.zoneId,
              classId: e.classId,
              concessionDetailId: e.concessionDetailId
            });

          }

        });

      });


    }
  }

  revertPass(model: any) {
    this.insModel = model;

    var admissonformid = this.insModel.admissionFormId;
    var classid = this.insModel.classId;

    this.IsRevertConcession();


  }
  modelToPass(model: any) {
    this.insModel = model;
    var admissonformid = this.insModel.admissionFormId;
    var classid = this.insModel.classId;
    this.IsAppliedConcession();

  }
  IsAppliedConcession() {

    var admissonformid = this.insModel.admissionFormId;
    var classid = this.insModel.classId;
    this.AdmissionformService.CheckFeeExemption(admissonformid).then(res => {
      if (res) {
        if (res.length > 0) {
          if (res[0].val > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Exemption Applied,Concession cannot be applied to this student.",
              title: "Error",
              messageTypeId: PayloadMessageTypes.error
            });
            return false;
          } else {
            this.AdmissionformService.CheckFeePaid(admissonformid).then(prs => {
              if (prs) {
                if (prs.length > 0) {
                  if (prs[0].val > 0) {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                      text: "Fee Already Paid,Concession cannot be applied to this student.",
                      title: "Error",
                      messageTypeId: PayloadMessageTypes.error
                    });
                    return false;
                  } else {
                    this.AdmissionformService.CheckSubInstallment(admissonformid + '?' + classid)
                      .then(cst => {
                        if (cst) {
                          if (cst.length > 0) {
                            if (cst[0].val > 0) {
                              this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: "Subinstallment Generated,Concession cannot be applied to this student.",
                                title: "Error",
                                messageTypeId: PayloadMessageTypes.error
                              });
                              return false;
                            } else {
                              var response = confirm('Are you sure to apply Concession to this student');

                              if (response) {
                                var key = this.scholarshipCriteriaId + "?" + "[" + JSON.stringify(this.insModel) + "]";

                                this.concessionDetailRepo.ApplyBulkConcession(key).then(r => {
                                  this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: "Record has been updated successfully",
                                    title: "Success",
                                    messageTypeId: PayloadMessageTypes.success
                                  });
                                });
                              }
                              return true;
                            }
                          } else {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                              text: "Concession cannot be applied to this student.",
                              title: "Error",
                              messageTypeId: PayloadMessageTypes.error
                            });
                            return false;
                          }
                        } else {
                          this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Concession cannot be applied to this student.",
                            title: "Error",
                            messageTypeId: PayloadMessageTypes.error
                          });
                          return false;
                        }
                      })
                  }
                } else {
                  this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Concession cannot be applied to this student.",
                    title: "Error",
                    messageTypeId: PayloadMessageTypes.error
                  });
                  return false;
                }
              } else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                  text: "Concession cannot be applied to this student.",
                  title: "Error",
                  messageTypeId: PayloadMessageTypes.error
                });
                return false;
              }
            });
          }
        } else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Concession cannot be applied to this student.",
            title: "Error",
            messageTypeId: PayloadMessageTypes.error
          });
          return false;
        }
      } else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Concession cannot be applied to this student.",
          title: "Error",
          messageTypeId: PayloadMessageTypes.error
        });
        return false;
      }

      return true;
    });

    return true;
  }

  IsRevertConcession() {

    var admissonformid = this.insModel.admissionFormId;
    var classid = this.insModel.classId;
    this.AdmissionformService.CheckFeeExemption(admissonformid).then(res => {
      if (res) {
        if (res.length > 0) {
          if (res[0].val > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Exemption Applied,Revert Concession cannot be applied to this student.",
              title: "Error",
              messageTypeId: PayloadMessageTypes.error
            });
            return false;
          } else {
            this.AdmissionformService.CheckSubInstallment(admissonformid + '?' + classid)
            .then(cst => {
              if (cst) {
                if (cst.length > 0) {
                  if (cst[0].val > 0) {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                      text: "Subinstallment Generated,Revert Concession cannot be applied to this student.",
                      title: "Error",
                      messageTypeId: PayloadMessageTypes.error
                    });
                    return false;
                  } else {
                    var response = confirm('Are you sure to revert Concession of this student');
                    if (response) {
                      this.AdmissionformService.RevertConcession(admissonformid)
                        .then(e => this.$store.dispatch(StoreTypes.updateStatusBar, {
                          text: "Record has been updated successfully",
                          title: "Success",
                          messageTypeId: PayloadMessageTypes.success
                        }))
                    }
                    return true;
                  }
                } else {
                  this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Revert Concession cannot be applied to this student.",
                    title: "Error",
                    messageTypeId: PayloadMessageTypes.error
                  });
                  return false;
                }
              } else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                  text: "Revert Concession cannot be applied to this student.",
                  title: "Error",
                  messageTypeId: PayloadMessageTypes.error
                });
                return false;
              }
            })
          }




        } else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Revert Concession cannot be applied to this student.",
            title: "Error",
            messageTypeId: PayloadMessageTypes.error
          });
          return false;
        }
      } else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Revert Concession cannot be applied to this student.",
          title: "Error",
          messageTypeId: PayloadMessageTypes.error
        });
        return false;
      }

      return true;
    });

    return true;
  }

  insertModel() {
    {


      // var list = this.selected.filter(s => s.isChecked == true);
      // var list = this.newDatas[1];
      // this.insModel.isChecked = true;
      // alert(JSON.stringify(this.insModel))
      // if (list.length > 0) {
      var key = this.scholarshipCriteriaId + "?" + "[" + JSON.stringify(this.insModel) + "]";
      // alert(JSON.stringify(key));
      this.concessionDetailRepo.ApplyBulkConcession(key).then(r => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Record has been updated successfully",
          title: "Success",
          messageTypeId: PayloadMessageTypes.success
        });
      });
    }
    // else if(res[0].val > 0)
    // {
    //   this.$store.dispatch(StoreTypes.updateStatusBar, {
    //     text: "Fee paid, Concession Cannot be Applied",
    //     title: "Danger",
    //     messageTypeId: PayloadMessageTypes.error
    //   });
  }

  //}
  //)


  // var list = this.selected.filter(s => s.isChecked == true);
  // var list = this.newDatas[1];
  //this.insModel.isChecked = true;
  // alert(JSON.stringify(this.insModel))
  // if (list.length > 0) {
  //var key = this.scholarshipCriteriaId + "?" + "[" + JSON.stringify(this.insModel) + "]";
  // alert(JSON.stringify(key));
  // this.concessionDetailRepo.ApplyBulkConcession(key).then(r => {
  //   this.$store.dispatch(StoreTypes.updateStatusBar, {
  //     text: "Record has been updated successfully",
  //     title: "Success",
  //     messageTypeId: PayloadMessageTypes.success
  //   });
  // });
  //}
  // }

  save() {
    this.$vs.notify({
      title: "Function click",
      text: "Click on me",
      color: "primary",
      fixed: true,
      click: () => {
        this.$vs.notify({
          title: "Secondary function",
          text: "Executed the function when clicking",
          color: "success",
          icon: "check_box"
        });
      }
    });
  }

  getListReport() {
    var list = this.selected.filter(s => s.isChecked == true);
    var key = JSON.stringify(list);
    alert(list);
    this.reportData = list;
    this.report =
      "assets/Reports/Resource/Fee/ScholarshipStudents.xml";
    this.$modal.show("report-viewer-eng");
  }

  editModel(model: IFeeConcessionDetail) {
    this.$modal.show("add-edit-model", {
      model: model,
      IsNewRecord: false,
      CampusId: this.campusId,
      sessionId: this.sessionId,
      ProgramDetailId: this.programDetailId,
      scholarshipCriteriaId: this.scholarshipCriteriaId
    });
  }

  deleteModel(model: IFeeConcessionDetail) {
    this.$modal.show("delete-model", { model: model });
  }
}
