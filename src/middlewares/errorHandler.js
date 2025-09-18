// Error handling middleware in which it helps to catch and respond to errors
export default (err, req, res, next) => {
  console.error(err);
  if (err?.code === 'P2002') {
    return res.status(409).json({ message: 'Duplicate value', meta: err.meta });
  }
  if (err?.status && err?.message) {
    return res.status(err.status).json({ message: err.message });
  }
  res.status(500).json({ message: 'Internal server error' });
};
