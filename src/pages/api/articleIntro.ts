import type {NextApiRequest, NextApiResponse} from 'next';
import {CMSDOMAIN} from '@/utils';
import {HTTP} from "@/lib/strapi";

export interface IArticleIntro {
    label: string;
    author: any;
    title: string;
    abstract: string;
    cover: any;
    article_id: number;
}

interface IArticleIntroProps {
    list: Array<{
        label: string; author: string;
        title: string; abstract: string; cover: any; article_id: number
    }>;
    total: number;
}

const getArticleIntroData = (req: NextApiRequest, res: NextApiResponse<IArticleIntroProps>): void => {
    const {pageNo, pageSize, linkName} = req.body;
    HTTP.get(`${CMSDOMAIN}/api/article-introductions`, {
        params: {
            pageNo,
            pageSize,
            linkName,
        },
    }).then(result => {
        const {data, meta} = result.data || {};
        res.status(200).json({
            list: Object.values(data),
            total: meta.pagination.total,
        });
    });
};

export default getArticleIntroData;
