module.exports = {
  async create(req, res) {
    try {
      return res.json(await Product.create(req.body).fetch());
    } catch (err) {
      if (err.code === 'E_INVALID_NEW_RECORD') {
        return res.status(400).json({
          code: err.code,
          message: 'Invalid product payload',
          details: err.details,
        });
      }

      throw err;
    }
  },
  async list(req, res) {
    const ps = await Product.find();
    return res.json(ps.map((p) => PriceService.applyTax(p)));
  },
};
