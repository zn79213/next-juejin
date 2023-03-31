import styles from "./styles.module.scss";
import Image from "next/image";
import {CSSProperties, FC, useContext, useEffect, useRef, useState} from "react";
import {UserAgentContext} from "@/stores/userAgent";
import Link from "next/link";
import {Themes} from "@/constants/enum";
import {ThemeContext} from "@/stores/theme";
import {TransContext} from "@/stores/transfrom";

interface ILogo {
    image: string;
    imageWithName: string;
    text: string;
}

export interface ILink {
    label: string;
    link?: string;
}

export interface ILinkList {
    title: string;
    list: ILink[];
}

export interface IHeaderNavProps {
    logo: ILogo;
    linkList: ILinkList
}

export const HeaderNav: FC<IHeaderNavProps> = ({
                                                   logo,
                                                   linkList,
                                               }) => {
    const {setTheme} = useContext(ThemeContext);
    const {userAgent} = useContext(UserAgentContext);
    const [fold, setFold] = useState(true);
    const {needTrans} = useContext(TransContext);

    return (
        <div className={styles.headerBox}>
            <header className={needTrans ? styles.header + ' ' + styles.scroll : styles.header}>
                <div className={styles.headerMain}>
                    <div
                        className={userAgent === 'mobile' ? styles.headerInline : styles.headerInline + ' ' + styles.notMobile}>
                        {userAgent === 'mobile' ?
                            <Image src={logo.image} alt={logo.text} width={31} height={22} priority={true}/>
                            : <Image src={logo.imageWithName} alt={logo.text} width={107} height={22} priority={true}
                                     className={styles.imageWithName}/>
                        }
                        <nav className={styles.mainNav}>
                            {(userAgent === 'mobile' || userAgent === 'ipad') &&
                                <>
                                    <div className={styles.phoneShowMenu} onClick={_ => {
                                        setFold(!fold)
                                    }}>
                                        <span>首页</span>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                             className={fold ? styles.fold_down : styles.fold_up}
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M2.45025 4.82431C2.17422 4.49957 2.40501 4.00049 2.83122 4.00049H9.16878C9.59498 4.00049 9.82578 4.49957 9.54975 4.82431L6.38097 8.55229C6.1813 8.78719 5.8187 8.78719 5.61903 8.55229L2.45025 4.82431Z"></path>
                                        </svg>
                                    </div>
                                    {!fold && <ul className={styles.navItems_fold}>
                                        {linkList.list?.map((item, index) => {
                                            return (
                                                <li key={index} className={styles.navItem}>
                                                    <Link href={item.link || '/'} className={styles.navItemLink}>
                                                        <span className={styles.navItemText} onClick={() => {
                                                            setFold(!fold)
                                                        }
                                                        }>{item.label}</span>
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>}
                                </>
                            }

                            {userAgent === 'pc' && <ul className={styles.navItems}>
                                {linkList.list?.map((item, index) => {
                                    return (
                                        <li key={index} className={styles.navItem}>
                                            <Link href={item.link || '/'} className={styles.navItemLink}>
                                                <span className={styles.navItemText}>{item.label}</span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>}
                        </nav>

                        <div className={styles.themeIcon}
                             onClick={(): void => {
                                 if (localStorage.getItem('theme') === Themes.light) {
                                     setTheme(Themes.dark)
                                 } else setTheme(Themes.light)
                             }}
                        ></div>
                    </div>
                </div>
            </header>
        </div>
    )
}