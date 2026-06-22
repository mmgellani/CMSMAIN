import { AdmissionAdmissionFormService, AdmissionStudentsService, SetupGenderService, SetupDegreeService, SetupGroupService } from '../../../../service';
import { IElUsersModel, KinshipConcession, OnlineAdmissionUpdData, IAcademicInfo } from '../../../../models/Admission/AdmissionForm';

import Component from 'vue-class-component';
import { IAdmissionStudents, IAdmissionformList, IAcademicInfoss, ISetupGender, ISetupDegree, ISetupGroup } from '../../../../models';
import { MigrationService } from '../../../../service/Migration/migration-service';
import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import axios from "axios";

import { timeStamp } from 'console';
import { trimCharsStart } from 'lodash/fp';

/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/








export interface studentPasswordInfo {
  refferenceNo: string;
  rollNo: string;
  password: string;
  studentid: string;
  fullName: string;


}

@Component({
  name: 'delete-modal',
  template: require('./index.html')
})


export class ElUpdation extends Vue {
  imageList = [
    {
      name: "Father's CNIC"
    },
    {
      name: "Students's CNIC"
    },
    {
      name: "Picture"
    },
    {
      name: "Result card"
    },
  ]
  documentArray: any[] = [
    {
      value: 'img0',
      name: 'Father\'s\ CNIC'
    },
    {
      value: 'img1',
      name: 'Student\'s\ CNIC'
    },
    {
      value: 'img2',
      name: 'Photograph'
    },
    {
      value: 'img3',
      name: 'Result Card'
    },
  ]

  // placeholder = require('~assets/images/placeholder.png').default;
  currIndex: number = 0;


  private repository: AdmissionStudentsService;
  private addrep: AdmissionAdmissionFormService;
  private genderrepo: SetupGenderService = new SetupGenderService(this.$store);
  private degreerepo: SetupDegreeService = new SetupDegreeService(this.$store);
  private picresp1: any = [];
  private picresp2: any = [];
  private picresp3: any = [];
  private picresp4: any = [];

  private grouprepo: SetupGroupService = new SetupGroupService(this.$store);

  private name = '';
  private campusprogramid = '';
  private referenceno = '';
  private classid = '';
  private list: Array<KinshipConcession> = [];
  private studentlist: Array<OnlineAdmissionUpdData> = [];
  private fathername = '';
  private scholarshipid = '';
  private rollno = '';
  private username = '';
  private address = '';
  Genderlist: Array<ISetupGender> = [];
  Degreelist: Array<ISetupDegree> = [];
  private imageurl: string = "";
  doctype = '';

  Grouplist: Array<ISetupGroup> = [];

  batch = [{ item: 1, show: 'Batch 1' }, { item: 2, show: 'Batch 2' }, { item: 3, show: 'Batch 3' }, { item: 4, show: 'Batch 4' }, { item: 5, show: 'Batch 5' }]


  private title: string = ' Update Record';


  private academicdata: IAcademicInfoss = {
    degreeId: '',
    groupId: '',
    institute: '',
    board: '',
    rollNo: '',
    year: '',
    obtainMarks: 0,
    totalMarks: 0
  }
  checkcountimg: number = 0;
  degreelist() {

    this.degreerepo.GetFindBy('e=>e.StatusId==1').then(r => {
      this.Degreelist = r as Array<ISetupDegree>

    }
    )
  }
  genderlist() {

    this.genderrepo.GetFindBy('e=>e.StatusId==1').then(r => {
      this.Genderlist = r as Array<ISetupGender>

    }
    )
  }
  imagePreview='';
  preview(item){
    this.imagePreview = item;
  }

  imagedownload(item)
  {
   
    var a = document.createElement("a"); //Create <a>
    a.href = "data:image/png;base64," + item; //Image Base64 Goes here
    a.download = "Image.png"; //File name Here
    a.click();

  }

  grouplist() {

    this.grouprepo.GetFindBy('e=>e.StatusId==1').then(r => {
      this.Grouplist = r as Array<ISetupGroup>

    }
    )
  }
  imageListResonse: any = []






  private data: IAdmissionformList = {
    subcity: '',
    programdetailid: '',
    genderid: '',
    year: '',
    percentage: 0,
    dob: new Date(),
    fullname: '',
    fathername: '',
    studentcnic: '',
    parentcnic: '',
    email: '',
    studentcontactno: '',
    parentcontactno: '+92',
    guardian: '',
    address: '',
    academicinfo: '',
    boardregistrationno: '',
    flag: '',
    degreeid: '',
    mail: '',
    refferenceNo: ''
  }





  created() {
    this.repository = new AdmissionStudentsService(this.$store);
    this.addrep = new AdmissionAdmissionFormService(this.$store);
  }

