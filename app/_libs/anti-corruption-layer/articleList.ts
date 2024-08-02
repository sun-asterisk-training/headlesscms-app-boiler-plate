import { MicroCMSListResponse } from 'microcms-js-sdk';
import { Article, getArticleList } from '../microcms';
import { ArticleListResponse, fetchArticleList } from '../nilto/articleList';
import { TYPE_CMS, TypeCMS } from '../utils';
import { CMS } from '@/_constants';
import {
  TransformedArticleDetailResponse,
  transformNiltoData,
  transformMicroCMSData,
} from './articleDetail';

// 記事一覧の型定義
export type TransformedArticleListResponse = {
  totalCount: number;
  limit: number;
  offset: number;
  contents: TransformedArticleDetailResponse[];
};

// 指定されたCMSから記事一覧を取得する
export const fetchArticleListCMSData = async (
  typeCMS: TypeCMS,
  limit: number,
  offset?: number,
  filters?: string,
  q?: string,
) => {
  switch (typeCMS) {
    case CMS.NILTO:
      return await fetchArticleList(limit, offset); // TODO: filters, q は未対応
    case CMS.MICROCMS:
      return await getArticleList({
        limit,
        offset,
        filters,
        q,
      });
    default:
      throw new Error('Unsupported CMS type');
  }
};

const transformNiltoListData = (niltoData: ArticleListResponse): TransformedArticleListResponse => {
  return {
    totalCount: niltoData.total,
    limit: niltoData.limit,
    offset: niltoData.offset,
    contents: niltoData.data.map((article) => transformNiltoData(article)),
  };
};

const transformMicroCMSListData = (
  microCMSData: MicroCMSListResponse<Article>,
): TransformedArticleListResponse => {
  return {
    totalCount: microCMSData.totalCount,
    limit: microCMSData.limit,
    offset: microCMSData.offset,
    contents: microCMSData.contents.map((article) => transformMicroCMSData(article)),
  };
};

export const transformResponse = (
  data: ArticleListResponse | MicroCMSListResponse<Article>,
  typeCMS: TypeCMS,
): TransformedArticleListResponse => {
  switch (typeCMS) {
    case CMS.NILTO:
      return transformNiltoListData(data as ArticleListResponse);
    case CMS.MICROCMS:
      return transformMicroCMSListData(data as MicroCMSListResponse<Article>);
    default:
      throw new Error('Unsupported CMS type');
  }
};

// 記事一覧を取得してデータを変換して返す
export const fetchArticleListData = async (
  limit: number,
  offset?: number,
  filters?: string,
  q?: string,
): Promise<TransformedArticleListResponse> => {
  const response = await fetchArticleListCMSData(TYPE_CMS, limit, offset, filters, q);

  if (!response) {
    throw new Error('Failed to fetch article list');
  }

  return transformResponse(response, TYPE_CMS);
};
