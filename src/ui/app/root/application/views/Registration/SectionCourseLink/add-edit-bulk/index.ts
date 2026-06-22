/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IRegistrationSectionCourseLink,ISetupClass,ISetupSection,IRegistrationCourse, ISetupCampusProgramLinkVM, ICourseSelected, IRegistrationProgramCourseLink, RegistrationProgramCourseLinkVM, IRegistrationSectionCourseLinkVM } from '../../../../models';
import { RegistrationSectionCourseLinkService,SetupCampusProgramLinkService,SetupClassService,SetupSectionService,RegistrationCourseService, RegistrationProgramCourseLinkService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateRegistrationSectionCourseLink = { model: IRegistrationSectionCourseLink, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateRegistrationSectionCourseLink> = {
    model: {
	// sectionCourseLinkId: { required },
	// campusProgramId: { required },
	// classId: { required },
	// courseId: { required },
	sectionId: { required },
	fromSerial: { required },
	toSerial: { required },
	// statusId: { required },
	// loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-bulk-model',
    template: require('./index.html')
})
export class RegistrationSectionCourseLinkAddEditBulk extends Vue {
    isActive:boolean=true;
    private repository: RegistrationSectionCourseLinkService;
    private repoProgramCourseLink:RegistrationProgramCourseLinkService=null;
    
    private repo1: SetupSectionService;
    private repo2: RegistrationCourseService;
    private SectionCourseLinkList:Array<IRegistrationSectionCourseLink>=[];
    private ListProgramCourseLinkVM:Array<RegistrationProgramCourseLinkVM>=[];
   
    sectionList:Array<ISetupSection>=[]
    courseList:Array<IRegistrationCourse>=[]

    private CourseSelectedList: Array<ICourseSelected> = [];
    private data: IRegistrationSectionCourseLink = {
        sectionCourseLinkId: '', campusProgramId: '', classId: '', sectionId: '', fromSerial: 0, toSerial: 0, statusId: 0, loggerId: '', 
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new RegistrationSectionCourseLinkService(this.$store);
       
      this.repoProgramCourseLink=new RegistrationProgramCourseLinkService(this.$store);
        this.repo1 = new SetupSectionService(this.$store);
        this.repo2 = new RegistrationCourseService(this.$store);
    }

    beforeModalOpen(event) {
        this.CourseSelectedList = [];
        this.IsNewRecord = event.params.IsNewRecord;
        
        var ProgramDetailID=event.params.Programdetailid
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        
       
       
        this.repo1.GetFindBy('e=>e.StatusId ==1').then(res=>{
            this.sectionList=res as Array<ISetupSection>
           
        });

        var key=ProgramDetailID+'?'+this.data.classId
       

        this.repoProgramCourseLink.GetAllFilterData(key).then(
            res=>
            {
                  this.ListProgramCourseLinkVM=res as Array<RegistrationProgramCourseLinkVM>
                 
                  for (var i = 0; i < this.ListProgramCourseLinkVM.length; i++) {

                            this.CourseSelectedList.push(
                                {
                                    courseId: this.ListProgramCourseLinkVM[i].courseId, fullName:  this.ListProgramCourseLinkVM[i].courseName, title:  this.ListProgramCourseLinkVM[i].courseName, isChecked: false
                                }
            
                            )
                        }
            }
        )

        // this.repo2.GetFindBy('e=>e.StatusId== 1').then(res=>{
        //     this.courseList=res as Array<IRegistrationCourse>
        //     for (var i = 0; i < this.courseList.length; i++) {

        //         this.CourseSelectedList.push(
        //             {
        //                 courseId: this.courseList[i].courseId, fullName: this.courseList[i].fullName, title: this.courseList[i].title, isChecked: false
        //             }

        //         )
        //     }
           
        // });
    }

    cancel() {
        
        this.$modal.hide('add-edit-bulk-model');
        this.$emit("submit");
    }

    saveModel() {
        if (this.IsNewRecord) {
            this.CourseSelectedList = this.CourseSelectedList.filter(s => s.isChecked == true);
            for (var i = 0; i < this.CourseSelectedList.length; i++) 
            {

                this.SectionCourseLinkList.push({
                    sectionCourseLinkId: helper.newGuid() ,campusProgramId:this.data.campusProgramId ,classId:this.data.classId,
                    sectionId:this.data.sectionId,fromSerial:this.data.fromSerial, toSerial:this.data.fromSerial,
                    statusId:1,loggerId:helper.newGuid()
                    
                
                  
                }

                )
            }
            var key=JSON.stringify(this.SectionCourseLinkList)
            // this.data.sectionCourseLinkId=helper.newGuid();
            // this.data.statusId=1;
            // this.data.loggerId = helper.newGuid();
            this.repository.AddMany(this.SectionCourseLinkList)
                .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been inserted successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                })
                this.cancel();
            });
        } else {
            if(this.isActive==true)
            {
                this.data.statusId=1;
            }
            
            else
            {
                this.data.statusId=0;
            }
            this.repository.Update(this.data)
                .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been updated successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                })
                this.cancel();
            });
        }

        this.cancel();
    }
    get allowSubmit() {
        return  (this.data.sectionId.length > 0) && (this.data.fromSerial > 0) && (this.data.toSerial > 0);
      }
    $v: Vuelidate<any>;
}