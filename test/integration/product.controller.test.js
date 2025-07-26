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
      },
      (e) => (e ? rej(e) : res())
    )
  );
  req = supertest(sails.hooks.http.app);
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
