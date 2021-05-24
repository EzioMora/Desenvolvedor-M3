import { get } from "../services/HTTPRequests.js";
import { updateCategoryPage } from "../index.js";
import { setStateOrder } from "./order.js";

const url = "http://localhost:3000/blusas";
const stateFilter = {
  filterColorsBy: [],
  filterSizesBy: [],
  filterPricesBy: "",
  endpointFilter: "",
  lastFilteredColors: [],
  lastFilteredSizes: [],
  lastFilteredPrices: [],
};

let endpointPricesHelper = `${url}?`;

const setStateFilter = ({
  setFilterColorBy,
  setFilterSizeBy,
  setFilterPricesBy,
}) => {
  const { filterColorsBy, filterSizesBy, filterPricesBy } = stateFilter;

  filterColorsBy.includes(setFilterColorBy)
    ? filterColorsBy.splice(filterColorsBy.indexOf(setFilterColorBy), 1)
    : filterColorsBy.push(setFilterColorBy);

  filterSizesBy.includes(setFilterSizeBy)
    ? filterSizesBy.splice(filterSizesBy.indexOf(setFilterSizeBy), 1)
    : filterSizesBy.push(setFilterSizeBy);

  if (setFilterPricesBy)
    filterPricesBy === setFilterPricesBy
      ? (stateFilter.filterPricesBy = "")
      : (stateFilter.filterPricesBy = setFilterPricesBy);

  let endpoint = "";
  filterColorsBy.forEach((color) => {
    if (color) {
      endpoint += `productColor_like=${color}&`;
      endpointPricesHelper += `productColor_like=${color}&`;
    }
  });

  filterSizesBy.forEach((size) => {
    if (size) {
      endpoint += `productSize_like=${size}&`;
      endpointPricesHelper += `productSize_like=${size}&`;
    }
  });

  let selectedPriceRange = stateFilter.filterPricesBy;
  if (selectedPriceRange) {
    const rangePrice = selectedPriceRange.split("-to-");
    rangePrice.length != 1
      ? (endpoint += `productPrice_gte=${rangePrice[0]}&productPrice_lte=${rangePrice[1]}&`)
      : (endpoint += `productPrice_gte=${rangePrice[0]}&`);
  }

  stateFilter.endpointFilter = endpoint;

  console.log("endpoint filter", stateFilter.endpointFilter);
};

const orderColors = (products) => {
  const listWithDuplicates = [];
  products.forEach((product) =>
    listWithDuplicates.push(...product.productColor)
  );

  const finalColors = listWithDuplicates
    .filter((color, index, array) => {
      return index === array.indexOf(color);
    })
    .sort();

  return finalColors;
};

const orderSizes = (products) => {
  const listWithDuplicates = [];
  products.forEach((product) =>
    listWithDuplicates.push(...product.productSize)
  );

  const listWithoutDuplicates = listWithDuplicates.filter(
    (size, index, array) => {
      return index === array.indexOf(size);
    }
  );

  const letters = [];
  const numbers = [];
  listWithoutDuplicates.forEach((size) => {
    typeof size === "string" ? letters.push(size) : numbers.push(size);
  });

  const finalSizes = [];
  letters.includes("P") && finalSizes.push("P");
  letters.includes("M") && finalSizes.push("M");
  letters.includes("G") && finalSizes.push("G");
  letters.includes("GG") && finalSizes.push("GG");
  letters.includes("U") && finalSizes.push("U");

  numbers.sort((a, b) => a - b);
  finalSizes.push(...numbers);

  return finalSizes;
};

const orderPrices = (products) => {
  const listPrices = [];
  products.forEach((product) => listPrices.push(product.productPrice));
  listPrices.sort((a, b) => a - b);

  const priceRangeList = [];
  listPrices.forEach((price) => {
    if (price >= 0 && price < 51) priceRangeList.push("0-to-50.99");
    if (price >= 51 && price < 151) priceRangeList.push("51-to-150.99");
    if (price >= 151 && price < 301) priceRangeList.push("151-to-300.99");
    if (price >= 301 && price < 501) priceRangeList.push("301-to-500.99");
    if (price > 500) priceRangeList.push("501");
  });

  const finalPriceRanges = priceRangeList.filter((range, index, array) => {
    return index === array.indexOf(range);
  });

  return finalPriceRanges;
};

