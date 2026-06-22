import Vue from "vue";
import Component from "vue-class-component";
import { Store } from "vuex";
import { State } from "vuex-class";
import {
  IRouteMixinData,
  IRouterMixinData
} from "../../../../../../../../ui/app/mixins/mixin-router";
import { ICommonState } from "../../../../../../../../ui/app/store";
import { ManageRoleService } from "../role-service";
import { ISearchResult, IRole, IUser } from "../../../../../../../../ui/app/model";
import { IAdminStoreState } from "../../../../../../../../ui/app/admin/store";
import { Toggle, PageArea, PortletArea } from "../../../../../../../../ui/app/components";
import { IClaimsHelper, AuthenticationService } from "../../../../../../../../ui/app/services";

@Component({
  components: {
    toggle: Toggle,
    'portlet-area': PortletArea,
    'page-area': PageArea
  },
  props: ["page", "pageSize"],
  template: require("./list.html")
})
export class RoleList extends Vue {

  claimsHelper: IClaimsHelper;
  // currentPage: number = Object.assign((<any>this).page);
  // currentPageSize: number = Object.assign((<any>this).pageSize);
  // start: number = 1;
  // end: number = 5;
  $route: IRouteMixinData;
  $router: IRouterMixinData;
  $store: Store<{ common: ICommonState }>;
  @State((state: IAdminStoreState) => state.common.user)
  user: IUser;

  columns = [
    { key: 'name', caption: 'Role Name' },
    { key: 'assignedUserCount', caption: "Total Users" },
    { key: 'enabled', caption: "Enabled" },
    { key: 'action', caption: 'Action', width: 120 }
  ];

  private svc: ManageRoleService;
  private searchResults: ISearchResult<IRole> = null;
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  public get total(): number {
    return this.searchResults ? this.searchResults.total : null;
  }

  public get roles(): IRole[] {
    return this.searchResults ? this.searchResults.items : [];
  }

  created() {
    this.claimsHelper = new AuthenticationService(this.$store);
    this.svc = new ManageRoleService(this.$store);
    this.search();
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("userlist" in this.user.claims == true) {
        if (this.user.claims["roleList"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["roleList"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["roleList"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["roleList"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  updateRoleStatus(role: IRole) {
    let data = Object.assign({}, role);

    this.svc.updateRoleStatus(data).catch((e: Error) => {
      this.$nextTick().then(() => (role.enabled = !role.enabled));
    });
  }

  public get onText() {
    return this.$t("dict.yes");
  }

  public get offText() {
    return this.$t("dict.no");
  }

  navigate(forward: boolean) {
    // if (forward) this.currentPage++;
    // else this.currentPage--;

    this.search();
  }

  private search() {
    let onSuccess = (value: ISearchResult<IRole>) => {
      if (value) {
        this.searchResults = value;

        // let page = value.page;
        // let pageSize = value.pageSize;
        // let total = value.total;

        // this.start = 1 + (page > 1 ? (page - 1) * pageSize : 0);
        // this.end = page * pageSize >= total ? total : page * pageSize;
      }
    };

    this.svc.search(0, 0).then(onSuccess);
  }
}
