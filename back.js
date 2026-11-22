// C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
        ['Louvre 雙人床架', 1],
        ['Antony 雙人床架', 2],
        ['Anty 雙人床架', 3],
        ['其他', 4],
        ],
        colors:{
            "Louvre 雙人床架":"#DACBFF",
            "Antony 雙人床架":"#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});

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
let orders = [];

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
      <input type="button" class="delSingleOrder-Btn" value="刪除">
    </td>
</tr>`;
    });
    orderPageTableBody.innerHTML = orderList;
}

function getOrders(){
    axios.get(ordersApiUrl,config).then(function(response){
        orders = response.data.orders;
        // console.log(orders);
        renderOrders()
      })
      .catch(function(error){
        console.log(error.response.data.message);
      });
}

getOrders();