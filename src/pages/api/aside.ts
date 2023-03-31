import {CMSDOMAIN} from "@/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {ILinkList} from "@/components/headerNav";
import {HTTP} from "@/lib/strapi";
import {IAsideProps} from "@/components/aside";


interface IHomeProps {
    indexHeaderNavData: {
        linkList: ILinkList
    };
    asideData: IAsideProps
}

const getAsideData = (req: NextApiRequest, res: NextApiResponse<IHomeProps>): void => {
    HTTP.get(`${CMSDOMAIN}/api/layouts`).then(result => {
        const {
            link_lists,
            image_banner,
            headline,
            desc,
            advs,
        } = result.data || {};
        HTTP.get(`${CMSDOMAIN}/api/users?populate=deep`).then(result => {
            const authors = result.data.slice(0, 3) || [];
            res.status(200).json({
                indexHeaderNavData: {
                    linkList: {
                        title: link_lists.data[0].title,
                        list: link_lists?.data[0].links?.data?.map((_item: any) => ({
                            label: _item.label,
                            link: _item.link,
                        })),
                    }
                },
                asideData: {
                    appDownload: {
                        imageBanner: `${CMSDOMAIN}${image_banner.data.url}`,
                        headline: headline,
                        desc: desc,
                    },
                    adv: {
                        advImg: `${CMSDOMAIN}${advs.data[0].adv_img.data.url}`,
                        advLink: {
                            label: advs.data[0].link.data.label,
                            link: advs.data[0].link.data.link,
                        }
                    },
                    authors: authors?.map((item: any) => ({
                        username: item.username,
                        rank: `${CMSDOMAIN}${item.rank.rank_img.url}`,
                        avatar: `${CMSDOMAIN}${item.avatar.url}`,
                        introduction: item.introduction,
                    }))
                }
            })
        })
    })

}

export default getAsideData;