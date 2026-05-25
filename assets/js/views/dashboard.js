(function () {
  const listEl = document.getElementById('product-list');

  const renderMessage = (message, className) => {
    if (!listEl) return;
    listEl.innerHTML = `<li class="${className}">${message}</li>`;
  };

  const normalizeProduct = (product) => ({
    name: typeof product?.name === 'string' && product.name.trim() ? product.name : 'Unknown product',
    taxIncluded:
      typeof product?.taxIncluded === 'number' && Number.isFinite(product.taxIncluded)
        ? `¥${product.taxIncluded}`
        : '価格不明',
  });

  fetch('/products')
    .then((r) => r.json())
    .then((products) => {
      if (!listEl) return;
      if (!Array.isArray(products) || products.length === 0) {
        renderMessage('商品がありません', 'empty');
        return;
      }

      listEl.innerHTML = products
        .map(normalizeProduct)
        .map((p) => `<li>${p.name}: ${p.taxIncluded}</li>`)
        .join('');
    })
    .catch(() => {
      renderMessage('商品の読み込みに失敗しました', 'error');
    });
})();
