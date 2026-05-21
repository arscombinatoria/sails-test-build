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
        port: 1339,
      },
      (e) => (e ? rej(e) : res())
    )
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
