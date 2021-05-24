import { get } from "../services/HTTPRequests.js";
import { url } from "../index.js";
import { createCards } from "./card.js";
import { stateFilter } from "./filter.js";
import { stateOrder } from "./order.js";

const btnLoadMoreDOM = document.querySelector(".vitrine__btn-load-more");

export const statePagination = {
  currentPage: 1,
  itemsPerPage: 9,
  totalPages: 0,
  endpointPagination: "",
};

export function setStatePagination({
  setCurrentPage,
  updatePage,
  setItemsPerPage,
  totalProducts,
}) {
  const { setEndpointPagination, showBtnPagination } = statePagination;

  if (setCurrentPage) statePagination.currentPage = +setCurrentPage;

  if (updatePage) statePagination.currentPage++;

  if (setItemsPerPage) statePagination.itemsPerPage = +setItemsPerPage;

  if (totalProducts)
    statePagination.totalPages = Math.ceil(
      +totalProducts / statePagination.itemsPerPage
    );

  const { currentPage, itemsPerPage, totalPages } = statePagination;
  statePagination.endpointPagination = `_page=${currentPage}&_limit=${itemsPerPage}`;

  if (currentPage === totalPages) btnLoadMoreDOM.style.display = "none";
  console.log(statePagination.endpointPagination);
}

const loadMoreProducts = async () => {
  const { endpointFilter } = stateFilter;
  const { endpointOrder } = stateOrder;
  const { endpointPagination } = statePagination;
  const endpoint = `${url}?${endpointFilter}${endpointOrder}${endpointPagination}`;
  console.log(endpoint);
  const products = await get(endpoint);
  createCards(products);
};

btnLoadMoreDOM.addEventListener("click", () => {
  setStatePagination({
    updatePage: true,
  });
  loadMoreProducts();
});
