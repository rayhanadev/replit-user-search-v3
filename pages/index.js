import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import Head from '../components/Head/Head.js';
import Layout from '../components/Layout/Layout.js';
import useUser from '../libs/useUser.js';
import fetcher from '../libs/fetcher.js';

import styles from '../styles/Home.module.scss';

export default function Home() {
	const { user } = useUser({ redirectTo: '/login' });
	const [username, setUsername] = useState('');
	const [currentUsers, setCurrentUsers] = useState([]);

	useEffect(() => {
		window.stop();
		const fetchUsers = async () => {
			if(username && username.trim().length > 0) {
				const { data: res, override } = await fetcher('/api/search', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						query: username
					}),
				});

				const data = res === null ? [] : res;

				if(data.length < 4 && user.username.includes(username) && override !== true) {
					data.push({
						image: user.icon,
						fullName: user.fullName,
						username: user.username,
						karma: user.karma,
						bio: user.bio
					});
				}

				setCurrentUsers(data.map((user) => {
						return {
							icon: user.image,
							fullName: user.fullName,
							username: user.username,
							cycles: user.karma,
							description: user.bio,
						}
				}));
			} else {
				setCurrentUsers([]);
			}
		}

		fetchUsers();
	}, [username]);

	if (!user || user.isLoggedIn === false) return <Layout>loading...</Layout>;


	return (
		<Layout>
			<Head title="Home" />

			<div className={styles.container}>
				<div className={styles.searchBar}>
					<FontAwesomeIcon icon={faChevronRight} className={styles.chevron} />
					<input
						type="text"
						value={username}
						placeholder="Username"
						onChange={(event) => setUsername(event.target.value)}
						className={styles.searchInput}
					/>
				</div>
				<div className={styles.flexBreak}></div>
				{
					currentUsers.map((user) => (
						<React.Fragment>
							<Card user={user} />
							<div className={styles.flexBreak}></div>
						</React.Fragment>
					))
				}
			</div>
		</Layout>
	)
}

function Card({ user }) {
	return (
		<a href={'https://replit.com/@' + user.username} className={styles.card}>
			<div className={styles.card}>
				<div className={styles.header}>			
					<div className={styles.img}>
						<Image
							src={user.icon}
							layout="fill"
							objectFit="cover"
							className={styles.img}
						/>
					</div>
					<div>
						<p className={styles.name}>{user.fullName || user.username}</p>
						<p className={styles.info}>@{user.username} • {user.cycles || 0} cycles</p>
					</div>
				</div>
				<p className={styles.desc}>
					{user.description || "This user hasn't written a bio yet." }
				</p>
			</div>
		</a>
	)
}