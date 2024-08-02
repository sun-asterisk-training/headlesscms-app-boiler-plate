'use client';

import { FC, useState, useCallback } from 'react';
import { fetchArticleListData } from '@/_libs/anti-corruption-layer/articleList';
import { TransformedArticleDetailResponse } from '@/_libs/anti-corruption-layer/articleDetail';
import { LIMIT } from '@/_constants';
import Cards from '@/_components/Cards';
import { Button } from '@mui/material';
import styles from './index.module.css';

type Props = {
  filters?: string;
  q?: string;
  totalCount: number;
};

export const ReadMore: FC<Props> = ({ filters, q, totalCount }) => {
  const [contents, setContents] = useState<TransformedArticleDetailResponse[]>([]);
  const [offset, setOffset] = useState<number>(LIMIT);
  const getNextContents = useCallback(async () => {
    const data = await fetchArticleListData(LIMIT, offset, filters, q);
    setContents((prev) => [...prev, ...data.contents]);
    setOffset((prev) => prev + LIMIT);
  }, [offset, filters, q]);

  if (totalCount <= LIMIT) {
    return null;
  }

  return (
    <div className={styles.readMore}>
      {contents.length > 0 && <Cards articles={contents} />}
      {totalCount > offset && (
        <Button variant="outlined" onClick={getNextContents}>
          もっと読む
        </Button>
      )}
    </div>
  );
};
