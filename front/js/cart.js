//Variables utiles
const cartSection = document.getElementById("cart__items");
const cartOrder = document.getElementsByClassName("cart__order");
const cartPrice = document.getElementsByClassName("cart__price");
const h1 = document.getElementsByTagName("h1");

//La fonction de récupération récupère les données du backend pour remplir les propriétés des canapés sur la page cart.html
function fetchIdData() {
    let totalQuantity = 0;
    let totalPrice = 0;
    if (localStorage.getItem('cart') != null) {
        cartSection.innerHTML = "";
        let items = JSON.parse(localStorage.getItem('cart'));
        for (let i = 0; i < items.length; i++) {
            let id = items[i][0];
            let color = items[i][1];
            let quantity = items[i][2];
            fetch(`http://localhost:3000/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {

                cartSection.innerHTML += `<article class='cart__item' data-id='${id}' data-color='${color}'>
                    <div class='cart__item__img'>
                    <img src='${data.imageUrl}' alt='${data.altTxt}'>
                    </div>
                    <div class='cart__item__content'>
                    <div class='cart__item__content__titlePrice'>
                        <h2>${data.name}</h2>
                        <p>${color}</p>
                        <p>${data.price} €</p>
                    </div>
                    <div class='cart__item__content__settings'>
                        <div class='cart__item__content__settings__quantity'>
                        <p>Qté : </p>
                        <input type='number' class='itemQuantity' name='itemQuantity' min='1' max='100' value='${quantity}'>
                        </div>
                        <div class='cart__item__content__settings__delete'>
                        <p class='deleteItem'>Supprimer</p>
                        </div>
                    </div>
                    </div>
                    </article>`;

                const quantityList = document.getElementsByClassName("itemQuantity");
                for (let item of quantityList) {
                    item.addEventListener("change", changeQuantity)
                }

                const deleteList = document.getElementsByClassName("deleteItem");
                for (let item of deleteList) {
                    item.addEventListener("click", removeItem)
                }
                
                //Prix total
                totalPrice += data.price * quantity;
                document.getElementById('totalPrice').innerHTML = totalPrice;
            });

            //quantité totale
            totalQuantity += parseInt(quantity);
            document.getElementById('totalQuantity').innerHTML = totalQuantity;
        }
    } else {
        h1[0].innerHTML = `Votre panier est vide`;
        cartOrder[0].innerHTML = '';
        cartPrice[0].innerHTML = '';
    }
}
fetchIdData();  

function changeQuantity(e) {
    if (localStorage.getItem('cart') != null) {
        let items = JSON.parse(localStorage.getItem('cart'));
        let {id, color} = e.target.closest(".cart__item").dataset;
        for (let i = 0; i < items.length; i++) {
            if (id === items[i][0] && color === items[i][1]) {
                items[i][2] = parseInt(e.target.value);         
            }
            localStorage.setItem("cart", JSON.stringify(items));
        }
        fetchIdData();
    }
}

function removeItem(e) {
    if (localStorage.getItem('cart') != null) {
        let items = JSON.parse(localStorage.getItem('cart'));
        let {id, color} = e.target.closest(".cart__item").dataset;
        for (let i = 0; i < items.length; i++) {
            if (id === items[i][0] && color === items[i][1]) {
                items.splice(i, 1);
            }
            localStorage.setItem("cart", JSON.stringify(items));
        }
        fetchIdData();
    }
}
