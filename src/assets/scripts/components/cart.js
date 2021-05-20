const cart = document.querySelector(".header__cart");
const cartItemCounter = document.querySelector(".header__cart-item-counter");

const stateCart = {
  productsInCart: 0,
};

const setStateCart = ({ cleanCart, updateCart }) => {
  if (updateCart) {
    stateCart.productsInCart++;
    cartItemCounter.classList.add("added-item-in-cart");
    cartItemCounter.innerText = stateCart.productsInCart;
  }
  if (cleanCart) {
    cartItemCounter.classList.remove("added-item-in-cart");
    stateCart.productsInCart = 0;
    cartItemCounter.innerText = "";
  }
};

cart.addEventListener("click", () => {
  const { productsInCart } = stateCart;
  const cartFull = productsInCart > 0;
  if (cartFull && confirm("Quer finalizar a compra?")) {
    setStateCart({
      cleanCart: true,
    });
    alert("Parabéns pela compra!!! Volte logo!");
  }
});

export { setStateCart };
