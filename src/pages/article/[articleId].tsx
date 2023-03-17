import {CMSDOMAIN, LOCALDOMAIN} from '@/utils';
import axios from 'axios';
import React, {CSSProperties, useEffect, useRef, useState} from 'react';
import type {GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage} from 'next';
import styles from './styles.module.scss';
import {IAuthor} from "@/components/aside";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight'


import {HeadingProps} from "react-markdown/lib/ast-to-react";

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const showdown = require('showdown');

export interface IArticleProps {
    title: string;
    author: IAuthor;
    abstract: string;
    cover: string;
    createdAt: string;
    content: string;
}

const Article: NextPage<IArticleProps> = ({title, author, abstract, cover, createdAt, content}) => {
    // const converter = new showdown.Converter();
    const toc: {
        level: number,
        id: string,
        title: string,
    }[] = [];
    const [needFixed, setNeedFixed] = useState(false);
    const tocRef = useRef<HTMLDivElement>(null);
    const styleObj: CSSProperties = {
        width: 300,
        position: needFixed ? 'fixed' : 'relative',
        top: 20,
        zIndex: 100,
    };

    useEffect(() => {
        const height = (tocRef.current?.getBoundingClientRect().top || 10) - (document.body.getBoundingClientRect().top) ||  300
        // console.log(height)
        window.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop;
            if (scrollTop > height && !needFixed) {
                setNeedFixed(true);
            } else if(scrollTop <= height) {
                setNeedFixed(false);
            }
        };
    }, []);

    // Magic.
    const addToTOC = ({children, ...props}: React.PropsWithChildren<HeadingProps>) => {
        const level = Number(props.node.tagName.match(/h(\d)/)?.slice(1));
        if (level && children && typeof children[0] === "string") {
            const id = (props.node.position?.start.line || '0') + '-' + (props.node.position?.start.column || '1')
            toc.push({
                level,
                id,
                title: children[0],
            });
            // console.log(toc)
            return React.createElement(
                props.node.tagName, {id, key: id}, children
            )
        } else {
            return React.createElement(props.node.tagName, props, children);
        }
    };

    function TOC() {
        return (
            <ul className={styles.catalogList}>
                {toc.map(({level, id, title}) => (
                    <li key={id} className={styles.item}>
                        <div className={styles.contain} style={{paddingLeft: level * 12}}>
                            <a href={`#${id}`} className={styles.aTag}>{title}</a>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }


    return (
        <div className={styles.main}>
            <div className={styles.article}>
                <article>
                    <h1 className={styles.title}>{title}</h1>
                    <div className={styles.authorInfo}>
                        <div className={styles.authorAvatar}>
                            <img src={author.avatar} alt="" className={styles.avatar}/>
                        </div>
                        <div className={styles.authorInfoBox}>
                            <div className={styles.authorName}>
                                <span className={styles.name}>{author.username}</span>
                                <span className={styles.rank}>
                                    <img src={author.rank} alt=""/>
                                </span>
                            </div>
                            <div className={styles.metaBox}>
                                <time className={styles.time}>{createdAt}</time>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img src={cover} alt={title} className={styles.cover}/>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.markdownBody}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                           components={{
                                               h1: addToTOC,
                                               // h1:()=><></>,
                                               h2: addToTOC,
                                               h3: addToTOC,
                                               h4: addToTOC,
                                               h5: addToTOC,
                                               h6: addToTOC,
                                           }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    </div>
                    {/*<div className={styles.content}>*/}
                    {/*    <div dangerouslySetInnerHTML={{__html: converter.makeHtml(content)}}*/}
                    {/*         className={styles.markdownBody}/>*/}
                    {/*</div>*/}
                </article>
            </div>
            <div className={styles.sideBar}>
                <div className={styles.author}>
                    <a href="" className={styles.itemInfo}>
                        <img src={author.avatar} alt="" className={styles.avatar}/>
                        <div className={styles.userInfo}>
                            <div className={styles.username}>
                                <span className={styles.name}>{author.username}</span>
                                <span className={styles.rank}>
                                    <img src={author.rank} alt="" className={styles.rankImg}/>
                                </span>
                            </div>
                            <div className={styles.position}>{author.introduction}</div>
                        </div>
                    </a>
                </div>
                <div className={styles.block}>
                    <div className={styles.blockTitle}>相关文章</div>
                    <div className={styles.blockBody}>
                        <div className={styles.entryList}>
                            <div >相关文章</div>
                            <div >相关文章</div>
                            <div >相关文章</div>

                        </div>
                    </div>
                </div>

                <div className={styles.block} style={styleObj} ref={tocRef}>
                    <div className={styles.blockTitle}>目录</div>
                    <div className={styles.catalogBody}>
                        {/* More magic. */}
                        <TOC/>
                    </div>
                </div>
            </div>
        </div>

    );
};

export const getServerSideProps: GetServerSideProps = async context => {
    const {articleId} = context.query;
    const {data} = await axios.get(`${LOCALDOMAIN}/api/articleInfo`, {
        params: {
            articleId,
        },
    });
    return {
        props: {
            title: data.title,
            author: {
                username: data.author.data.username,
                rank: `${CMSDOMAIN}${data.author.data.rank.data.rank_img.data.url}`,
                avatar: `${CMSDOMAIN}${data.author.data.avatar.data.url}`,
                introduction: data.author.data.introduction,
            },
            abstract: data.abstract,
            cover: `${CMSDOMAIN}${data.cover.data.url}`,
            createdAt: data.createdAt,
            content: data.content,
            label: data.label,
            // tags: data.tags.data.map((item: any) => {
            //     name:item.name
            // })
        }
    };
};


export default Article;
