const baseUrl = "https://livejs-api.hexschool.io/api/livejs/v1/customer/";
const apiPath = "niniiwork";
const productsApiUrl = `${baseUrl}${apiPath}/products` ;
const cartsApiUrl =  `${baseUrl}${apiPath}/carts`;
const ordersApiUrl =  `${baseUrl}${apiPath}/orders`;

let products = [];
let carts = [];
let finalTotal = 0;

const productSelect = document.querySelector('.productSelect');
const productWrap = document.querySelector('.productWrap');
const shoppingCartTableBody = document.querySelector('.shoppingCart-table tbody');
const shoppingCartTotal = document.querySelector('.total');
const discardAllBtn = document.querySelector('.discardAllBtn');
const orderInfoBtn = document.querySelector('.orderInfo-btn');
const customerName = document.querySelector('#customerName');
const customerPhone = document.querySelector('#customerPhone');
const customerEmail = document.querySelector('#customerEmail');
const customerAddress = document.querySelector('#customerAddress');
const tradeWay = document.querySelector('#tradeWay');
const orderInfoForm = document.querySelector('.orderInfo-form');

// console.log(orderInfoForm);

orderInfoBtn.addEventListener("click",function(event){
    event.preventDefault();
    customerName.nextElementSibling.style.display = "none";
    customerPhone.nextElementSibling.style.display = "none";
    customerEmail.nextElementSibling.style.display = "none";
    customerAddress.nextElementSibling.style.display = "none";
    const name = customerName.value.trim();
    const tel = customerPhone.value.trim();
    const email = customerEmail.value.trim();
    const address = customerAddress.value.trim();
    const payment = tradeWay.value;

    let isError = false;

    if(!name){
        customerName.nextElementSibling.style.display = "block";
        isError = true;
        // console.log('未填寫姓名');
    }
    if(!tel){
        customerPhone.nextElementSibling.style.display = "block";
        isError = true;
    }
    if(!email){
        customerEmail.nextElementSibling.style.display = "block";
        isError = true;
    }
    if(!address){
        customerAddress.nextElementSibling.style.display = "block";
        isError = true;
    }
    if(!isError){
        const formData = {
            "data": {
              "user": {
                // "name": "name", 可以換成下面的寫法
                name,
                tel,
                email,
                address,
                payment,
              },
            },
          };
        //   console.log("送出訂單");
        submitOrder(formData);
    }
});

shoppingCartTableBody.addEventListener("click",function(event){
    event.preventDefault();
    const id = event.target.dataset.id;
    // console.log(event.target.dataset.id);
    if(id){
        deleteCart(id);
    }
});

discardAllBtn.addEventListener("click",function(event){
    event.preventDefault();
    deleteCarts();
});

productWrap.addEventListener("click",function(event){
    event .preventDefault();
    const id = event.target.dataset.id;
    if(id){
        addCarts(id);
    }
    // console.log(event.target.dataset.id);
});
//送出訂單
function submitOrder(formData){
    axios.post(ordersApiUrl,formData).then(function(response){
        console.log(response.data);
        orderInfoForm.reset();
        getCarts();
        alert('你已送出訂單');
    })
    .catch(function(error){
        console.log(error.response.data.message);
    })
}

//刪除購物車單一品項
function deleteCart(id){
    axios.delete(`${cartsApiUrl}/${id}`).then(function(response){
        // console.log(response.data);
        carts = response.data.carts;
        finalTotal = response.data.finalTotal;
        renderCarts();
    })
    .catch(function(error){
        console.log(error.response.data.message);
    });
}

//刪除購物車所有品項
function deleteCarts(){
    axios.delete(cartsApiUrl).then(function(response){
        carts = response.data.carts;
        finalTotal = response.data.finalTotal;
        renderCarts();
    })
    .catch(function(error){
        console.log(error.response.data.message);
    });
}

//篩選產品
productSelect.addEventListener("change",function(){
    if(productSelect.value === '全部'){
        renderProducts(products);
    }else{
        let filiterProduct = [];
        products.forEach(function(product){
            if(product.category === productSelect.value){
                filiterProduct.push(product);
            }
        });
        renderProducts(filiterProduct);
    }
});

//渲染購物車列表
function renderCarts(){
    let cartsList = "";
    carts.forEach(function(item){
        cartsList += `<tr>
        <td>
            <div class="cardItem-title">
                <img src="${item.product.images}" alt="">
                <p>${item.product.title}</p>
            </div>
        </td>
        <td>NT$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${item.product.price * item.quantity}</td>
        <td class="discardBtn">
            <a href="#" class="material-icons" data-id= "${item.id}">
                clear
            </a>
        </td>
    </tr>`;
    });
    shoppingCartTableBody.innerHTML = cartsList;
    shoppingCartTotal.textContent = `NT$${finalTotal}`;

    if(!carts.length){
        discardAllBtn.style.display = "none";
        orderInfoBtn.setAttribute("disabled",true);
    }else{
        discardAllBtn.style.display = "inline-block";
        orderInfoBtn.removeAttribute("disabled");
    }

}

//渲染產品列表
function renderProducts(data){
    let productList = "";
    data.forEach(function(product){
        productList += `<li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${product.images}" alt="">
        <a href="#" class="addCardBtn" data-id="${product.id}">加入購物車</a>
        <h3>${product.title}</h3>
        <del class="originPrice">NT$${product.origin_price}</del>
        <p class="nowPrice">NT$${product.price}</p>
    </li>`;
    });
    productWrap.innerHTML = productList;
}

//加入購物車
function addCarts(id){
    const data = {
        "data": {
          "productId": id,
          "quantity": 1,
        },
      };
    axios.post(cartsApiUrl,data).then(function(response){
        carts = response.data.carts;
        finalTotal = response.data.finalTotal;
        renderCarts();
        // console.log(response.data);
    })
    .catch(function(error){
        console.log(error.response.data.message);
    });
}
//取得購物車列表
function getCarts(){
    axios.get(cartsApiUrl).then(function(response){
        // console.log(response.data.finalTotal);
        carts = response.data.carts;
        // console.log(carts);
        finalTotal = response.data.finalTotal;
        renderCarts()
    })
    .catch(function(error){
        console.log(error.response.data.message);
    });
}

//取得產品列表
function getProducts(){
    axios
    .get(productsApiUrl)
    .then(
        function(response){
            products = response.data.products;
            renderProducts(products);
            // console.log(products);
        }
    )
    .catch(function(error){
        console.log(error.response.data.message);
    });

}
function init(){
    getProducts();
    getCarts();
}

init();