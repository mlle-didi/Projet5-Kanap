//LIEN ENTRE PRODUIT PAGE D'ACCUEIL ET PAGE PRODUIT

//Récupération de l'id dans l'URL
const urlProduct = new URLSearchParams (window.location.search);
const productID = urlProduct.get('id');

//Récupération des données du backend et construction du DOM
let fetchProduct = function() { //requete API
    fetch(`http://localhost:3000/api/products/${productID}`)
    .then((res) => res.json())
    .then((data) => {
        //Insertion de l'image
        let img = document.querySelector('.item__img');
        img.innerHTML = `<img src='${data.imageUrl}' alt='${data.altTxt}'>`;
        //Modification du titre de la page 
        let title = document.querySelector('title');
        title.innerHTML = data.name;
        //Modification du titre 'h1'
        let name = document.getElementById('title');
        name.innerHTML = data.name;
        //Modification du prix
        let price = document.getElementById('price');
        price.innerHTML = `${data.price}`;
        //Modification de la description
        let description = document.getElementById('description');
        description.innerHTML = data.description;
        //Insertion des options de couleurs
        let color = document.getElementById('colors');
        for (i = 0; i < data.colors.length; i++) {
          color.innerHTML += `<option value='${data.colors[i]}'>${data.colors[i]}</option>`;
        }
    });
};

fetchProduct();

//Obtenir la valeur de quantité et la couleur du canapé dans le balisage
function quantityValue() {
  let quantity = document.getElementById('quantity');
  return quantity.value;
}
function colorValue() {
  let color = document.getElementById('colors');
  return color.value;
}

//La fonction récupère le localStorage sous forme de tableau
function getCart() {
  let items = [];
  if (localStorage.getItem('cart') != null) {
    items = JSON.parse(localStorage.getItem('cart'));
  }
  return items;
}

//La fonction addTocart ajoute le canapé sélectionné au localStorage, selon qu'il y est ou non
function addToCart(id, color, quantity) {
  let addConfirm = () => {alert('Le produit a bien été ajouté au panier');}
  //Si la quantité est inférieur ou égale à 0 ou qu'une couleur n'est pas sélectionné alors il n'y a aucun ajout 
  if (quantity <= 0 || color == '') {
    return;
  }
  let items = getCart();
  //Si il n'y a aucun article dans le localStorage, on l'ajoute et on confirme son ajout
  if (items.length == 0) {
    items = [[id, color, quantity]];
    addConfirm();
    //Sinon on vérifie si il est déja présent dans le localStorage
  } else {
    let found = false;
    for (let i = 0; i < items.length; i++) {
      let idArray = items[i][0];
      let colorArray = items[i][1];
      let quantityArray = items[i][2];
      //Si il est déja présent, on l'ajoute en incrémentant sa quantité et on confirme son ajout 
      if (id == idArray && color == colorArray) {
        found = true;
        quantityArray += quantity;
        items[i][2] = quantityArray;
        addConfirm();
      }
    }
    //Si il n'existe pas, on l'ajoute et on confirme son ajout
    if (found == false) {
      let item = [id, color, quantity];
      items.push(item);
      addConfirm();
    }
  }
  //Mise à jour du localStorage
  localStorage.setItem('cart', JSON.stringify(items));
}

//Selection du bouton ajouter au panier
const cartButton = document.getElementById('addToCart');

//A l'appui du bouton : cartButton
cartButton.addEventListener('click', function(event){
  let quantity = parseInt(quantityValue());
  let color = colorValue();
  //Si la couleur n'est pas sélectionné, un message d'erreur apparaît
  if(color == '') {
    alert("Veuillez sélectionner une couleur s'il vous plaît");
    event.preventDefault();
  }
  //Si la quantité est inférieur ou égale à 0, un message d'erreur apparaît
  if(quantity <= 0) {
    alert("Veuillez entrer une quantité valide s'il vous plaît");
    event.preventDefault();
  }
<<<<<<< HEAD
  addToCart(productID, color, quantity);
});
=======
  addToCart(id, color, quantity);
}); 
>>>>>>> ae588d5 (mise à jour)
