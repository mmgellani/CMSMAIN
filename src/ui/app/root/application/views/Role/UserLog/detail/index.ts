/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { required, maxLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import * as helper from "../../../../helper";
import { IUserLog } from "../../../../models/Role/UserLog";
import { RoleUserLogService } from "../../../../service/Role/UserLog";

type ValidateRoleUserLog = { model: IUserLog; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateRoleUserLog> = {
  model: {
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "userlog-detail-model",
  template: require("./index.html")
})
export class RoleUserLogDetail extends Vue {
  private repository: RoleUserLogService;
  private data: IUserLog = {
    auditId: "",
    dateTime: "",
    displayName: "",
    localIpPort: "",
    publicIpPort: "",
    user: "",
    controllerAction: "",
    operation: "",

  };

  private title: string = "Details";
  private isActive = false;
  private datas: Array<IUserLog> = [];


  created() {
    this.repository = new RoleUserLogService(this.$store);
  }

  beforeModalOpen(event) {
    Object.assign(this.data, event.params.model);
  }

  getFirst(value) {
    if (value) {
      var first = value.split(',')[0];
      if (first) {
        var key = first.split(':')[0].replace('{', '').replace(/"/g, '');
        var val = first.split(':')[1].replace('{', '').replace(/"/g, '');

        this.datas = [];
        this.repository.FindBy(`SELECT
        "Role"."UserLog"."AuditId",
        "Role"."UserLog"."DateTime",
        "Role"."User"."DisplayName",
        "Role"."UserLog"."LocalIpPort",
        "Role"."UserLog"."PublicIpPort",
        "Role"."UserLog"."User",
        "Role"."UserLog"."ControllerAction",
        "Role"."UserLog"."Operation"
        FROM
        "Role"."UserLog"
        INNER JOIN "Role"."User" ON "Role"."UserLog"."UserId" = "Role"."User"."UserId" 
        WHERE "Operation"::jsonb->>'` + key + `' = '` + val + `' order by "DateTime"`)
          .then(response => {
            this.datas = response;
          })
      }
    }
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("userlog-detail-model");
  }

  $v: Vuelidate<any>;
}
