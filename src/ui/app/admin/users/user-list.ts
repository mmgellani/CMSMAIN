import Vue from "vue";
import { Store } from "vuex";
import Component from "vue-class-component";
import { VueModelDate } from "vue-model-date/lib-esm";
import { ManageUserService } from "./user-service";
import { IRouteMixinData, IRouterMixinData } from "../../mixins/mixin-router";
import { ISearchResult, IUser } from "../../model";
import { ICommonState } from "../../store";
import { Toggle, PortletArea, PageArea } from "../../components";
import { Signup } from './signup/signup';

import "./users.scss";

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
  private svc: ManageUserService;
  private searchResults: ISearchResult<IUser> = null;

  columns = [
    { key: 'displayName', caption: 'User Name' },
    { key: 'email', caption: "Email" },
    { key: 'action', caption: 'Action', width: 120 }
  ];

  created() {
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
