import React from 'react'
import DynamicRender from '../../atoms/DynamicRender/DynamicRender';
import { componentsMap } from './ComponentMap';

export async function getStaticPaths() {
    return { paths: [{
        params: {
            pageSlug: 'page-one'
        }
    }], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
    return {
        props: {
            params,
            dateTime: new Date().toDateString()
        }
    };
}

  export default function DynamicPage({dateTime, params}) {
    const pageConfig = [
        {
            component: 'HeadingWrapper',
            id: 'HeadingWrapper',
            order: 1
        },
        {
            component: 'ButtonsWrapper',
            id: 'ButtonsWrapper',
            order: 2
        }
    ]

    const dynamicPageProps = {
        HeadingWrapper: {
            heading: "This is dynamic page heading"
        },
        ButtonsWrapper: {
            label: "Dynamic Button"
        }
    };
    return (
      <>
      <div>{params?.pageSlug} - {dateTime}</div>
      <DynamicRender config={pageConfig} componentsMap={componentsMap} componentsProp={dynamicPageProps} />
      </>
    )
  }