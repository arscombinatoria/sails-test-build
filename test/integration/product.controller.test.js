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
  it('responds JSON', async () => {
    await Product.create({ name: 'Book', price: 1000 });
    const r = await req.get('/products');
    expect(r.status).toBe(200);
    expect(r.body[0]).toHaveProperty('taxIncluded');
  });
});

describe('POST /products', () => {
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

describe('POST /products validation', () => {
  it.each([
    {
      title: 'rejects request when name is missing',
      payload: { price: 500 },
      invalidField: 'name',
    },
    {
      title: 'rejects request when price is missing',
      payload: { name: 'Pen' },
      invalidField: 'price',
    },
    {
      title: 'rejects request when price is a string',
      payload: { name: 'Pen', price: 'abc' },
      invalidField: 'price',
    },
  ])('$title', async ({ payload, invalidField }) => {
    const r = await req.post('/products').send(payload);

    expect(r.status).toBeGreaterThanOrEqual(400);
    expect(r.status).toBeLessThan(500);

    expect(r.body).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'E_INVALID_NEW_RECORD',
          message: expect.any(String),
          details: expect.any(String),
        }),
      }),
    );
    expect(r.body.error.details).toContain(`\`${invalidField}\``);

    const stored = await Product.find();
    expect(stored).toHaveLength(0);
  });
});
