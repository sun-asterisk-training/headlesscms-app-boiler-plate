import Link from 'next/link';
import { Article } from '@/_libs/microcms';
import PublishDate from '@/_components/PublishDate';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
} from '@mui/material';

type Props = {
  article:
    | Article // TODO: すべてのページでmicrocmsとniltoの切り替え対応が完了後、型Articleは不要になるはずなので削除する
    | {
        id: string;
        title?: string;
        description?: string;
        thumbnail: {
          url: string;
        } | null;
        publishedAt?: string | null;
        createdAt: string;
      };
};

export default function CustomCard({ article }: Props) {
  return (
    <Card>
      <CardActionArea component={Link} href={`/articles/${article.id}`}>
        {article.thumbnail && (
          <CardMedia component="img" height="140" image={article.thumbnail.url} alt="" />
        )}
        <CardContent>
          {article.title && (
            <Typography gutterBottom variant="h5" component="div">
              {article.title}
            </Typography>
          )}
          {article.description && (
            <Typography variant="body2" color="text.secondary">
              {article.description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <PublishDate date={article.publishedAt || article.createdAt} />
        <Button size="small" color="primary">
          Share
        </Button>
      </CardActions>
    </Card>
  );
}
