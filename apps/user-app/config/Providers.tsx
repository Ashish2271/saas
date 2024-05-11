'use client'
import { SessionProvider } from "next-auth/react";
import ThemeProvider from '../lib/mui/ThemeProvider'
import { PropsWithChildren } from 'react'
const Providers = ({ children }: PropsWithChildren) => {
	return (
    <SessionProvider>
	<ThemeProvider>
		{children}
    </ThemeProvider>
	</SessionProvider>
)
}

export default Providers
