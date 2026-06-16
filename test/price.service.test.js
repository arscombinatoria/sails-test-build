const PriceService = require('../api/services/PriceService');

describe('PriceService.applyTax', () => {
  it('adds taxIncluded using default 10% consumption tax without mutating input', () => {
    const product = { name: 'Pen', price: 100 };

    const result = PriceService.applyTax(product);

    expect(result).toEqual({ name: 'Pen', price: 100, taxIncluded: expect.closeTo(110) });
    expect(result).not.toBe(product);
    expect(product).toEqual({ name: 'Pen', price: 100 });
  });

  it('uses an explicitly provided tax rate', () => {
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

  it('supports boundary tax rate values with direct formula behavior', () => {
    const product = { name: 'Item', price: 100 };

    expect(PriceService.applyTax(product, 0).taxIncluded).toBe(100);
    expect(PriceService.applyTax(product, -0.2).taxIncluded).toBe(80);
    expect(PriceService.applyTax(product, 1).taxIncluded).toBe(200);
  });

  it.each([
    { caseName: 'null product', product: null, rate: undefined, message: 'product must be an object' },
    { caseName: 'missing price', product: { name: 'Unknown price item' }, rate: undefined, message: 'product.price must be a finite number' },
    { caseName: 'non-numeric price', product: { name: 'Broken price item', price: 'abc' }, rate: undefined, message: 'product.price must be a finite number' },
    { caseName: 'infinite price', product: { name: 'Infinite item', price: Infinity }, rate: undefined, message: 'product.price must be a finite number' },
    { caseName: 'non-numeric tax rate', product: { name: 'Pen', price: 100 }, rate: '0.1', message: 'tax rate must be a finite number' },
  ])('throws a clear TypeError for invalid input: $caseName', ({ product, rate, message }) => {
    expect(() => PriceService.applyTax(product, rate)).toThrow(new TypeError(message));
  });

  it('preserves additional product properties in the returned object', () => {
    const product = { name: 'Bag', price: 50, category: 'daily' };

    const result = PriceService.applyTax(product, 0.1);

    expect(result).toEqual({
      name: 'Bag',
      price: 50,
      category: 'daily',
      taxIncluded: expect.closeTo(55),
    });
  });
});
