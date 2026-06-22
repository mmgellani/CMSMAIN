/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';
import { SetupCampusService, SetupSessionService, SetupProgramDetailsService, SetupClassService, SetupCampusProgramLinkService, RegistrationSectionCourseLinkService, SetupSectionService, SetupSubCityService, SetupCityService, HumanResourceStaffService, RegistrationCourseService, RegistrationProgramCourseLinkService, TimeTableTimeTableService } from '../../../../service';
import { ISetupSession, ISetupCampus, ISetupProgramDetails, ISetupClass, ISetupSection, IRegistrationSectionCourseLinkVM, ISetupCampusProgramVM, DDLGroupModel, DDLModel, ICampusCityVM, ISetupCity, ISetupSubCity, StaffHODData, IRegistrationCourse, IRegistrationProgramCourseLink, RegistrationProgramCourseLinkVM } from '../../../../models';
import { StaffRecord } from '../staffrecord';
import { StoreTypes } from '../../../../../../store';





@Component({
  name: 'models-form-list',
  template: require('./index.html'),
  components: {
    'staff-record': StaffRecord

  }
})

export class SectionIncharge extends Vue {

  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private Campusrepository: SetupCampusService = null;
  private Sessionrepository: SetupSessionService = null;
  private ProgramDetailRepository: SetupProgramDetailsService = null;

