
var timelineEl = document.getElementById('chartTimeline');
var ctx = timelineEl.getContext('2d');

var width = window.innerWidth;
let graphCanvasWidth = Math.floor(width/4);

var gradient = ctx.createLinearGradient(0, 0, 0,graphCanvasWidth);

// Add three color stops
gradient.addColorStop(1, 'red');
gradient.addColorStop(0.8, 'green');


async function graphTimeline(account_name) {
  if(!account_name){
    console.log('Must pass either an account name or all to graph timelines');
    return
  }
  let timelineData = await fetch(`/graph/data/timeline/${account_name}`, {
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
        datasets:[{
          label: 'All Accounts',
          data: timelineData.timeline,
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
            enabled: true
          }
        },
        animations: {
          y: {
            easing: 'easeInOutElastic',
            from: (ctx) => {
              if (ctx.type === 'data') {
                if (ctx.mode === 'default' && !ctx.dropped) {
                  ctx.dropped = true;
                  return 0;
                }
              }
            }
          }
        }
      }
    });
  
  }else{
    console.log('Error getting timeline data');
  }
}

graphTimeline('cashflow');