const showAndHideCheckboxes = async () => {
  const { filterPricesBy, endpointFilter } = stateFilter;
  const newFilter = await get(`${url}?${endpointFilter}`);
  const colors = orderColors(newFilter);
  const sizes = orderSizes(newFilter);
  const prices = orderPrices(newFilter);
  const pricesPermanence = orderPrices(await get(endpointPricesHelper));
  console.log("pricesPermanence", pricesPermanence);

  const checkboxColor = document.querySelectorAll("[data-filter=color]");
  checkboxColor.forEach((checkbox) => {
    const label = checkbox.parentElement;
    colors.includes(checkbox.value)
      ? (label.style.display = "flex")
      : (label.style.display = "none");
  });

  const checkboxSize = document.querySelectorAll("[data-filter=size]");
  checkboxSize.forEach((checkbox) => {
    const label = checkbox.parentElement;
    sizes.toString().includes(checkbox.value)
      ? (label.style.display = "flex")
      : (label.style.display = "none");
  });

  const checkboxPrice = document.querySelectorAll("[data-filter=price]");
  checkboxPrice.forEach((checkbox) => {
    const label = checkbox.parentElement;
    prices.includes(checkbox.value)
      ? (label.style.display = "flex")
      : (label.style.display = "none");

    if (pricesPermanence.includes(checkbox.value)) {
      label.style.display = "flex";
    }

    if (prices.includes(checkbox.value) && checkbox.checked === true) {
      label.classList.add("selected-filter");
    } else {
      label.classList.remove("selected-filter");
      checkbox.checked = false;
    }
  });
};

const handleClick = async (event = "default") => {
  const checkbox = event != "default" ? event.target : "default";
  const filterType =
    checkbox != "default" ? checkbox.dataset.filter : "default";
  console.log(checkbox);

  switch (filterType) {
    case "color":
      setStateFilter({
        setFilterColorBy: checkbox.value,
      });
      break;
    case "size":
      setStateFilter({
        setFilterSizeBy: checkbox.value,
      });
      break;
    case "price":
      setStateFilter({
        setFilterPricesBy: checkbox.value,
      });
    default:
      break;
  }

  showAndHideCheckboxes();

  const isDesktop = window.innerWidth > 640;

  if (isDesktop) {
    const handleShowColors = document.querySelector(
      ".filter__handle-show-colors"
    );
    colors.length > 5
      ? (handleShowColors.style.display = "flex")
      : (handleShowColors.style.display = "none");

    setStateOrder({
      resetOrder: true,
    });
    updateCategoryPage();
  }
};

