import { setStateCart } from "./cart.js";

const vitrineProductGroup = document.querySelector(".vitrine__product-group");

const cleanVitrine = () => (vitrineProductGroup.innerHTML = "");

const createCards = (products) => {
  products.forEach((product) => {
    const name = product.productName.toUpperCase();
    const url = product.productUrl;
    const price = product.productPrice;
    const formattedPrice = price.toFixed(2).replace(".", ",");
    const installments = product.productInstallments;
    const installmentsPrice = (price / installments)
      .toFixed(2)
      .replace(".", ",");

    vitrineProductGroup.innerHTML += `
      <li class="product-card">
        <img class="product-card__img" src="${url}" alt="${name}" title="${name}"/>
        <div class="product-card__info">
          <span class="product-card__title">${name}</span>
          <span class="product-card__price">R$ ${formattedPrice}</span>
          <span class="product-card__installments">até ${installments}x de R$${installmentsPrice}</span>
        </div>
        <button class="product-card__buy-btn">COMPRAR</button>
      </li>
    `;
  });

  const productss = document.querySelectorAll(".product-card__buy-btn");
  productss.forEach((product) => {
    product.addEventListener("click", () => {
      setStateCart({
        updateCart: true,
      });
    });
  });
};

export { createCards, cleanVitrine };
