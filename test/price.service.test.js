const PriceService = require('../api/services/PriceService');

describe('PriceService.applyTax', () => {
  it('adds taxIncluded using default rate', () => {
    const product = { name: 'Pen', price: 100 };

    const result = PriceService.applyTax(product);

    expect(result.name).toBe('Pen');
    expect(result.price).toBe(100);
    expect(result.taxIncluded).toBeCloseTo(110);
    expect(product).not.toHaveProperty('taxIncluded');
  });

  it('uses a custom tax rate when provided', () => {
    const product = { name: 'Notebook', price: 200 };

    const result = PriceService.applyTax(product, 0.08);

    expect(result.taxIncluded).toBe(216);
  });
});
