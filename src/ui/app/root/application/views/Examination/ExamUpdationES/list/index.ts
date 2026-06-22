/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { AdmissionStudentsService, ExaminationExamTypeService, SetupClassService ,AttendanceAttendenceStatusService} from '../../../../service';
import { ExamUpdList, IAdmissionAdmissionFormCplVM, IAdmissionStudents,IAttendanceAttendenceStatus, IAdmissionStudentsImage, IExaminationExamType, ISetupClass, IVWAdmissionFormCpl3, IVWStudentFeeProfile, IVWStudentsProfile, StudentsProfileCon } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import { HighlightSpanKind } from 'typescript';
import moment from 'moment'
// import { AdmissionStudentsAddEdit } from '../add-edit';
// import { AdmissionStudentsDelete } from '../delete';

// import { AdmissionStudentEdit } from '../edit-student';

@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': AdmissionStudentsAddEdit,
    //     'edit-model': AdmissionStudentEdit
    // }
})

export class ExamUpdationListES extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(this.$store)

    private repository: AdmissionStudentsService;
    private repo: ExaminationExamTypeService = new ExaminationExamTypeService(this.$store)
    private classrepository: SetupClassService;
    examtypelist = [];
    courselist = [];
    private data: Array<IAdmissionStudents> = [];
    private datas: Array<IVWStudentFeeProfile> = [];
    private filterString: string = '';
    private admissionFormId: string = "";
    private classlist: Array<ISetupClass> = [];
    private classid: string = ''
    Hide = false;
    private finallist = [];
    private date: Date = new Date();
    datestring = '';
    cousreName = '';