  beforeModalOpen(event) {
    this.imageListResonse=[];
    this.genderlist();
    this.grouplist();
    this.degreelist();
    this.studentlist = [];
    this.referenceno = event.params.REFFERENE;
    this.repository.GetAdmissionData(this.referenceno).then(r => {
      this.studentlist = r as Array<OnlineAdmissionUpdData>
      if (this.studentlist) {

        this.data.subcity = this.studentlist[0].city
        this.data.programdetailid = this.studentlist[0].program
        this.data.genderid = this.studentlist[0].gender
        this.data.year = this.studentlist[0].year
        this.data.dob = this.studentlist[0].dateOfBirth
        this.data.fullname = this.studentlist[0].studentName
        this.data.fathername = this.studentlist[0].fatherName
        this.data.parentcnic = this.studentlist[0].parentCNIC
        this.data.studentcnic = this.studentlist[0].parentCNIC
        this.data.email = this.studentlist[0].email
        this.data.studentcontactno = this.studentlist[0].studentNo
        this.data.parentcontactno = this.studentlist[0].parentNo
        this.data.refferenceNo = this.studentlist[0].refferenceNo
        this.address = this.studentlist[0].address

        this.academicdata.degreeId = this.studentlist[0].degreeId
        this.academicdata.groupId = this.studentlist[0].groupId
        this.academicdata.institute = this.studentlist[0].institution
        this.academicdata.board = this.studentlist[0].board
        this.academicdata.rollNo = this.studentlist[0].boardRollNo
        this.academicdata.year = this.studentlist[0].year
        this.academicdata.obtainMarks = this.studentlist[0].obtained
        this.academicdata.totalMarks = this.studentlist[0].total
      }
      this.documentArray.forEach(element => {
        // this.GetImagePathEx(element.value)
        console.log(element.value)
        //this.referenceno = 'RLHRFSCMM2039077';
        var key = this.referenceno + '?' + element.value
        axios.post("https://ems.cms.edu.pk/api/OnlineAdmission/imagepath", { ProvidedString: key })
          .then(r => {

            // setTimeout(() => this.renderex(r, option), 1000);
            //  setTimeout(() => this.decision(r), 1000);
           
            this.imageListResonse.push(r.data);
            console.log('Response = ' + JSON.stringify(this.imageListResonse))

          })
      });
      // this.GetAllimages();
    })
  }

  GetImagePathEx(option) {

    this.doctype = option
    this.imageurl = "";
    //this.referenceno = 'RLHRFSCMM2039060';
    var key = this.referenceno + '?' + this.doctype


    axios.post("https://ems.cms.edu.pk/api/OnlineAdmission/imagepath", { ProvidedString: key })
      .then(r => {

        // setTimeout(() => this.renderex(r, option), 1000);
        //  setTimeout(() => this.decision(r), 1000);
        console.log('Response = ' + JSON.stringify(r))
        this.imageListResonse = r;

      })
      .catch(e => {

      });
  }



  GetAllimages() {
    // debugger
    // alert('hel')

    setTimeout(() => this.finaldest(), 500);
    // this.finaldest()
    console.log(this.picresp1.data)

  }
  finaldest() {
    
    this.checkcountimg = 0;

    const userImage1 = document.getElementById('preview0') as HTMLImageElement;
    userImage1.src = 'data:image/gif;base64,' + this.picresp1.data;

    console.log('path' + userImage1)
    // if (this.picresp1.data.length > 0) {
    //   this.checkcountimg++
    // }

    // const userImage = document.getElementById('preview1') as HTMLImageElement;
    // userImage.src = this.picresp2.data ? ('data:image/gif;base64,' + this.picresp2.data) : this.placeholder;
    // if (this.picresp2.data.length > 0) {
    //   this.checkcountimg++
    // }

    // const userImage2 = document.getElementById('preview2') as HTMLImageElement;
    // userImage2.src = this.picresp3.data ? ('data:image/gif;base64,' + this.picresp3.data) : this.placeholder;
    // if (this.picresp3.data.length > 0) {
    //   this.checkcountimg++
    // }

    // const userImage4 = document.getElementById('preview3') as HTMLImageElement;
    // userImage4.src = this.picresp4.data ? ('data:image/gif;base64,' + this.picresp4.data) : this.placeholder;
    // if (this.picresp4.data.length > 0) {
    //   this.checkcountimg++
    // }

  }




  renderex(r, option) {

    if (option == 'img0') {
      this.picresp1 = r;
    }
    else if (option == 'img1') {
      this.picresp2 = r;
    }
    else if (option == 'img2') {
      this.picresp3 = r;
    }
    else if (option == 'img3') {
      this.picresp4 = r;
    }

  }



  Getgender() {
    if (this.data.genderid.length > 0) {
      return this.Genderlist.find(e => e.genderId == this.data.genderid).description

    }
  }
  GetDegree() {
    if (this.academicdata.degreeId.length > 0) {
      return this.Degreelist.find(e => e.degreeId == this.academicdata.degreeId).fullName

    }
  }

  Getgroup() {

    if (this.academicdata.groupId == '00000000-0000-0000-0000-000000000000' || this.academicdata.groupId == 'Null') {
      return 'Null'
    }
    else {
      if (this.academicdata.groupId.length > 0) {
        return this.Grouplist.find(e => e.groupId == this.academicdata.groupId).fullName

      }
    }
  }

  cancel() {
    this.$modal.hide('el-model');
    this.imagePreview = ''

  }




}