import Vue from 'vue';
import { Store } from 'vuex';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import { ICommonOptions } from '../../plugins';
import { ContentService, TimeService, TimeObject, weatherObject } from '../services';
import { IRootStoreState, RootStoreTypes } from '../store';

import * as charts from './admission-role';
import WidgetBox from './widget-box/index';
import { AdmissionAdmissionFormService, FeeStudentChallanService, RegistrationEnrollmentsService, RolePrevilagesService } from '../application/service';
import { IAdmissionAdmissionForm, IFeeStudentChallan, IRegistrationEnrollments, RoleDashboard, IRoleDashboardfilter, UserRoleDashboardlink, TodoList, IAdmissionCount, IAdmissionFeeCount } from '../application/models';
import { DashboardWidget } from '../../components';
import Axios from 'axios';
import attendanceApproved from '../../components/attendance-approved';
import { ToDoListWidget } from './admission-role/toDoList';

import * as single from '../application/views/Dashboard';
import collapsibleWidget from '../../../../../src/ui/app/components/collapsibleWidget';
import { PayloadMessageTypes } from '../../model';
import { StoreTypes } from '../../store';
import { ToDoListAddEdit } from './add-edit';
import moment from 'moment';
import { FilterModel } from './filter-model';
import { PublicVWDashBoardVMService } from '../application/service/DashBoard/DashBoard';


@Component({
  template: require('./home.html'),
  components: {
    'form-collection': charts.FormCollectionWidget,
    'form-collection-cp': charts.FormCollectionWidgetCp,
    'form-collection-ad': charts.FormCollectionWidgetAd,
    'form-collection-fe': charts.FormCollectionWidgetFe,
    'form-collection-b': charts.FormCollectionBarWidget,
    'form-collection-p': charts.FormCollectionPieWidget,
    'form-collection-d': charts.FormCollectionDonutWidget,
    'form-collection-s': charts.FormCollectionSparklineWidget,
    'form-collection-s-o': charts.FormCollectionServerOverviewWidget,
    'widget-box': WidgetBox,
    "dashboard-widget": DashboardWidget,
    "attendance-approved": attendanceApproved,
    'todo-list': ToDoListWidget,

    'form-collection-single': single.FormCollectionSingle,
    'heldVsUnheld': single.HeldVsUnheld,
    'approvedVsUnapproved': single.ApprovedVsUnapproved,
    'concessionGraph': single.ConcessionGraph,
    'revenueGraph': single.RevenueGraph,
    collapsibleWidget,
    'toDoList-add-edit-model': ToDoListAddEdit,
    'filter-model': FilterModel
  },


})
export class Home extends Vue {

  private timeService: TimeService;

  private svc: ContentService = null;
  private admissionRepository: AdmissionAdmissionFormService;
  private FeeChallanrepository: FeeStudentChallanService = null;
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
  private paidData: Array<IFeeStudentChallan> = [];
  private repository: PublicVWDashBoardVMService = new PublicVWDashBoardVMService(this.$store);

  private data: Array<IAdmissionAdmissionForm> = [];
  private datas: Array<IAdmissionCount> = [];
  private admissionFeeCountList: Array<IAdmissionFeeCount> = [];
  private EnrollData: Array<IRegistrationEnrollments> = [];
  private admissionCount: number = 0;
  private paidChallanCount: number = 0;
  private EnrollmentCount: number = 0;
  private feeCount: number = 0;
  private totalCount: number = 0;
  private percentageCountA: number = 0;
  private percentageCountB: number = 0;
  private lastPeriodActual: number = 0;
  private lastPeriodBudgeted: number = 0;
  private heldVsUnheld: boolean = false;
  private approvedVsUnapproved: boolean = false;
  private formcollectionsingle: boolean = false;
  private concessionGraph: boolean = false;
  private revenueGraph: boolean = false;
  private isCoustomize: boolean = false;
  private dashboardwidget: boolean = false;
  private todolist: boolean = false;
  private admissionCountWidget: boolean = false;
  private check: string = "";
  private lat: number = 31.5077596;
  private lon: number = 74.3470055;
  viewCard: boolean = false;
  des = '';
  icon = '';
  curDateTime: TimeObject = {
    year: "2020",
    month: "01",
    day: "01",
    hours: "00",
    minutes: "00",
    seconds: "00"
  };

  curWeather: weatherObject = {
    temp: 0,
    description: ''
  };


  private rolePrivilagesRepo: RolePrevilagesService = null;
  private roleDashboardList: Array<UserRoleDashboardlink> = [];
  private toDoList: Array<TodoList> = [];
  private list: any = [];

  @State((state: IRootStoreState) => state.common.user.authenticated) authenticated: boolean;

  @State((state: IRootStoreState) => state.common.user.displayName) displayName: string;

  @State((state: IRootStoreState) => state.common.isLoading) isLoading: boolean;

  @State((state: IRootStoreState) => state.apiCallContent) apiCallContent: string;

  @State((state: IRootStoreState) => state.common.user.userId) userId: number;