  private ClassRepository: SetupClassService = null;
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );

  private SectionCourserepository: RegistrationSectionCourseLinkService;
  private programCourserepository: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store);

  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);



  private SubcityRepo: SetupSubCityService = null;

  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];

  private Staffhodlist: Array<StaffHODData> = [];



  CheckAllRec: boolean = false;
  fromDate: Date = new Date();
  ToDate: Date = new Date();

  private sessionList: Array<ISetupSession> = [];
  private campusList: Array<ISetupCampus> = [];
  private programdetailList: Array<ISetupProgramDetails> = [];
  private classList: Array<ISetupClass> = [];
  private modelSection: Array<ISetupSection> = [];
  private sectionService: SetupSectionService;
  private staffService: HumanResourceStaffService = null;
  private timetableService: TimeTableTimeTableService = null;
  private courseService: RegistrationCourseService = new RegistrationCourseService(this.$store);
  Addmore: boolean = true;

  private filterString: string = "";
  private courseid: string = "";
  sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];
  private cityRepo: SetupCityService = new SetupCityService(this.$store)
  private subCityRepo: SetupSubCityService = new SetupSubCityService(this.$store)

  private programDDL: Array<DDLGroupModel> = [];
  private cityList: Array<ISetupCity> = []
  private subCityList: Array<ISetupSubCity> = []

  private subCityId = '';
  cityId = '';
  private ddl: Array<DDLModel> = [];

  private campusCityList: Array<ICampusCityVM> = [];

  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];
  private courseList: Array<RegistrationProgramCourseLinkVM> = [];


  private campusid: string = "";
  private sessionid: string = "";
  private programdetailid: string = "";
  private classid: string = "";
  private campusProgramId: string = "";
  private sectionid: string = "";
  private reportData: any = [];
  private report: String = "";
  sectionCourseLinkId: String = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;


  private columns = [
    { key: 'fullName', caption: 'Full Name' },
    { key: 'email', caption: 'Email' },
    { key: 'action', caption: 'Action', width: 120 }


  ];




  created() {

    this.Campusrepository = new SetupCampusService(this.$store);
    this.Sessionrepository = new SetupSessionService(this.$store);
    this.ProgramDetailRepository = new SetupProgramDetailsService(this.$store);
    this.ClassRepository = new SetupClassService(this.$store);
    this.sectionService = new SetupSectionService(this.$store);
    this.SubcityRepo = new SetupSubCityService(this.$store);
    this.staffService = new HumanResourceStaffService(this.$store);
    this.timetableService = new TimeTableTimeTableService(this.$store);
    this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
  }

  mounted() {

    this.loadSession();
    this.loadCityCampus();
    this.loadSection();
    this.loadCity();
    this.loadClass();

  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("Sectionincharge" in this.user.claims == true) {
        if (this.user.claims["Sectionincharge"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["Sectionincharge"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["Sectionincharge"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["Sectionincharge"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }


  loadCityCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetCityVM().then(r => {
      this.campusCityList = r as Array<ICampusCityVM>;
    });
  }

  loadCourse() {
    this.programdetailid = this.campusProgramLinkList.find(e => e.sessionId == this.sessionid && e.campusId == this.campusid && e.campusProgramId == this.campusProgramId).programDetailId;

    if (this.programdetailid.length > 0 && this.classid.length > 0) {
      var key = this.programdetailid + '?' + this.classid;
      this.programCourserepository.GetAllFilterData(key).then(r => {
        this.courseList = r as Array<RegistrationProgramCourseLinkVM>
      })
    }
  }

  loadProgramsOfCampus() {
    this.ddl = [];
    this.programDDL = [];
    let oldObj: ISetupCampusProgramVM;
    var key = this.sessionid + "?" + this.campusid;
    this.campusProgramLinkRepo.GetAllVM(key).then(r => {
      this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
      this.sectionCourseLinkList = [];
    });
  }
  loadCity() {
    this.cityRepo.GetAll()
      .then(r => {
        this.cityList = r as Array<ISetupCity>

      })
  }
  loadSubCity() {

    this.subCityRepo.GetFindBy('e=>e.CityId.ToString()=="' + this.cityId + '"')
      .then(r => {
        this.subCityList = r as Array<ISetupSubCity>
      })

  }


  loadSession() {
    this.Sessionrepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }


  loadSection() {
    this.sectionService.GetFindBy("e=>e.StatusId==1").then(r => {
      this.modelSection = r as Array<ISetupSection>;
    });
  }

  loadCampus() {
    this.Campusrepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.campusList = r as Array<ISetupCampus>;
    });
  }

  loadprogramdetails() {
    this.ProgramDetailRepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.programdetailList = r as Array<ISetupProgramDetails>;
    });
  }



  loadClass() {

    this.ClassRepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.classList = r as Array<ISetupClass>;
    });


  }

  loadProgramSection() {
    if (this.campusid.length > 0 && this.campusProgramId.length > 0 && this.classid.length > 0) {
      this.SectionCourserepository.GetSectionData(this.campusid + `?` + this.campusProgramId + `?` + this.classid)
        .then(response => {
          this.sectionCourseLinkList = response as Array<IRegistrationSectionCourseLinkVM>
        });
    }
  }

  insertModel() {
    if (this.sessionid.length > 0 && this.campusid.length > 0 && this.campusProgramId.length > 0 && this.classid.length > 0 && this.sectionCourseLinkId.length > 0) {
      this.programdetailid = this.campusProgramLinkList.find(e => e.sessionId == this.sessionid && e.campusId == this.campusid && e.campusProgramId == this.campusProgramId).programDetailId;
      this.$modal.show('staff-rec', { PROGRAMDETAIL: this.programdetailid, CAMPUSPROGRAMID: this.campusProgramId, COURSEID: this.sectionCourseLinkId, CLASSID: this.classid });
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select the Dropdowns",
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error
      });
    }


  }

  deleteModel(option) {

    var response = confirm('Are you sure to delete ')
    if (response) {
      this.timetableService.DeleteSectionInchargeData(option.ide).then(r => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: r,
          title: 'Success',
          messageTypeId: PayloadMessageTypes.error
        })

        this.GetSectionList();


      })
    }
  }

  GetSectionList() {
    this.Addmore = true;
    this.programdetailid = this.campusProgramLinkList.find(e => e.sessionId == this.sessionid && e.campusId == this.campusid && e.campusProgramId == this.campusProgramId).programDetailId;


    this.timetableService.GetSectionData(this.sectionCourseLinkId.toString()).then(r => {

      this.Staffhodlist = r as Array<StaffHODData>
      if (this.Staffhodlist.length > 0)

        this.Addmore = false;




    })


  }



}