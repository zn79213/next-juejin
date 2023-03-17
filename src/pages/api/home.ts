import axios from 'axios'
import {CMSDOMAIN} from "@/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {ILinkList} from "@/components/headerNav";


interface IHomeProps {
    indexHeaderNavData: {
        linkList: ILinkList
    };
}

const getHomeData = (req: NextApiRequest, res: NextApiResponse<IHomeProps>): void => {
    axios.get(`${CMSDOMAIN}/api/homes`).then(result => {
        const {link_lists} = result.data || {};
        // console.log(link_lists);
        // const linkListItem = link_lists?.data?.find((v: ILinkList) => v.title === 'index_header_nav');
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