const req=require('supertest')(sails.hooks.http.app);
describe('GET /products',()=>{ it('responds JSON',async()=>{
  await Product.create({name:'Book',price:1000});
  const r=await req.get('/products');
  expect(r.status).toBe(200);
  expect(r.body[0]).toHaveProperty('taxIncluded');
});});
