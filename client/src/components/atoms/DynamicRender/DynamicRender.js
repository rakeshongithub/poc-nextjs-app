import React from 'react'
import sortBy from 'lodash/sortBy';
import logger from '../../../utils/logger';

export default function DynamicRender({config, componentsMap, componentsProp}) {
  if(!config) return null;
  
  const renderComponent = (itemProps, index) => {
    try {
        if(typeof componentsMap[itemProps.component] !== "undefined") {
            logger.info(`Initiated creating component ${itemProps.id}`);
            const compProps = componentsProp ? componentsProp[itemProps.id] : {}
            const component = componentsMap[itemProps.component];
            const styleProps = itemProps?.props ?? {};

            return React.createElement(component, {
                key: `${itemProps.id}_${index}`,
                ...styleProps,
                ...compProps
            })
        }

        logger.error(`Error: Component not been created yet ${itemProps.id}`);
        return React.createElement(() => (<div>Component not been created yet.</div>), {key: `${itemProps.id}_${index}`})

    } catch (err) {
        logger.error("something wrong while creating dynamic component", err);
    }
  }
  
  return <>{sortBy(config, ['order']).map(renderComponent)}</>
}
