// Fournie : transforme 220 en "2,20 €". Tu n'as pas à la modifier.
function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

const menuList = document.querySelector("#menu");
const ticketLine = document.querySelector("#ticket-lines");
const emptyTicket = document.querySelector("#ticket-empty");
const sumTotal = document.querySelector("#ticket-total");
const formDiscount = document.querySelector("#promo-form");
const inputDiscount = document.querySelector("#promo-code");
const formule = document.querySelector("#formule");
const formName = document.querySelector("#customer-form");
const input = document.querySelector("#customer-name");
const error = document.querySelector("#customer-error");
const title = document.querySelector("#ticket-title");
const gain = document.querySelector("#ticket-discount");
const errorDiscount = document.querySelector("#promo-message");
const btnCheckout = document.querySelector("#checkout");
const numberCount = document.querySelector("#ticket-number");

// Étape 1 · Afficher la carte + Étape 2 · Les produits épuisés

function renderMenu(product) {
  return `<article class="product">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price"> ${formatPrice(product.price)}</p>
          <button type="button" class="product-add">Ajouter</button>
        </article>`;
}

for (let i = 0; i < menu.length; i++) {
  menuList.innerHTML += renderMenu(menu[i]);
  // Étape 2 · Les produits épuisés
  const cards = document.querySelectorAll(".product");
  const buttonCard = document.querySelectorAll(".product-add");
  if (!menu[i].available) {
    cards[i].classList.add("is-sold-out");
    buttonCard[i].disabled = true;
  }
}
// Étape 3 · L'objet order
const order = {
  lines: [],
  add(product) {
    for (let i = 0; i < this.lines.length; i++) {
      const existingId = this.lines[i].id;
      if (product.id === existingId) {
        this.lines[i].quantity += 1;

        return;
      }
    }
    this.lines.push({ ...product, quantity: 1 });
  },
  getSubtotal() {
    let subtotal = 0;
    for (let i = 0; i < this.lines.length; i++) {
      subtotal += this.lines[i].quantity * this.lines[i].price;
    }
    return subtotal;
  },
  remove(id) {
    for (let i = 0; i < this.lines.length; i++) {
      const existingId = this.lines[i].id;
      if (id === existingId) {
        if (this.lines[i].quantity > 1) {
          this.lines[i].quantity -= 1;
        } else {
          this.lines.splice(i, 1);
        }
        return;
      }
    }
  },
};
const buttonCardAdd = document.querySelectorAll(".product-add");

buttonCardAdd.forEach((button, position) =>
  button.addEventListener("click", () => {
    order.add(menu[position]);
    renderTicket();
  }),
);

// Étape 4 · Afficher le ticket + Étape 5 · Retirer une ligne

function renderTicketLine(product) {
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
function renderTicket() {
  ticketLine.textContent = "";
  order.lines.length !== 0
    ? emptyTicket.classList.add("is-hidden")
    : emptyTicket.classList.remove("is-hidden");
  let pastry = 0;
  let other = 0;
  for (let i = 0; i < order.lines.length; i++) {
    ticketLine.innerHTML += renderTicketLine(order.lines[i]);
    //formule
    if (order.lines[i].category === "pastry") {
      pastry += order.lines[i].quantity;
    } else {
      other += order.lines[i].quantity;
    }
  }
  let menuCount = Math.min(pastry, other);
  formule.textContent = `Nombre de formules: ${menuCount} soit ${menuCount} € de gagné`;
  let subtotal = order.getSubtotal() - menuCount * 100;

  sumTotal.textContent = formatPrice(subtotal);
  // remise
  if (order.discount) {
    let resultDiscount = applyDiscount(subtotal);
    let remise = subtotal - resultDiscount;
    gain.textContent = formatPrice(remise);
    sumTotal.textContent = formatPrice(resultDiscount);
  } else {
    gain.textContent = "0,00 €";
    sumTotal.textContent = formatPrice(subtotal);
  }
  //remove line
  const buttonLineRemove = document.querySelectorAll(".line-remove");

  buttonLineRemove.forEach((button, position) =>
    button.addEventListener("click", () => {
      order.remove(order.lines[position].id);
      renderTicket();
    }),
  );
}

// Étape 6 · Filtrer par catégorie
const nav = document.querySelector("nav");
nav.addEventListener("click", (event) => {
  const tag = event.target.value;
  if (!tag) return;

  let filteredMenu = menu;
  if (tag !== "all") {
    filteredMenu = menu.filter((product) => product.category === tag);
  }
  menuList.innerHTML = "";
  for (let i = 0; i < filteredMenu.length; i++) {
    menuList.innerHTML += renderMenu(filteredMenu[i]);
    const cards = document.querySelectorAll(".product");
    const buttonCard = document.querySelectorAll(".product-add");
    if (!filteredMenu[i].available) {
      cards[i].classList.add("is-sold-out");
      buttonCard[i].disabled = true;
    }
    const buttonCardAdd = document.querySelectorAll(".product-add");

    buttonCardAdd.forEach((button, position) =>
      button.addEventListener("click", () => {
        order.add(filteredMenu[position]);
        renderTicket();
      }),
    );
  }

  const btnActive = document.querySelector(".is-active");
  if (btnActive) {
    btnActive.classList.remove("is-active");
  }
  event.target.classList.add("is-active");
});

// Étape 7 · Le prénom du client

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
// Étape 8 · Le code promo

function applyDiscount(dish) {
  return dish * (1 - 10 / 100);
}
formDiscount.addEventListener("submit", (event) => {
  event.preventDefault();
  let result = inputDiscount.value.toLowerCase();

  if (result !== "barista") {
    errorDiscount.textContent = "Code inconnu";
    order.discount = false;
  } else {
    order.discount = true;
    errorDiscount.textContent = "";
  }
  renderTicket();
});

// Bonus
//Bonus 1 · Encaisser

const ticketDay = JSON.parse(localStorage.getItem("ticketDay")) || [];
let count = ticketDay.length;

btnCheckout.addEventListener("click", () => {
  if (order.lines.length !== 0) {
    // incrémentation ticket
    count += 1;
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
