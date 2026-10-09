window.onload = function() {

    document.getElementById('menus').contentEditable = true

}
let priceChange = document.querySelectorAll('.product-price')



function removeSelected() {
    const checkedItems = document.querySelectorAll('.checkedItems')
    checkedItems.forEach(item => {

        if (item.checked) {
            var card = item.parentElement
            removeItem(card)
        }

    })
};

function removeItem(divToRemove) {
    divToRemove.remove()
  }
  function addBreadItems(){
    const breadItemsContainer = document.querySelector("#bread-container");
    let newBreadTitle = document.getElementById('productName').value
    let newBreadPrice = document.getElementById('product-price').value
    let newBreadImg = document.getElementById('product-img').value
    let newBreadDescrip = document.getElementById('product-desc').value
    const newBreadProduct = document.createElement('div')
    newBreadProduct.classList.add('new-item')
    const newItem = `
    <h1 style="color: rgb(174, 107, 20); text-align: center; font-family: glass antiqua;">New Items</h1>
    <div id="item newItem">
    <img id ="productimg" width="200" src="${newBreadImg}" alt="">
    <input type="checkbox" id="checkedItem" class = "checkedItems" >
    <div class="products-item-details">
      <h3 class="product-title">${newBreadTitle}</h3>
        <p>${newBreadDescrip}</p>
        <p class="product-price">${newBreadPrice}</p>
        <button onclick="addToCart(this)" class="btn prime-btn product-btn">Add To Cart</button>
    </div>
    </div>`
    newBreadProduct.innerHTML = newItem
    breadItemsContainer.appendChild(newBreadProduct)
    clearInputs()
}
function addBeverageItems(){
  const menuItemsContainer = document.querySelector("#beverage-container");
  let newTitle = document.getElementById('productName').value
  let newPrice = document.getElementById('product-price').value
  let newImg = document.getElementById('product-img').value
  let newDescrip = document.getElementById('product-desc').value
  const newBeverageProduct = document.createElement('div')
  newBeverageProduct.classList.add('new-item')
  const newItem = `
  <h1 style="color: rgb(174, 107, 20); text-align: center; font-family: glass antiqua;">New Item</h1>
  <div id="item newItem">
  <img id ="productimg" width="200" src="${newImg}" alt="">
  <div class="products-item-details">
    <h3 class="product-title">${newTitle}</h3>
      <p>${newDescrip}</p>
      <p class="product-price">${newPrice}</p>
      <button onclick="addToCart(this)" class="btn prime-btn product-btn">Add To Cart</button>
  </div>
  </div>`
  newBeverageProduct.innerHTML = newItem
  menuItemsContainer.appendChild(newBeverageProduct)
  clearInputs()
}
function addDessertItems(){
  const dessertItemsContainer = document.querySelector("#dessert-container");
  let dessertTitle = document.getElementById('productName').value
  let dessertPrice = document.getElementById('product-price').value
  let dessertImg = document.getElementById('product-img').value
  let dessertDescrip = document.getElementById('product-desc').value
  const newDessertProduct = document.createElement('div')
  newDessertProduct.classList.add('new-item')
  const newItem = `
  <h1 style="color: rgb(174, 107, 20); text-align: center; font-family: glass antiqua;">New Item</h1>
  <div id="item newItem">
  <img id ="productimg" width="200" src="${dessertImg}" alt="">
  <div class="products-item-details">
    <h3 class="product-title">${dessertTitle}</h3>
      <p>${dessertDescrip}</p>
      <p class="product-price">${dessertPrice}</p>
      <button onclick="addToCart(this)" class="btn prime-btn product-btn">Add To Cart</button>
  </div>
  </div>`
  newDessertProduct.innerHTML = newItem
  dessertItemsContainer.appendChild(newDessertProduct)
  clearInputs()
}
function addBreakfastItems(){
  const mainItemsContainer = document.querySelector("#breakfeast-contain");
  let breakfastTitle = document.getElementById('productName').value
  let breakfastPrice = document.getElementById('product-price').value
  let breakfastImg = document.getElementById('product-img').value
  let breakfastDescrip = document.getElementById('product-desc').value
  const newBreakfastProduct = document.createElement('div')
  newBreakfastProduct.classList.add('new-item')
  const newItem = `
  <h1 style="color: rgb(174, 107, 20); text-align: center; font-family: glass antiqua;">New Item</h1>
  <div id="item newItem">
  <img id ="productimg" width="200" src="${breakfastImg}" alt="">
  <div class="products-item-details">
    <h3 class="product-title">${breakfastTitle}</h3>
      <p>${breakfastDescrip}</p>
      <p class="product-price">${breakfastPrice}</p>
      <button onclick="addToCart(this)" class="btn prime-btn product-btn">Add To Cart</button>
  </div>
  </div>`
  newBreakfastProduct.innerHTML = newItem
  mainItemsContainer.appendChild(newBreakfastProduct)
  clearInputs()
}
function clearInputs(){
  let clearAllInputTags = document.querySelectorAll('input');
  clearAllInputTags.forEach(eachInput => eachInput.value = '');
}

function displayItems() {
    let sessionMenu = localStorage.getItem('Original-Menu') ?? orgMenu
    var displayMenu = document.getElementById("display-menu")
    console.log(displayMenu)
    displayMenu.innerHTML = sessionMenu


}
displayItems()


function saveSession() {
    var testdiv = document.getElementById('menus').outerHTML
    localStorage.setItem('Original-Menu', testdiv)
    console.log(localStorage.getItem('Original-Menu'))
    // location.replace('menu.html')
  }

