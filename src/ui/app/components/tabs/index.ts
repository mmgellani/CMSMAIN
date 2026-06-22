import Vue from 'vue';
Vue.component('tabs', {
    template: `
    <span>
        <div class="kt-portlet kt-portlet--tabs">
        <div class="kt-portlet__head">
            <div class="kt-portlet__head-toolbar" style="max-width:100%;  overflow-x: auto; overflow-y:hidden;">
             
                <ul class="nav nav-tabs nav-tabs-line nav-tabs-line-brand nav-tabs-line-2x nav-tabs-line-right nav-tabs-bold" role="tablist">
                    <li v-for='tab in tabs' class="nav-item">
                         <a style="margin-right:30px;" :href='tab.href' @click='selectTab(tab)' :class="tab.isActive ? 'nav-link active show' : 'nav-link'">
                            <span v-html="tab.name"></span>
                         </a>
                     </li>
                </ul>
               
            </div>
        </div>
        <div class="kt-portlet__body">                   
            <div class="tab-content">
            <slot></slot>
            </div>      
        </div>
        </div>
    </span>
    `,

    methods: {
        selectTab(selectedTab) {
            this.tabs.forEach((tab) => { tab.isActive = (tab === selectedTab); });
        }
    },
    data() {
        return { tabs: [] };
    },
    mounted() {
        // console.log(this.$children)
    },
    created() {
        this.tabs = this.$children;
    }
});
Vue.component('tab', {
    props: {
        name: {
            required: true
        },
        selected: {
            default: false
        },
        force: {
            default: false
        }
    },
    data() {
        return { isActive: false };
    },
    computed: {
        href() {
            //
            return '#' + this
                .name
                .toLowerCase()
                .replace(/ /g, '-'); // replace any space
        }
    },
    mounted() {
        this.isActive = this.selected;
    },
    template: `<div v-show='isActive' v-if="!force"><slot></slot></div>
               <div v-else-if='isActive && force'><slot></slot></div>`
});











// <span>
// <div class="clearfix">
//     <ul class="nav nav-tabs float-left">
//         <li v-for='tab in tabs' class="nav-item">
//             <a :href='tab.href' @click='selectTab(tab)' :class="tab.isActive ? 'nav-link active show' : 'nav-link'">
//                 <span v-html="tab.name"></span>
//             </a>
//         </li>
//     </ul>
// </div>
// <div class="tab-content mb-lg">
//     <slot></slot>
// </div>
// </span>

