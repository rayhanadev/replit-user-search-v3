import { lightfetch } from 'lightfetch-node';
import withSession from '../../libs/session.js';

export default withSession(async (req, res) => {
  const user = req.session.get('user');
	const { query } = await req.body;

	const body = {
		query: 'query UserSearch($query: String!, $limit: Int!) { usernameSearch(query: $query, limit: $limit) { username fullName image karma bio } }',
		variables: JSON.stringify({
			query,
			limit: 4
		}),
	};

	try {
		const { data, error } = await lightfetch('https://replit.com/graphql', {
			method: 'POST',
			headers: {
				Cookie: 'connect.sid=' + user.token,
				Referrer: 'https://replit.com/',
				'X-Requested-With': 'XMLHttpRequest'
			},
			body,
		}).then((res) => res.toJSON());

		if(error) {
			res.status(400).send(JSON.stringify({
				status: 400,
				message: error,
			}));
		} else {
			res.status(200).send(JSON.stringify({
				status: 200,
				data: data.usernameSearch,
			}));
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(JSON.stringify({
			status: 500,
			message: 'Something happened on the server.',
		}));
	}
});