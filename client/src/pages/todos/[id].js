import React from 'react';
import { getTodos, getTodosById } from '../../services/getTodos';
import { useRouter } from 'next/router';
import Link from 'next/link';
import logger from '../../utils/logger';

export async function getStaticPaths({ locales, defaultLocale }) {
  let data = [];
  try {
    data = await getTodos(1);
  } catch (err) {
    logger.error('<====== todos detail page error =====================>');
  }
  // const res = await fetch('http://localhost:3200/todos');
  // const data = await res.json();
  const pathsWithLocales = [];
  // Get the paths we want to pre-render based on posts
  data?.forEach((post) => {
    const pathObj = { id: post.id.toString() };

    const pagePaths = locales.map((locale) => {
      if (defaultLocale === locale) {
        return { params: pathObj };
      }
      return { params: { id: post.id.toString() }, locale };
    });

    pathsWithLocales.push(...pagePaths);
  });

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  // return { paths: pathsWithLocales, fallback: true }
  return { paths: pathsWithLocales, fallback: 'blocking' };
}

export async function getStaticProps({ params, locale }) {
  const data = await getTodosById(params.id);
  // const res = await fetch(`http://localhost:3200/todos/${params.id}`)
  // const data = await res.json();

  return {
    props: { data, locale },
    revalidate: 60
  };
}

export default function blogDetail({ data, locale }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading....</h1>;
  }
  return (
    <div className="todos-detail">
      <Link
        href={{
          pathname: '/'
        }}
        as={{
          pathname: '/'
        }}>
        Back
      </Link>
      <h1>
        {data.title} - {locale}
      </h1>
    </div>
  );
}
