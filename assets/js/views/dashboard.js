(function () {
  fetch('/products')
    .then((r) => r.json())
    .then((l) => {
      const productList = document.getElementById('product-list');
      if (!productList) {
        return;
      }

      productList.innerHTML = l
        .map((p) => `<li>${p.name}: ¥${p.taxIncluded}</li>`)
        .join('');
    })
    .catch(() => {
      // Intentionally ignore dashboard data load errors to avoid view crash.
    });
})();
