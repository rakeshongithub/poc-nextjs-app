import React from 'react';
import { useRouter } from 'next/router';
import { getPostById, getPosts } from '../../services/getPosts';
import Link from 'next/link';
import logger from '../../utils/logger';

export async function getStaticPaths({ locales, defaultLocale }) {
  let data = [];
  try {
    data = await getPosts(1);
  } catch (err) {
    logger.error('<====== posts detail page error =====================>');
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

export async function getStaticProps(context) {
  const { params, locale } = context;
  try {
    const data = await getPostById(params.id);
    // const res = await fetch(`http://localhost:3200/todos/${params.id}`)
    // const data = await res.json();

    return {
      props: { data, locale },
      revalidate: 2
    };
  } catch (err) {
    return {
      notFound: true
    };
  }
}

export default function blogDetail(context) {
  const { data, locale } = context;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading....</h1>;
  }

  return (
    <div className="blog-detail">
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
      <p>{data.body}</p>
    </div>
  );
}
