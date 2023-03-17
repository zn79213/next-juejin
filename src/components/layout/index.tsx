import {HeaderNav, IHeaderNavProps} from "@/components/headerNav";
import {FC} from "react";
import styles from "./styles.module.scss";
import {Aside, IAsideProps} from "@/components/aside";
import {useLocation} from "react-router";
import {useRouter} from "next/router";

export interface ILayoutProps {
    headerNavData: IHeaderNavProps;

    asideData: IAsideProps;

}

export const Layout: FC<ILayoutProps & { children: JSX.Element }> = ({
                                                                         headerNavData,
                                                                         asideData,
                                                                         children,
                                                                     }) => {
    const l = useRouter()
    const path = l.pathname !== "/article/[articleId]";
    return (
        <div className={styles.layout}>
            <HeaderNav {...headerNavData} />
            <main className={path ? styles.main : styles.mainArticle}>
                {children}
                {path && <div className={styles.aside}>
                    <Aside {...asideData}/>
                </div>}
            </main>
        </div>
    );
};