  @State((state: IRootStoreState) => state.sidebarClose) sidebarClose: boolean;

  timeInterval: any = null;

  created() {
    this.timeService = new TimeService();
    this.setNewTime();


    this.admissionRepository = new AdmissionAdmissionFormService(this.$store);
    this.FeeChallanrepository = new FeeStudentChallanService(this.$store);
    this.rolePrivilagesRepo = new RolePrevilagesService(this.$store);
    this.svc = new ContentService(this.$store);

    this.timeInterval = setInterval(this.setNewTime.bind(this), 1000);
    // let onFulfilled = () => this.init = true;

    // this.svc.rikerIpsum()
    //   .then(onFulfilled);
    this.weatherApi();
    this.getLocation();
  }

  setNewTime() {
    this.curDateTime = this.timeService.getCurrentDateTime();
  }

  beforeDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }

  }

  mounted() {

    // this.loadDashboardData();
    setTimeout(() => this.refreshData(), 3000);
    // this.refreshData();
    setTimeout(() => this.loadToDoList(), 3000);
    // this.loadToDoList();
    // this.check = this.percentageCount.toString() + '%';
  }

  loadcheck(key) {
    //  alert(key);
    //  console.log(JSON.stringify(this.roleDashboardList));
    var userDashboadId = this.roleDashboardList.find(e => e.moduleId == key).userDashboadId;

    this.rolePrivilagesRepo.UpdateStatus(userDashboadId)
      .then(response => {
        this.refreshData();

        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Record has been Deleted successfully',
          title: 'Success',
          messageTypeId: PayloadMessageTypes.success
        })


      })

  }

  loadToDoList() {
    // debugger;
    this.toDoList = [];
    this.rolePrivilagesRepo.GetToDoList(this.userId)
      .then(response => {
        this.toDoList = (response as Array<TodoList>)
      });
  }

  checkStatusP(status) {
    if (status) {
      return false;
    }
    else {
      return true;
    }

  }
  checkStatusC(status) {
    if (status) {
      return true;
    }
    else {
      return false;
    }

  }

  insertModel() {
    this.$modal.show('toDoList-add-edit-model', { model: { todoListId: '', userId: this.userId, dated: new Date(), description: '', taskStatus: false, title: '', statusId: 0 }, IsNewRecord: true });
  }

  filterModel(key) {
    var roleDasboardId = this.roleDashboardList.find(e => e.moduleId == key).roleDasboardId;
    this.$modal.show('filter-model', { roleDasboardId: roleDasboardId, userId: this.userId });
  }

  editModel(model: TodoList) {
    this.$modal.show('toDoList-add-edit-model', { model: model, IsNewRecord: false });
  }

  deleteModel(model: TodoList) {
    model.statusId = 0;
    var key = model.todoListId + "?" + model.userId + "?" + model.dated + "?" + model.description + "?" + model.taskStatus + "?" + model.title + "?" + model.statusId;
    this.rolePrivilagesRepo.InsertToDoList(key)
      .then(() => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Record has been Deleted successfully',
          title: 'Deleted',
          messageTypeId: PayloadMessageTypes.warning
        })
        this.loadToDoList();
      });

  }

  updateModel(model: TodoList) {
    var key = model.todoListId + "?" + model.userId + "?" + model.dated + "?" + model.description + "?" + true + "?" + model.title + "?" + model.statusId;
    this.rolePrivilagesRepo.InsertToDoList(key)
      .then(() => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Status Changed to Completed successfully',
          title: 'Completed',
          messageTypeId: PayloadMessageTypes.success
        })
        this.loadToDoList();
      });

  }

  loadDashboardData() {
    this.roleDashboardList = [];
    this.rolePrivilagesRepo.GetAllRoleDashboardEx(this.userId)
      .then(response => {
        this.roleDashboardList = (response as Array<UserRoleDashboardlink>)
        // var StatusId = this.roleDashboardList.filter(e => e.moduleId == 'heldVsUnheld');
        // if (StatusId.length > 0) {
        //   this.heldVsUnheld = true;
        // }
        // else {
        //   this.heldVsUnheld = false;
        // }

        // StatusId = this.roleDashboardList.filter(e => e.moduleId == 'approvedVsUnapproved');
        // if (StatusId.length > 0) {
        //   this.approvedVsUnapproved = true;
        // }
        // else {
        //   this.approvedVsUnapproved = false;
        // }

        // StatusId = this.roleDashboardList.filter(e => e.moduleId == 'form-collection-single');
        // if (StatusId.length > 0) {
        //   this.formcollectionsingle = true;
        // }
        // else {
        //   this.formcollectionsingle = false;
        // }

        // StatusId = this.roleDashboardList.filter(e => e.moduleId == 'concessionGraph');
        // if (StatusId.length > 0) {
        //   this.concessionGraph = true;
        // }
        // else {
        //   this.concessionGraph = false;
        // }

        // StatusId = this.roleDashboardList.filter(e => e.moduleId == 'revenueGraph');
        // if (StatusId.length > 0) {
        //   this.revenueGraph = true;
        // }
        // else {
        //   this.revenueGraph = false;
        // }

        var StatusId = this.roleDashboardList.filter(e => e.moduleId == 'dashboardwidget');
        if (StatusId.length > 0) {
          this.dashboardwidget = true;
        }
        else {
          this.dashboardwidget = false;
        }

        StatusId = this.roleDashboardList.filter(e => e.moduleId == 'todolist');
        if (StatusId.length > 0) {
          this.todolist = true;
        }
        else {
          this.todolist = false;
        }

        StatusId = this.roleDashboardList.filter(e => e.moduleId == 'admissionCountWidget');
        if (StatusId.length > 0) {
          this.admissionCountWidget = true;
        }
        else {
          this.admissionCountWidget = false;
        }


        // this.roleDashboardList.forEach(element => {
        //   if (element.moduleId == 'heldVsUnheld') {
        //     this.heldVsUnheld = true;
        //   }
        //   else {
        //     this.heldVsUnheld = false;
        //   }
        // });
        // this.roleDashboardList.forEach(element => {
        //   if (element.moduleId == 'approvedVsUnapproved') {
        //     this.approvedVsUnapproved = true;
        //   }
        //   else {
        //     this.approvedVsUnapproved = false;
        //   }
        // });
        // this.roleDashboardList.forEach(element => {
        //   if (element.moduleId == 'form-collection-single') {
        //     this.formcollectionsingle = true;
        //   }
        //   else {
        //     this.formcollectionsingle = false;
        //   }
        // });
        // this.roleDashboardList.forEach(element => {
        //   if (element.moduleId == 'concessionGraph') {
        //     this.concessionGraph = true;
        //   }
        //   else {
        //     this.concessionGraph = false;
        //   }
        // });
        // this.roleDashboardList.forEach(element => {
        //   if (element.moduleId == 'revenueGraph') {
        //     this.revenueGraph = true;
        //   }
        //   else {
        //     this.revenueGraph = false;
        //   }
        // });
        // if(this.roleDashboardList.length == 0)
        // {
        //   this.isCoustomize = true;
        // }
        // else

    this.loadAdmissionCount();
    this.loadAdmissionCountFeeWise();
      });
      
  }

  refreshData() {
    this.loadDashboardData();
  }

  loadAdmissionCount() {
    var roleDasboardId = this.roleDashboardList.find(e => e.moduleId == 'admissionCountWidget').roleDasboardId;
    // alert(this.userId + "###" + roleDasboardId)
    var key = this.userId + "?" + roleDasboardId
    this.repository.GetAdmissionCount(key)
        .then(response => this.datas = (response as Array<IAdmissionCount>));
  }
  
  loadAdmissionCountFeeWise() {
    var roleDasboardId = this.roleDashboardList.find(e => e.moduleId == 'admissionCountWidget').roleDasboardId;
    // alert(this.userId + "###" + roleDasboardId)
    var key = this.userId + "?" + roleDasboardId
    this.repository.GetAdmissionCountFeeWise(key)
        .then(response => this.admissionFeeCountList = (response as Array<IAdmissionFeeCount>));
  }
  done: false;


  formatDate(value) {
    return moment(value).format('DD-MMM-YYYY')

  }


  init: Boolean = false;
  $common: ICommonOptions;
  $store: Store<IRootStoreState>;

  get siteLogoAlt() {
    return this.$t('dict.logo');
  }

  //TO do code
  // private toDoList = ['one', 'two'];
  // listItem = ''

  insertToList() {
    // this.toDoList.push(this.listItem);
  }

  openDashboardWidget() {
    this.$emit('toggleDashboardWidget', true);
  }

  close() {
    this.$emit('toggleDashboardWidget', false);
    this.refreshData();
  }

  getLocation() {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          // this.geolocationPosition = position,
          console.log(position)
          console.log(position.coords.latitude)
          console.log(position.coords.longitude)
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
          this.weatherApi();

        },
        error => {
          switch (error.code) {
            case 1:
              console.log('Permission Denied');
              break;
            case 2:
              console.log('Position Unavailable');
              break;
            case 3:
              console.log('Timeout');
              break;
          }
        }
      );
    };
  }

  weatherApi() {



    const weatherCall = Axios.create({
      withCredentials: false,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'x-www-form-urlencoded',
      }
    }
    );

    weatherCall
      .get('https://api.openweathermap.org/data/2.5/weather?lat=' + this.lat + '&lon=' + this.lon + '&units=metric&appid=0823d130c340b02d3e17e60b0529e76e')
      .then((response) => {
        if (response.status >= 200 && response.status <= 300) {
          this.curWeather = {
            temp: Math.round(response.data.main.temp),
            description: response.data.weather[0].description
          }
          this.icon = this.icon =
            "https://openweathermap.org/img/wn/" +
            response.data.weather[0].icon +
            "@2x.png";
        }
      });
  }

}


