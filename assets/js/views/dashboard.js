(function () {
  fetch('/products')
    .then((r) => r.json())
    .then((l) => {
      document.getElementById('product-list').innerHTML = l
        .map((p) => `<li>${p.name}: ¥${p.taxIncluded}</li>`)
        .join('');
    });
})();
