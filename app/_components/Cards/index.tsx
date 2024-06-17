import { Article } from '@/_libs/microcms';
import CustomCard from '@/_components/Card';
import { Grid } from '@mui/material';

type Props = {
  articles: Article[];
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