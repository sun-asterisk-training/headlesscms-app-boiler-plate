type Category = {
  _id: number;
  name: string;
};

type Tag = {
  _id: number;
  name: string;
};

type Thumbnail = {
  url: string;
};

type ContentFields = {
  rich_editor?: string;
  ad?: boolean;
};

type Content = {
  luid: string;
  fields: ContentFields;
};

type RelatedArticle = {
  _id: number;
  _created_at: string;
  _published_at: string | null; // MEMO: 下書きの記事ではnullになる
  title: string;
  description: string;
  thumbnail: Thumbnail;
};

export type ArticleDetailResponse = {
  _id: number;
  _created_at: string;
  _published_at: string | null; // MEMO: 下書きの記事ではnullになる
  title: string;
  description: string;
  category: Category;
  tags: { tag: Tag }[];
  thumbnail: Thumbnail;
  content: Content[];
  related_articles: { related_article: RelatedArticle }[];
};

const baseUrl = process.env.NEXT_PUBLIC_NILTO_BASE_URL;
const apiKey = process.env.NEXT_PUBLIC_NILTO_API_KEY;

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_NILTO_BASE_URL is required');
}

if (!apiKey) {
  throw new Error('NEXT_PUBLIC_NILTO_API_KEY is required');
}

export const fetchArticleDetail = async (
  articleId: string,
): Promise<ArticleDetailResponse | null> => {
  try {
    const headers = new Headers();
    headers.append('X-NILTO-API-KEY', apiKey);

    const response = await fetch(`${baseUrl}contents/${articleId}`, {
      headers: headers,
    });

    if (!response) {
      throw new Error('Failed to fetch article details');
    }

    const data: ArticleDetailResponse = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
