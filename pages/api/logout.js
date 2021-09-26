import withSession from '../../libs/session.js';

export default withSession(async (req, res) => {
	req.session.destroy();
	res.status(200).redirect('/');
});