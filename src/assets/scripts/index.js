import { get } from "./services/HTTPRequests.js";
import { stateOrder } from "./components/order.js";
import { createCards, cleanVitrine } from "./components/card.js";
import { createFilter, stateFilter } from "./components/filter.js";
import {
  statePagination,
  setStatePagination,
} from "./components/pagination.js";

const url = "http://localhost:3000/blusas";

const initCategoryPage = async (endpoint) => {
  let products = await get(endpoint);
  createFilter(products);
  setStatePagination({
    totalProducts: products.length,
  });
  const { endpointPagination } = statePagination;
  const newEndpoint = `${url}?${endpointPagination}`;
  products = await get(newEndpoint);
  createCards(products);
};

initCategoryPage(url);

const updateCategoryPage = async () => {
  const { endpointFilter } = stateFilter;
  const { endpointOrder } = stateOrder;
  const endpoint = `${url}?${endpointFilter}${endpointOrder}`;
  let products = await get(endpoint);
  setStatePagination({
    setCurrentPage: 1,
    totalProducts: products.length,
  });
  const { endpointPagination } = statePagination;
  const newEndpoint = `${endpoint}&${endpointPagination}`;
  products = await get(newEndpoint);
  cleanVitrine();
  createCards(products);
};

export { url, updateCategoryPage };
