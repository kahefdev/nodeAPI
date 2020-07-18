exports.getOverview = (req, res) => {
  res.status(200).render('base', {
    title: 'Get All tours',
  });
};
exports.getTour = (req, res) => {
  res.status(200).render('base', {
    title: 'The Forest Hiker Tour',
  });
};
