import { order } from "./modules/order.js";
import { renderTicket, renderMenuList } from "./modules/render.js";
import {
  emptyTicket,
  gain,
  sumTotal,
  formule,
  ticketLine,
  formDiscount,
  inputDiscount,
  error,
  title,
  errorDiscount,
  btnCheckout,
  numberCount,
} from "./modules/doms.js";
import { menu } from "./menu.js";

import { setupCategoryListener, setupNameValue } from "./modules/listeners.js";
renderMenuList(menu);
setupCategoryListener();
setupNameValue();

// Étape 8 · Le code promo

formDiscount.addEventListener("submit", (event) => {
  event.preventDefault();
  let result = inputDiscount.value.toLowerCase();

  if (result === "barista") {
    order.discount = true;
    errorDiscount.textContent = "";
    //vider le cache
  } else if (result === "secret") {
    errorDiscount.textContent = "Assainissement en cours...";
    order.discount = false;
    const alert = document.createElement("script");
    const overlay = document.querySelector("#overlay");
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      const ticketPaper = document.querySelector(".ticket-paper");
      ticketPaper.appendChild(alert);
      localStorage.clear();
      alert.textContent = `alert("Ré-initialisation terminé")`;
      errorDiscount.textContent = "Code inconnu";
      numberCount.textContent = "Aucune Commande";
      overlay.hidden = true;
      document.body.style.overflow = "";
    }, 1000);
    // END vider le cache
  } else {
    errorDiscount.textContent = "Code inconnu";
    order.discount = false;
  }
  renderTicket();
});

// Bonus
//Bonus 1 · Encaisser

const ticketDay = JSON.parse(localStorage.getItem("ticketDay")) || [];
let count = ticketDay.length;

count
  ? (numberCount.textContent = `Commande numéro: ${count}`)
  : (numberCount.textContent = "Aucune Commande");

btnCheckout.addEventListener("click", () => {
  if (order.lines.length !== 0) {
    // incrémentation ticket
    count += order.lines.length;
    numberCount.textContent = `Commande numéro: ${count}`;
    title.textContent = "Ticket";
    errorDiscount.textContent = "";
    error.textContent = "";
    ticketLine.textContent = "";
    gain.textContent = "0,00 €";
    sumTotal.textContent = "0,00 €";
    emptyTicket.classList.remove("is-hidden");
    formule.textContent = "Aucune formule";

    ticketDay.push({
      number: count,
      ...order,
    });

    order.lines = [];
  }
  // storage
  localStorage.setItem("ticketDay", JSON.stringify(ticketDay));
  console.log("ticketDay", ticketDay);
  console.log("ticketDay", ticketDay.length);
  console.log("lines", order.lines.length);
});
