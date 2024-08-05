import { Article, getArticleDetail } from '../microcms';
import { ArticleDetailResponse, fetchArticleDetail } from '../nilto/articleDetail';
import { TYPE_CMS, TypeCMS } from '../utils';

const THUMBNAIL_WIDTH = 800;
const THUMBNAIL_HEIGHT = 600;

// 記事詳細の型定義
export type TransformedArticleDetailResponse = {
  id: string;
  title?: string;
  description?: string;
  publishedAt?: string | null;
  createdAt: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  } | null;
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
    } | null;
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

const createThumbnail = (
  url: string,
  width: number = THUMBNAIL_WIDTH,
  height: number = THUMBNAIL_HEIGHT,
) => ({
  url,
  width,
  height,
});

const transformNiltoData = (niltoData: ArticleDetailResponse): TransformedArticleDetailResponse => {
  const thumbnail = niltoData.thumbnail ? createThumbnail(niltoData.thumbnail.url) : null;

  const category = niltoData.category
    ? {
        id: niltoData.category._id.toString(),
        name: niltoData.category.name,
      }
    : null;

  const tags = niltoData.tags
    .filter((tag) => tag.tag) // MEMO: タグが未選択(null)の場合があるので除外
    .map((tag) => ({
      id: tag.tag._id.toString(),
      name: tag.tag.name,
    }));

  const content = niltoData.content
    .map((item) => {
      if (item.luid === 'rich_editor' && item.fields.rich_editor) {
        return {
          fieldId: 'richEditor',
          richEditor: item.fields.rich_editor,
        };
      } else if (item.luid === 'ad' && item.fields.ad !== undefined) {
        return {
          fieldId: 'ad',
          ad: item.fields.ad,
        };
      }
      return null;
    })
    .filter((item) => item) as { fieldId: string; richEditor?: string; ad?: boolean }[]; // MEMO: nullを除外

  const relatedArticles = niltoData.related_articles
    .filter((article) => article.related_article) // MEMO: 関連記事が未選択(null)の場合があるので除外
    .map((article) => ({
      id: article.related_article._id.toString(),
      title: article.related_article.title,
      description: article.related_article.description,
      thumbnail: article.related_article.thumbnail
        ? {
            url: article.related_article.thumbnail.url,
          }
        : null,
      publishedAt: article.related_article._published_at,
      createdAt: article.related_article._created_at,
    }));

  return {
    id: niltoData._id.toString(),
    title: niltoData.title,
    description: niltoData.description,
    publishedAt: niltoData._published_at,
    createdAt: niltoData._created_at,
    thumbnail: thumbnail,
    category: category,
    tags: tags,
    content: content,
    relatedArticles: relatedArticles,
  };
};

const transformMicroCMSData = (microCMSData: Article): TransformedArticleDetailResponse => {
  const thumbnail = microCMSData.thumbnail
    ? createThumbnail(
        microCMSData.thumbnail.url,
        microCMSData.thumbnail.width,
        microCMSData.thumbnail.height,
      )
    : null;

  const category = microCMSData.category
    ? {
        id: microCMSData.category.id,
        name: microCMSData.category.name,
      }
    : null;

  const tags = microCMSData.tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
  }));

  const relatedArticles = microCMSData.relatedArticles.map((article) => ({
    id: article.id,
    title: article.title,
    description: article.description,
    thumbnail: article.thumbnail
      ? {
          url: article.thumbnail.url,
        }
      : null,
    publishedAt: article.publishedAt,
    createdAt: article.createdAt,
  }));

  return {
    id: microCMSData.id,
    title: microCMSData.title,
    description: microCMSData.description,
    publishedAt: microCMSData.publishedAt,
    createdAt: microCMSData.createdAt,
    thumbnail: thumbnail,
    category: category,
    tags: tags,
    content: microCMSData.content,
    relatedArticles: relatedArticles,
  };
};

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
