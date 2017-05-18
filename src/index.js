import { PureComponent, PropTypes as RPT } from 'react';
import memoize from 'fast-memoize';

function deepMergeObject(rootAcc, element) {
  if (typeof element === 'string' || typeof element === 'number' || typeof element === 'function') {
    return element;
  }

  return Object.keys(element)
    .reduce((acc, key) => ({ ...acc, [key]: deepMergeObject(rootAcc[key] || {}, element[key]) }), rootAcc);
}

export function deepMerge(rootAcc, ...elements) {
  return elements.reduce((acc, element) => deepMergeObject(acc, element), rootAcc);
}

export function getStyle(givenOverrideStyle, givenConstructorStyle, givenPropsStyle, constants, props) {
  const localStyle = resolveStyleObject(givenOverrideStyle, constants, props);

  const staticStyle = resolveStyleObject(givenConstructorStyle, constants, props);

  const propsStyle = Array.isArray(givenPropsStyle)
    ? deepMerge({}, ...givenPropsStyle.map(s => resolveStyleObject(s, constants, props)))
    : resolveStyleObject(givenPropsStyle, constants, props);

  return deepMerge({}, staticStyle, propsStyle, localStyle);
}

export const memoizeGetStyle = memoize(getStyle);

function resolveStyleObject(functionOrObject = {}, constants, props) {
  return typeof functionOrObject === 'function'
    ? functionOrObject(constants, props)
    : functionOrObject;
}

export function createStyledComponent(constants) {
  return class StyledComponent extends PureComponent {
    static propTypes = {
      children: RPT.node,
      style: RPT.oneOfType([RPT.func, RPT.object])
    }

    static defaultProps = {
      children: null,
      style: {}
    }

    getStyle(overrideStyle) {
      const { children, style, ...restProps } = this.props;
      return memoizeGetStyle(overrideStyle, this.constructor.style, style, constants, restProps);
    }
  };
}

const StyledComponent = createStyledComponent({});
export default StyledComponent;
