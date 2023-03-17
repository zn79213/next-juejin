import type {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';
import {ILayoutProps} from '@/components/layout';
import {CMSDOMAIN} from '@/utils';
import * as console from "console";

const getLayoutData = (req: NextApiRequest, res: NextApiResponse<ILayoutProps>): void => {
    axios.get(`${CMSDOMAIN}/api/layouts`).then(result => {
        // console.log(result.data)
        const {
            link_lists,
            logo_text,
            logo_image,
            logo_image_with_name,
            image_banner,
            headline,
            desc,
            advs,
        } = result.data || {};

        axios.get(`${CMSDOMAIN}/api/users?populate=deep`).then(result => {
            const authors = result.data || {};
            // console.log(result)

            res.status(200).json({
                headerNavData: {
                    linkList: {
                        title: link_lists?.data[0]?.title,
                        list: link_lists?.data[0]?.links?.data?.map((_item: any) => ({
                            label: _item.label,
                            link: _item.link,
                        })),
                    },
                    logo: {
                        image: `${CMSDOMAIN}${logo_image.data.url}`,
                        imageWithName: `${CMSDOMAIN}${logo_image_with_name.data.url}`,
                        text: logo_text,
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
                        introduction:item.introduction,
                    }))
                }
            });

        }).catch(e => {
            console.log(e);
        })
    });
};

export default getLayoutData;
