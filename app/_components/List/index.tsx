import Link from 'next/link';
import Image from 'next/image';
import { TransformedArticleDetailResponse } from '@/_libs/anti-corruption-layer/articleDetail';
import PublishDate from '@/_components/PublishDate';
import styles from './index.module.css';

type Props = {
  article: TransformedArticleDetailResponse;
};

export default function List({ article }: Props) {
  return (
    <Link href={`/articles/${article.id}`} className={styles.list}>
      <Image
        src={article.thumbnail.url}
        alt=""
        width={article.thumbnail.width}
        height={article.thumbnail.height}
        className={styles.image}
      />
      <dl>
        <dt>{article.title}</dt>
        <dd>
          <PublishDate date={article.publishedAt || article.createdAt} />
        </dd>
      </dl>
    </Link>
  );
}
