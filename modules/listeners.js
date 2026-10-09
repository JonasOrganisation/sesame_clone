import { renderMenuList } from "./render.js";
import { nav, formName, input, error, title } from "./doms.js";
import { menu } from "../menu.js";
import { order } from "./order.js";

// Étape 6 · Filtrer par catégorie

export function setupCategoryListener() {
  nav.addEventListener("click", (event) => {
    const tag = event.target.value;
    if (!tag) return;

    let filteredMenu = menu;
    if (tag !== "all") {
      filteredMenu = menu.filter((product) => product.category === tag);
    }
    renderMenuList(filteredMenu);

    const btnActive = document.querySelector(".is-active");
    if (btnActive) {
      btnActive.classList.remove("is-active");
    }
    event.target.classList.add("is-active");
  });
}
// Étape 7 · Le prénom du client
export function setupNameValue() {
  formName.addEventListener("submit", (event) => {
    event.preventDefault();

    let result = input.value.trim();
    if (!result) {
      error.textContent = "Veuillez entrer un Prénom";
      title.textContent = "Ticket";
    } else {
      order.customer = result;
      title.textContent = `Ticket de ${order.customer}`;
      input.value = "";
      error.textContent = "";
    }
  });
}
