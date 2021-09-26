import React from 'react';
import Head from 'next/head';

import { SWRConfig } from 'swr';
import fetch from '../libs/fetcher.js';

import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
	return (
		<React.Fragment>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<SWRConfig
				value={{
					fetcher: fetch,
					onError: (err) => {
						console.error(err)
					},
				}}
			>
				<Component {...pageProps} />
			</SWRConfig>
		</React.Fragment>
	)
}

export default MyApp;