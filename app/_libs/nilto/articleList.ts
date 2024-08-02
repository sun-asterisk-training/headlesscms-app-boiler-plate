import { ArticleDetailResponse } from './articleDetail';

export type ArticleListResponse = {
  total: number;
  limit: number;
  offset: number;
  data: ArticleDetailResponse[];
};

const baseUrl = process.env.NEXT_PUBLIC_NILTO_BASE_URL;
const apiKey = process.env.NEXT_PUBLIC_NILTO_API_KEY;

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_NILTO_BASE_URL is required');
}

if (!apiKey) {
  throw new Error('NEXT_PUBLIC_NILTO_API_KEY is required');
}

export const fetchArticleList = async (
  limit: number,
  offset?: number,
): Promise<ArticleListResponse | null> => {
  try {
    const headers = new Headers();
    headers.append('X-NILTO-API-KEY', apiKey);

    const params = new URLSearchParams({
      model: 'articles',
      limit: limit.toString(),
      offset: offset?.toString() || '0',
    });

    const response = await fetch(`${baseUrl}contents?${params.toString()}`, {
      headers: headers,
    });

    if (!response) {
      throw new Error('Failed to fetch article list');
    }

    const data: ArticleListResponse = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
