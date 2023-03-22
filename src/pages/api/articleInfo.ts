import type { NextApiRequest, NextApiResponse } from 'next';
import {CMSDOMAIN} from '@/utils';
import { IArticleProps } from '../article/[articleId]';
import {HTTP} from "@/lib/strapi";

const getArticleInfoData = (req: NextApiRequest, res: NextApiResponse<IArticleProps>): void => {
  const { articleId } = req.query;
  HTTP.get(`${CMSDOMAIN}/api/article-introductions/${articleId}`).then(result => {
    const data = result.data || {};
    res.status(200).json(data);
  });
};

export default getArticleInfoData;
