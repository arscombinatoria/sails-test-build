module.exports = {
  applyTax(product, rate = 0.1) {
    if (!product || typeof product !== 'object') {
      throw new TypeError('product must be an object');
    }

    if (typeof product.price !== 'number' || !Number.isFinite(product.price)) {
      throw new TypeError('product.price must be a finite number');
    }

    if (typeof rate !== 'number' || !Number.isFinite(rate)) {
      throw new TypeError('tax rate must be a finite number');
    }

    return { ...product, taxIncluded: product.price * (1 + rate) };
  },
};
