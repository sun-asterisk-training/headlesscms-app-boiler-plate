import { Ranking, getRanking } from '../microcms';
import { fetchRanking, RankingResponse } from '../nilto/ranking';
import { TYPE_CMS, TypeCMS } from '../utils';
import { CMS } from '@/_constants';
import {
  TransformedArticleDetailResponse,
  transformNiltoData,
  transformMicroCMSData,
} from './articleDetail';

// ランキングの型定義
export type TransformedRankingResponse = {
  articles: TransformedArticleDetailResponse[];
};

// 指定されたCMSからランキングを取得する
export const fetchRankingCMSData = async (typeCMS: TypeCMS, limit: number, draftKey?: string) => {
  switch (typeCMS) {
    case CMS.NILTO:
      return await fetchRanking(limit);
    case CMS.MICROCMS:
      return await getRanking({
        limit,
        draftKey,
        depth: 2, // MEMO: depth=1がデフォルトで、idのみ取得され、2にすると詳細も取得される
      });
    default:
      throw new Error('Unsupported CMS type');
  }
};

const transformNiltoRankingData = (niltoData: RankingResponse): TransformedRankingResponse => {
  return {
    articles: niltoData.data.map((data) => transformNiltoData(data.article)),
  };
};

const transformMicroCMSRankingData = (microCMSData: Ranking): TransformedRankingResponse => {
  return {
    articles: microCMSData.articles.map((data) => transformMicroCMSData(data)),
  };
};

export const transformResponse = (
  data: RankingResponse | Ranking,
  typeCMS: TypeCMS,
): TransformedRankingResponse => {
  switch (typeCMS) {
    case CMS.NILTO:
      return transformNiltoRankingData(data as RankingResponse);
    case CMS.MICROCMS:
      return transformMicroCMSRankingData(data as Ranking);
    default:
      throw new Error('Unsupported CMS type');
  }
};

// ランキングを取得してデータを変換して返す
export const fetchRankingData = async (
  limit: number,
  draftKey?: string,
): Promise<TransformedRankingResponse> => {
  const response = await fetchRankingCMSData(TYPE_CMS, limit, draftKey);

  if (!response) {
    throw new Error('Failed to fetch ranking');
  }

  return transformResponse(response, TYPE_CMS);
};
