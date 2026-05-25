/**
 * @vitest-environment jsdom
 */

const path = require('path');

const script = path.resolve(__dirname, '../assets/js/views/dashboard.js');

describe('dashboard view script', () => {
  beforeEach(() => {
    delete require.cache[script];
    document.body.innerHTML = '<ul id="product-list"></ul>';
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { name: 'Pen', taxIncluded: 110 },
            { name: 'Book', taxIncluded: 1100 },
          ]),
      }),
    );
  });

  afterEach(() => {
    vi.resetModules();
    delete global.fetch;
    document.body.innerHTML = '';
  });

  it('renders product list', async () => {
    require(script);
    await vi.waitFor(() => {
      expect(document.getElementById('product-list').innerHTML).toBe(
        '<li>Pen: ¥110</li><li>Book: ¥1100</li>',
      );
    });
    expect(global.fetch).toHaveBeenCalledWith('/products');
  });

  it('renders empty content when API returns an empty list', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      }),
    );

    const productList = document.getElementById('product-list');
    productList.innerHTML = '<li>before render</li>';

    require(script);
    await vi.waitFor(() => {
      expect(productList.innerHTML).toBe('');
    });
  });

  it('does not crash and keeps current DOM when fetch rejects', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('network error')));

    const productList = document.getElementById('product-list');
    productList.innerHTML = '<li>before render</li>';

    require(script);
    await vi.waitFor(() => {
      expect(productList.innerHTML).toBe('<li>before render</li>');
    });
  });

  it('does not crash and keeps current DOM when response.json rejects', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error('invalid json')),
      }),
    );

    const productList = document.getElementById('product-list');
    productList.innerHTML = '<li>before render</li>';

    require(script);
    await vi.waitFor(() => {
      expect(productList.innerHTML).toBe('<li>before render</li>');
    });
  });

  it('does not crash even when #product-list does not exist', async () => {
    document.body.innerHTML = '<div id="other"></div>';

    expect(() => require(script)).not.toThrow();
    await vi.waitFor(() => {
      expect(document.getElementById('other').innerHTML).toBe('');
    });
  });
});
