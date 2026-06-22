import Vue from 'vue';
import Component from 'vue-class-component';
import { Store } from 'vuex';
import { State } from 'vuex-class';
import * as i18n from 'vue-i18n';
import { SupportedLocales, SupportedTimeZones } from '../../locales';
import { IUser } from '../../model';
import { Debounce, GlobalConfig } from '../../common';
import { Autocomplete } from '../../components';
import { AuthenticationService } from '../../services';
import { IRouterMixin, IRouteMixinData, IRouterMixinData } from '../../mixins/mixin-router';
import { RouteNames } from '../routes'
import { IAdminStoreState, AdminStoreTypes } from '../store';

import './navigation.scss';
import { NavLink } from '../../root/layout/navigation/nav-link';

@Component({
  components: {
    autocomplete: Autocomplete,
    'nav-link': NavLink
  },
  template: require('./navigation.html')
})
export class AreaNavigation extends Vue implements IRouterMixin {

  private auth: AuthenticationService;
  sidebarContent = [
    {
      name: "Home", path: '/'
    },
    {
      name: "Users", path: '/users'
    },
    {
      name: "Roles", path: '/roles'
    },
    {
      name: "Previlages", path: '/roleprevilages'
    },
    {
      name: "Security Claims", path: '/securityclaims'
    }

  ];


  @State((state: IAdminStoreState) => state.common.user) user: IUser;

  changeLocale(locale: string, e: Event) {
    if (locale !== this.$i18n.locale) {
      // user-options-plugin mixin watches for locale changes, and will invoke logic to load resource strings
      this.$store.dispatch(AdminStoreTypes.common.updateLocale, locale);
    }
  }

  created() {
    this.auth = new AuthenticationService(this.$store);
  }

  onTimeZoneChange(timeZoneId: string) {

    if (timeZoneId && this.timeZones.find(o => o.key == timeZoneId) && timeZoneId != this.user.timeZoneId) {
      this.$store.dispatch(AdminStoreTypes.common.updateTimeZone, timeZoneId);
      this.showTimeZones = false;
    }
  }

  beforeMount() {

    this.activeTimeZoneId = this.user.timeZoneId;
  }


  get locales() {
    return SupportedLocales;
  }

  logout(e: Event) {

    this.auth.logout()
      .then(user => {
        this.$store.dispatch(AdminStoreTypes.common.updateUser, user);
      })
      .then(() => {
        let back = window.history.length;
        window.history.go(back);
        window.location.replace(GlobalConfig.uri.site);
      });
  }

  showSearchInput() {
    this.searchOptions.showInput = !this.searchOptions.showInput;
  }

  toggleTimeZoneInput(display: boolean = null) {

    display = display || !this.showTimeZones;
    this.showTimeZones = display;
  }

  get searchPageIsActive(): boolean {
    return (this.$route.name === RouteNames.search);
  }

  submitSearch(e: Event) {

    let onSubmitSearch = () => {

      this.searchOptions.showInput = false;

      this.$router.push({
        name: RouteNames.search,
        params: {
          searchText: this.searchOptions.searchText
        }
      });

    }

    Debounce(onSubmitSearch, 500)();
  }

  $route: IRouteMixinData;

  $router: IRouterMixinData;

  $store: Store<IAdminStoreState>;

  searchOptions = {
    searchText: '',
    showInput: false
  }

  showTimeZones: boolean = false;

  get activeCulture() {
    return this.user.cultureName;
  }

  get activeTimeZoneId() {

    return this.user.timeZoneId;
  }

  set activeTimeZoneId(value: string) {

    if (value && this.timeZones.find(o => o.key == value) && value != this.user.timeZoneId) {
      this.$store.dispatch(AdminStoreTypes.common.updateTimeZone, value);
      this.showTimeZones = false;
    }
  }

  get timeZones() {
    return SupportedTimeZones;
  }

  toggleButton() {
    if (document.body.className.indexOf('kt-aside--minimize') >= 0) {
      document.body.className = 'kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed';
    } else {
      document.body.className = 'kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-aside--minimize';
    }

  }

  mouseOver() {
    if (document.body.className.indexOf('kt-aside--minimize') >= 0) {
      document.body.className = 'kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-aside--minimize-hover';
    }
  }

  mouseLeave() {
    if (document.body.className.indexOf('kt-aside--minimize') >= 0) {
      document.body.className = 'kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-aside--minimize';
    }
  }


}