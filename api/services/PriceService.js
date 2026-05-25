module.exports = {
  applyTax(p, r = 0.1) {
    if (!p || typeof p !== 'object') {
      throw new TypeError('product must be an object');
    }

    if (typeof p.price !== 'number' || Number.isNaN(p.price)) {
      throw new TypeError('price must be a valid number');
    }

    if (typeof r !== 'number' || Number.isNaN(r)) {
      throw new TypeError('tax rate must be a valid number');
    }

    if (r < 0) {
      throw new RangeError('tax rate must be greater than or equal to 0');
    }

    return { ...p, taxIncluded: p.price * (1 + r) };
  },
};
