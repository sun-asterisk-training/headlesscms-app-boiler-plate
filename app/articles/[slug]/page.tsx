import { Metadata } from 'next';
import Image from 'next/image';
import Layout from '@/_components/Layout';
import Main from '@/_components/Main';
import Sub from '@/_components/Sub';
import Ad from '@/_components/Ad';
import Ranking from '@/_components/Ranking';
import PublishDate from '@/_components/PublishDate';
import RichEditor from '@/_components/RichEditor';
import Pickup from '@/_components/Pickup';
import SearchField from '@/_components/SearchField';
import Category from '@/_components/Category';
import Tags from '@/_components/Tags';
import Cards from '@/_components/Cards';
import styles from './page.module.css';
import { fetchArticleDetailData } from '@/_libs/anti-corruption-layer/articleDetail';

type Props = {
  params: {
    slug: string;
  };
  searchParams: {
    draftKey?: string;
  };
};

export const revalidate = 60;

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const data = await fetchArticleDetailData(params.slug, searchParams.draftKey);

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: data.thumbnail?.url,
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const data = await fetchArticleDetailData(params.slug, searchParams.draftKey);

  return (
    <Layout>
      <Main>
        <div className={styles.container}>
          <div className={styles.content}>
            {data.title && <h1 className={styles.title}>{data.title}</h1>}
            <div>カテゴリー：{data.category && <Category category={data.category} />}</div>
            <div>タグ：{data.tags.length > 0 && <Tags tags={data.tags} />}</div>
            <div>
              <PublishDate date={data.publishedAt || data.createdAt} />
            </div>
            {data.thumbnail && (
              <div className={styles.thumbnail}>
                <Image
                  src={data.thumbnail.url}
                  alt=""
                  width={data.thumbnail.width}
                  height={data.thumbnail.height}
                />
              </div>
            )}
            {data.content.map((item, i) => {
              if (item.fieldId === 'richEditor' && item.richEditor) {
                return <RichEditor key={i} content={item.richEditor} />;
              }
              if (item.fieldId === 'ad' && item.ad) {
                return <Ad key={i} />;
              }
              return null;
            })}
            <div>
              <h2>関連記事</h2>
              <Cards articles={data.relatedArticles} />
            </div>
          </div>
        </div>
      </Main>
      <Sub>
        <Ad />
        <Pickup />
        <SearchField />
        <Ranking />
      </Sub>
    </Layout>
  );
}
