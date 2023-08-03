function arrayShufle(array) {
    return array.sort((a, b) => 0.5 - Math.random())
}
const kursUSD = 1458.49

var x=document.getElementById("logbox");
x.style.display = "none";

let nftBase=[
    {
        "name": "Charizard",
        "img": "charizard.png",
        "price": 2.15
    },
    {
        "name": "Garchomp",
        "img": "garchomp.png",
        "price": 1.55
    },
    {
        "name": "Gengar",
        "img": "gengar.png",
        "price": 0.70
    },
    {
        "name": "Gradevoir",
        "img": "gradevoir.png",
        "price": 0.75
    },
    {
        "name": "Infernape",
        "img": "infernape.png",
        "price": 0.95
    },
    {
        "name": "Lucario",
        "img": "lucario.png",
        "price": 0.80
    },
    {
        "name": "Mewtwo",
        "img": "mewtwo.png",
        "price": 1.90
    },
    {
        "name": "Milotic",
        "img": "milotic.png",
        "price": 0.65
    },
    {
        "name": "Scizor",
        "img": "scizor.png",
        "price": 0.70
    },
];

document.addEventListener("DOMContentLoaded", () => {
    const productList = document.querySelector("div.product-list")

    productList.innerHTML = ""
    // console.log(arrayShufle(nftBase));
    arrayShufle(nftBase).forEach(el => {
        productList.innerHTML += `
            <div class="col-4 product animate__animated animate__fadeInUpBig">
                <img src="static/img/${el['img']}" alt="product">
                <div class="position-relative">
                    <span class="badge rounded-pill bg-danger price-badge">${el['price']} ETH.</span>
                </div>
                <div class="btn-group btn-group-sm " role="group" data-product='${JSON.stringify(el)}'>
                    <button type="button" class="btn btn-outline-info" data-rol="info" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i class="fa-solid fa-circle-info" style="color: #ffffff;"></i>
                    </button>
                    <button type="button" class="btn btn-outline-info" data-rol="save">
                        <i class="fa-solid fa-chart-line" style="color: #ffffff;"></i>
                    </button>
                    <button type="button" class="btn btn-outline-info" data-rol="buy"><i class="fa-solid fa-cart-shopping" style="color: #ffffff;"></i></button>
                </div>
            </div>`;
    })
    const products = document.querySelectorAll(".product")
    let i = 0
    let printer = setInterval(() => {
        let el = products[i]
        i < products.length ? el.style.display = "block" : clearInterval(printer)
        i++
    }, 200)
    cart()
    const store = document.querySelectorAll(".btn-outline-info")
    store.forEach(el => {
        el.addEventListener("click", () => {
            // console.log(JSON.parse(el.parentElement.dataset.product));
            switch (el.dataset.rol) {
                case "info":
                    showInfo(JSON.parse(el.parentElement.dataset.product))
                    break
                case "save":
                    saveProduct(JSON.parse(el.parentElement.dataset.product))
                    break
                case "buy":
                    cart({
                        'add': JSON.parse(el.parentElement.dataset.product)
                    })
                    break
                default:
                    break
            }
        })
    })
    // checkout-clear
    document.querySelector(".checkout-clear").addEventListener("click", () => {
        cart({
            'clear': true
        })
    })
})

