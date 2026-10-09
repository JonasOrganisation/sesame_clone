import { order } from "./order.js";
import {
  formatPrice,
  setupAddButtons,
  disableSoldOutProducts,
  toggleEmptyTicket,
  calcFormule,
  discount,
  remove,
} from "./utils.js";

import { ticketLine } from "./doms.js";
import { menuList } from "./doms.js";

export function renderMenu(product) {
  return `<article class="product">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price"> ${formatPrice(product.price)}</p>
          <button type="button" class="product-add">Ajouter</button>
        </article>`;
}
export function renderTicketLine(product) {
  const totalLine = product.quantity * product.price;

  return `<li class="ticket-line">
      <span class="line-name">${product.name}</span>
      <span class="line-qty">× ${product.quantity}</span>
      <span class="line-price">${formatPrice(totalLine)}</span>
      <button
        type="button"
        class="line-remove"
        aria-label="Retirer un ${product.name}"
      >
        −
      </button>
    </li>`;
}
export function renderTicket() {
  ticketLine.textContent = "";
  toggleEmptyTicket();

  ticketLine.innerHTML = order.lines.map(renderTicketLine).join("");
  const subtotal = calcFormule(order.lines);
  discount(subtotal);
  remove(order.lines);
}
export function renderMenuList(products) {
  menuList.innerHTML = products.map(renderMenu).join("");

  const cards = document.querySelectorAll(".product");
  const buttonCard = document.querySelectorAll(".product-add");

  disableSoldOutProducts(cards, buttonCard, products);
  setupAddButtons(buttonCard, products);
}
