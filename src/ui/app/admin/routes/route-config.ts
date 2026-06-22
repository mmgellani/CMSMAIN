import { Route, RouteConfig as VueRouteConfig } from "vue-router";
import {
  PageForbidden,
  Login,
  PageNotFound,
  Search,
  Verify
} from "../../components";
import { AreaLayout } from "../layout/layout";
import { DashboardRouteConfig } from "../dashboard/dashboard";
import { ManageUser } from "../users/user";
import { ManageUserList } from "../users/user-list";
import { SiteSettings } from "../settings/settings";
import { SiteReports } from "../reports/reports";
import { SecurityRoleClaims } from "../../model";
import { RouteNames } from "./route-names";
import { RoleRoutes } from "../roles";

import * as view from '../../root/application/views';

let others: VueRouteConfig[] = [
  {
    component: ManageUser,
    name: RouteNames.manageUser,
    path: "user/:id",
    props: true
  },
  {
    component: ManageUserList,
    name: RouteNames.manageUsers,
    path: "users"
  },
  {
    component: SiteReports,
    name: RouteNames.siteReports,
    path: "/reports"
  },
  {
    component: SiteSettings,
    name: RouteNames.siteSettings,
    path: "/site"
  },
  {
    component: Search,
    name: RouteNames.search,
    path: "/search/:searchText"
  },
  {
    component: Search,
    name: RouteNames.search + "default",
    path: "/search"
  },
  {
    component: Verify,
    name: RouteNames.verify,
    path: "/verification"
  },
  { component: view.RolePrevilagesList, name: RouteNames.roleprevilages, path: '/roleprevilages' },
  { component: view.SecurityClaimUpd, name: RouteNames.securityclaims, path: '/securityclaims' }
];

export const RouteConfig: VueRouteConfig[] = [
  {
    component: Login,
    name: RouteNames.login,
    path: "/login"
  },
  {
    component: AreaLayout,
    path: "/",
    meta: {
      claims: [SecurityRoleClaims.Admin]
    },
    children: DashboardRouteConfig.concat(RoleRoutes).concat(others)
  },
  {
    component: PageForbidden,
    name: RouteNames.forbidden,
    path: "/forbidden"
  },
  {
    component: PageNotFound,
    path: "*"
  }
];
