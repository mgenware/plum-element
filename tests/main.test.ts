/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/no-duplicates */
import { html, fixture, expect } from '@open-wc/testing';
import { PlumElement, PlumPropDefs } from '..';

it('Basic syncing between props n attrs', async () => {
  class TElement extends PlumElement {
    static get plProps(): PlumPropDefs {
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
  customElements.define('t-basic', TElement);
  const el: TElement = await fixture(html`<t-basic></t-basic>`);

  expect(el.getAttribute('a')).to.eq(null);
  expect(el.getAttribute('b')).to.eq(null);

  // Prop -> attr.
  el.a = 'mgenware';
  el.b = 17;
  el.a = 'mgenware';
  el.b = 17;
  expect(el.getAttribute('a')).to.eq('mgenware');
  expect(el.getAttribute('b')).to.eq('17');

  // Attr -> prop.
  el.setAttribute('a', 'hi');
  el.setAttribute('b', '17');
  expect(el.a).to.eq('hi');
});

it('onPLPropUpdated and onPLAttrUpdated', async () => {
  class TElement extends PlumElement {
    propCount = 0;
    attrCount = 0;
    pName = '';
    pOld: unknown;
    pNew: unknown;
    attrToPropUpdate = false;
    aName = '';
    aOld: unknown;
    aNew: unknown;

    static get plProps(): PlumPropDefs {
      return {
        a: 's',
      };
    }

    get a(): unknown {
      return this.getPLProp('a');
    }

    set a(v: unknown) {
      this.setPLProp('a', v);
    }

    protected onPLPropUpdated(
      name: string,
      oldValue: unknown,
      newValue: unknown,
      attrToPropUpdate: boolean,
    ) {
      this.propCount++;
      this.pName = name;
      this.pOld = oldValue;
      this.pNew = newValue;
      this.attrToPropUpdate = attrToPropUpdate;
    }

    protected onPLAttributeUpdated(
      name: string,
      oldValue: string | null,
      newValue: string | null,
      attrToPropUpdate: boolean,
    ) {
      this.attrCount++;
      this.aName = name;
      this.aOld = oldValue;
      this.aNew = newValue;
      this.attrToPropUpdate = attrToPropUpdate;
    }
  }
  customElements.define('t-pl-events', TElement);
  const el: TElement = await fixture(html`<t-pl-events></t-pl-events>`);

  // Prop -> attr.
  el.a = 'mgenware';
  expect(el.attrToPropUpdate).to.eq(false);
  expect(el.pName).to.eq('a');
  expect(el.pOld).to.eq(undefined);
  expect(el.pNew).to.eq('mgenware');

  expect(el.aName).to.eq('a');
  expect(el.aOld).to.eq(null);
  expect(el.aNew).to.eq('mgenware');

  expect(el.propCount).to.eq(1);
  expect(el.attrCount).to.eq(1);

  expect(el.getAttribute('a')).to.eq('mgenware');

  // Attr -> prop.
  el.setAttribute('a', 'changed');
  expect(el.attrToPropUpdate).to.eq(true);
  expect(el.pName).to.eq('a');
  expect(el.pOld).to.eq('mgenware');
  expect(el.pNew).to.eq('changed');

  expect(el.aName).to.eq('a');
  expect(el.aOld).to.eq('mgenware');
  expect(el.aNew).to.eq('changed');

  expect(el.propCount).to.eq(2);
  expect(el.attrCount).to.eq(2);

  expect(el.a).to.eq('changed');
});
