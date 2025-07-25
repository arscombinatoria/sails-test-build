module.exports = { applyTax(p,r=0.1){return{...p,taxIncluded:p.price*(1+r)};} };
