import { Route, RouteConfig as VueRouteConfig } from "vue-router";
import { RoleList } from "./actions/list";
import { ReadRole } from "./actions/read";
import { CreateRole } from "./actions/create";
import { UpdateRole } from "./actions/update";

export const RoleRoutes: VueRouteConfig[] = [
  {
    component: RoleList,
    name: "listRoles",
    path: "roles"
  },
  {
    component: UpdateRole,
    name: "updateRole",
    path: "role/update/:id",
    props: true
  },
  {
    component: ReadRole,
    name: "viewRole",
    path: "role/:id",
    props: true
  },
  {
    component: CreateRole,
    name: "createRole",
    path: "role/create/:id",
    props: true
  }
];