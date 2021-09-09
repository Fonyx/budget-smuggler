// A collection of functions for the use of chart.js


// https://www.chartjs.org/docs/latest/samples/area/line-stacked.html


// https://www.chartjs.org/docs/latest/developers/updates.html
// function addData(chart, label, data) {
//     chart.data.labels.push(label);
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.push(data);
//     });
//     chart.update();
// }
// function removeData(chart) {
//     chart.data.labels.pop();
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.pop();
//     });
//     chart.update();
// }

//https://www.chartjs.org/docs/latest/developers/updates.html 
// function updateConfigAsNewObject(chart) {
//     chart.options = {
//         responsive: true,
//         plugins: {
//             title: {
//                 display: true,
//                 text: 'Chart.js'
//             }
//         },
//         scales: {
//             x: {
//                 display: true
//             },
//             y: {
//                 display: true
//             }
//         }
//     };
//     chart.update();
// }

https://www.chartjs.org/docs/latest/samples/advanced/linear-gradient.html

/*  
Data needed
labels: list of dates
data: transactionList
colors: listOfColors to show green for positive and red for negative on the plot
category: For displaying the colour of the category
*/


// Chart.defaults.font.family = 'Lato';
// Chart.defaults.font.size = 18;
// var dates = ['18/5/1991', '21/5/1991', '28/5/1991', '1/6/1991','5/6/1991']
// var amounts = [200, 250, 270, -10, 500];
// var colours = ['green', 'green', 'green', 'red', 'green']

// dateObjs = dates.map((date, index) => {
  //   let currentAmount = amounts[index];
  //   let dataElement = {
    //     //   {due_date: '18/5/1991', amount: 200},
    //     due_date: date,
    //     amount: currentAmount}
    //   return dataElement
    // });
    // console.log(dateObjs);
  var timelineEl = document.getElementById('chartTimeline');
  var ctx = timelineEl.getContext('2d');

  async function graphTimeline() {
    let timelineData = await fetch('/graph/data/timeline', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    })
    .then(async (response) =>{
      let data = await response.json();
      return data.body;
    })
    .catch((err) => console.log(err));
    
    console.log(timelineData);
    if(timelineData){
      let timelineChart = new Chart(ctx, {
        type:'line',
        data:{
          labels: timelineData.labels,
          datasets:[{
            label: 'All Accounts',
            data: timelineData.data,
            backgroundColor:timelineData.colors,
          }],
        },
        options:{
          title:{
            display: true,
            text: 'All Accounts',
            fontSize: 25
          },
          legend:{
            display: false,
            position: 'right',
            labels:{
              fontColor: 'black'
            }
          },
          layout: {
            padding: {
              left: 50,
              right: 50,
              bottom: 0,
              top: 0
            }
          },
          plugins:{
            tooltip: {
              enabled: false
            }
          }
          ,
          parsing: {
            xAxisKey: 'date',
            yAxisKey: 'amount'
          }
        }
      });
    
    }else{
      console.log('Error getting timeline data');
    }
  }

  graphTimeline();



