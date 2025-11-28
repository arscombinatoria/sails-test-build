const ProductModel = require('../api/models/Product');

describe('Product model definition', () => {
  it('defines required name and price attributes', () => {
    expect(ProductModel).toHaveProperty('attributes');
    const attrs = ProductModel.attributes;
    expect(attrs).toHaveProperty('name');
    expect(attrs.name).toMatchObject({ type: 'string', required: true });
    expect(attrs).toHaveProperty('price');
    expect(attrs.price).toMatchObject({ type: 'number', required: true });
  });
});
