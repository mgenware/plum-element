/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/no-duplicates */
import { html, fixture, expect } from '@open-wc/testing';
import { PlumElement, PlumPropDefs } from '..';

it('Prop types', async () => {
  class TElement extends PlumElement {
    static get plProps(): PlumPropDefs {
      return {
        s: 's',
        n: 'n',
        b: 'b',
        a: 'a',
        o: 'o',
      };
    }

    getProp(name: string): unknown {
      return this.getPLProp(name);
    }

    setProp(name: string, val: unknown) {
      this.setPLProp(name, val);
    }
  }
  customElements.define('t-prop-types', TElement);
  const el: TElement = await fixture(html`<t-prop-types></t-prop-types>`);

  // Attr -> prop (string).
  let p = 's';
  el.setAttribute(p, 'str');
  expect(el.getProp(p)).to.eq('str');
  el.setAttribute(p, '');
  expect(el.getProp(p)).to.eq('');
  el.removeAttribute(p);
  expect(el.getProp(p)).to.eq(undefined);

  // Prop -> attr (string).
  el.setProp(p, 'str');
  expect(el.getAttribute(p)).to.eq('str');
  el.setProp(p, '');
  expect(el.getAttribute(p)).to.eq('');
  el.setProp(p, undefined);
  expect(el.getAttribute(p)).to.eq(null);
  el.setProp(p, null);
  expect(el.getAttribute(p)).to.eq(null);

  // Attr -> prop (number).
  p = 'n';
  el.setAttribute(p, '123');
  expect(el.getProp(p)).to.eq(123);
  el.setAttribute(p, '');
  expect(Number.isNaN(el.getProp(p))).to.eq(true);
  el.removeAttribute(p);
  expect(el.getProp(p)).to.eq(undefined);

  // Prop -> attr (number).
  el.setProp(p, -2);
  expect(el.getAttribute(p)).to.eq('-2');
  el.setProp(p, 0);
  expect(el.getAttribute(p)).to.eq('0');
  el.setProp(p, undefined);
  expect(el.getAttribute(p)).to.eq(null);
  el.setProp(p, null);
  expect(el.getAttribute(p)).to.eq(null);

  // Attr -> prop (bool).
  p = 'b';
  el.setAttribute(p, '');
  expect(el.getProp(p)).to.eq(true);
  el.removeAttribute(p);
  expect(el.getProp(p)).to.eq(false);

  // Prop -> attr (bool).
  el.setProp(p, true);
  expect(el.getAttribute(p)).to.eq('');
  el.setProp(p, false);
  expect(el.getAttribute(p)).to.eq(null);

  // Attr -> prop (array).
  p = 'a';
  el.setAttribute(p, '["str", 123, null]');
  expect(el.getProp(p)).to.deep.eq(['str', 123, null]);
  el.removeAttribute(p);
  expect(el.getProp(p)).to.eq(undefined);

  // Prop -> attr (array).
  el.setProp(p, ['str', -23, null]);
  expect(el.getAttribute(p)).to.eq('["str",-23,null]');
  el.setProp(p, undefined);
  expect(el.getAttribute(p)).to.eq(null);
  el.setProp(p, null);
  expect(el.getAttribute(p)).to.eq(null);

  // Attr -> prop (object).
  p = 'a';
  el.setAttribute(p, '{"a": "haha", "b": null}');
  expect(el.getProp(p)).to.deep.eq({ a: 'haha', b: null });
  el.removeAttribute(p);
  expect(el.getProp(p)).to.eq(undefined);

  // Prop -> attr (object).
  el.setProp(p, { a: 'changed', b: null });
  expect(el.getAttribute(p)).to.eq('{"a":"changed","b":null}');
  el.setProp(p, undefined);
  expect(el.getAttribute(p)).to.eq(null);
  el.setProp(p, null);
  expect(el.getAttribute(p)).to.eq(null);
});
