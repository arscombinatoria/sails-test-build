const Sails = require('sails').Sails;
const supertest = require('supertest');

let sailsApp;
let req;

beforeAll(async () => {
  sailsApp = new Sails();
  await new Promise((res, rej) =>
    sailsApp.lift(
      {
        hooks: { grunt: false },
        log: { level: 'warn' },
        datastores: { default: { adapter: 'sails-disk', inMemoryOnly: true } },
        port: 0,
      },
      (e) => (e ? rej(e) : res()),
    ),
  );
  req = supertest(sails.hooks.http.app);
});

beforeEach(async () => {
  await Product.destroy({});
});

afterAll(async () => {
  if (sailsApp) {
    await new Promise((r) => sailsApp.lower(r));
  }
});

describe('GET /products', () => {
  const sortByName = (a, b) => a.name.localeCompare(b.name);

  it('returns empty array when no products exist', async () => {
    const r = await req.get('/products');

    expect(r.status).toBe(200);
    expect(r.body).toEqual([]);
  });

  it('responds JSON', async () => {
    const seedProducts = [
      { name: 'Book', price: 1000 },
      { name: 'Pen', price: 500 },
      { name: 'Notebook', price: 750 },
    ];
    const createdProducts = await Product.createEach(seedProducts).fetch();
    const r = await req.get('/products');

    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(createdProducts.length);

    const sortedExpected = [...createdProducts].sort(sortByName);
    const sortedActual = [...r.body].sort(sortByName);

    sortedActual.forEach((product, index) => {
      const expected = sortedExpected[index];
      expect(product.name).toBe(expected.name);
      expect(product.price).toBe(expected.price);
      expect(product.taxIncluded).toBeCloseTo(product.price * 1.1);
    });
  });

  it('calculates taxIncluded for decimal prices with expected rounding precision', async () => {
    const created = await Product.create({ name: 'Sticker', price: 99.99 }).fetch();

    const r = await req.get('/products');

    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(1);

    const sortedExpected = [created].sort(sortByName);
    const sortedActual = [...r.body].sort(sortByName);
    const [actual] = sortedActual;
    const [expected] = sortedExpected;

    expect(actual.name).toBe(expected.name);
    expect(actual.price).toBe(expected.price);
    expect(actual.taxIncluded).toBeCloseTo(109.989, 3);
    expect(actual.taxIncluded).toBeCloseTo(actual.price * 1.1);
  });

  it('allows zero and negative prices and applies tax calculation consistently', async () => {
    const seedProducts = [
      { name: 'DebtCoupon', price: -100 },
      { name: 'FreeSample', price: 0 },
    ];
    const createdProducts = await Product.createEach(seedProducts).fetch();

    const r = await req.get('/products');

    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(createdProducts.length);

    const sortedExpected = [...createdProducts].sort(sortByName);
    const sortedActual = [...r.body].sort(sortByName);

    sortedActual.forEach((product, index) => {
      const expected = sortedExpected[index];
      expect(product.name).toBe(expected.name);
      expect(product.price).toBe(expected.price);
      expect(product.taxIncluded).toBeCloseTo(expected.price * 1.1);
    });
  });
});

describe('POST /products', () => {

  describe('validation errors', () => {
    const invalidCases = [
      {
        name: 'missing name',
        payload: { price: 500 },
        expectedDetail: 'Missing value for required attribute `name`',
      },
      {
        name: 'missing price',
        payload: { name: 'Pen' },
        expectedDetail: 'Missing value for required attribute `price`',
      },
      {
        name: 'price is string',
        payload: { name: 'Pen', price: 'abc' },
        expectedDetail: 'wrong type of data for property `price`',
      },
    ];

    it.each(invalidCases)('returns fixed error contract for %s and has no side effects', async ({ payload, expectedDetail }) => {
      const beforeCount = await Product.count();

      const r = await req.post('/products').send(payload);

      expect(r.status).toBe(500);
      expect(r.body).toEqual(
        expect.objectContaining({
          code: 'E_INVALID_NEW_RECORD',
          isOperational: true,
          details: expect.stringContaining(expectedDetail),
          cause: expect.objectContaining({
            name: 'UsageError',
            code: 'E_INVALID_NEW_RECORD',
            details: expect.stringContaining(expectedDetail),
          }),
        }),
      );

      const afterCount = await Product.count();
      expect(afterCount).toBe(beforeCount);
    });
  });

  it('creates product', async () => {
    const product = { name: 'Pen', price: 500 };

    const r = await req.post('/products').send(product);

    expect(r.status).toBe(200);
    expect(r.body).toMatchObject(product);
    expect(r.body).toHaveProperty('id');

    const stored = await Product.findOne({ id: r.body.id });
    expect(stored).toMatchObject(product);
  });
});
