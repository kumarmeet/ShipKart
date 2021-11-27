const flashDataSession = (req, data, action) => {
  req.session.flashedData = data;
  req.session.save(action);
};

const getSessionData = (req) => {
  const sessionData = req.session.flashedData;
  req.session.flashedData = null;
  return sessionData;
};

module.exports = {
  getSessionData: getSessionData,
  flashDataSession: flashDataSession,
};
