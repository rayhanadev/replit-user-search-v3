import React from 'react';
import Head from 'next/head';

export default function HeadComponent({ title }) {
	return (
		<Head>
			<title>{ title ? `${title} - ` : ''}Replit User Search v3</title>
		</Head>
	)
}