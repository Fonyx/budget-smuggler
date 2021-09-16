
async function graphTimeline() {

  // get the account name from the timeline-account id field
  let accountName = document.querySelector('#timeline-account').innerHTML;
  accountNameLower = accountName.toLowerCase();
  // slugify for url parametrization
  accountNameLowerSlug = accountNameLower.replace(/ /g, '-');
  console.log(accountNameLowerSlug);
  // determine which url to send the request to
  if(accountNameLower === 'all'){
    dataUrl = '/graph/data/timeline/all';
  } else {
    dataUrl = `/graph/data/timeline/account/${accountNameLowerSlug}`;
  }
  console.log(dataUrl);

  // build a new canvas to display to
  var timelineEl = document.getElementById('chartTimeline');
  var ctx = timelineEl.getContext('2d');

  var width = window.innerWidth;
  let graphCanvasWidth = Math.floor(width/4);

  var gradient = ctx.createLinearGradient(0, 0, 0,graphCanvasWidth);

  // Add three color stops
  gradient.addColorStop(1, 'red');
  gradient.addColorStop(0.8, 'green');

  // get the data
  let data = await fetch(dataUrl, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json'}
  })
  .then(async (response) =>{
    let data = await response.json();
    return data.body;
  })
  .catch((err) => console.log(err));


  if(data){
    timelineChart = new Chart(ctx, {
      type:'line',
      data:{
        datasets:[{
          label: data.amount,
          data: data.timeline,
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
        scales: {
          yAxes: [{
              ticks: {
                  fontSize: 40
              }
          }]
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
            enabled: true
          },
          legend:{
            display:false,
            text: data.accountName
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

graphTimeline();
