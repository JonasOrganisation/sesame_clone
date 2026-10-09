import { emptyTicket, gain, sumTotal, formule } from "./doms.js";
import { order } from "./order.js";
import { renderTicket } from "./render.js";

export function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}
export function toggleEmptyTicket() {
  order.lines.length !== 0
    ? emptyTicket.classList.add("is-hidden")
    : emptyTicket.classList.remove("is-hidden");
}
export function calcFormule(lines) {
  let menuCount = countFormules(lines);
  formule.textContent = `Nombre de formules: ${menuCount} soit ${menuCount} € de gagné`;
  return order.getSubtotal() - menuCount * 100;
}
function countFormules(arg) {
  let pastry = 0;
  let other = 0;
  for (let i = 0; i < arg.length; i++) {
    if (arg[i].category === "pastry") {
      pastry += arg[i].quantity;
    } else {
      other += arg[i].quantity;
    }
  }
  return Math.min(pastry, other);
}
function applyDiscount(dish) {
  return dish * (1 - 10 / 100);
}
export function discount(total) {
  // remise
  if (order.discount) {
    let resultDiscount = applyDiscount(total);
    let remise = total - resultDiscount;
    gain.textContent = formatPrice(remise);
    sumTotal.textContent = formatPrice(resultDiscount);
  } else {
    gain.textContent = "0,00 €";
    sumTotal.textContent = formatPrice(total);
  }
}
export function remove(products) {
  //remove line
  const buttonLineRemove = document.querySelectorAll(".line-remove");
  buttonLineRemove.forEach((button, position) =>
    button.addEventListener("click", () => {
      order.remove(products[position].id);
      renderTicket();
    }),
  );
}
export function disableSoldOutProducts(cards, buttonCard, products) {
  cards.forEach((card, position) => {
    if (!products[position].available) {
      card.classList.add("is-sold-out");
      buttonCard[position].disabled = true;
    }
  });
}
export function setupAddButtons(buttonCard, products) {
  buttonCard.forEach((button, position) =>
    button.addEventListener("click", () => {
      order.add(products[position]);
      renderTicket();
    }),
  );
}
