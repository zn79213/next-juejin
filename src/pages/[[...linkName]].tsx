import styles from '@/styles/Home.module.scss'
import React, {CSSProperties, FC, useContext, useEffect, useRef, useState} from "react";
import {ThemeContext} from "@/stores/theme";
import {ILink, ILinkList} from "@/components/headerNav";
import {NextPage} from "next";
import Link from "next/link";
import {CMSDOMAIN, LOCALDOMAIN} from "@/utils";
import axios from 'axios';
import {IArticleIntro} from "@/pages/api/articleIntro";
import Image from "next/image";
import {IComponentProps} from './_app';
import {TransContext} from "@/stores/transfrom";
import {Aside, IAsideProps} from "@/components/aside";

export interface IProps {
    linkName: string | string[] | undefined;
    indexHeaderNavData: {
        linkList: ILinkList
    };
    asideData: IAsideProps;
    articles: {
        list: {
            label: ILink;
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

const Home: NextPage<IProps & IComponentProps> = ({linkName, indexHeaderNavData, articles, isSupportWebp,asideData}) => {
    const {theme} = useContext(ThemeContext);
    const [content, setContent] = useState<IProps["articles"]>({list: [], total: 0});
    const [pageNo, setPageNo] = useState(1);
    const {needTrans} = useContext(TransContext);
    const [current, setCurrent] = useState(linkName || 'index')

    // 节流
    const throttle = (func: Function, delay = 1000) => {
        let timer: any = null;
        return (...a: any[]) => {
            const context = this;
            const args = a;
            if (!timer) {
                timer = setTimeout(() => {
                    func.apply(context, args);
                    timer = null;
                }, delay);
            }
        }
    }

    useEffect(() => {
        // console.log(articles)
        setContent(articles);
        setCurrent(linkName || '');
    }, [linkName])

    useEffect(() => {
        // 处理函数
        const handle = () => {
            if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10) {
                setPageNo(pre => {
                    axios.post(`${LOCALDOMAIN}/api/articleIntro`, {
                        pageNo: pre + 1,
                        pageSize: 8,
                        linkName,
                    }).then(({data}) => {
                        let addList = data.list.map((item: IArticleIntro) => ({
                            label: item.label,
                            author: item.author.data.username,
                            title: item.title,
                            abstract: item.abstract,
                            cover: item.cover.data ? (CMSDOMAIN + item.cover.data?.url) : '',
                            link: `${LOCALDOMAIN}/article/${item.article_id}`,
                            articleId: item.article_id,
                        }))
                        setContent(prev => {
                            let c: IProps["articles"] = {list: [], total: prev.total};
                            c.list = [...prev.list, ...addList];
                            return c;
                        })
                    })
                    return pre + 1;
                })
            }
        }
        const scrollLoading = throttle(handle, 1000);
        // 滚动事件
        document.addEventListener('scroll', scrollLoading);
        return (): void => {
            document.removeEventListener('scroll', scrollLoading);
        }
    }, [])


    return (
        <>
            <nav className={needTrans ? styles.vewNav + ' ' + styles.scroll : styles.vewNav}>
                {/*    <nav className={styles.vewNav}>*/}
                <div className={styles.navList}>
                    {indexHeaderNavData.linkList.list?.map((item, index) => {
                        const link = item.link || '/'
                        // console.log("link: ", link)
                        return (
                            <Link key={item.link} href={link}
                                  className={('/' + current === item.link) ? styles.listItem + ' ' + styles.navActive : styles.listItem}>
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
            <div className={styles.main}>
                <div className={styles.articleMainPC}>
                    <div className={styles.listHeader}>
                        最新 | 最热
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
                                            {item.cover &&
                                                <img src={item.cover} alt={item.title}
                                                     className={styles.articleCover}/>}
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
                </div>
                <Aside {...asideData}/>
                {/*{isSupportWebp && <Aside {...asideData}/>}*/}
            </div>
        </>
    )
}

Home.getInitialProps = async (context): Promise<IProps> => {
    const linkName = context.query.linkName ? context.query.linkName : '';
    // console.log(context.query, linkName)
    const {data: homeData} = await axios.get(`${LOCALDOMAIN}/api/home`);
    const {data: articleData} = await axios.post(`${LOCALDOMAIN}/api/articleIntro`, {
        pageNo: 1,
        pageSize: 8,
        linkName: linkName
    })

    // console.log(articleData)

    return {
        linkName,
        indexHeaderNavData: homeData.indexHeaderNavData,
        asideData: homeData.asideData,
        articles: {
            list: articleData.list.map((item: IArticleIntro) => ({
                label: item.label,
                author: item.author.data.username,
                title: item.title,
                abstract: item.abstract,
                cover: item.cover.data ? (CMSDOMAIN + item.cover.data?.url) : '',
                link: `${LOCALDOMAIN}/article/${item.article_id}`,
                articleId: item.article_id,
            })),
            total: articleData.total,
        },
    };
};
export default Home;
