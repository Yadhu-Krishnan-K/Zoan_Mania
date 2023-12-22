const processOrdersForChart = function (orders,num) {
    console.log("orders===",orders)
  // Assuming you want to count the number of orders for each day
    const ordered = {};
    const income = {};
    // console.log('orders===',orders)
    orders.forEach((order) => {
      if(num == 1){
        var orderDate = new Date(order.OrderDate).toISOString().split('T')[0];
      }else if(num == 2){
        var orderDate = new Date(order.OrderDate).toISOString().slice(0, 7);

      }else if(num == 3){
        var orderDate = new Date(order.OrderDate).getFullYear().toString();
      }
      let total = 0, count = 0;
    
      if (order.Status === 'Delivered') {
        order.Items.forEach((item) => {
          if (item.returnStatus !== 'returned') {
            total += item.discounted * item.quantity;
            count += item.quantity;
          }
        });
    
        income[orderDate] = (income[orderDate] || 0) + total;
        ordered[orderDate] = (ordered[orderDate] || 0) + count;
    
        console.log('incomeperDay[orderDate]===', income[orderDate], ' : total===', total);
        console.log('ordersByDate[orderDate]===', ordered[orderDate], ' : count===', count);
      }
    });
    
  // console.log('ordersByDate=====',ordersByDate)

  // // Convert the data to an array of objects suitable for Chart.js
  //   const chartData = Object.keys(ordersByDate).map((date) => ({
  //     date, 
  //     count: ordersByDate[date],
  // }));

    // console.log(chartData)
    return {ordered,income};

  }

  module.exports = {
    processOrdersForChart
  }