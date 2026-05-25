const PriceService = require('../api/services/PriceService');

describe('PriceService.applyTax', () => {
  const expectImmutableInput = (source) => {
    expect(source).not.toHaveProperty('taxIncluded');
  };

  it('adds taxIncluded using default rate', () => {
    const product = { name: 'Pen', price: 100 };

    const result = PriceService.applyTax(product);

    expect(result.name).toBe('Pen');
    expect(result.price).toBe(100);
    expect(result.taxIncluded).toBeCloseTo(110);
    expectImmutableInput(product);
  });

  it('uses a custom tax rate when provided', () => {
    const product = { name: 'Notebook', price: 200 };

    const result = PriceService.applyTax(product, 0.08);

    expect(result.taxIncluded).toBeCloseTo(216);
    expectImmutableInput(product);
  });

  it('handles boundary prices (0 and decimal) with toBeCloseTo', () => {
    const zeroPriceProduct = { name: 'Sticker', price: 0 };
    const decimalPriceProduct = { name: 'Cable', price: 99.99 };

    const zeroPriceResult = PriceService.applyTax(zeroPriceProduct);
    const decimalPriceResult = PriceService.applyTax(decimalPriceProduct);

    expect(zeroPriceResult.taxIncluded).toBeCloseTo(0);
    expect(decimalPriceResult.taxIncluded).toBeCloseTo(109.989);
    expectImmutableInput(zeroPriceProduct);
    expectImmutableInput(decimalPriceProduct);
  });

  it('supports zero and 8% tax rates', () => {
    const product = { name: 'Bag', price: 500 };

    const noTaxResult = PriceService.applyTax(product, 0);
    const reducedTaxResult = PriceService.applyTax(product, 0.08);

    expect(noTaxResult.taxIncluded).toBeCloseTo(500);
    expect(reducedTaxResult.taxIncluded).toBeCloseTo(540);
    expectImmutableInput(product);
  });

  it('rejects negative tax rates', () => {
    const product = { name: 'Mug', price: 300 };

    expect(() => PriceService.applyTax(product, -0.01)).toThrow(RangeError);
    expectImmutableInput(product);
  });

  it('throws for invalid inputs (undefined product or price)', () => {
    expect(() => PriceService.applyTax()).toThrow(TypeError);
    expect(() => PriceService.applyTax({ name: 'NoPrice' })).toThrow(TypeError);
    expect(() => PriceService.applyTax({ name: 'BadPrice', price: NaN })).toThrow(TypeError);
  });
});
