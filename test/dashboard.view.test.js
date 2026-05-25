/**
 * @vitest-environment jsdom
 */

const path = require('path');

describe('dashboard view script', () => {
  const script = path.resolve(__dirname, '../assets/js/views/dashboard.js');

  const flushPromises = async () => {
    await new Promise(process.nextTick);
  };

  const loadDashboardScript = () => {
    delete require.cache[script];
    require(script);
  };

  beforeEach(() => {
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
    vi.restoreAllMocks();
    delete global.fetch;
    document.body.innerHTML = '';
  });

  it('renders product list', async () => {
    loadDashboardScript();

    await flushPromises();

    expect(document.getElementById('product-list').innerHTML).toBe(
      '<li>Pen: ¥110</li><li>Book: ¥1100</li>',
    );
    expect(global.fetch).toHaveBeenCalledWith('/products');
  });

  it('does not crash with an unhandled exception when fetch rejects', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('network error')));
    const unhandledRejectionSpy = vi.fn();
    process.once('unhandledRejection', unhandledRejectionSpy);

    expect(() => loadDashboardScript()).not.toThrow();
    await flushPromises();

    expect(document.getElementById('product-list').innerHTML).toBe(
      '<li class="error">商品の読み込みに失敗しました</li>',
    );
    expect(unhandledRejectionSpy).not.toHaveBeenCalled();
  });

  it('renders an empty-state message when response is an empty array', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      }),
    );

    loadDashboardScript();
    await flushPromises();

    expect(document.getElementById('product-list').innerHTML).toBe(
      '<li class="empty">商品がありません</li>',
    );
  });

  it('renders fallback values when json returns invalid product fields', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { name: 'Notebook' },
            { taxIncluded: 500 },
            {},
          ]),
      }),
    );

    loadDashboardScript();
    await flushPromises();

    expect(document.getElementById('product-list').innerHTML).toBe(
      '<li>Notebook: 価格不明</li><li>Unknown product: ¥500</li><li>Unknown product: 価格不明</li>',
    );
  });
});
