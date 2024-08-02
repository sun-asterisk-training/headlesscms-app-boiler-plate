import { ArticleDetailResponse } from './articleDetail';

export type RankingResponse = {
  data: {
    article: ArticleDetailResponse;
  }[];
};

const baseUrl = process.env.NEXT_PUBLIC_NILTO_BASE_URL;
const apiKey = process.env.NEXT_PUBLIC_NILTO_API_KEY;

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_NILTO_BASE_URL is required');
}

if (!apiKey) {
  throw new Error('NEXT_PUBLIC_NILTO_API_KEY is required');
}

export const fetchRanking = async (limit: number): Promise<RankingResponse | null> => {
  try {
    const headers = new Headers();
    headers.append('X-NILTO-API-KEY', apiKey);

    const params = new URLSearchParams({
      model: 'ranking',
      limit: limit.toString(),
      depth: '2', // MEMO: depth=1がデフォルトで、idのみ取得され、2にすると詳細も取得される
    });

    const response = await fetch(`${baseUrl}contents?${params.toString()}`, {
      headers: headers,
    });

    if (!response) {
      throw new Error('Failed to fetch ranking');
    }

    const data: RankingResponse = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
