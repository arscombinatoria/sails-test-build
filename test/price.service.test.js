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

  it('calculates taxIncluded for zero, decimal, and very large prices', () => {
    const zeroPrice = { name: 'Freebie', price: 0 };
    const decimalPrice = { name: 'Coffee', price: 123.45 };
    const veryLargePrice = { name: 'Enterprise Contract', price: 1e15 };

    expect(PriceService.applyTax(zeroPrice).taxIncluded).toBe(0);
    expect(PriceService.applyTax(decimalPrice).taxIncluded).toBeCloseTo(135.795);
    expect(PriceService.applyTax(veryLargePrice).taxIncluded).toBe(1e15 * 1.1);
  });

  it('supports edge tax rate values (0, negative, and >= 1) with direct formula behavior', () => {
    const product = { name: 'Item', price: 100 };

    expect(PriceService.applyTax(product, 0).taxIncluded).toBe(100);
    expect(PriceService.applyTax(product, -0.2).taxIncluded).toBe(80);
    expect(PriceService.applyTax(product, 1).taxIncluded).toBe(200);
    expect(PriceService.applyTax(product, 1.5).taxIncluded).toBe(250);
  });

  it('throws for null product and returns NaN for missing/non-numeric price', () => {
    expect(() => PriceService.applyTax(null)).toThrow(TypeError);

    const missingPriceProduct = { name: 'Unknown price item' };
    const nonNumericPriceProduct = { name: 'Broken price item', price: 'abc' };

    expect(PriceService.applyTax(missingPriceProduct).taxIncluded).toBeNaN();
    expect(PriceService.applyTax(nonNumericPriceProduct).taxIncluded).toBeNaN();
  });

  it('keeps original object intact and preserves all return properties', () => {
    const product = { name: 'Bag', price: 50, category: 'daily' };

    const result = PriceService.applyTax(product, 0.1);

    expect(product).toEqual({ name: 'Bag', price: 50, category: 'daily' });
    expect(result).toEqual({
      name: 'Bag',
      price: 50,
      category: 'daily',
      taxIncluded: expect.closeTo(55),
    });
    expect(result).not.toBe(product);
  });
});
