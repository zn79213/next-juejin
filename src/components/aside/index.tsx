import {FC} from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import {ILink} from "@/components/headerNav";
import {LOCALDOMAIN} from "@/utils";

interface IAppDownload {
    imageBanner: string;
    headline: string;
    desc: string;
}

interface IAdv {
    advImg: string;
    advLink: ILink;
}

export interface IAuthor {
    username: string;
    rank?: string;
    avatar: string;
    introduction?:string;
}

export interface IAsideProps {
    appDownload: IAppDownload;
    adv: IAdv;
    authors: IAuthor[];
}

export const Aside: FC<IAsideProps> = ({appDownload, adv, authors}) => {
    return (
        <div className={styles.aside}>
            <div className={styles.bannerBlock}>
                <div className={styles.banner}>
                    <a href={adv.advLink.link || '/'}>
                        <img src={adv.advImg} alt={adv.advLink.label} width={240} height={200}/>
                    </a>

                    <div className={styles.ctrlBox}>
                        <span className={styles.ionClose}></span>
                        <a href="">
                            <span className={styles.icon}>投放</span>
                            <span>广告</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.bannerBlock}>
                <a href="">
                    <div className={styles.appDownload}>
                        <img src={appDownload.imageBanner} className={styles.qrImg}/>
                        <div className={styles.contentBox}>
                            <div className={styles.headLine}>{appDownload.headline}</div>
                            <div className={styles.desc}>{appDownload.desc}</div>
                        </div>
                    </div>
                </a>
            </div>

            <div className={styles.bannerBlock}>
                <div className={styles.authorRank}>
                    <header>🎖️作者榜</header>
                    <div className={styles.userList}>
                        {authors.map((author,index) => {
                            return (
                                <div className={styles.item} key={index}>
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
                            )
                        })}
                        <a href="">
                            <div className={styles.more}>
                                <span>完整榜单</span>
                                <span className={styles.i}></span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}