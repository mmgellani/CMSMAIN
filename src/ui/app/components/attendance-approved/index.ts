import Vue from 'vue';
import Component from 'vue-class-component';
import { charts } from 'highcharts';
import Highcharts from 'highcharts';
import { genComponent } from 'vue-highcharts';

@Component({
    name: 'attendance-approved',
    template: require('./index.html'),
    components: {
        Highcharts: genComponent('Highcharts', Highcharts)
    
      }
    // props: ["", ""]
})
export default class attendanceApproved extends Vue {
    options = {
        chart: {
          backgroundColor: '#959cb61a',
          type: 'line'
        },
        title: {
          text: 'Sample Data'
        },
    
        yAxis: {
          title: {
            text: null
          }
        },
    
        xAxis: {
          categories: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
        },
    
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },
    
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            pointStart: 2010
          }
        },
    
        series: [{
          name: 'Admission',
          data: [13934, 14503, 16177, 17658, 18031, 19031, 19133, 19844, 20823, 24441]
        }],
    
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
    
      };


}