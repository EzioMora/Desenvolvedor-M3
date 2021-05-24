import { updateCategoryPage } from "../index.js";
const selectOrderDOM = document.querySelector(".dropdown-order__select");
const selectOrderListDOM = document.querySelector(".dropdown-order__list");
const selectOrderTitleDom = document.querySelector(
  ".dropdown-order__selected-title"
);
const selectItemsDOM = document.querySelectorAll(".dropdown-order__list-item");
const btnOrder = document.querySelector(".order__btn");
const selectOrderMobileDOM = document.querySelector(".dropdown-order");
const closeOrderMobile = document.querySelector(".dropdown-order__icon-x");

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

let selectDesktopActive = true;

const showSelectDesktop = () => {
  selectDesktopActive
    ? selectOrderListDOM.classList.add("show-select-desktop")
    : selectOrderListDOM.classList.remove("show-select-desktop");

  selectDesktopActive
    ? selectItemsDOM.forEach((link) =>
        link.classList.add("show-select-desktop")
      )
    : selectItemsDOM.forEach((link) =>
        link.classList.remove("show-select-desktop")
      );

  selectDesktopActive = !selectDesktopActive;
};

selectOrderDOM.addEventListener("click", showSelectDesktop);

let selectMobileActive = true;
const showSelectMobile = (event) => {
  selectMobileActive
    ? selectOrderMobileDOM.classList.add("select-order-mobile")
    : selectOrderMobileDOM.classList.remove("select-order-mobile");

  selectOrderDOM.removeEventListener("click", showSelectDesktop);

  selectMobileActive = !selectMobileActive;
};

btnOrder.addEventListener("click", showSelectMobile);
closeOrderMobile.addEventListener("click", showSelectMobile);

selectItemsDOM.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const orderIsMobile = window.innerWidth <= 640;
    const orderIsDesktop = !orderIsMobile;
    const selectedLink = event.target;
    const linkTitle = selectedLink.innerText;
    const endpoint = selectedLink.dataset.href;

    setStateOrder({
      setTitleDOM: linkTitle,
      setEndpoint: endpoint,
    });
    orderIsDesktop && showSelectDesktop();
    orderIsMobile && showSelectMobile();
  });
});

export { stateOrder, setStateOrder };
