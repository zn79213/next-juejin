import styles from '@/styles/Home.module.scss'
import React, {FC, useContext, useEffect, useState} from "react";
import {ThemeContext} from "@/stores/theme";
import {ILinkList} from "@/components/headerNav";
import {NextPage} from "next";
import Link from "next/link";
import {CMSDOMAIN, LOCALDOMAIN} from "@/utils";
import axios from 'axios';
import {IArticleIntro} from "@/pages/api/articleIntro";
import Image from "next/image";
import { IComponentProps } from './_app';

export interface IProps {
    indexHeaderNavData: {
        linkList: ILinkList
    };
    articles: {
        list: {
            label: string;
            author: string;
            title: string;
            abstract: string;
            cover?: string;
            link: string;
            articleId: number;
        }[];
        total: number;
    };
}

const Home: NextPage<IProps & IComponentProps> = ({indexHeaderNavData, articles,isSupportWebp}) => {
    const {theme} = useContext(ThemeContext);
    const [content, setContent] = useState(articles);

    // useEffect(() => {
    //
    // }, [theme])

    return (
        <>
            <nav className={styles.vewNav}>
                <div className={styles.navList}>
                    {indexHeaderNavData.linkList.list?.map((item, index) => {
                        return (
                            <Link key={index} href={item.link || '/'} className={styles.listItem}>
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
            <main className={styles.main}>
                <div className={styles.articleMainPC}>
                    <div className={styles.listHeader}>
                        最新最热
                        <ul>
                            {/*<li>最新</li>*/}
                            {/*<li>最热</li>*/}
                        </ul>
                    </div>
                    <div className={styles.articles}>
                        {content?.list?.map((item, index) => {
                            return (
                                <Link href={item.link} key={index}>
                                    <div className={styles.article}>
                                        <div>
                                            <div>{item.author}</div>
                                        </div>
                                        <div className={styles.articleMain}>
                                            <div className={styles.contentMain}>
                                                <div className={styles.title}>{item.title}</div>
                                                <div className={styles.abstract}>{item.abstract}</div>
                                                {/*<ul><li></li></ul>*/}
                                            </div>
                                            <img src={item.cover} alt={item.title}
                                                 className={styles.articleCover}/>
                                        </div>

                                        {/*<div className={styles.dislikeButton}>*/}
                                        {/*    <svg width="12" height="12"*/}
                                        {/*         fill="none" className="icon-close">*/}
                                        {/*        <path*/}
                                        {/*            d="M1.70538 11.7191C1.52399 11.899 1.22992 11.899 1.04853 11.7191L1.03125 11.7019C0.849866 11.522 0.84987 11.2302 1.03125 11.0502L10.2956 1.85884C10.477 1.67889 10.7711 1.67889 10.9525 1.85885L10.9697 1.876C11.1511 2.05596 11.1511 2.34773 10.9697 2.52769L1.70538 11.7191Z"></path>*/}
                                        {/*        <path*/}
                                        {/*            d="M1.0828 2.48943C0.903312 2.30758 0.904276 2.01369 1.08495 1.83302L1.10216 1.8158C1.28284 1.63513 1.5748 1.63609 1.75428 1.81794L10.9104 11.0949C11.0898 11.2767 11.0889 11.5706 10.9082 11.7513L10.891 11.7685C10.7103 11.9492 10.4183 11.9482 10.2389 11.7664L1.0828 2.48943Z"></path>*/}
                                        {/*    </svg>*/}
                                        {/*</div>*/}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {/*<div className={styles.paginationArea}>*/}
                    {/*    <Pagination*/}
                    {/*        total={content?.total}*/}
                    {/*        pageSize={6}*/}
                    {/*        onPageChange={(pageNo: number): void => {*/}
                    {/*            axios*/}
                    {/*                .post(`${LOCALDOMAIN}/api/articleIntro`, {*/}
                    {/*                    pageNo,*/}
                    {/*                    pageSize: 6,*/}
                    {/*                })*/}
                    {/*                .then(({data}) => {*/}
                    {/*                    setContent({*/}
                    {/*                        list: data.list.map((item: IArticleIntro) => ({*/}
                    {/*                            label: item.label,*/}
                    {/*                            info: item.info,*/}
                    {/*                            link: `${LOCALDOMAIN}/article/${item.articleId}`,*/}
                    {/*                        })),*/}
                    {/*                        total: data.total,*/}
                    {/*                    });*/}
                    {/*                });*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
            </main>
        </>
    )
}

Home.getInitialProps = async (context): Promise<IProps> => {
    const {data: homeData} = await axios.get(`${LOCALDOMAIN}/api/home`);
    const {data: articleData} = await axios.post(`${LOCALDOMAIN}/api/articleIntro`, {
        pageNo: 1,
        pageSize: 6,
    });

    // console.log(articleData)

    return {
        indexHeaderNavData: homeData.indexHeaderNavData,
        articles: {
            list: articleData.list.map((item: IArticleIntro) => ({
                label: item.label,
                author: item.author.data.username,
                title: item.title,
                abstract: item.abstract,
                cover: CMSDOMAIN + item.cover.data.url,
                link: `${LOCALDOMAIN}/article/${item.article_id}`,
                articleId: item.article_id,
            })),
            total: articleData.total,
        },
    };
};
export default Home;
