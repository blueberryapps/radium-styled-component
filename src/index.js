import { PureComponent, PropTypes as RPT } from 'react';
import { fromJS } from 'immutable';

export default class StyledComponent extends PureComponent {
  static propTypes = {
    style: RPT.oneOfType([RPT.func, RPT.object])
  }

  static defaultProps = {
    style: {}
  }

  getStyle(localStyle) {
    const { style } = this.props;
    const defaultStyle = localStyle || this.constructor.style;

    if (!style) {
      return defaultStyle;
    }

    if (style instanceof Array) {
      const styleObj = style.reduce((acc, current) => fromJS(acc).mergeDeep(fromJS(current)), {});
      return fromJS(defaultStyle).mergeDeep(styleObj).toJS();
    }

    return fromJS(defaultStyle).mergeDeep(fromJS(style)).toJS();
  }
}
