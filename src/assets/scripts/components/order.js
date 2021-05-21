// import { updateStore } from "../main.js";
import { updateCategoryPage } from "../index.js";
const selectOrderDOM = document.querySelector(".dropdown-order__select");
const selectOrderTitleDom = document.querySelector(
  ".dropdown-order__selected-title"
);
const selectItemsDOM = document.querySelectorAll(".dropdown-order__list-item");

const stateOrder = {
  endpointOrder: "",
};

const setStateOrder = ({ resetOrder, setTitleDOM, setEndpoint }) => {
  if (resetOrder) {
    selectOrderTitleDom.innerText = "Ordenar por:";
    stateOrder.endpointOrder = "";
  }
  if (setTitleDOM) selectOrderTitleDom.innerText = setTitleDOM;
  if (setEndpoint) stateOrder.endpointOrder = setEndpoint;
  updateCategoryPage();
};

selectItemsDOM.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const { setSelectOrderTitleDom, setEndpointOrder } = stateOrder;
    const selectedLink = event.target;
    const linkTitle = selectedLink.innerText;
    const endpoint = selectedLink.dataset.href;
    setStateOrder({
      setTitleDOM: linkTitle,
      setEndpoint: endpoint,
    });
  });
});

export { stateOrder, setStateOrder };
