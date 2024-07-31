import { Article, getArticleDetail } from '../microcms';
import { ArticleDetailResponse, fetchArticleDetail } from '../nilto/articleDetail';
import { TYPE_CMS, TypeCMS } from '../utils';

// 記事詳細の型定義
export type TransformedArticleDetailResponse = {
  id: string;
  title: string;
  description: string;
  publishedAt?: string | null;
  createdAt: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  category: {
    id: string;
    name: string;
  } | null;
  tags: {
    id: string;
    name: string;
  }[];
  content: {
    fieldId: string;
    richEditor?: string;
    ad?: boolean;
  }[];
  relatedArticles: {
    id: string;
    title: string;
    description: string;
    thumbnail: {
      url: string;
    };
    publishedAt?: string | null;
    createdAt: string;
  }[];
};

// 指定されたCMSから記事詳細を取得する
export const fetchArticleDetailCMSData = async (
  typeCMS: TypeCMS,
  id: string,
  draftKey?: string,
) => {
  switch (typeCMS) {
    case 'nilto':
      return await fetchArticleDetail(id);
    case 'microcms':
      return await getArticleDetail(id, {
        draftKey: draftKey,
      });
    default:
      throw new Error('Unsupported CMS type');
  }
};

const createThumbnail = (url: string, width: number = 800, height: number = 600) => ({
  url,
  width,
  height,
});

const transformNiltoData = (niltoData: ArticleDetailResponse): TransformedArticleDetailResponse => {
  const content: { fieldId: string; richEditor?: string; ad?: boolean }[] = [];

  niltoData.content.forEach((item) => {
    if (item.luid === 'rich_editor') {
      content.push({
        fieldId: 'richEditor',
        richEditor: item.fields.rich_editor,
      });
    } else if (item.luid === 'ad') {
      content.push({
        fieldId: 'ad',
        ad: item.fields.ad,
      });
    }
  });

  return {
    id: niltoData._id.toString(),
    title: niltoData.title,
    description: niltoData.description,
    publishedAt: niltoData._published_at,
    createdAt: niltoData._created_at,
    thumbnail: createThumbnail(niltoData.thumbnail.url),
    category: {
      id: niltoData.category._id.toString(),
      name: niltoData.category.name,
    },
    tags: niltoData.tags.map((tag) => ({
      id: tag.tag._id.toString(),
      name: tag.tag.name,
    })),
    content: content,
    relatedArticles: niltoData.related_articles.map((article) => ({
      id: article.related_article._id.toString(),
      title: article.related_article.title,
      description: article.related_article.description,
      thumbnail: {
        url: article.related_article.thumbnail.url,
      },
      publishedAt: article.related_article._published_at,
      createdAt: article.related_article._created_at,
    })),
  };
};

const transformMicroCMSData = (microCMSData: Article): TransformedArticleDetailResponse => ({
  id: microCMSData.id,
  title: microCMSData.title,
  description: microCMSData.description,
  publishedAt: microCMSData.publishedAt,
  createdAt: microCMSData.createdAt,
  thumbnail: createThumbnail(
    microCMSData.thumbnail.url,
    microCMSData.thumbnail.width,
    microCMSData.thumbnail.height,
  ),
  category: microCMSData.category
    ? {
        id: microCMSData.category.id,
        name: microCMSData.category.name,
      }
    : null,
  tags: microCMSData.tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
  })),
  content: microCMSData.content,
  relatedArticles: microCMSData.relatedArticles.map((article) => ({
    id: article.id,
    title: article.title,
    description: article.description,
    thumbnail: {
      url: article.thumbnail.url,
    },
    publishedAt: article.publishedAt,
    createdAt: article.createdAt,
  })),
});

export const transformResponse = (
  data: ArticleDetailResponse | Article,
  typeCMS: TypeCMS,
): TransformedArticleDetailResponse => {
  switch (typeCMS) {
    case 'nilto':
      return transformNiltoData(data as ArticleDetailResponse);
    case 'microcms':
      return transformMicroCMSData(data as Article);
    default:
      throw new Error('Unsupported CMS type');
  }
};

// 記事詳細を取得してデータを変換して返す
export const fetchArticleDetailData = async (
  slug: string,
  draftKey?: string,
): Promise<TransformedArticleDetailResponse> => {
  const response = await fetchArticleDetailCMSData(TYPE_CMS, slug, draftKey);

  if (!response) {
    throw new Error('Failed to fetch article details');
  }

  return transformResponse(response, TYPE_CMS);
};