private errormessage: boolean = false;
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    examtyeid = '';
    private installmentNo = 1;
    private attendanceStatusList: Array<IAttendanceAttendenceStatus> = []
    private presentStatusId = '';

    private studentRecord: Array<ExamUpdList> = [];
    private TempstudentRecord: Array<ExamUpdList> = [];
    private Tempstudent2Record: Array<ExamUpdList> = [];
   
    private idd : number = null;

    private AssExType: Array<object> = [
        { idd: 0, text: 'Assessment' },
        { idd: 1, text: 'Examination' }
    ];

    private saveStudentRecord: Array<StudentsProfileCon> = [];
    private reposstudent: AdmissionStudentsService;
    private columns = [
        { key: 'examTypeName', caption: 'ExamType' },
        { key: 'month', caption: "Month" },
        { key: 'fullName', caption: "Course" },
        { key: 'attendanceStatusId', caption: 'Attendance' },

        { key: 'total', caption: "TotalMarks" },
        { key: 'obtained', caption: "Obtained" },
        { key: 'checked', caption: "Select All" }
    ];

    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }];

    created() {

        this.repository = new AdmissionStudentsService(this.$store);
        this.reposstudent = new AdmissionStudentsService(this.$store);
        this.classrepository = new SetupClassService(this.$store);
        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2);
        console.log(moment(this.datestring).format("MMMM"))
        this.loadAttendanceStatus();

        
        if (this.TempstudentRecord && this.TempstudentRecord.length > 0) {
            this.TempstudentRecord.forEach(item => {
                this.loaddata(item);
            });
        }
        // this.repo.GetFindBy('e=>e.StatusId==1').then(r => {
        //     this.examtypelist = r as Array<IExaminationExamType>
        // })
    }

    loaddata(item: any){
        
        debugger;
        this.$set(item, "attendanceStatusId", item.attendanceStatusId);
        if (this.TempstudentRecord.find(s => s.attendanceStatusId == item.attendanceStatusId).attendance.toLowerCase().startsWith('pre')) {
            item.isMarksDisabled = false; 
        }
        else {
            item.obtained = 0;
            item.isMarksDisabled = true;
        }
    
}
    validateMarks(row) {
        if (row.obtained > row.total) {
         // row.error = "Obtained marks cannot exceed total marks.";
         // row.obtained = row.total; // Reset obtained marks to max allowed
          this.errormessage=true
        } else if (row.obtained < 0) {
          row.error = "Marks cannot be negative";
          this.errormessage=false
          row.obtained = 0; // Reset to zero if negative
        } else {
          row.error = "";
          this.errormessage=false

        }

        this.errormessage = this.TempstudentRecord.some(student => student.obtained > student.total && student.checked);
        // this.TempstudentRecord.forEach(record => {
        //     if (record.obtained > record.total) {
        //         this.errormessage = true; // Set error message if obtained marks exceed total
        //     }

        //     else
        //     {
        //         this.errormessage = false
        //     }
        // });
        // this.errormessage=false
      }

    loadAttendanceStatus() {
        this.attendanceStatusRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.attendanceStatusList = r as Array<IAttendanceAttendenceStatus>
                this.presentStatusId = this.attendanceStatusList.find(s => s.code.toLowerCase() == "p").attendenceStatusId;
            });
    }
    GetClass() {
        this.classrepository.GetFindBy('e=>e.StatusId==1').then(r => {
            this.classlist = r as Array<ISetupClass>

        })


    }

    // checklength() {

    //     return this.studentRecord.filter(e => e.checked ).length;
       
    // }

    checklength() { 
        let checkedCount = this.studentRecord.filter(e => e.checked).length;

        // Check if any checked student has obtainedMarks greater than totalMarks
        let hasError = this.studentRecord.some(e => e.checked && e.obtained  > e.total);
        
        // Set the error message accordingly
        this.errormessage = hasError;
        
        return checkedCount;
    }

   
    
    checks(item: any) {
        debugger;
        this.$set(item, "attendanceStatusId", item.attendanceStatusId);
        if (this.attendanceStatusList.find(s => s.attendenceStatusId == item.attendanceStatusId).fullName.toLowerCase().startsWith('pre')) {
            item.isMarksDisabled = false; 
        }
        else {
            item.obtained = 0;
            item.isMarksDisabled = true;
        }
        this.TempstudentRecord.forEach(record => {
            if (record.obtained > record.total && record.checked) {
                this.errormessage = true; // Set error message if obtained marks exceed total
            }

            else
            {
                this.errormessage = false
            }
        });
    }
    save() {
        debugger;
        let smsid = '';
        this.finallist = [];

        this.TempstudentRecord.forEach(element => {
            if (element.checked == true) {
                this.finallist.push(element)



            }
            smsid += `''` + element.examMasterId + `'',`

        });

        smsid = smsid.substring(1, smsid.length - 2);




        var admissionFormId = this.finallist[0].admissionFormId;
        this.repo.UpdateExamData(JSON.stringify(this.finallist) + '?' + smsid + '?' + admissionFormId).then(r => {

            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: r,
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });



        })



    }
    mounted() {
        this.validatePage();
        this.GetClass();
        if (this.TempstudentRecord && this.TempstudentRecord.length > 0) {
            this.TempstudentRecord.forEach(item => {
                this.loaddata(item);
            });
        }
    }
    private examScheduleName = ""
    refereshdata()
    {

        debugger;
        this.TempstudentRecord.forEach(item => {
            item.obtained = null; // Clear input fields
          });
          this.getstudent();
          this.errormessage=false;

    }
    ReloadData() {
        debugger;
        if (this.TempstudentRecord && this.TempstudentRecord.length > 0) {
            this.TempstudentRecord.forEach(item => {
                this.loaddata(item);
            });
        }
      
this.Tempstudent2Record= [];

       // this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2);



        if (this.Hide == false) {
            this.TempstudentRecord = this.studentRecord.filter(e => e.examTypeName == this.examScheduleName)

        }
        if (this.Hide == true) {
            this.TempstudentRecord = this.studentRecord.filter(e => e.examTypeName == this.examScheduleName && e.fullName == this.cousreName)

        }








    }
    datapassing() {
        debugger;
        if (this.errormessage)
        {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Obtained marks cannot exceed total marks.',
                title: '',
                messageTypeId: PayloadMessageTypes.error
              });


            
            return;
        }

        
        this.Tempstudent2Record = [];
    
        this.TempstudentRecord.forEach(element => {
            if (element.checked) {
                // Find the matching attendance status
                let status = this.attendanceStatusList.find(s => s.attendenceStatusId === element.attendanceStatusId);
                if (status) {
                    // Update the attendance name based on the selected ID
                    this.$set(element, "attendance", status.fullName);
                }
                // Push the updated element into the list
                this.Tempstudent2Record.push(element);
            }
        });
    }
    // datapassing() {
    //     debugger;
    //     this.Tempstudent2Record = [];
    //     this.TempstudentRecord.forEach(element => {
    //         if (element.checked == true) {
    //             this.Tempstudent2Record.push(element)



    //         }


    //     });

    // }

    getstudent() {
        debugger;
        this.courselist = [];
        this.studentRecord = [];
        if(this.filterString.length > 0 && (this.idd == 0 || this.idd == 1))
        {
        if(this.idd == 0){
            var key = this.filterString +"?Assessment"
        }
        else{
            var key = this.filterString +"?Exam"
        }
       
        this.reposstudent.GetStudentsExamUpdESNew(key)
            .then(response => {
                this.studentRecord = response as Array<ExamUpdList>
                if (this.studentRecord.length == 0) {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'No Record found',
                        title: "Success",
                        messageTypeId: PayloadMessageTypes.error
                    });





                }
                else {
                    this.studentRecord.forEach(element => {

                        // element.attendance!=='pre' .toLowerCase().startsWith('pre')) {
                        //     item.obtained = 0;
                        //     item.isMarksDisabled = true;
                        // }
                        
                        // if (this.examtypelist.length > 0) {
                        //     if (this.examtypelist.filter(e => e.examTypeId == element.examTypeId).length == 0)
                        //         this.examtypelist.push({
                        //             "examTypeId": element.examTypeId,
                        //             "fullName": element.examTypeName
                        //         }
                        //         )

                        // }
                        // else {
                        //     this.examtypelist.push({
                        //         "examTypeId": element.examTypeId,
                        //         "fullName": element.examType
                        //     }
                        //     )


                        // }
                        if (this.courselist.length > 0) {
                            if (this.courselist.filter(e => e.courseName == element.fullName).length == 0)
                                this.courselist.push({
                                    "courseName": element.fullName

                                }
                                )

                        }
                        else {
                            this.courselist.push({
                                "courseName": element.fullName

                            }
                            )


                        }


                    });



                }
                this.PopulateExamType();

            });
        }
    }
    getAddress(item) {
        var j = '';
        j.toLowerCase().startsWith('error')
        var k = JSON.parse(item);

        return k;

    }

    editStudent(model: StudentsProfileCon) {
        //this.$modal.show('edit-model', { model: model, IsNewRecord: false});
        // var response = confirm('Are you sure to reverse concession?')
        // if (response) {
        var key = model.admissionFormId + '?' + model.challanTypeId + '?' + this.installmentNo + '?' + this.classid;
        this.reposstudent.ReverseConcession(key).then(r => {
            // alert(JSON.stringify(r))
            if (r[0].providedString.toLowerCase().startsWith('error')) {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: r[0].providedString,
                    title: "Error",
                    messageTypeId: PayloadMessageTypes.error
                });
            }
            else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: r[0].providedString,
                    title: "Success",
                    messageTypeId: PayloadMessageTypes.success
                });
            }


        })
        // }
    }
    PopulateExamType() {
        this.examtypelist = [];
       // this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2);
        //moment().month(new Date(this.datestring), "MMMM");
       // console.log(moment(this.datestring).format("MMMM"))
        this.studentRecord.forEach(element => {
            //if (element.month == moment(this.datestring).format("MMMM")) {
                if (this.examtypelist.length > 0) {
                    if (this.examtypelist.filter(e => e.fullName == element.examTypeName).length == 0)
                        this.examtypelist.push({
                            "examTypeId": element.examTypeId,
                            "fullName": element.examTypeName
                        }
                        )

                }
                else {
                    console.log(this.examtypelist.filter(s => s.fullName == element.examTypeName).length)
                    if (this.examtypelist.filter(s => s.fullName == element.examTypeName).length == 0) {
                        this.examtypelist.push({
                            "examTypeId": element.examTypeId,
                            "fullName": element.examTypeName
                        }
                        )
                    }



                }



           // }

        });


    }
    saveModal(list) {
        this.saveStudentRecord = [];
        this.saveStudentRecord = list;
        // alert(JSON.stringify(this.saveStudentRecord))
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('examUpdationListES' in this.user.claims) == true) {
                if (this.user.claims['examUpdationListES'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['examUpdationListES'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['examUpdationListES'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['examUpdationListES'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }
    getPhone(item) {
        return JSON.parse(item);
    }

    editModel(model: IVWStudentsProfile) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

}