const renderFilter = ({ colors, sizes, prices }) => {
  const { filterSizesBy, filterPricesBy } = stateFilter;
  const categoryColorDOM = document.querySelector(".filter__color");
  const divColorDOM = document.querySelector(".filter__color-group");
  const divSizeDOM = document.querySelector(".filter__size-group");
  const divPriceDOM = document.querySelector(".filter__price-group");

  colors.forEach((color, i) => {
    divColorDOM.innerHTML += `
          <label for="color-${color.toLowerCase()}" class="filter__color-item">
            <input
              class="filter__color-checkbox"
              type="checkbox"
              name="color-${color.toLowerCase()}"
              id="color-${color.toLowerCase()}"
              value="${color}"
              data-filter="color"
            />
            <span class="filter__color-checkbox-custom"></span>
            ${color}
          </label>
      `;
  });

  if (colors.length >= 5) {
    divColorDOM.classList.add("filter__color-group--limit-sample");

    categoryColorDOM.innerHTML += `
     <div class="filter__handle-show-colors">
      <span class="filter__title-show-colors">Ver todas as cores</span>
      <i class="filter__img-arrow fas fa-angle-down"></i>
     </div>
    `;
  }

  divSizeDOM.innerHTML = "";
  sizes.forEach((size, i) => {
    divSizeDOM.innerHTML += `
      <label for="size-${size}" class="filter__size-item">
            <input
              class="filter__size-checkbox"
              type="checkbox"
              name="size-${size}"
              id="size-${size}"
              data-filter="size"
              value="${size}"
            />
            <span class="filter__size-checkbox-custom">${size}</span>
      </label>
    `;
  });

  divPriceDOM.innerHTML = "";
  prices.forEach((price, i) => {
    const rangePrice = price.split("-to-");

    divPriceDOM.innerHTML +=
      rangePrice.length != 1
        ? `
        <label for="range-price-${price}" class="filter__price-item">
          <input
            class="filter__price-checkbox"
            type="checkbox"
            name="rangePrice"
            value="${price}"
            id="range-price-${price}"
            data-filter="price"
          />
          <span class="filter__price-checkbox-custom"></span>
            de R$${rangePrice[0]} até R$${Math.floor(rangePrice[1])}
        </label>
      `
        : `
        <label for="range-price-${price}" class="filter__price-item">
          <input
            type="checkbox"
            class="filter__price-checkbox"
            name="rangePrice"
            value="${price}"
            id="range-price-${price}"
            data-filter="price"
          />
          <span class="filter__price-checkbox-custom"></span>
            a partir de R$${price}
        </label>
      `;
  });

  document.querySelectorAll(".filter__color-checkbox").forEach((label) => {
    label.addEventListener("click", handleClick);
  });

  let showColors = true;
  const handleShowColors = document.querySelector(
    ".filter__handle-show-colors"
  );
  handleShowColors.addEventListener("click", () => {
    const textShowColors = document.querySelector(".filter__title-show-colors");
    const arrowShowColors = document.querySelector(".filter__img-arrow");

    if (showColors) {
      document
        .querySelector(".filter__color-group")
        .classList.remove("filter__color-group--limit-sample");
      handleShowColors.classList.add("open");
      textShowColors.innerText = "Ver menos cores";
      arrowShowColors.classList.remove("fa-angle-down");
      arrowShowColors.classList.add("fa-angle-up");
    } else {
      document
        .querySelector(".filter__color-group")
        .classList.add("filter__color-group--limit-sample");
      handleShowColors.classList.remove("open");
      textShowColors.innerText = "Ver todas as cores";
      arrowShowColors.classList.remove("fa-angle-up");
      arrowShowColors.classList.add("fa-angle-down");
    }

    // showColors
    //   ? document
    //       .querySelector(".filter__color-group")
    //       .classList.remove("filter__color-group--limit-sample")
    //   : document
    //       .querySelector(".filter__color-group")
    //       .classList.add("filter__color-group--limit-sample");
    showColors = !showColors;
  });

  document.querySelectorAll(".filter__size-checkbox").forEach((label) => {
    label.addEventListener("click", handleClick);
  });

  document.querySelectorAll(".filter__price-checkbox").forEach((label) => {
    label.addEventListener("click", handleClick);
  });
};

const filterWrapperDOM = document.querySelector(".filter");
let showFilter = true;
const showFilterMobile = () => {
  showFilter
    ? filterWrapperDOM.classList.add("show-filter-mobile")
    : filterWrapperDOM.classList.remove("show-filter-mobile");
  showFilter = !showFilter;
};

const btnShowFilterMobileDOM = document.querySelector(
  ".filter__btn-show-filter-mobile"
);
btnShowFilterMobileDOM.addEventListener("click", showFilterMobile);

