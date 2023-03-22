import {CMSDOMAIN} from "@/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {ILinkList} from "@/components/headerNav";
import {HTTP} from "@/lib/strapi";


interface IHomeProps {
    indexHeaderNavData: {
        linkList: ILinkList
    };
}

const getHomeData = (req: NextApiRequest, res: NextApiResponse<IHomeProps>): void => {
    HTTP.get(`${CMSDOMAIN}/api/homes`).then(result => {
        const {link_lists} = result.data || {};
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
        })
    })

}

export default getHomeData;