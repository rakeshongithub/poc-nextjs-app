import React from 'react'
import PropTypes from 'prop-types';
import DynamicRender from '../../atoms/DynamicRender/DynamicRender';
import { componentsMap } from './ComponentMap';

// Page configuration and properties
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
];

const dynamicPageProps = {
    HeadingWrapper: {
        heading: "This is dynamic page heading"
    },
    ButtonsWrapper: {
        label: "Dynamic Button"
    }
};

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

// DynamicPage component
const DynamicPage = ({dateTime, params}) => (
    <>
        <div>{params?.pageSlug} - {dateTime}</div>
        <DynamicRender 
            config={pageConfig} 
            componentsMap={componentsMap} 
            componentsProp={dynamicPageProps} 
        />
    </>
);

DynamicPage.propTypes = {
    dateTime: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
};

export default DynamicPage;
