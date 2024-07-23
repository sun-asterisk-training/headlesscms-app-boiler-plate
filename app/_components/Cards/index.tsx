import { Article } from '@/_libs/microcms';
import CustomCard from '@/_components/Card';
import { Grid } from '@mui/material';

type Props = {
  articles:
    | Article[] // TODO: すべてのページでmicrocmsとniltoの切り替え対応が完了後、型Articleは不要になるはずなので削除する
    | {
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

export default function Cards({ articles }: Props) {
  if (articles.length === 0) {
    return <p>記事がありません。</p>;
  }
  return (
    <Grid container spacing={4}>
      {articles.map((article) => (
        <Grid item xs={12} sm={6} md={4} key={article.id}>
          <CustomCard article={article} />
        </Grid>
      ))}
    </Grid>
  );
}
