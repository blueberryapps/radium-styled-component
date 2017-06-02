import { render } from 'enzyme';
import Radium from 'radium';
import React from 'react';
import StyledComponent, { deepMerge, getStyle, memoizeGetStyle } from '../index';

it('should merge objects', () => {
  const a = { a: { b: 1, c: 2 } };
  const b = { a: { b: 5 }, d: 3 };
  expect(deepMerge(a, b)).toEqual({ a: { b: 5, c: 2 }, d: 3 });
});

it('should merge objects 2', () => {
  const a = { a: { b: 1, c: 2 } };
  const b = { a: { b: 5, j: { g: 7 } }, d: 3 };
  expect(deepMerge(a, b)).toEqual({ a: { b: 5, c: 2, j: { g: 7 } }, d: 3 });
});

it('should merge objects 3', () => {
  const a = { a: { b: 1, c: 2 } };
  const b = { a: { b: 5, c: { g: 7 } }, d: 3 };
  expect(deepMerge(a, b)).toEqual({ a: { b: 5, c: { g: 7 } }, d: 3 });
});

it('should merge objects 4', () => {
  const b = { a: { b: 1, c: 2 } };
  const a = { a: { b: 5, c: { g: 7 } }, d: 3 };
  expect(deepMerge(a, b)).toEqual({ a: { b: 1, c: 2 }, d: 3 });
});

it('should merge objects 5', () => {
  const b = { a: { b: 1, c: 2 } };
  const a = { a: { b: 5, c: { g: 7 } }, d: 3 };
  const c = { g: 17 };
  expect(deepMerge(a, b, c)).toEqual({ a: { b: 1, c: 2 }, d: 3, g: 17 });
});

it('memoized gets style for large objects is faster', () => {
  const dateFirst = new Date();
  for (let i = 0; i < 10000; i += 1) {
    getStyle({ b: { c: 3, g: { b: { c: 3, g: { b: { c: 3 }, g: { b: { c: 3 } }, h: { b: { c: 3 }, g: { b: { c: 3 } } } } } } } }, { b: { c: 3, g: { b: { c: 3, g: { b: { c: 3 }, g: { b: { c: 3 } }, h: { b: { c: 3 }, g: { b: { c: 3 } } } } } } } }, { b: { c: 3, g: { b: { c: 3, g: { b: { c: 3 }, g: { b: { c: 3 } }, h: { b: { c: 3 }, g: { b: { c: 3 } } } } } } } }, { b: { c: 3 } }, { b: { c: 3 } });
  }
  const withoutMemoize = new Date() - dateFirst;

  const dateSecond = new Date();
  for (let i = 0; i < 10000; i += 1) {
    memoizeGetStyle({ b: { c: 3, g: { b: { c: 3, g: { b: { c: 3 }, g: { b: { c: 3 } }, h: { b: { c: 3 }, g: { b: { c: 3 } } } } } } } }, { b: { c: 3, g: { b: { c: 3, g: { b: { c: 3 }, g: { b: { c: 3 } }, h: { b: { c: 3 }, g: { b: { c: 3 } } } } } } } }, { b: { c: 3, g: { b: { c: 3, g: { b: { c: 3 }, g: { b: { c: 3 } }, h: { b: { c: 3 }, g: { b: { c: 3 } } } } } } } }, { b: { c: 3 } }, { b: { c: 3 } });
  }
  const withMemoize = new Date() - dateSecond;
  expect(withMemoize).toBeLessThan(withoutMemoize);
});

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

@Radium
class Button2 extends StyledComponent {
  render() {
    const style = this.getStyle();
    return (
      <button style={style.button}>
        <span style={style.text}>Text</span>
      </button>
    );
  }

  static style = () => ({
    button: {
      paddingLeft: '30px'
    },
    text: {
      color: 'blue'
    }
  })
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

it('should render Button with default style merged with custom style (as array of objects)', () => {
  expect(render(<Button style={[{ button: { textTransform: 'uppercase' } }, () => ({ button: { marginLeft: '100px' } }), { text: { color: 'blue' } }]} />)).toMatchSnapshot();
});

it('should render Button and Button2 with different styles', () => {
  expect(render(<div><Button /><Button2 /></div>)).toMatchSnapshot();
});

it('should render Button with passed styles and different styles', () => {
  expect(render(<div><Button style={{ button: { paddingLeft: '5px' } }} /><Button style={{ button: { paddingLeft: '10px' } }} /></div>)).toMatchSnapshot();
});

it('should render Button2 with passed styles and different styles', () => {
  expect(render(<div><Button2 style={{ button: { paddingLeft: '5px' } }} /><Button2 style={{ button: { paddingLeft: '10px' } }} /></div>)).toMatchSnapshot();
});
