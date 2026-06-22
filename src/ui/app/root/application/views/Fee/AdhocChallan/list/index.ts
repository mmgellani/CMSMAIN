/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { DDLGroupModel, DDLModel, ICampusCityVM, IFeeCampusBankAccountVM, IFeeCampusBankLink, IFeeCampusBankVM, ISetupCampus, ISetupCampusProgramVM, ISetupSession,IFeeHead,GetAdhocChallanList,IHumanResourceStaff } from '../../../../models';
import { FeeCampusBankLinkService, SetupCampusProgramLinkService, SetupCampusService, SetupSessionService,FeeStudentFeeStructureService,FeeStudentChallanService,HumanResourceStaffService } from '../../../../service';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { AdhocChallanAddEdit } from '../add-edit';
import { AdhocChallanDelete } from '../delete';
import { IRootStoreState,RootStoreTypes } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from "../../../../../../store";
import Vue from 'vue';
 


@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': AdhocChallanAddEdit,
        'delete-model': AdhocChallanDelete
    }
})

export class AdhocChallanLinkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeStudentChallanService;
    private repo1:FeeStudentFeeStructureService;
    // private data: Array<IFeeCampusBankVM> = [];
    private data: Array<GetAdhocChallanList> = [];
    private staffList: IHumanResourceStaff[] = []
    private repoStaff: HumanResourceStaffService = new HumanResourceStaffService(this.$store)

    // private datas: Array<IFeeCampusBankVM> = [];
    private datas: Array<IFeeCampusBankAccountVM> = [];

    private filterString: string = '';
    isLoadingStaff = false;
    hideSpner = true;

    private campusId = '';
        private staffId = '';

    private sessionId = "";
    private feeHeadId='';
        private cityId = "";
    private programDetailId = '';

    private campusList: Array<ISetupCampus> = []
    private campusCityList: Array<ICampusCityVM> = []
    private ddl: Array<DDLModel> = [];
    private programDDL: Array<DDLGroupModel> = [];

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    private feeHeadList: Array<IFeeHead> = [];
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];


    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(
        this.$store
    );
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
        this.$store
    );
    private Staffrepo: HumanResourceStaffService;

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    CityId = '';

    private columns = [
        //  { key: 'campusName', caption: 'Campus' },
       
        { key: 'challanNo', caption: "Challan No" },
        { key: 'staffName', caption: "Staff Name" },
        { key: 'email', caption: 'Email' ,width: 200 },
        { key: 'feeHead', caption: "Fee Head" },
        { key: 'feeAmount', caption: 'Amount' },
          {key:'dueDate',caption:'Due Date',sort: true,width: 100},
         {key:'status',caption:'Status',sort: true},
        { key: 'action', caption: 'Action', width: 200 }
    ];

    created() {
        this.repository = new FeeStudentChallanService(this.$store);
        this.repo1=new FeeStudentFeeStructureService(this.$store);
                this.Staffrepo = new HumanResourceStaffService(this.$store);

        this.loadCityCampus();
        this.GetFeeHead();
    }
    GetFeeHead() {
        this.repo1.GetFeeHeadId().then(r => {
            this.feeHeadList = r as Array<IFeeHead>;
            console.log('values',this.feeHeadList)
        });
    }

    mounted() {
        this.validatePage();
        // this.refreshData();
    }
    loadCityCampus() {
      
            this.campusddl = [];
            this.cityDDL = [];
            let oldObj: ICampusCityVM;
            this.campusRepo.GetCityVM().then(r => {
                this.campusCityList = r as Array<ICampusCityVM>;
            });
            
       
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('adhocChallanLink' in this.user.claims) == true) {
                if (this.user.claims['adhocChallanLink'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['adhocChallanLink'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['adhocChallanLink'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['adhocChallanLink'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }


    refreshData() {
        debugger;
            // this.data = [];
            if(this.campusId.length>0){
           this.repo1.GetAdhocChallanList(this.campusId).then((response) => {
            let result = response as Array<GetAdhocChallanList>;
debugger;

                if (this.staffId.length > 0) {
                result = result.filter(e => e.staffId === this.staffId);
            }
            // Apply feeHeadId filter if selected
            if (this.feeHeadId.length > 0) {
                result = result.filter(e => e.feeHeadId === this.feeHeadId);
            }



            this.data = result;
        });
    }
       
    }

 loadStaff(campusid) {
    debugger;
    this.isLoadingStaff = true;
    this.hideSpner = true;
    this.staffList = [];
    this.staffId = '';      // Reset selected staff
    this.feeHeadId = '';  

    if (this.campusId.length > 0) {
 const campus = this.campusCityList.find(
    e => e.campusId === this.campusId
  );

  if (campus) {
    var cityId = campus.cityId;
  }    debugger;


         this.Staffrepo.GetStaff(cityId).then(res => {
            this.staffList = res as Array<IHumanResourceStaff>
            this.staffList.forEach(element => {
                element.fullName = element.fullName + ' - ' + element.email
            });

        })
         .then(() => {
                // always run
                
                                this.refreshData();

            })
        // this.repoStaff.GetStaffByCampus(this.campusId)
        //     .then(r => {
        //         this.staffList = r as IHumanResourceStaff[];
        //     })
        //     .then(() => {
        //         // always run
                
        //                         this.refreshData();

        //     })
            .catch(() => {
                // run on error
                this.isLoadingStaff = false;
                this.hideSpner = false;
            });
    }
}


PrintAdhocChallan(challanNo,challanTypeId) {
 
    // console.log(refferenceNo)
  console.log('this.data',challanTypeId)
// this.data[0].challanTypeId
    var key = challanNo +'?'+challanTypeId+'?'+this.user.email
    this.repository.AdhocChallanEx(key).then(response => {
      var arr = response as any
               if (arr.length > 0) {
                // alert(JSON.stringify(r[0].general.campusName))
               
                  // alert('else')
                  this.$store.dispatch(RootStoreTypes.reportOperation, {
                    data: arr as any,
                    path: '/assets/Reports/Resource/Admission/AdhocChallan.xml',
                    show: true
                  });
                
              } else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                  text: 'No record Found',
                  title: 'Failed',
                  messageTypeId: PayloadMessageTypes.warning
                });
              }
    });
  }
    insertModel() {
       
        if (this.campusId.length >0 && this.staffId.length >0)  {
                    debugger;

            //this.$modal.show('add-edit-model');
             this.$modal.show('add-edit-model', { model: {campusid: this.campusId,staffid:this.staffId,feeHeadId: this.feeHeadId},userId:this.user.userId,IsNewRecord: true,staffid:this.staffId,feeHeadId: this.feeHeadId});
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdowns",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }


    }

    editModel(model: GetAdhocChallanList) {
        
        this.$modal.show('add-edit-model', { model: model, feeHeadId: this.feeHeadId, IsNewRecord: false, campusid: this.campusId,userId:this.user.userId});
    }

    deleteModel(model: GetAdhocChallanList) {
        this.$modal.show('delete-model', { model: model });
    }
}