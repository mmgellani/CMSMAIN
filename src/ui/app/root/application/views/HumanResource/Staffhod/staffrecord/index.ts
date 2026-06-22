import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IAdmissionStudents, StaffHODData } from '../../../../models';
import { AdmissionStudentsService, HumanResourceStaffService } from '../../../../service';


@Component({
    name: 'staff-modal',
    template: require('./index.html')
})


export class StaffRecord extends Vue {

    data:Array<StaffHODData>=[];
    service:HumanResourceStaffService=new HumanResourceStaffService(this.$store);
    courseid:string='';
    programdetail:string='';
    campusprogramlink:string='';
    classid:string='';

    beforeModalOpen(event) {
        this.data=[];
        this.courseid=event.params.COURSEID;
        this.programdetail=event.params.PROGRAMDETAIL;
        this.campusprogramlink=event.params.CAMPUSPROGRAMID;
        this.classid=event.params.CLASSID;

        var key=this.campusprogramlink+'?'+this.classid+'?'+this.courseid;
         
         
        this.service.GetStaffHODData(key).then(r=>{
          this.data= r as Array<StaffHODData>

        })

        



    }

    ResetOthers(option:any)
    {

        this.data.forEach(element => {

            if(element.ide!=option)
            {
                element.isChecked=false;
            }
            
        });


    }
    cancel()
    {
        this.$modal.hide('staff-rec');
    }
    save()
    {

        var z=this.data.filter(e=>e.isChecked==true);

        var key=JSON.stringify(z)+'?'+this.campusprogramlink+'?'+this.programdetail+'?'+this.courseid+'?'+this.classid;
        
        this.service.InsertStaffHODData(key).then(r=>{
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: r,
                title: 'Success',
                messageTypeId: PayloadMessageTypes.success
            })

            this.$emit('submit');


            this.cancel();
            


        })


        
    }

}