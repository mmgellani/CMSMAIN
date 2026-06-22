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

import { IFeeFeeHead, IFeeStudentFeeStructureVM, IFeeStudentChallanVM, ISetupCollector, IFeeStudentChallan, DisableChallans } from '../../../../models';
import { FeeFeeHeadService, FeeStudentChallanService, SetupCollectorService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';

import WidgetBox from '../../../../../home/widget-box/index';

@Component({
    name: 'DisableChallan',
    template: require('./index.html'),
    
})

export class StudentDisableChallanSearch extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    repo:FeeStudentChallanService=new FeeStudentChallanService(this.$store);

    disablechallanlist:Array<DisableChallans>=[];
    filterString:string='';

mounted()
{



}
getrecord()
{
    this.disablechallanlist=[];
    this.repo.GetDisableChallans(this.filterString).then(r=>{
        this.disablechallanlist= r as Array<DisableChallans>

        console
        .log(JSON.stringify(this.disablechallanlist))
    })



}



}