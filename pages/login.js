import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HCaptcha from '@hcaptcha/react-hcaptcha';

import Head from '../components/Head/Head.js';
import Layout from '../components/Layout/Layout.js';
import useUser from '../libs/useUser.js';
import fetcher from '../libs/fetcher.js';

import styles from '../styles/Login.module.scss';

export default function Login() {
	const { mutateUser } = useUser({
		redirectTo: '/',
		redirectIfFound: true,
	});

	const router = useRouter();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [sid, setSid] = useState('');
	const [token, setToken] = useState('');
	const [btnText, setBtnText] = useState('Log in');
	const captchaRef = useRef(null);

	const onSubmit = (event) => {
		event.preventDefault();
		captchaRef.current.execute();
	};

	const onExpire = () => {
		console.log("hCaptcha Token Expired");
	};

	const onError = (err) => {
		console.log(`hCaptcha Error: ${err}`);
	};

  useEffect(async () => {
    if (token) {
			const body = {
				username,
				password,
				captcha: token,
			}

			if(sid && sid.length > 0) body.sid = sid;

			try {
				const data = await fetcher('/api/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body),
				});

				mutateUser(data);
			} catch (error) {
				console.log(error.data.message)
				setBtnText(error.data.message);
			};
    }
  }, [token, username, password]);

	console.log(router.query)
	return (
		<Layout>
			<Head title="Login" />
			<div className={styles.loginForm}>
				<h1>Login to Replit</h1>
				<div className={styles.formBody}>
					{
						router.query.useSid === 'true' ? (
							<React.Fragment>
								<input
									type="text"
									value={sid}
									placeholder="connect.sid"
									onChange={(event) => setSid(event.target.value)}
								/>
								<div className={styles.flexBreak}></div>
							</React.Fragment>
						) : (
							<React.Fragment>
								<input
									type="text"
									value={username}
									placeholder="Username"
									onChange={(event) => setUsername(event.target.value)}
								/>
								<div className={styles.flexBreak}></div>
								<input
									type="password"
									value={password}
									placeholder="Password"
									onChange={(event) => setPassword(event.target.value)}
								/>
								<div className={styles.flexBreak}></div>
							</React.Fragment>
						)
					}
					<button onClick={onSubmit}><strong>{btnText}</strong></button>
				</div>
				<HCaptcha
					sitekey="473079ba-e99f-4e25-a635-e9b661c7dd3e"
					size="invisible"
					onVerify={setToken}
					onError={onError}
					onExpire={onExpire}
					ref={captchaRef}
				/>
			</div>
		</Layout>
	)
}