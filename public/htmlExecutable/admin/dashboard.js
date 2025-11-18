// (async function () {
//   const data = [
//     { year: 2010, count: 10 },
//     { year: 2011, count: 20 },
//     { year: 2012, count: 15 },
//     { year: 2013, count: 25 },
//     { year: 2014, count: 22 },
//     { year: 2015, count: 30 },
//     { year: 2016, count: 28 },
//   ];

//   new Chart(
//     document.getElementById('acquisitions'),
//     {
//       type: 'bar',
//       data: {
//         labels: data.map(row => row.year),
//         datasets: [
//           {
//             label: 'Acquisitions by year',
//             data: data.map(row => row.count)
//           }
//         ]
//       }
//     }
//   );

//   new Chart(
//     document.getElementById("doughnut"),
//     {
//       type: "doughnut",
//       data: {
//         labels: [
//           'Red',
//           'Blue',
//           'Yellow'
//         ],
//         datasets: [{
//           label: 'My First Dataset',
//           data: [300, 50, 100],
//           backgroundColor: [
//             'rgb(255, 99, 132)',
//             'rgb(54, 162, 235)',
//             'rgb(255, 205, 86)'
//           ],
//           hoverOffset: 4
//         }]
//       }
//     }
//   )
// })();






function fetchSalesData(selectedOption) {
  fetch(`/admin/getSalesData/${selectedOption}`)
    .then(res => res.json())
    .then((data) => {
      console.log('data = ',data)
      if(data.ordersData.length==0){
        
      }
      const barCtx = document.getElementById('barChart').getContext('2d');
      const dataBar = {
        labels: Object.keys(data.ordersData.income),
        datasets: [{
          label: 'Sales',
          data: Object.values(data.ordersData.income),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };

      const configBar = {
        type: 'bar',
        data: dataBar,
        options: {
          scales: {
            y: { beginAtZero: true },
            x: { beginAtZero: true }
          }
        },
      };

      new Chart(barCtx, configBar);

      const lineCtx = document.getElementById('lineChart').getContext('2d');
      const dataLine = {
        labels: Object.keys(data.ordersData.ordered),
        datasets: [{
          fill: false,
          lineTension: 0,
          backgroundColor: 'rgba(0, 255, 255, 1.0)',
          borderColor: 'rgba(0, 255, 255, 0.4)',
          data: Object.values(data.ordersData.ordered),
        }]
      };

      const configLine = {
        type: 'line',
        data: dataLine,
        options: {
          legend: { display: false },
          scales: { yAxes: [{ ticks: { min: 0 } }] }
        }
      };

      new Chart(lineCtx, configLine);


    })
    .catch(error => console.error('Error fetching sales data:', error));
}

document.addEventListener("DOMContentLoaded", function () {
  fetchSalesData(document.querySelector('select').value);
});




function downloadCsv() {
  let startDate = new Date($('#startDate').val())
  let endDate = new Date($('#endDate').val())
  if (endDate < startDate) {
    $('#dateError').text('end date should be greater than or equal to startdate')
    return setTimeout(() => {
      $('#dateError').text('')
    }, 3000)
  }
  fetch('/admin/downloadSalesReport', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      startDate, endDate
    })
  }).then(response => response.blob())
    .then(blob => {
      // Create a link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([blob]));

      // Set the filename for the download
      link.download = 'sales_report.csv';

      // Append the link to the body
      document.body.appendChild(link);

      // Trigger the click event to start the download
      link.click();

      // Remove the link from the DOM
      document.body.removeChild(link);
    })
    .catch(error => console.error('Error downloading CSV:', error));

}





function downloadPdf() {
  let startDate = new Date($('#startDate').val())
  let endDate = new Date($('#endDate').val())
  if (endDate < startDate) {
    $('#dateError').text('end date should be greater than or equal to startdate')
    return setTimeout(() => {
      $('#dateError').text('')
    }, 3000)
  }
  fetch('/admin/downloadSalesReportPDF', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      startDate, endDate
    })
  })
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([blob]));
      link.download = 'sales_report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(error => console.error('Error downloading PDF:', error));

}


