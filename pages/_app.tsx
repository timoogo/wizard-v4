    import React from 'react';
    import './styles/_global.css';
    import {QueryClient, QueryClientProvider} from "react-query";
    import Header from "@/components/Header";

    interface AppProps {
        Component: React.ComponentType;
        pageProps: object;
    }
    const queryClient = new QueryClient();
    function MyApp({ Component, pageProps }: AppProps) {
        return (
            <>
                <Header/>
                <main className="pt-16"> {/* Adjust this padding-top value to match your Header's height */}
            <QueryClientProvider client={queryClient}>
                    <Component {...pageProps} />
                </QueryClientProvider>
                </main>
            </>
        );
    }

    export default MyApp;
