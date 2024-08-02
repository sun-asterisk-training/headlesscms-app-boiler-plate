import { Pickup, getPickup } from '../microcms';
import { fetchPickup, PickupResponse } from '../nilto/pickup';
import { TYPE_CMS, TypeCMS } from '../utils';
import { CMS } from '@/_constants';
import {
  TransformedArticleDetailResponse,
  transformNiltoData,
  transformMicroCMSData,
} from './articleDetail';

// ピックアップの型定義
export type TransformedPickupResponse = {
  articles: TransformedArticleDetailResponse[];
};

// 指定されたCMSからピックアップを取得する
export const fetchPickupCMSData = async (typeCMS: TypeCMS, limit: number, draftKey?: string) => {
  switch (typeCMS) {
    case CMS.NILTO:
      return await fetchPickup(limit);
    case CMS.MICROCMS:
      return await getPickup({
        limit,
        draftKey,
        depth: 2, // MEMO: depth=1がデフォルトで、idのみ取得され、2にすると詳細も取得される
      });
    default:
      throw new Error('Unsupported CMS type');
  }
};

const transformNiltoPickupData = (niltoData: PickupResponse): TransformedPickupResponse => {
  return {
    articles: niltoData.data.map((data) => transformNiltoData(data.article)),
  };
};

const transformMicroCMSPickupData = (microCMSData: Pickup): TransformedPickupResponse => {
  return {
    articles: microCMSData.articles.map((data) => transformMicroCMSData(data)),
  };
};

export const transformResponse = (
  data: PickupResponse | Pickup,
  typeCMS: TypeCMS,
): TransformedPickupResponse => {
  switch (typeCMS) {
    case CMS.NILTO:
      return transformNiltoPickupData(data as PickupResponse);
    case CMS.MICROCMS:
      return transformMicroCMSPickupData(data as Pickup);
    default:
      throw new Error('Unsupported CMS type');
  }
};

// ピックアップを取得してデータを変換して返す
export const fetchPickupData = async (
  limit: number,
  draftKey?: string,
): Promise<TransformedPickupResponse> => {
  const response = await fetchPickupCMSData(TYPE_CMS, limit, draftKey);

  if (!response) {
    throw new Error('Failed to fetch pickup');
  }

  return transformResponse(response, TYPE_CMS);
};
