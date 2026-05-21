const Sails = require('sails').Sails;

let sailsApp;

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
      (e) => (e ? rej(e) : res())
    )
  );
});

afterAll(async () => {
  if (sailsApp) {
    await new Promise((r) => sailsApp.lower(r));
  }
});

describe('Product model', () => {
  it('create & read', async () => {
    const c = await Product.create({ name: 'Pen', price: 100 }).fetch();
    const f = await Product.findOne({ id: c.id });
    expect(f.name).toBe('Pen');
  });
});
