import type { AppProps } from "next/app"
import "@/styles/globals.css"
import Navbar from "@/components/navbar"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { queryClient } from "@/lib/queryClient"

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="min-h-screen min-w-full flex">
				<aside className="w-36 bg-gray-50 shadow-2xs p-6 sticky top-0 h-screen overflow-hidden flex-shrink-0">
					<Navbar />
				</aside>
				<section className="flex-1 overflow-auto overscroll-none h-screen">
					<Component {...pageProps} />
				</section>
			</div>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}