const showBtnsBottomCenter = () => {
  const filterColorIsOpen = document
    .querySelector(".filter__color-group")
    .className.includes("show-color-filter-mobile");
  const filterSizeIsOpen = document
    .querySelector(".filter__size-group")
    .className.includes("show-size-filter-mobile");
  const filterPriceIsOpen = document
    .querySelector(".filter__price-group")
    .className.includes("show-price-filter-mobile");

  if (filterColorIsOpen || filterSizeIsOpen || filterPriceIsOpen) {
    document
      .querySelector(".filter__btns-bottom-center")
      .classList.add("show-btns-bottom");
  } else {
    document
      .querySelector(".filter__btns-bottom-center")
      .classList.remove("show-btns-bottom");
  }
};

let showColorFilter = true;
const showColorFilterMobile = () => {
  if (showColorFilter) {
    // document
    //   .querySelector(".filter__color-group")
    //   .classList.remove("filter__color-group--limit-sample");
    document
      .querySelector(".filter__color-group")
      .classList.add("show-color-filter-mobile");
    document.querySelector(".filter__show-color-filter").style.display = "none";
    document.querySelector(".filter__do-not-show-color-filter").style.display =
      "block";
  } else {
    // document
    //   .querySelector(".filter__color-group")
    //   .classList.add("filter__color-group--limit-sample");
    document
      .querySelector(".filter__color-group")
      .classList.remove("show-color-filter-mobile");
    document.querySelector(".filter__show-color-filter").style.display =
      "block";
    document.querySelector(".filter__do-not-show-color-filter").style.display =
      "none";
  }

  showColorFilter = !showColorFilter;
  showBtnsBottomCenter();
};

let showSizeFilter = true;
const showSizeFilterMobile = () => {
  if (showSizeFilter) {
    document
      .querySelector(".filter__size-group")
      .classList.add("show-size-filter-mobile");
    document.querySelector(".filter__show-size-filter").style.display = "none";
    document.querySelector(".filter__do-not-show-size-filter").style.display =
      "block";
  } else {
    document
      .querySelector(".filter__size-group")
      .classList.remove("show-size-filter-mobile");
    document.querySelector(".filter__show-size-filter").style.display = "block";
    document.querySelector(".filter__do-not-show-size-filter").style.display =
      "none";
  }
  showSizeFilter = !showSizeFilter;
  showBtnsBottomCenter();
};

let showPriceFilter = true;
const showPriceFilterMobile = () => {
  if (showPriceFilter) {
    document
      .querySelector(".filter__price-group")
      .classList.add("show-price-filter-mobile");
    document.querySelector(".filter__show-price-filter").style.display = "none";
    document.querySelector(".filter__do-not-show-price-filter").style.display =
      "block";
  } else {
    document
      .querySelector(".filter__price-group")
      .classList.remove("show-price-filter-mobile");
    document.querySelector(".filter__show-price-filter").style.display =
      "block";
    document.querySelector(".filter__do-not-show-price-filter").style.display =
      "none";
  }
  showPriceFilter = !showPriceFilter;
  showBtnsBottomCenter();
};

window.addEventListener("click", (event) => {
  const target = event.target;
  if (
    target.matches(".filter__show-color-filter") ||
    target.matches(".filter__do-not-show-color-filter")
  ) {
    showColorFilterMobile();
  }

  if (
    target.matches(".filter__show-size-filter") ||
    target.matches(".filter__do-not-show-size-filter")
  ) {
    showSizeFilterMobile();
  }

  if (
    target.matches(".filter__show-price-filter") ||
    target.matches(".filter__do-not-show-price-filter")
  ) {
    showPriceFilterMobile();
  }
  return;
});

