export const order = {
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
