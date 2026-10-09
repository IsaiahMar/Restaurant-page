function signUp() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let pass = document.getElementById("pass").value;

    if (email == "" || pass == "") {
        alert("Please fill the forms");
    } else {
        localStorage.setItem('name', name); // Store the name
        localStorage.setItem(email, pass);
        alert("Account Created");
        location.replace("login.html");
    }
}

function login() {
    let email = document.getElementById("email").value;
    let pass = document.getElementById("pass").value;

    if (localStorage.getItem(email)) {
        if (pass == localStorage.getItem(email)) {
            location.replace("menu.html");
            alert("Login Successful");
        } else if (pass == "") {
            alert("Login Failed please enter your password");
        }
    } else if (email == "") {
        alert("Login Failed please enter your email");
    } else if (localStorage.getItem(email) == null || pass == "") {
        alert("Login Failed Unknown credential combination");
    }
}
function customerLogout(){
    // Only remove this customer's session data. localStorage.clear() also
    // deleted the saved menu and every customer account.
    localStorage.removeItem('name')
    localStorage.removeItem('cart')
    localStorage.removeItem('receipt')
    localStorage.removeItem('tipamount')
    location.replace('login.html')
}


const orgMenu = `
<div id ="menus">
<div class="Breakfast">
<div id="breakfeast-contain">
    <div  class="item product-item">
        <img id ="product-img" width="200" src="https://lamadeleine.com/wp-content/uploads/2019/04/LMD061720_SummerLTODigital_PT004_1rt5.jpg" alt="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
        <h3 class="product-title">Croque Madame</h3>
            <p class="product-desc">Smoked ham & Swiss with garlic cream sauce baked on country bread & topped with a fried egg. Served with wild field & balsamic on the side. Daily before 11am.</p>
            <p class="product-price">$29</p>
            <button onclick="addToCart(this)" class="btn prime-btn product-btn">Add To Cart</button>
        </div>
    </div>
    <div  class="item product-item">
        <img id ="product-img" width="200" src="https://lamadeleine.com/wp-content/uploads/2019/02/LMD_101518_MenuItemImageResize_196x274_PT0004-Breakfast-CountryFrenchBfast-Bacon.jpg" alt="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
            <h3 class="product-title">Big French Breakfast</h3>
            <p class="product-desc">This Breakfast will make you full for hours. You might even get lunch as well.</p>
            <p class="product-price">$27</p>
            <button onclick="addToCart(this)" class="btn prime-btn product-btn">Add To Cart</button>
        </div>
    </div>
    <div  class="item product-item">
        <img id ="product-img" width="200" src="images/products/fritters.jpeg" alt="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
        <h3 class="product-title">Fritters</h3>
            <p class="product-desc">fritter, any of various types of fried foods, generally consisting of small pieces of meat, vegetables, fruit, or dough.</p>
            <p class="product-price">$15</p>
            <button onclick="addToCart(this)" class="btn prime-btn product-btn">Add To Cart</button>
        </div>
    </div>
    <div  class="item product-item">
        <img id ="product-img" width="200" src="images/products/mousse.jpeg" alt="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
            <h3 class="product-title">Mousse</h3>
            <p class="product-desc"> This super moist dark chocolate mousse combines unsweetened natural cocoa powder and dark cocoa powder for an extra rich flavor.</p>
            <p class="product-price">$35.00</p>
            <button onclick="addToCart(this)" class="btn prime-btn product-btn">Add To Cart</button>
        </div>
    </div>
    <div  class="item product-item">
        <img id ="product-img" width="200" src="images/products/donut.jpeg" alt="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
        <h3 class="product-title">Donuts</h3>
            <p class="product-desc">We are not gonna give three donuts, or two Donuts, but only one donut for 10.99 and its topped with freshly picked strawberries.</p>
            <p class="product-price">$10.99</p>
            <button onclick="addToCart(this)" class="btn prime-btn product-btn">Add To Cart</button>
        </div>
    </div> 
</div>
</div><br><br><br><br><br>

<h1 style="color: blue; text-align: center; font-family: glass antiqua;">Bread</h1>
<div id="bread-container" class="items-container">
    <div class="item product-bread">
        <img id ="product-img" class="shop-item-image" width="200" src="images/products/bagel.jpeg" alt="" srcset="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
        <h3 class="shop-item-title">Bagels</h3>
        <p class="product-desc">Made fresh on Location: toasted and smothered with homemade creamcheese.</p>
        <div class="shop-item-price">$4.00</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
    <div class="item product-bread">
        <img id ="product-img" class="shop-item-image" width="200" src="images/products/rye-bread-2.jpeg" alt="" srcset="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
        <h3 class="shop-item-title">Fresh Rye Bread</h3>
        <p class="product-desc">Made fresh on Location. Whole loaf can come sliced upon request.</p>
        <div class="shop-item-price">$12.00</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
    <div class="item product-bread">
        <img id ="product-img" class="shop-item-image" width="200" src="https://www.simplyrecipes.com/thmb/tR-5eHAZ3lgNR6Yvu3yxdHMNpk8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Easy-Banana-Bread-LEAD-2-2-63dd39af009945d58f5bf4c2ae8d6070.jpg" alt="" srcset="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
        <h3 class="shop-item-title">Banana Bread</h3>
        <p class="product-desc">Banana bread is a type of sweet bread made from mashed bananas.</p>
        <div class="shop-item-price">$20.00</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
    <div class="item product-bread">
    <img id ="product-img" class="shop-item-image" width="200" src="https://static01.nyt.com/images/2023/07/21/multimedia/21baguettesrex-hbkc/21baguettesrex-hbkc-threeByTwoMediumAt2X.jpg" alt="" srcset="">
    <input type="checkbox" id="checkedItem" class = "checkedItems" >
    <div class="products-item-details">
    <h3 class="shop-item-title">Baguette</h3>
    <p class="product-desc">A baguette is a long, thin type of bread of French origin that is commonly made from basic lean dough.</p>
    <div class="shop-item-price">$15.00</div>
    <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
</div>
</div>
</div>
<br>
<br>
<br>
<h1 style="color: rgb(174, 107, 20); text-align: center; font-family: glass antiqua;">Beverages</h1>
<div id="beverage-container" class="items-container">
    <div class="item product-beverage">
        <img id ="product-img" class="shop-item-image" width="200" src="images/products/affogato-el-cafe.jpeg" alt="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
        <h3 class="shop-item-title">Affogato el Cafe</h3>
        <p class="product-desc">Made by pouring expresso from freshly ground coffe beans over two scoops of vanilla icecream.</p>
        <div class="shop-item-price">$4.00</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</a>
    </div>
    </div>
    <div class="item product-beverage">
        <img id ="product-img" class="shop-item-image" width="200" src="images/products/beverage.jpeg" alt="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
        <h3 class="shop-item-title">Frozen Cappuccino</h3>
        <p class="product-desc">Double blended with ice and topped with whipped cream and caramel.</p>
        <div class="shop-item-price">$12.00</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
    <div class="item product-beverage">
        <img id ="product-img" class="shop-item-image" width="200" src="images/products/cappuccino.jpeg" alt="" srcset="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
        <h3 class="shop-item-title">Cappuccino</h3>
        <p class="product-desc">Hot shot of expresso with steamed milk and topped with a sweet milk foam.</p>
        <div class="shop-item-price">$9.00</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
    <div class="item product-beverage">
        <img id ="product-img" class="shop-item-image" width="200" src="images/products/chamomile-tea.jpeg" alt="" srcset="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
        <h3 class="shop-item-title">Chamomile Tea</h3>
        <p class="product-desc">Freshly dried Chamomile flower tea optionally sweetened with sugar or honey.</p>
        <div class="shop-item-price">$5.00</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
    <div class="item product-beverage">
        <img id ="product-img" class="shop-item-image" width="200" src="images/products/coffee-milk.jpeg" alt="" srcset="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
        <h3 class="shop-item-title">Black Coffee with fresh cream</h3>
        <p class="product-desc">Newly toasted coffee beans grounded and made into a nice hotcup of cofee with fresh cream.</p>
        <div class="shop-item-price">$5.00</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
    <div class="item product-beverage">
        <img id ="product-img" class="shop-item-image" width="200" src="images/products/french-press.jpeg" alt="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
        <h3 class="shop-item-title">Black Coffee French Press</h3>
        <p class="product-desc">Freshly toasted and ground coffee beans with two-three cups of coffee inside the french press.</p>
        <div class="shop-item-price">$12.00</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
    <div class="item product-beverage">
        <img id ="product-img" class="shop-item-image" width="200" src="images/products/expresso.jpeg" alt="" srcset="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
        <h3 class="shop-item-title">Expresso Shot</h3>
        <p class="product-desc">A single shot of expresso.</p>
        <div class="shop-item-price">$7.49</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
</div>
<br>
<br>
<br>
<h1 style="color: rgb(174, 107, 20); text-align: center; font-family: glass antiqua;">Desserts</h1>
<div id="dessert-container" class="dessert-container">
  <div  class="item product-dessert">
    <img id ="product-img" width="200" src="images/products/cheese-cake-2.jpeg" alt="">
    <input type="checkbox" id="checkedItem" class = "checkedItems" >
    <div class="products-item-details">
    <h3 class="product-title">Vanilla Cheesecake</h3>
        <p class="product-desc"> With its outstanding vanilla flavor, pillowy soft crumb, and creamy vanilla buttercream, this is truly the best vanilla cheesecake I've ever had.</p>
        <p class="product-price">$40.00</p>
        <button onclick="addToCart(this)" class="btn prime-btn product-btn">Add To Cart</button>
    </div>
</div>
    <div  class="item product-dessert">
    <img id ="product-img" class="shop-item-image" width="200" src="images/products/cream-puff2.jpeg" alt="" srcset="">
    <input type="checkbox" id="checkedItem" class = "checkedItems">    
    <div class="products-item-details">
    <h3 class="shop-item-title">Cream-Puff</h3>
        <p class="product-desc">A single cream puff with freshly whipped cream and strawberries from the local market.</p>
        <div class="shop-item-price">$5.49</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
        </div>
    </div>
    <div  class="item product-dessert">
    <img id ="product-img" class="shop-item-image" width="200" src="images/products/apple-strudel.jpeg" alt="" srcset="">
    <input type="checkbox" id="checkedItem" class = "checkedItems"> 
    <div class="products-item-details">
        <h3 class="shop-item-title">Apple Strudel</h3>
        <p class="product-desc">Apple strudel is a traditional Viennese strudel, a popular pastry in Austria, Bavaria, the Czech Republic, Northern Italy, Slovenia, Croatia, and other countries in Europe.</p>
        <div class="shop-item-price">$14.49</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
    <div  class="item product-dessert">
    <img id ="product-img" class="shop-item-image" width="200" src="images/products/cup-cakes-2.jpeg" alt="" srcset="">
    <input type="checkbox" id="checkedItem" class = "checkedItems">    
    <div class="products-item-details">
    <h3 class="shop-item-title">Cupcake</h3>
        <p class="product-desc">A single cupcake waiting to be eaten.</p>
        <div class="shop-item-price">$5.49</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
    <div  class="item product-dessert">
        <img id ="product-img" width="200" src="images/products/plum-cake.jpeg" alt="">
        <input type="checkbox" id="checkedItem" class = "checkedItems" >
        <div class="products-item-details">
            <h3 class="product-title">Plum cake</h3>
            <p class="product-desc">Very good cake to have if you want to eat your feelings away. Taste's especially nice on a rainy day after your mother's funeral.</p>
            <p class="product-price">$25.00</p>
            <button onclick="addToCart(this)" class="btn prime-btn product-btn">Add To Cart</button>
        </div>
    </div>
    <div  class="item product-dessert">
    <img id ="product-img" class="shop-item-image" width="200" src="images/products/tart-coco2.jpeg" alt="" srcset="">
    <input type="checkbox" id="checkedItem" class = "checkedItems">      
    <div class="products-item-details">
        <h3 class="shop-item-title">Chocolate Tart</h3>
        <p class="product-desc">A single Chocolate tart with fresh chocolate cream and candied raspberries.</p>
        <div>$9.99</div>
        <button class="btn" onclick="addToCart(this)"" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
    <div  class="item product-dessert">
    <img id ="product-img" class="shop-item-image" width="200" src="images/products/macaroons.jpeg" alt="" srcset="">
    <input type="checkbox" id="checkedItem" class = "checkedItems">      
    <div class="products-item-details">
    <h3 class="shop-item-title">Macaroons</h3>
        <p class="product-desc">Eight maccaroons with strawberry filling per order.</p>
        <div class="shop-item-price">$34.49</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
    <div  class="item product-dessert">
    <img id ="product-img" class="shop-item-image" width="200" src="images/products/meringue.jpeg" alt="" srcset="">
    <input type="checkbox" id="checkedItem" class = "checkedItems">      
    <div class="products-item-details">
        <h3 class="shop-item-title">Meringue cookies</h3>
        <p class="product-desc">Light and fluffly little crisps that melt away on the tongue. Pack of 24 per order.</p>
        <div class="shop-item-price">$29.99</div>
        <button class="btn" onclick="addToCart(this)" style="text-decoration: none;">Add To Cart</button>
    </div>
    </div>
    </div>
</div>
</div>`
let firstLogin = false

function staffLogin() {

    let staffEmail = document.getElementById('staffU').value;
    let staffPass = document.getElementById('Staffpass').value;

    if (staffEmail === 'admin22@gmail.com' && staffPass === 'Quack') {

        localStorage.setItem('manager', true)
        alert('You are now in manager mode.')

        if (firstLogin === false) {
            localStorage.setItem('Original-Menu', orgMenu)


        }
        location.replace('edit-menu.html')
    }
     else {
        alert('Login failed')
    }
}


    
function staffLogout(){
    sessionStorage.setItem('manager', false)
    location.replace('staff-login.html')
    
}


const header = document.querySelector('.navbar');

window.onscroll = function() {
    var top = window.scrollY;
    //console.log(top);
    if (top >= 100) {
        header.classList.add('navbarDark');
    } else {
        header.classList.remove('navbarDark');
    }
}



function contactAlert() {
    alert("Thank you for contacting us. We will get back to you as soon as possible.");
    let review = document.getElementById("review").value;
    localStorage.setItem("review", review);

}