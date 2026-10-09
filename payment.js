// window.onload = function() {
//     let totalPrice = localStorage.getItem('totalPrice');
//     if (totalPrice) {
//         document.querySelector(".total-price").innerText = "$" + parseFloat(totalPrice).toFixed(2);
//     }

// let cartItems = localStorage.getItem('cartItems');
// if (cartItems) {
// let x.innerText = document.querySelector(".cart-items")
// return x
// }
// }

// function openForm1(){
//     document.getElementById('form-cash').style.display = "block"
//     document.getElementById('form-credit').style.display = "none"
// };
// function openForm2(){
//     document.getElementById('form-credit').style.display = "block"
//     document.getElementById('form-cash').style.display = "none"
// };
// function closeForm1(){
//     document.getElementById('form-cash').style.display = "none";
//     alert("Thank you for your purchase!")
//     window.location.assign("/receipt.html")
// };
// function closeForm2(){
//     document.getElementById('form-credit').style.display = "none"
//     alert("Thank you for your purchase!")
//     window.location.assign("/receipt.html")
// };
// function back(){
//     document.getElementById('form-credit').style.display = "none"
//     document.getElementById('form-cash').style.display = "none"
// }


//Dropdown option for delivery or pickup
// function selector(){
//     let x = document.getElementsByClassName(select).value
//     if(value == "pickup-1"||value == "pickup-2"){
//         let y = document.getElementsByClassName('dropdown').innerHTML
//         y.createElement('p') = "This order will take 20 minutes to be ready..."
//     }
//     else if(value == "delivery-1"||value == "delivery-2"){
//         let z = document.getElementsByClassName('dropdown').innerHTML
//         z.createElement('p') = "This order will take 40 minutes to be ready and delievered..."
//     }
// }

// function value(event){
//     value.addEventListener("keypress", function(){
//         return event.charCode != 8 && event.charCode == 0 || event.charCode >= 48 && event.charCode<=57;
//     })
// }

//AFter purchasig order make sure cart automatically clears its items


// function onInvalid (e) {
//     e.target.getElementsByClassName('required');
//   }

//   let form = document.querySelector('forms');

//   document.querySelectorAll('input').forEach(input => {
//     input.addEventListener('required', onInvalid);
//   });

//   form.addEventListener('submit', (e) => {
//     e.preventDefault();

//     let valid = form.reportValidity();
//   })




function setTipAmount() {
    let tipamount = document.getElementById("tip2").value;

    if (tipamount == "0") {
        alert("Please select a tip amount.");
    } else {
        localStorage.setItem("tipamount", tipamount);
    }

}



// function pickUpOrDelivery() {
//     let pickUpOrDelivery = document.querySelector("pickDeliv").value;
//     localStorage.setItem("pickUpOrDelivery", pickUpOrDelivery);
// }