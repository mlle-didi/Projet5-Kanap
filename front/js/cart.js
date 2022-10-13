// AFFICHER LES ARTICLES DANS LE PANIER //

//Variables pour afficher le panier
const cartSection = document.getElementById("cart__items");
const cartOrder = document.getElementsByClassName("cart__order");
const cartPrice = document.getElementsByClassName("cart__price");
const h1 = document.getElementsByTagName("h1");

//Récupération des données du backend pour remplir les propriétés des canapés sur la page cart.html
function fetchIdData() {
    let totalQuantity = 0;
    let totalPrice = 0;
    //Si le panier n'est pas vide
    if (localStorage.getItem('cart') != null) {
        cartSection.innerHTML = "";
        let items = JSON.parse(localStorage.getItem('cart'));
        //On parcourt le tableau du localStorage pour trouver le produit demandé
        for (let i = 0; i < items.length; i++) {
            let id = items[i][0];
            let color = items[i][1];
            let quantity = items[i][2];
            //Requête pour récupérer les données du canapé
            fetch(`http://localhost:3000/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                //Intégration des données récupérées pour afficher l'article dans le panier
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
                    //Quand l'utilisateur modifie la quantité, la fonction changeQuantity se déclenche
                    item.addEventListener("change", changeQuantity)
                }

                const deleteList = document.getElementsByClassName("deleteItem");
                for (let item of deleteList) {
                    //Quand l'utilisateur clique sur le bouton "supprimer", la fonction "removeItem" se déclenche
                    item.addEventListener("click", removeItem)
                }
                
                //Calcul et affichage du prix total
                totalPrice += data.price * quantity;
                document.getElementById('totalPrice').innerHTML = totalPrice;
            });

            //Calcul et affichage de la quantité totale
            totalQuantity += parseInt(quantity);
            document.getElementById('totalQuantity').innerHTML = totalQuantity;
        }
    //Si le panier est vide
    } else {
        h1[0].innerHTML = `Votre panier est vide`;
        cartSection.innerHTML = '';
        cartOrder[0].innerHTML = '';
        cartPrice[0].innerHTML = '';
    }
}
fetchIdData();  

//MODIFICATION DE LA QUANTITE DANS LE PANIER
function changeQuantity(e) {
    //Si le panier n'est pas vide
    if (localStorage.getItem('cart') != null) {
        let items = JSON.parse(localStorage.getItem('cart'));
        let {id, color} = e.target.closest(".cart__item").dataset;
        //On parcourt le tableau du localStorage pour trouver l'article demandé
        for (let i = 0; i < items.length; i++) {
            //Si son id et sa couleur correspond
            if (id === items[i][0] && color === items[i][1]) {
                //On modifie sa quantité avec la quantité saisie
                items[i][2] = parseInt(e.target.value);         
            }
            //Mise à jour du localStorage
            localStorage.setItem("cart", JSON.stringify(items));
        }
        //Mise à jour de l'affichage
        fetchIdData();
    }
}

//SUPPRESSION D'UN ARTICLE DANS LE PANIER
function removeItem(e) {
    //Si le panier n'est pas vide 
    if (localStorage.getItem('cart') != null) {
        let items = JSON.parse(localStorage.getItem('cart'));
        let {id, color} = e.target.closest(".cart__item").dataset;
        //On parcourt le tableau du localStorage pour trouver l'article demandé
        for (let i = 0; i < items.length; i++) {
            //Si son id et sa couleur correspond
            if (id === items[i][0] && color === items[i][1]) {
                //On le supprime
                items.splice(i, 1);
            }  
        }
        //Mise à jour du localStorage
        localStorage.setItem("cart", JSON.stringify(items));
        //Si le tableau des produits est vide
        if(localStorage.getItem('cart') === '[]') {
            //Alors on supprime le panier du localStorage
            localStorage.removeItem('cart');
        }
            //Mise à jour de l'affichage
            fetchIdData();
    }
}

// GERER LE FORMULAIRE CLIENT //

let items = JSON.parse(localStorage.getItem('cart'));

/*Envoie le formulaire lorsque l'on appuie sur le bouton "commander"
function getForm() {
    const form = document.querySelector('form');
    if (localStorage.getItem('cart') != null) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            //Création de l'objet contact à partir des données du formulaire
            const contact = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                email: document.getElementById("email").value,
            };
            
            //Prénom
            function formFirstName() {
                const validFirstName = contact.firstName;
                //
                let regexFirstName = /^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+))$/;
                if (regexFirstName.test(validFirstName)) {
                document.querySelector("#firstNameErrorMsg").innerHTML = "";
                return true;
                } else {
                let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
                firstNameErrorMsg.innerHTML = "Ne peut contenir de chiffres ou caractères spéciaux";
                }
            }
            formFirstName();
            
            //Nom de famille
            function formLastName() {
                const validLastName = contact.lastName;
                let regexLastName = /^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+))$/;
                if (regexLastName.test(validLastName)) {
                document.querySelector("#lastNameErrorMsg").innerHTML = "";
                return true;
                } else {
                let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
                lastNameErrorMsg.innerHTML =
                    "Ne peut contenir de chiffres ou caractères spéciaux";
                }
            }
            formLastName();

            //Adresse postale
            function formAddress() {
                const validAddress = contact.address;
                let regexpAddress = /^[^@&"()!_$*€£`+=\/;?#]+$/;
                if (regexpAddress.test(validAddress)) {
                document.querySelector("#addressErrorMsg").innerHTML = "";
                return true;
                } else {
                let addressErrorMsg = document.getElementById("addressErrorMsg");
                addressErrorMsg.innerHTML = "Veuillez saisir une adresse valide <br> Exemple: 10 rue de Paris";
                }
            }
            formAddress();

            //Ville
            function formCity() {
                const validCity = contact.city;
                let regexCity = /^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+)){1,10}$/;
                if (regexCity.test(validCity)) {
                document.querySelector("#cityErrorMsg").innerHTML = "";
                return true;
                } else {
                let cityErrorMsg = document.getElementById("cityErrorMsg");
                cityErrorMsg.innerHTML = "Veuillez saisir une nom de ville valide <br> Ne doit pas contenir de chiffre";
                }
            }
            formCity();

            //Adresse E-mail
            function formEmail() {
                const validEmail = contact.email;
                let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (regexEmail.test(validEmail)) {
                document.querySelector("#emailErrorMsg").innerHTML = "";
                return true;
                } else {
                let emailErrorMsg = document.getElementById("emailErrorMsg");
                emailErrorMsg.innerHTML = "Veuillez saisir une adresse email valide <br> Exemple: test@email.com";
                }
            }
            formEmail();

            function formValidation() {
                //Si le formulaire est correctement rempli, il créera un élément "contact" dans le localStorage
                if (
                formFirstName() == true &&
                formLastName() == true &&
                formAddress() == true &&
                formCity() == true &&
                formEmail() == true
                ) {
                localStorage.setItem("contact", JSON.stringify(contact));
                return true;
                //Sinon message d'erreur pour corriger le formulaire
                } else {
                e.preventDefault();
                }
            }
            formValidation();

            / Tableau du localStorage pour l'envoyer au serveur
            let items = [];
            for (let i = 0; i < items.length; i++) {
                items.push(items[i].id);
            }
            console.log(items);
            
            if (formValidation() === true) {
                // Création d'un objet "order" avec les informations de "contact" et "produits"
                const order = {
                    contact,
                    items,
                };

                //Requête qui retourne l'objet contact, le tableau produits et orderId
                fetch("http://localhost:3000/api/products/order", {
                    method: "POST",headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(order),
                })
                .then((res) => res.json())
                // Pour vérifier l'état de res.ok dans le réseau
                .then((data) => {
                    console.log(data);
                    localStorage.clear(); //Suppresion des clés stockées
                    localStorage.setItem("orderId", data.orderId); //Ajout du duo clé-valeur dans le localStorage
                    document.location.href = "confirmation.html";
                })
                .catch(() => {
                    alert ("Une erreur est survenue, merci de revenir plus tard.");
                })
            } else {
                e.preventDefault();
            }
        });
    }
}
getForm();*/