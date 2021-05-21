import { get } from "./services/HTTPRequests.js";
import { createCards } from "./components/card.js";

const initCategoryPage = async () => {
  const products = await get("http://localhost:3004/blusas");
  createCards(products);
};

initCategoryPage();
