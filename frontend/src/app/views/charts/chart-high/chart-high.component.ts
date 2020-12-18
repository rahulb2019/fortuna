import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { CategoryAxis } from '@amcharts/amcharts4/charts';

@Component({
  selector: 'app-chart-high',
  templateUrl: './chart-high.component.html',
  styles: []
})
export class ChartHighComponent implements OnInit {

  constructor() { }

  public chart1 = {

    title: {
      text: 'Solar Employment Growth by Sector, 2010-2016'
    },

    subtitle: {
      text: 'Source: thesolarfoundation.com'
    },

    yAxis: {
      title: {
        text: 'Number of Employees'
      }
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
      name: 'Installation',
      data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
      color: '#007bff'
    }, {
      name: 'Manufacturing',
      data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
      color: '#dc3545'
    }, {
      name: 'Sales & Distribution',
      data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387],
      color: '#28a745'
    }, {
      name: 'Project Development',
      data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227],
      color: '#ffc107'
    }, {
      name: 'Other',
      data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111],
      color: '#17a2b8'
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
  public chart2 = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Historic World Population by Region'
    },
    subtitle: {
      text: 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
    },
    xAxis: {
      categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Population (millions)',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    tooltip: {
      valueSuffix: ' millions'
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
      shadow: true
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Year 1900',
      data: [133, 156, 947, 408, 6],
      color: '#dc3545'
    }, {
      name: 'Year 2000',
      data: [814, 841, 3714, 727, 31],
      color: '#28a745'
    }, {
      name: 'Year 2016',
      data: [1216, 1001, 4436, 738, 40],
      color: '#ffc107'
    }]
  };
  public chart3 = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    colorAxis: {},
    title: {
        text: 'Browser market shares in January, 2018'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    },
    series: [{
        name: 'Brands',
        colorByPoint: true,
        data: [{
            name: 'Chrome',
            y: 61.41,
            sliced: true,
            selected: true
        }, {
            name: 'Internet Explorer',
            y: 11.84
        }, {
            name: 'Firefox',
            y: 10.85
        }, {
            name: 'Edge',
            y: 4.67
        }, {
            name: 'Safari',
            y: 4.18
        }, {
            name: 'Sogou Explorer',
            y: 1.64
        }, {
            name: 'Opera',
            y: 1.6
        }, {
            name: 'QQ',
            y: 1.2
        }, {
            name: 'Other',
            y: 2.61
        }]
    }]
  };

  public chart4 = {
    chart: {
      type: 'spline',
      animation: Highcharts.SVGElement, // don't animate in old IE
      marginRight: 10,
      events: {
        load() {

          // set up the updating of the chart each second
          const series = this.series[0];
          setInterval(function() {
            // tslint:disable-next-line: one-variable-per-declaration
            const x = (new Date()).getTime(), // current time
               y = Math.random();
            series.addPoint([x, y], true, true);
          }, 1000);
        }
      }
    },
    time: {
      useUTC: false
    },

    title: {
      text: 'Live random data'
    },

    accessibility: {
      announceNewData: {
        enabled: true,
        minAnnounceInterval: 15000,
        announcementFormatter(allSeries, newSeries, newPoint) {
          if (newPoint) {
            return 'New point added. Value: ' + newPoint.y;
          }
          return false;
        }
      }
    },

    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
    },

    yAxis: {
      title: {
        text: 'Value'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },

    tooltip: {
      headerFormat: '<b>{series.name}</b><br/>',
      pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
    },

    legend: {
      enabled: false
    },

    exporting: {
      enabled: false
    },

    series: [{
      name: 'Random data',
      color: '#0084ff',
      data: (function() {
        // generate an array of random data
        let data = [],
          time = (new Date()).getTime(),
          i;

        for (i = -19; i <= 0; i += 1) {
          data.push({
            x: time + i * 1000,
            y: Math.random()
          });
        }
        return data;
      }())
    }]
  };

  public chart5 = {

    chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
    },

    title: {
        text: 'Speedometer'
    },

    pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#FFF'],
                    [1, '#333']
                ]
            },
            borderWidth: 0,
            outerRadius: '109%'
        }, {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#333'],
                    [1, '#FFF']
                ]
            },
            borderWidth: 1,
            outerRadius: '107%'
        }, {
            // default background
        }, {
            backgroundColor: '#DDD',
            borderWidth: 0,
            outerRadius: '105%',
            innerRadius: '103%'
        }]
    },

    // the value axis
    yAxis: {
        min: 0,
        max: 200,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
            step: 2,
            rotation: 'auto'
        },
        title: {
            text: 'km/h'
        },
        plotBands: [{
            from: 0,
            to: 120,
            color: '#55BF3B' // green
        }, {
            from: 120,
            to: 160,
            color: '#DDDF0D' // yellow
        }, {
            from: 160,
            to: 200,
            color: '#DF5353' // red
        }]
    },

    series: [{
        name: 'Speed',
        data: [80],
        tooltip: {
            valueSuffix: ' km/h'
        }
    }]

};

    public chart6 = {
      chart: {
          type: 'area'
      },
      accessibility: {
          // tslint:disable-next-line: max-line-length
          description: 'Image description: An area chart compares the nuclear stockpiles of the USA and the USSR/Russia between 1945 and 2017. The number of nuclear weapons is plotted on the Y-axis and the years on the X-axis. The chart is interactive, and the year-on-year stockpile levels can be traced for each country. The US has a stockpile of 6 nuclear weapons at the dawn of the nuclear age in 1945. This number has gradually increased to 369 by 1950 when the USSR enters the arms race with 6 weapons. At this point, the US starts to rapidly build its stockpile culminating in 32,040 warheads by 1966 compared to the USSR’s 7,089. From this peak in 1966, the US stockpile gradually decreases as the USSR’s stockpile expands. By 1978 the USSR has closed the nuclear gap at 25,393. The USSR stockpile continues to grow until it reaches a peak of 45,000 in 1986 compared to the US arsenal of 24,401. From 1986, the nuclear stockpiles of both countries start to fall. By 2000, the numbers have fallen to 10,577 and 21,000 for the US and Russia, respectively. The decreases continue until 2017 at which point the US holds 4,018 weapons compared to Russia’s 4,500.'
      },
      title: {
          text: 'US and USSR nuclear stockpiles'
      },
      subtitle: {
          text: 'Sources: <a href="https://thebulletin.org/2006/july/global-nuclear-stockpiles-1945-2006">' +
              'thebulletin.org</a> &amp; <a href="https://www.armscontrol.org/factsheets/Nuclearweaponswhohaswhat">' +
              'armscontrol.org</a>'
      },
      xAxis: {
          allowDecimals: false,
          labels: {
              formatter() {
                  return this.value; // clean, unformatted number for year
              }
          },
          accessibility: {
              rangeDescription: 'Range: 1940 to 2017.'
          }
      },
      yAxis: {
          title: {
              text: 'Nuclear weapon states'
          },
          labels: {
              formatter() {
                  return this.value / 1000 + 'k';
              }
          }
      },
      tooltip: {
          pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
      },
      plotOptions: {
          area: {
              pointStart: 1940,
              marker: {
                  enabled: false,
                  symbol: 'circle',
                  radius: 2,
                  states: {
                      hover: {
                          enabled: true
                      }
                  }
              }
          }
      },
      series: [{
          name: 'USA',
          data: [
              null, null, null, null, null, 6, 11, 32, 110, 235,
              369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
              20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
              26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
              24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
              21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
              10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
              5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
          ],
          color: '#57aeff'
      }, {
          name: 'USSR/Russia',
          data: [null, null, null, null, null, null, null, null, null, null,
              5, 25, 50, 120, 150, 200, 426, 660, 869, 1060,
              1605, 2471, 3322, 4238, 5221, 6129, 7089, 8339, 9399, 10538,
              11643, 13092, 14478, 15915, 17385, 19055, 21205, 23044, 25393, 27935,
              30062, 32049, 33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000,
              37000, 35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
              21000, 20000, 19000, 18000, 18000, 17000, 16000, 15537, 14162, 12787,
              12600, 11400, 5500, 4512, 4502, 4502, 4500, 4500
          ],
          color: '#57dc57'
      }]
  };

  public chart7 = {
    chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    accessibility: {
        description: 'A scatter plot compares the height and weight of 507 individuals by gender. Height in centimeters is plotted on the X-axis and weight in kilograms is plotted on the Y-axis. The chart is interactive, and each data point can be hovered over to expose the height and weight data for each individual. The scatter plot is fairly evenly divided by gender with females dominating the left-hand side of the chart and males dominating the right-hand side. The height data for females ranges from 147.2 to 182.9 centimeters with the greatest concentration between 160 and 165 centimeters. The weight data for females ranges from 42 to 105.2 kilograms with the greatest concentration at around 60 kilograms. The height data for males ranges from 157.2 to 198.1 centimeters with the greatest concentration between 175 and 180 centimeters. The weight data for males ranges from 53.9 to 116.4 kilograms with the greatest concentration at around 80 kilograms.'
    },
    title: {
        text: 'Height Versus Weight of 507 Individuals by Gender'
    },
    subtitle: {
        text: 'Source: Heinz  2003'
    },
    xAxis: {
        title: {
            enabled: true,
            text: 'Height (cm)'
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
    },
    yAxis: {
        title: {
            text: 'Weight (kg)'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 100,
        y: 70,
        floating: true,
        backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
        borderWidth: 1
    },
    plotOptions: {
        scatter: {
            marker: {
                radius: 5,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x} cm, {point.y} kg'
            }
        }
    },
    series: [{
        name: 'Female',
        color: 'rgba(223, 83, 83, .5)',
        data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
            [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
            [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
            [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
            [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
            [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
            [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
            [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
            [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
            [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
            [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
            [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
            [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
            [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
            [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
            [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
            [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
            [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
            [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
            [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
            [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
            [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
            [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
            [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
            [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
            [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4]]

    }, {
        name: 'Male',
        color: 'rgba(119, 152, 191, .5)',
        data: [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
            [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
            [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0],
            [184.0, 79.6], [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9],
            [176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4], [173.5, 81.8],
            [178.0, 89.6], [180.3, 82.8], [180.3, 76.4], [164.5, 63.2], [173.0, 60.9],
            [183.5, 74.8], [175.5, 70.0], [188.0, 72.4], [189.2, 84.1], [172.8, 69.1],
            [170.0, 59.5], [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 80.1],
            [186.7, 87.8], [171.4, 84.7], [172.7, 73.4], [175.3, 72.1], [180.3, 82.6],
            [182.9, 88.7], [188.0, 84.1], [177.2, 94.1], [172.1, 74.9], [167.0, 59.1],
            [169.5, 75.6], [174.0, 86.2], [172.7, 75.3], [182.2, 87.1], [164.1, 55.2],
            [163.0, 57.0], [171.5, 61.4], [184.2, 76.8], [174.0, 86.8], [174.0, 72.2],
            [177.0, 71.6], [186.0, 84.8], [167.0, 68.2], [171.8, 66.1], [182.0, 72.0],
            [167.0, 64.6], [177.8, 74.8], [164.5, 70.0], [192.0, 101.6], [175.5, 63.2],
            [171.2, 79.1], [181.6, 78.9], [167.4, 67.7], [181.1, 66.0], [177.0, 68.2],
            [174.5, 63.9], [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9],
            [180.1, 93.0], [175.5, 80.9], [180.6, 72.7], [184.4, 68.0], [175.5, 70.9],
            [180.3, 83.2], [180.3, 83.2]]
    }]
};

public chart8 = {
  chart: {
      zoomType: 'xy'
  },
  title: {
      text: 'Average Monthly Temperature and Rainfall in Tokyo'
  },
  subtitle: {
      text: 'Source: WorldClimate.com'
  },
  xAxis: [{
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      crosshair: true
  }],
  yAxis: [{ // Primary yAxis
      labels: {
          format: '{value}°C',
          style: {
              color: Highcharts.getOptions().colors[1]
          }
      },
      title: {
          text: 'Temperature',
          style: {
              color: Highcharts.getOptions().colors[1]
          }
      }
  }, { // Secondary yAxis
      title: {
          text: 'Rainfall',
          style: {
              color: Highcharts.getOptions().colors[0]
          }
      },
      labels: {
          format: '{value} mm',
          style: {
              color: Highcharts.getOptions().colors[0]
          }
      },
      opposite: true
  }],
  tooltip: {
      shared: true
  },
  legend: {
      layout: 'vertical',
      align: 'left',
      x: 120,
      verticalAlign: 'top',
      y: 100,
      floating: true,
      backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || // theme
          'rgba(255,255,255,0.25)'
  },
  series: [{
      name: 'Rainfall',
      type: 'column',
      yAxis: 1,
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
      color: '#57aeff',
      tooltip: {
          valueSuffix: ' mm'
      }

  }, {
      name: 'Temperature',
      type: 'spline',
      data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
      color: '#00ca00',
      tooltip: {
          valueSuffix: '°C'
      }
  }]
};

public chart9 = {
  chart: {
      renderTo: 'high-3d-chart',
      type: 'column',
      options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          depth: 50,
          viewDistance: 25
      }
  },
  title: {
      text: 'Chart rotation demo'
  },
  subtitle: {
      text: 'Test options by dragging the sliders below'
  },
  plotOptions: {
      column: {
          depth: 25
      }
  },
  series: [{
      data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
      color: '#57aeff'
  }]
};

// tslint:disable-next-line: one-variable-per-declaration
 categories = [
  '0-4', '5-9', '10-14', '15-19',
  '20-24', '25-29', '30-34', '35-39', '40-44',
  '45-49', '50-54', '55-59', '60-64', '65-69',
  '70-74', '75-79', '80-84', '85-89', '90-94',
  '95-99', '100 + '
  ];
public chart10 = {
  categories : [
    '0-4', '5-9', '10-14', '15-19',
    '20-24', '25-29', '30-34', '35-39', '40-44',
    '45-49', '50-54', '55-59', '60-64', '65-69',
    '70-74', '75-79', '80-84', '85-89', '90-94',
    '95-99', '100 + '
    ],
  chart: {
      type: 'bar'
  },
  title: {
      text: 'Population pyramid for Germany, 2018'
  },
  subtitle: {
      text: 'Source: <a href="http://populationpyramid.net/germany/2018/">Population Pyramids of the World from 1950 to 2100</a>'
  },
  accessibility: {
      point: {
          descriptionFormatter: function (point) {
              var index = point.index + 1,
                  category = point.category,
                  val = Math.abs(point.y),
                  series = point.series.name;

              return index + ', Age ' + category + ', ' + val + '%. ' + series + '.';
          }
      }
  },
  xAxis: [{
      categories: this.categories,
      reversed: false,
      labels: {
          step: 1
      },
      accessibility: {
          description: 'Age (male)'
      }
  }, { // mirror axis on right side
      opposite: true,
      reversed: false,
      categories: this.categories,
      linkedTo: 0,
      labels: {
          step: 1
      },
      accessibility: {
          description: 'Age (female)'
      }
  }],
  yAxis: {
      title: {
          text: null
      },
      labels: {
          formatter: function () {
              return Math.abs(this.value) + '%';
          }
      },
      accessibility: {
          description: 'Percentage population',
          rangeDescription: 'Range: 0 to 5%'
      }
  },

  plotOptions: {
      series: {
          stacking: 'normal'
      }
  },

  tooltip: {
      formatter: function () {
          return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
              'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 1) + '%';
      }
  },

  series: [{
      name: 'Male',
      data: [
          -2.2, -2.1, -2.2, -2.4,
          -2.7, -3.0, -3.3, -3.2,
          -2.9, -3.5, -4.4, -4.1,
          -0.0
      ],
      color: '#57dc57'
  }, {
      name: 'Female',
      data: [
          2.1, 2.0, 2.1, 2.3, 2.6,
          2.9, 3.2, 3.1, 2.9, 3.4,
          0.0
      ],
      color: '#57aeff'
  }]
};

ngOnInit() {
  }
//   function(chart) {
//     if (!chart.renderer.forExport) {
//         setInterval(function() {
//             let point = chart.series[0].points[0],
//                 newVal,
//                 inc = Math.round((Math.random() - 0.5) * 20);
//             newVal = point.y + inc;
//             if (newVal < 0 || newVal > 200) {
//                 newVal = point.y - inc;
//             }

//             point.update(newVal);

//         }, 3000);
//     }
// }


}
