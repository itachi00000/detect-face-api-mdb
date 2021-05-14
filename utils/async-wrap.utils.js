const asyncWrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = { asyncWrap };
