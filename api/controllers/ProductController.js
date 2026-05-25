module.exports = {
  async create(req, res) {
    return res.json(await Product.create(req.body).fetch());
  },
  async list(req, res) {
    const ps = await Product.find();
    return res.json(ps.map((p) => PriceService.applyTax(p)));
  },
};
