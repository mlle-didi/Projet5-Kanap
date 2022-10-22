//LIEN ENTRE PRODUIT PAGE D'ACCUEIL ET PAGE PRODUIT

//Récupération de l'id dans l'URL
const urlProduct = new URLSearchParams (window.location.search);
const id = urlProduct.get('id');

//Récupération des données du backend et construction du DOM
let fetchProduct = function() { //requete API
    fetch(`http://localhost:3000/api/products/${id}`)
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

//Ajout d'un paragraphe qui fait office de notification de confirmation
let buttonAddToCart = document.getElementsByClassName('item__content__addButton');
let newP = document.createElement('p');
newP.textContent = '';
buttonAddToCart[0].appendChild(newP);

//Modification du css pour mettre la notification sous le boutton addToCart
buttonAddToCart[0].style.display = 'block';
buttonAddToCart[0].style.textAlign = 'center';

//La fonction addTocart ajoute le canapé sélectionné au localStorage, selon qu'il y est ou non
function addToCart(id, color, quantity) {
  let min = document.getElementById('quantity').min;
  let max = document.getElementById('quantity').max;
  //Si la quantité est inférieur ou égale à 0 ou qu'une couleur n'est pas sélectionné alors il n'y a aucun ajout 
  if (quantity < min  || quantity > max ||color == '') {
    return;
  }
  let items = getCart();
  //Si il n'y a aucun article dans le localStorage, on l'ajoute et on confirme son ajout
  if (items.length == 0) {
    items = [[id, color, quantity]];
    newP.textContent = 'Votre produit a été ajouté au panier';
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
        newP.textContent = 'Votre produit a été ajouté au panier';
      }
    }
    //Si il n'existe pas, on l'ajoute et on confirme son ajout
    if (found == false) {
      let item = [id, color, quantity];
      items.push(item);
      newP.textContent = 'Votre produit a été ajouté au panier';
    }
  }
  //Mise à jour du localStorage
  localStorage.setItem('cart', JSON.stringify(items));
  //Redirection vers la page "panier"
  document.location.href = "./cart.html"
}

//Selection du bouton ajouter au panier
const cartButton = document.getElementById('addToCart');

//A l'appui du bouton : cartButton
cartButton.addEventListener('click', function(event){
  let min = document.getElementById('quantity').min;
  let max = document.getElementById('quantity').max;
  let quantity = parseInt(quantityValue());
  let color = colorValue();

  //Si la couleur n'est pas sélectionné ou que la quantité n'est pas valide , un message d'erreur apparaît
  if(color == '' || quantity < min || quantity > max){
    alert("Veuillez sélectionner une couleur et une quantité valide s'il vous plaît");
    event.preventDefault();
  }
  addToCart(id, color, quantity);
});