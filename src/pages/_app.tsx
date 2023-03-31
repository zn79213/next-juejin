import '@/styles/globals.scss';
import type {AppContext, AppProps} from 'next/app';
import App from 'next/app';
import Head from "next/head";
import {ThemeContextProvider} from '@/stores/theme';
import {UserAgentProvider} from "@/stores/userAgent";
import {ILayoutProps, Layout} from "@/components/layout";
import axios from "axios";
import {getIsMobile, getIsSupportWebp, LOCALDOMAIN} from "@/utils";
import {TransContextProvider} from "@/stores/transfrom";

export interface IComponentProps {
    isMobile?: boolean;
    isSupportWebp?: boolean;
}

const MyApp = (data: AppProps & ILayoutProps & IComponentProps): JSX.Element => {
    const {Component, pageProps, headerNavData, isMobile, isSupportWebp} = data;

    return (
        <>
            <Head>
                <title>{`稀土掘金`}</title>
                <meta name="description"
                      content={`掘金是面向全球中文开发者的技术内容分享与交流平台。我们通过技术文章、沸点、课程、直播等产品和服务，打造一个激发开发者创作灵感，激励开发者沉淀分享，陪伴开发者成长的综合类技术社区。`}/>
                <meta name="viewport" content="user-scalable=no"/>
                <meta name="viewport" content="initial-scale=1,maximum-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <ThemeContextProvider>
                <UserAgentProvider>
                    <TransContextProvider>
                        <Layout headerNavData={headerNavData}>
                            <Component {...pageProps} isMobile={isMobile} isSupportWebp={isSupportWebp}/>
                        </Layout>
                    </TransContextProvider>
                </UserAgentProvider>
            </ThemeContextProvider>
        </>
    )
}

MyApp.getInitialProps = async (context: AppContext): Promise<AppProps & ILayoutProps & IComponentProps> => {
    const pageProps = await App.getInitialProps(context);
    const {data = {}} = await axios.get(`${LOCALDOMAIN}/api/layout`);

    return {
        ...pageProps,
        ...data,
        isMobile: getIsMobile(context),
        isSupportWebp: getIsSupportWebp(context),
    };
};

export default MyApp;