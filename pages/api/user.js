import withSession from '../../libs/session.js';

export default withSession(async (req, res) => {
  const user = req.session.get('user');

  if (user) {
    res.send(JSON.stringify({
      isLoggedIn: true,
      ...user,
    }));
  } else {
    res.send(JSON.stringify({
      isLoggedIn: false,
    }));
  }
});