function cart(params = []) {
    let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {}
    if (params['add']) {
        cart[params['add']['name']] = params['add']
        localStorage.setItem("cart", JSON.stringify(cart));
    } else if (params['remove']) {
        delete cart[params['remove']]
        localStorage.setItem("cart", JSON.stringify(cart));
    } else if (params['clear']) {
        cart = {};
        localStorage.setItem("cart", "{}");
    }
    let totalSum = 0
    const cartList = document.querySelector(".cart-list")
    Object.values(cart).forEach((product, index) => {
        if (index == 0) cartList.innerHTML = ""
        totalSum += product.price
        cartList.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2">
                    <img src="static/img/${product.img}" alt="text" class="cart-thumps">
                </div>
                <div class="ms-2 me-auto">
                    <div class="fw-bold">NFT N: ${product.name}</div>
                    <span class="small">${product.price} ETH ~ $${product.price * kursUSD}.</span>
                </div>
                <span class="badge bg-danger rounded-pill" onclick="cart({'remove': '${product.name}'})">
                    <i class="fa-regular fa-trash-can"></i>
                </span>
            </li>`

    })
    document.querySelector(".cart-sum").innerText = `${totalSum.toFixed(2)} ETH`
    if (Object.keys(cart).length < 1) {
        cartList.innerHTML =
            `<li class="list-group-item d-flex justify-content-between align-items-start">Products not found !</li>`
        mainButton.hide();
    } else {
        mainButton.show();
        mainButton.setParams({
            'text': 'Pay ' + (totalSum * kursUSD).toFixed(2) + ' USD.',
            'color': "#2ECC71",
            'text_color': "#F7F9F9"
        })
    }
    return cart
}
const showInfo = (product) => {
    document.querySelector("#exampleModalLabel").innerHTML =
        `NFT: ${product.name} <span class="badge rounded-pill bg-danger">${product.price} ETH.</span>`
}
const saveProduct = (product) => {
    console.log("Save in list of favorites !");
}

mainButton.onClick(() => {
// mainButton.showProgress();
let orderList = []
Object.values(cart()).forEach(product => {
    orderList.push({
        'label': product.name,
        'amount': (product.price * kursUSD * 100).toFixed(0)
    })
})
// console.log(orderList);
// document.querySelector("#logbox").innerText = JSON.stringify(orderList, null, 4)
const BotToken = '6291243164:AAENlR1B8f2OwGFZyTeTd-iSEnrUrUERa_s'
let method = "sendInvoice"
axios.post(`https://api.telegram.org/bot${BotToken}/${method}`, {
        'chat_id': telegramData.user.id,
        'title': 'POKEMON NFT.',
        'description': 'The order is buying NFT tokens.',
        'payload': "order_id=G3645",   
        'provider_token': '284685063:TEST:OWU1ZmU2OWM5MjQ2',
        'currency': 'USD',
        'max_tip_amount': 1000 * 100,
        'prices': orderList,
        'suggested_tip_amounts': [
            1 * 100, 5 * 100, 50 * 100, 100 * 100,
        ],
        'photo_url': "https://i.pinimg.com/originals/ce/86/bf/ce86bfc1979af3ac87db7ab1f2dd07b2.jpg",
        'photo_width': 735,
        'photo_height': 490,
        'need_name': true,
        'need_phone_number': true,
        'need_email': true,
        'need_shipping_address': true,
        'is_flexible': true,
        'reply_markup': {
            'inline_keyboard': [
                [{
                    'text': "🎁 Pay with discount",
                    'pay': true
                }],
                [{
                    'text': "⭕️ Cancel pay",
                    'callback_data': "pay||cancel"
                }],
                [{
                    'text': "♻️ Back to NFT Market",
                    'web_app': {
                        'url': 'https://hungnguyenkl.github.io/'
                    }
                }]
            ]
        },
    })
    .then(function (response) {
        // console.log(response);
        // document.querySelector("#logbox").innerText = JSON.stringify(response, null, 4)
        if (response.data.result) telegram.close()
    })
    .catch(function (error) {
        // document.querySelector("#logbox").innerText = JSON.stringify(error, null, 4)
        console.log(error);
    });
    
})
// const BotToken = '5418286898:AAGfWkyf8bZdeFqe7aXi_r0KDadkFsnrq8Q'
//     let method = "sendMessage"
//     axios.post(`https://api.telegram.org/bot${BotToken}/${method}`, {
//         'chat_id': 679143250,
//         'text': 'salom'
//     })
//     .then(function (response) {
//         console.log(response);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });