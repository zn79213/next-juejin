import type {NextApiRequest, NextApiResponse} from 'next';
import {ILayoutProps} from '@/components/layout';
import {CMSDOMAIN} from '@/utils';
import {HTTP} from "@/lib/strapi";

const getLayoutData = (req: NextApiRequest, res: NextApiResponse<ILayoutProps>): void => {
    HTTP.get(`${CMSDOMAIN}/api/layouts`).then(result => {
        const {
            link_lists,
            logo_text,
            logo_image,
            logo_image_with_name,
            // image_banner,
            // headline,
            // desc,
            // advs,
        } = result.data || {};
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
        })


        // HTTP.get(`${CMSDOMAIN}/api/users?populate=deep`).then(result => {
        //     const authors = result.data.slice(0, 3) || [];

            // res.status(200).json({
            //     headerNavData: {
            //         linkList: {
            //             title: link_lists?.data[0]?.title,
            //             list: link_lists?.data[0]?.links?.data?.map((_item: any) => ({
            //                 label: _item.label,
            //                 link: _item.link,
            //             })),
            //         },
            //         logo: {
            //             image: `${CMSDOMAIN}${logo_image.data.url}`,
            //             imageWithName: `${CMSDOMAIN}${logo_image_with_name.data.url}`,
            //             text: logo_text,
            //         }
            //     },
                // asideData: {
                //     appDownload: {
                //         imageBanner: `${CMSDOMAIN}${image_banner.data.url}`,
                //         headline: headline,
                //         desc: desc,
                //     },
                //     adv: {
                //         advImg: `${CMSDOMAIN}${advs.data[0].adv_img.data.url}`,
                //         advLink: {
                //             label: advs.data[0].link.data.label,
                //             link: advs.data[0].link.data.link,
                //         }
                //     },
                //     authors: authors?.map((item: any) => ({
                //         username: item.username,
                //         rank: `${CMSDOMAIN}${item.rank.rank_img.url}`,
                //         avatar: `${CMSDOMAIN}${item.avatar.url}`,
                //         introduction: item.introduction,
                //     }))
                // }
            // });

        // })
    });
};

export default getLayoutData;
