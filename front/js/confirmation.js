function orderConfirmation() {
    //L'identifiant de commande sera donné au client lorsque la commande sera terminée
    //Et effacera le stockage local pour des raisons de sécurité
    const orderId = document.getElementById("orderId");
    orderId.innerHTML = localStorage.getItem("orderId");
    localStorage.clear();
  }
  orderConfirmation();