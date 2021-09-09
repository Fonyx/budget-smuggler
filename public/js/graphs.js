
var timelineEl = document.getElementById('chartTimeline');
var ctx = timelineEl.getContext('2d');

var gradient = ctx.createLinearGradient(0,20, 0,500);

// Add three color stops
gradient.addColorStop(1, 'red');
gradient.addColorStop(0.8, 'green');



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
          backgroundColor:gradient,
          parsing: {
            xAxisKey: 'date',
            yAxisKey: 'amount'
          },
          borderColor: gradient,
          fill: false,
          // cubicInterpolationMode: 'monotone',
          // tension: 0.2,
          stepped: true,
        }],
      },
      options:{
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
      }
    });
  
  }else{
    console.log('Error getting timeline data');
  }
}

graphTimeline();



