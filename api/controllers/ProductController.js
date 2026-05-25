module.exports = {
  async create(req, res) {
    try {
      return res.json(await Product.create(req.body).fetch());
    } catch (e) {
      if (e.code === 'E_INVALID_NEW_RECORD') {
        return res.status(400).json({
          error: {
            code: e.code,
            message: e.message,
            details: e.details,
          },
        });
      }
      throw e;
    }
  },
  async list(req, res) {
    const ps = await Product.find();
    return res.json(ps.map((p) => PriceService.applyTax(p)));
  },
};
