import { Category } from '@/_libs/microcms';
import Link from 'next/link';

type Props = {
  category: { id: string; name: string };
};

export default function Category({ category }: Props) {
  return <Link href={`/category/${category.id}`}>{category.name}</Link>;
}
