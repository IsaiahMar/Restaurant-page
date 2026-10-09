// window.onload = function() {
//     let totalPrice = localStorage.getItem('totalPrice');
//     if (totalPrice) {
//         document.querySelector(".total-price").innerText = "$" + parseFloat(totalPrice).toFixed(2);
//     }
// }

// function returnHome() {
//     location.replace("index.html");
//     clearCart();
// }

// let cart = {};
// if (localStorage.getItem("cart")) {
//     cart = JSON.parse(localStorage.getItem("cart"));
//     displayCartItems();
//     updateCartTotal();
// }

// function addToCart(itemName, itemPrice) {
//     if (cart[itemName]) {
//         alert(`${itemName} is already in the cart!`);
//     } else {
//         cart[itemName] = { price: itemPrice, quantity: 1 };
//         console.log(cart);
//         displayCartItems();
//         updateCartTotal();
//         localStorage.setItem("cart", JSON.stringify(cart));
//         alert(`You added ${itemName} to your cart!`);
//     }
//     // console.log(cart);
// }

// function displayCartItems() {
//     const cartItemsContainer = document.querySelector(".cart-items");
//     cartItemsContainer.innerHTML = "";

//     for (let itemName in cart) {
//         const item = cart[itemName];

//         const cartRow = document.createElement("div");
//         cartRow.classList.add("cart-row");

//         const cartRowHTML = `
//         <div class="cart-item cart-column">
//           <span class="cart-item-title">${itemName}</span>
//         </div>
//         <span class="cart-price cart-column">$${item.price.toFixed(2)}</span>
//         <div class="cart-quantity cart-column">
//             <input class="cart-quantity-input" type="number" value="${
//                 item.quantity
//             }" data-item-name="${itemName}">
//         </div>
//       `;

//         cartRow.innerHTML = cartRowHTML;
//         cartItemsContainer.append(cartRow);
//     }

//     let quantityInputs = document.querySelectorAll(".cart-quantity-input");
//     quantityInputs.forEach((input) => {
//         input.addEventListener("change", (event) => {
//             let newQuantity = parseInt(event.target.value);
//             let itemName = event.target.getAttribute("data-item-name");
//             console.log(`Item Name: ${itemName}, New Quantity: ${newQuantity}`);
//             updateQuantity(itemName, newQuantity);
//         });
//     });
// }

// function removeFromCart(itemName) {
//     delete cart[itemName];
//     displayCartItems();
//     updateCartTotal();
//     localStorage.setItem("cart", JSON.stringify(cart));
// }

// function updateCartTotal() {
//     let total = 0;
//     for (let itemName in cart) {
//         total += cart[itemName].price * cart[itemName].quantity;
//     }

//     localStorage.setItem('totalPrice', total);

//     document.querySelector(".cart-total .cart-total-price").innerText =
//         "$" + total.toFixed(2);
//     console.log(total);
// }


// function clearCart() {
//     cart = {};
//     localStorage.removeItem("cart");
//     displayCartItems();
//     updateCartTotal();
// }

// window.onload = function() {
//     let name = localStorage.getItem('name');
//     document.querySelector(".displayName").innerHTML = name;
// }

// function returnHome() {
//     location.replace("index.html");
//     clearCart();
// }

// let cart = {};
// if (localStorage.getItem("cart")) {
//     cart = JSON.parse(localStorage.getItem("cart"));
//     displayCartItems();
//     updateCartTotal();
// }
// function addToCart(item) {
//     var parentElement = item.parentNode;
//     var itemName = parentElement.children[0].textContent;
//     var itemPrice = parentElement.children[2].textContent;
//         if (cart[itemName]) {
//             alert(`${itemName} is already in the cart!`);
//         } else {
//             cart[itemName] = { price: itemPrice, quantity: 1 };
//             displayCartItems();
//             updateCartTotal();
//             localStorage.setItem("cart", JSON.stringify(cart));
//             alert(`${itemName} is added to the cart!`);
//         }
//     }

// function displayCartItems() {
//     const cartItemsContainer = document.querySelector(".cart-items");
//     cartItemsContainer.innerHTML = "";

//     for (let itemName in cart) {
//         const item = cart[itemName];

//         const cartRow = document.createElement("div");
//         cartRow.classList.add("cart-row");

//         const cartRowHTML = `
//         <div class="cart-item cart-column">
//           <span class="cart-item-title">${itemName}</span>
//         </div>
//         <span class="cart-price cart-column">${item.pr ice}</span>
//         <div class="cart-quantity cart-column">
//             <input class="cart-quantity-input" type="number" value="${
//                 item.quantity
//             }" data-item-name="${itemName}">
//         </div>
//       `;

//         cartRow.innerHTML = cartRowHTML;
//         cartItemsContainer.append(cartRow);
//     }

//     let quantityInputs = document.querySelectorAll(".cart-quantity-input");
//     quantityInputs.forEach((input) => {
//         input.addEventListener("change", (event) => {
//             let newQuantity = parseInt(event.target.value);
//             let itemName = event.target.getAttribute("data-item-name");
//             console.log(`Item Name: ${itemName}, New Quantity: ${newQuantity}`);
//             updateQuantity(itemName, newQuantity);
//         });
//     });
// }

// function removeFromCart(itemName) {
//     delete cart[itemName];
//     displayCartItems();
//     updateCartTotal();
//     localStorage.setItem("cart", JSON.stringify(cart));
// }

// function updateCartTotal() {
//     let total = 0;
//     for (let itemName in cart) {
//         total += cart[itemName].price * cart[itemName].quantity;
//     }

//     localStorage.setItem('totalPrice', total);

//     document.querySelector(".cart-total .cart-total-price").innerText =
//         "$" + total.toFixed(2);
//     console.log(total);
// }



function clearCart() {
    cart = {};
    localStorage.removeItem("cart");
    displayCartItems();
    updateCartTotal();
}

// window.onload = function() {
//     let name = localStorage.getItem('name');
//     document.querySelector(".displayName").innerHTML = name;
// }

function returnHome() {
    location.replace("menu.html");
    localStorage.removeItem('totalPrice');
    localStorage.removeItem('cart');
    localStorage.removeItem('tipamount');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (40 - 20 + 1)) + 20 + " minutes.";
}