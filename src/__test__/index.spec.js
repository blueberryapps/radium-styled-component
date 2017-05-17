import { render } from 'enzyme';
import Radium from 'radium';
import React from 'react';
import StyledComponent from '../index';


@Radium
class Button extends StyledComponent {
  render() {
    const style = this.getStyle();
    return (
      <button style={style.button}>
        <span style={style.text}>Text</span>
      </button>
    );
  }

  static style = {
    button: {
      paddingLeft: '20px'
    },
    text: {
      color: 'red'
    }
  }
}

it('should render Button with default style', () => {
  expect(render(<Button />)).toMatchSnapshot();
});

it('should render Button with default style overriden with custom style (as object)', () => {
  expect(render(<Button style={{ button: { paddingLeft: '100px' } }} />)).toMatchSnapshot();
});

it('should render Button with default style merged with custom style (as object)', () => {
  expect(render(<Button style={{ text: { textTransform: 'uppercase' } }} />)).toMatchSnapshot();
});

it('should render Button with default style merged with custom style (as array of objects)', () => {
  expect(render(<Button style={[{ button: { textTransform: 'uppercase' } }, { button: { marginLeft: '100px' } }, { text: { color: 'blue' } }]} />)).toMatchSnapshot();
});
