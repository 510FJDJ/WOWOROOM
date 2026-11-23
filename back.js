

function renderC3(){
  let totalObj = {};
  orders.forEach(function(item){
    // console.log(item.products);
    item.products.forEach(function(productItem){
      if(totalObj[productItem.title] === undefined){
        totalObj[productItem.title] = productItem.quantity;
      }else{
        totalObj[productItem.title] += productItem.quantity;
      }
    });
  });

  //抽出所有品名,變成陣列
let originAry = Object.keys(totalObj);
let newData = [];
// 3. 跑迴圈，把每個品名和對應的數量組成小陣列，塞進 newData
originAry.forEach(function(item){
  let ary = [];
  ary.push(item);
  ary.push(totalObj[item]);
  newData.push(ary);
});

// console.log(newData);

// C3.js
let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
      type: "pie",
      columns: newData,
  },
  color:{
    pattern:["#DACBFF",
    "#9D7FEA",
    "#5434A7",
    "#301E5F"]
  }
});

}



const baseUrl = "https://livejs-api.hexschool.io/api/livejs/v1/admin/";
const apiPath = "niniiwork";
const ordersApiUrl = `${baseUrl}${apiPath}/orders` ;
const uid = "gdooWEz0EUQfntvI3O5FHQCNnvj2";
const config = {
    headers: {
      Authorization: uid,
    },
  };
const orderPageTableBody = document.querySelector('.orderPage-table tbody');
const discardAllBtn = document.querySelector('.discardAllBtn');

let orders = [];

//清除全部訂單
discardAllBtn.addEventListener("click",function(event){
  event.preventDefault();
  deleteOrders();
});

function deleteOrders(){
  axios.delete(`${ordersApiUrl}`,config).then(function(response){
    orders = response.data.orders;
    renderOrders();
    renderC3();
    // console.log(response.data.orders);
  })
  .catch(function(error){
    console.log(error.response.data.message);
  });
}

//刪除訂單單一列表
orderPageTableBody.addEventListener("click",function(event){
  event.preventDefault();
  if(event.target.classList.contains("delSingleOrder-Btn")){
    const orderId = event.target.dataset.id;
    deleteOrder(orderId);
    // console.log(event.target.dataset.id);
  }
  // console.log(event.target.classList.contains("delSingleOrder-Btn"));
});


function deleteOrder(orderId){
  axios.delete(`${ordersApiUrl}/${orderId}`,config).then(function(response){
    orders = response.data.orders;
    renderOrders();
    renderC3();
    // console.log(response.data.orders);
  })
  .catch(function(error){
    console.log(error.response.data.message);
  });
}

//渲染訂單列表
function renderOrders(){
    let orderList = "";
    orders.forEach(function(order){
        const orderDate = new Date(order.createdAt * 1000).toISOString().slice(0,10).replaceAll("-","/");
        // 1. 針對該筆訂單的 products 陣列，組出所有品項名稱的 HTML 字串
        const productList = order.products.map(function(product){
            return `<p>${product.title} x ${product.quantity}</p>`;
        }).join();

        orderList += `<tr>
    <td>${order.createdAt}</td>
    <td>
      <p>${order.user.name}</p>
      <p>${order.user.tel}</p>
    </td>
    <td>${order.user.address}</td>
    <td>${order.user.email}</td>
    <td>
      <p>${productList}</p>
    </td>
    <td>${orderDate}</td>
    <td class="orderStatus">
      <a href="#">未處理</a>
    </td>
    <td>
      <input type="button" data-id=${order.id} class="delSingleOrder-Btn" value="刪除">
    </td>
</tr>`;
    });
    orderPageTableBody.innerHTML = orderList;

    if(!orders.length){
      discardAllBtn.style.display = "none";
    }else{
      discardAllBtn.style.display = "block";
    }

}

function getOrders(){
    axios.get(ordersApiUrl,config).then(function(response){
        orders = response.data.orders;
        // console.log(orders);
        renderOrders()
        renderC3(); 
      })
      .catch(function(error){
        console.log(error.response.data.message);
      });
}

getOrders();