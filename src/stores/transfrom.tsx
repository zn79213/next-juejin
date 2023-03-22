import {createContext, Dispatch, SetStateAction, useEffect, useState} from "react";

interface ITransContextProps {
    needTrans: Boolean;
    setNeedTrans: Dispatch<SetStateAction<boolean>>;
}

interface IProps {
    children: JSX.Element;
}

export const TransContext = createContext({} as ITransContextProps)

export const TransContextProvider = ({children}: IProps): JSX.Element => {
    const [needTrans, setNeedTrans] = useState(false);

    useEffect(() => {
        // 导航栏动画效果
        let pre = 0;

        function scrollTrans() {
            const height = 150;
            const scrollTop = document.documentElement.scrollTop;
            // console.log(scrollTop, pre, 'pre')
            if (scrollTop > height && !needTrans && scrollTop > pre) {
                setNeedTrans(true);
            } else if (scrollTop <= height || scrollTop < pre) {
                setNeedTrans(false);
            }
            pre = scrollTop;
        };
        window.addEventListener('scroll', scrollTrans);
        return (): void => {
            window.removeEventListener('scroll', scrollTrans);
        }
    }, [])

    return (
        <TransContext.Provider
            value={{needTrans, setNeedTrans}}>
            {children}
        </TransContext.Provider>
    )
}