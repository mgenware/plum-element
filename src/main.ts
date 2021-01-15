export type PlumPropType = 's' | 'n' | 'b' | 'a' | 'o';
export type PlumProps = Record<string, PlumPropType>;

export class PlumElement extends HTMLElement {
  // Returns a map of pl-props to monitor for changes.
  static get plProps(): PlumProps {
    return {};
  }

  static get observedAttributes() {
    return Object.keys(this.plProps);
  }

  // Stores all pl-props in a map.
  protected plProps: Record<string, unknown> = {};

  // Gets the value of a specified pl-prop.
  protected getPLProp(prop: string): unknown {
    return this.plProps[prop];
  }

  // Sets the value of a specified pl-prop.
  // `ignoreAttr`: true if attribute update is not needed.
  protected setPLProp(prop: string, value: unknown, ignoreAttr = false) {
    const current = this.getPLProp(prop);
    // Treat `null` as `undefined` (default property value).
    if (value === null) {
      // eslint-disable-next-line no-param-reassign
      value = undefined;
    }
    if (current !== value) {
      this.plProps[prop] = value;
      if (!ignoreAttr) {
        if (value === undefined) {
          this.removeAttribute(prop);
          return;
        }
        if (typeof value === 'boolean') {
          if (value) {
            this.setAttribute(prop, '');
          } else {
            this.removeAttribute(prop);
          }
        } else {
          this.setAttribute(prop, `${value}`);
        }
      }
    }
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    // Sync attributes with props.
    this.setPLProp(name, newValue, false);
  }
}
