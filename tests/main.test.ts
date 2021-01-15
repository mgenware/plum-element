/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/no-duplicates */
import { html, fixture, expect } from '@open-wc/testing';
import { PlumElement, PlumProps } from '..';

it('Basic syncing between props n attrs', async () => {
  class TElement extends PlumElement {
    static get plProps(): PlumProps {
      return {
        a: 's',
        b: 'n',
      };
    }

    get a(): unknown {
      return this.getPLProp('a');
    }

    set a(v: unknown) {
      this.setPLProp('a', v);
    }

    get b(): unknown {
      return this.getPLProp('b');
    }

    set b(v: unknown) {
      this.setPLProp('b', v);
    }
  }
  customElements.define('t-element', TElement);
  const el: TElement = await fixture(html`<t-element></t-element>`);

  expect(el.getAttribute('a')).to.eq(null);
  expect(el.getAttribute('b')).to.eq(null);
  el.a = 'mgenware';
  el.b = 17;
  expect(el.getAttribute('a')).to.eq('mgenware');
  expect(el.getAttribute('b')).to.eq('17');

  el.setAttribute('a', 'hi');
  expect(el.a).to.eq('hi');
});
