import React from 'react';
import Image from 'next/image';

import styles from './Header.module.scss';

export default function Header({ user }) {
	return (
		<div className={styles.topBar}>
			<div className={styles.title}>
				<div className={styles.logo}>
					<Image
						src="/replit-logo.png"
						layout="fill"
						objectFit="cover"
					/>
				</div>
				<div className={styles.text}>
					<p className={styles.main}>Replit User Search v3</p>
					<p className={styles.subtitle}>By: RayhanADev</p>
				</div>
			</div>
			{
				user && user.username ? (
					<div className={styles.profile}>
						<button onClick={() => location.href = '/api/logout' }>Log out</button>
						<div className={styles.text}>
							<p className={styles.main}>{user.fullName}</p>
							<p className={styles.subtitle}>@{user.username}</p>
						</div>
						<div className={styles.img}>
							<Image
								src={user?.icon || '/replit-logo.png'}
								layout="fill"
								objectFit="cover"
								className={styles.img}
							/>
						</div>
					</div>
				) : <div></div>
			}
		</div>
	)
}