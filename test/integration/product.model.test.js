describe('Product model',()=>{ it('create & read',async()=>{
  const c=await Product.create({name:'Pen',price:100}).fetch();
  const f=await Product.findOne({id:c.id});
  expect(f.name).toBe('Pen');
});});
