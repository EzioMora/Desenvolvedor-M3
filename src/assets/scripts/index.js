import { get } from "./services/HTTPRequests.js";
import { stateOrder } from "./components/order.js";
import { createCards, cleanVitrine } from "./components/card.js";
import {
  statePagination,
  setStatePagination,
} from "./components/pagination.js";

const url = "http://localhost:3004/blusas";

const initCategoryPage = async (endpoint) => {
  let products = await get(endpoint);
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
  const { endpointOrder } = stateOrder;
  const endpoint = `${url}?${endpointOrder}`;
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
