import { get } from "./services/HTTPRequests.js";
import { stateOrder } from "./components/order.js";
import { createCards, cleanVitrine } from "./components/card.js";

const url = "http://localhost:3004/blusas";

const initCategoryPage = async (endpoint) => {
  const products = await get(endpoint);
  createCards(products);
};

initCategoryPage(url);

const updateCategoryPage = async () => {
  const { endpointOrder } = stateOrder;
  const endpoint = `${url}?${endpointOrder}`;
  const products = await get(endpoint);
  cleanVitrine();
  createCards(products);
};

export { url, updateCategoryPage };
