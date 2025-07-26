/**
 * @jest-environment jsdom
 */

const path = require('path');

describe('dashboard view script', () => {
  beforeEach(() => {
    document.body.innerHTML = '<ul id="product-list"></ul>';
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { name: 'Pen', taxIncluded: 110 },
            { name: 'Book', taxIncluded: 1100 },
          ]),
      })
    );
  });

  afterEach(() => {
    jest.resetModules();
    delete global.fetch;
    document.body.innerHTML = '';
  });

  it('renders product list', async () => {
    const script = path.resolve(__dirname, '../assets/js/views/dashboard.js');
    require(script);
    // allow pending promises from fetch chain to resolve
    await new Promise(process.nextTick);
    expect(document.getElementById('product-list').innerHTML).toBe(
      '<li>Pen: ¥110</li><li>Book: ¥1100</li>'
    );
    expect(global.fetch).toHaveBeenCalledWith('/products');
  });
});