const handleClickBtnsMobile = (event) => {
  const target = event.target;
  const {
    filterColorsBy,
    filterSizesBy,
    filterPricesBy,
    lastFilteredColors,
    lastFilteredSizes,
    lastFilteredPrices,
  } = stateFilter;
  const checkboxColor = document.querySelectorAll("[data-filter=color]");
  const checkboxSize = document.querySelectorAll("[data-filter=size]");
  const checkboxPrice = document.querySelectorAll("[data-filter=price]");

  switch (target.className) {
    case "filter__btn-apply-filter":
      stateFilter.lastFilteredColors = [...filterColorsBy];
      stateFilter.lastFilteredSizes = [...filterSizesBy];
      stateFilter.lastFilteredPrices = stateFilter.filterPricesBy;
      setStateOrder({
        resetOrder: true,
      });
      updateCategoryPage();
      showFilter = false;
      showFilterMobile();
      showColorFilter = false;
      showColorFilterMobile();
      showSizeFilter = false;
      showSizeFilterMobile();
      showPriceFilter = false;
      showPriceFilterMobile();
      console.log("new", stateFilter);
      break;
    case "filter__btn-clean-filter":
      checkboxColor.forEach((checkbox) => {
        if (filterColorsBy.includes(checkbox.value)) checkbox.checked = false;
      });

      checkboxSize.forEach((checkbox) => {
        if (filterSizesBy.toString().includes(checkbox.value)) {
          checkbox.checked = false;
        }
      });

      checkboxPrice.forEach((checkbox) => {
        if (filterPricesBy.includes(checkbox.value)) checkbox.checked = false;
      });

      stateFilter.filterColorsBy = [];
      stateFilter.filterSizesBy = [];
      stateFilter.filterPricesBy = "";
      stateFilter.lastFilteredColors = [];
      stateFilter.lastFilteredSizes = [];
      stateFilter.lastFilteredPrices = "";
      stateFilter.endpointFilter = "";
      handleClick();
      setStateOrder({
        resetOrder: true,
      });
      updateCategoryPage();
      break;
    case "filter__icon-x":
      filterColorsBy.forEach((color) => {
        if (!lastFilteredColors.includes(color)) {
          checkboxColor.forEach((checkbox) => {
            if (color.includes(checkbox.value)) checkbox.checked = false;
          });
          filterColorsBy.splice(filterColorsBy.indexOf(color), 1);
        }
      });

      lastFilteredColors.forEach((color) => {
        if (!filterColorsBy.includes(color)) {
          checkboxColor.forEach((checkbox) => {
            if (color.includes(checkbox.value)) checkbox.checked = true;
          });
        }
      });

      filterSizesBy.forEach((size) => {
        if (!lastFilteredSizes.includes(size)) {
          checkboxSize.forEach((checkbox) => {
            if (size.includes(checkbox.value)) checkbox.checked = false;
          });
          filterSizesBy.splice(filterSizesBy.indexOf(size), 1);
        }
      });

      lastFilteredSizes.forEach((size) => {
        if (!filterSizesBy.includes(size)) {
          checkboxSize.forEach((checkbox) => {
            if (size.includes(checkbox.value)) checkbox.checked = true;
          });
        }
      });

      if (!lastFilteredPrices.includes(filterPricesBy)) {
        checkboxPrice.forEach((checkbox) => {
          if (filterPricesBy.includes(checkbox.value)) checkbox.checked = false;
          if (lastFilteredPrices.includes(checkbox.value))
            checkbox.checked = true;
        });
        stateFilter.filterPricesBy = lastFilteredPrices;
      }
      break;
    default:
      break;
  }
};

const btnApplyFilter = document.querySelector(".filter__btn-apply-filter");
btnApplyFilter.addEventListener("click", handleClickBtnsMobile);
const btnCleanFilter = document.querySelector(".filter__btn-clean-filter");
btnCleanFilter.addEventListener("click", handleClickBtnsMobile);

const closeFilterMobileDOM = document.querySelector(".filter__icon-x");
closeFilterMobileDOM.addEventListener("click", (event) => {
  showFilter = false;
  showFilterMobile();
  showColorFilter = false;
  showColorFilterMobile();
  showSizeFilter = false;
  showSizeFilterMobile();
  showPriceFilter = false;
  showPriceFilterMobile();
  handleClickBtnsMobile(event);
});

const createFilter = (products) => {
  const colors = orderColors(products);
  const sizes = orderSizes(products);
  const prices = orderPrices(products);

  renderFilter({
    colors,
    sizes,
    prices,
  });
};

export { createFilter, stateFilter };
