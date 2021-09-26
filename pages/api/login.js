import { authenticate } from 'replit-login';
import { lightfetch } from 'lightfetch-node';
import withSession from '../../libs/session.js';

export default withSession(async (req, res) => {
	const { username, password, captcha } = await req.body;

	const body = {
		query: '{ currentUser { username fullName image karma bio } }',
	};

	try {
		if (username && password && captcha) {
			const auth = await authenticate(username, password, captcha);

			if (typeof auth === 'string') {
				const { data: { currentUser: { username, fullName, image, karma, bio } } } = await lightfetch(`https://replit.com/graphql`, {
					method: 'POST',
					headers: {
						Cookie: 'connect.sid=' + auth,
						Referrer: 'https://replit.com/',
						'X-Requested-With': 'XMLHttpRequest'
					},
					body,
				}).then((res) => res.toJSON());

				const user = {
					username,
					fullName,
					icon: image,
					karma: karma,
					bio: bio,
					token: auth,
					isLoggedIn: true,
				};
				req.session.set('user', user);
				await req.session.save();

				res.status(200).send(JSON.stringify({
					status: 200,
					...user,
				}));
			} else {
				res.status(500).send(JSON.stringify({
					status: 500,
					message: 'Invalid credentials.',
				}));
			}
		} else {
			res.status(400).send(JSON.stringify({
				status: 400,
				message: 'Invalid credentials.',
			}));
		}
	} catch (error) {
		console.log(error)
		res.status(500).send(JSON.stringify({
			status: 500,
			message: 'Something happened on the server.',
		}));
	}
});