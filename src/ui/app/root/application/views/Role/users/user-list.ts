import Vue from "vue";
import { Store } from "vuex";
import Component from "vue-class-component";
import { VueModelDate } from "vue-model-date/lib-esm";
import { ManageUserService } from "./user-service";
import { IRouteMixinData, IRouterMixinData } from "../../../../../../../ui/app/mixins/mixin-router";
import { ISearchResult, IUser } from "../../../../../../../ui/app/model";
import { ICommonState } from "../../../../../../../ui/app//store";
import { Toggle, PortletArea, PageArea } from "../../../../../../../ui/app/components";
import { Signup } from './signup/signup';

import "./users.scss";
import { IRootStoreState } from "../../../../store";
import { State } from "vuex-class";

@Component({
  template: require("./user-list.html"),
  components: {
    toggle: Toggle, signup: Signup,
    'portlet-area': PortletArea,
    'page-area': PageArea
  },
  directives: {
    modelDate: VueModelDate
  },
  props: ["page", "pageSize"]
})
export class ManageUserList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private svc: ManageUserService;
  private searchResults: ISearchResult<IUser> = null;
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  columns = [
    { key: 'displayName', caption: 'User Name' },
    { key: 'email', caption: "Email" },
    { key: 'action', caption: 'Action', width: 120 }
  ];

  created() {
    this.validatePage();
    this.svc = new ManageUserService(this.$store);
    this.search();
    this.svc.getUser(1).then(o => {
      this.registeredAfter = new Date(o.user.createdOn);
    });
  }

  private insertModel() {
    this.$modal.show('add-edit-model');
  }

  private search() {
    let onSuccess = (value: ISearchResult<IUser>) => {
      if (value) {
        this.searchResults = value;
      }
    };

    this.svc.search(0, 0).then(onSuccess);
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("userlist" in this.user.claims == true) {
        if (this.user.claims["userlist"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["userlist"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["userlist"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["userlist"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }


  updateUserStatus(user: IUser) {
    let data = {
      username: user.username,
      enabled: user.enabled
    };

    this.$router.push

    this.svc.updateUserStatus(data);
  }

  public get onText() {
    return this.$t("dict.yes");
  }

  public get offText() {
    return this.$t("dict.no");
  }

  navigate(forward: boolean) {
    this.search();
  }

  registeredAfter: Date = null;

  public get total(): number {
    return this.searchResults ? this.searchResults.total : null;
  }

  public get users(): IUser[] {
    return this.searchResults ? this.searchResults.items : [];
  }

  $route: IRouteMixinData;
  $router: IRouterMixinData;
  $store: Store<{ common: ICommonState }>;
}
