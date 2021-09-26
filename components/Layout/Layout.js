import React from 'react';

import Header from '../Header/Header.js';
import useUser from '../../libs/useUser.js';

import styles from './Layout.module.scss';

export default function Layout({ children }) {
  const { user } = useUser();

	return (
		<React.Fragment>
			<Header user={user} />
			<main>
				<div className={styles.children}>{children}</div>
			</main>
		</React.Fragment>
	)
}