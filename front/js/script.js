//Produits disponibles sur page d'accueil
//requête API pour demander l'ensemble des produits
fetch('http://localhost:3000/api/products')
.then(function(res) {
    if (res.ok) {
        return res.json();
    }
}) 
//réponse émise, produits affichés
.then(function(value) {
    console.log(value);
    let sectionItemHtml = document.getElementById('items');
    for(let product of value) {
        let newLink = document.createElement('a');
        newLink.href = './product.html?id=' + product._id;
        sectionItemHtml.appendChild(newLink);
        //parent.appendchild(enfant)

        let newArticle = document.createElement('article');
        newLink.appendChild(newArticle);

        let newImage = document.createElement('img');
        newImage.src = product.imageUrl;
        newImage.alt = product.altTxt;
        newArticle.appendChild(newImage);
        
        let newTitle = document.createElement('h3');
        let productName = document.createTextNode(product.name);
        newTitle.appendChild(productName);
        newArticle.appendChild(newTitle);
        
        let newDescription = document.createElement('p');
        let productDescription = document.createTextNode(product.description);
        newDescription.appendChild(productDescription);
        newArticle.appendChild(newDescription);
    }
})
.catch(function(err) {
// Une erreur est survenue
});

