/* eslint-disable class-methods-use-this */
export type PlumPropType = 's' | 'n' | 'b' | 'a' | 'o';
export type PlumPropDefs = Record<string, PlumPropType>;

/**
 * Main type of plum-element.
 *
 * Some terms used in this file:
 * `pl-prop`: a property defined in a `PlumElement`.
 */
export class PlumElement extends HTMLElement {
  // Returns a map of pl-props to monitor for changes.
  static get plProps(): PlumPropDefs {
    return {};
  }

  static get observedAttributes() {
    return Object.keys(this.plProps);
  }

  // Stores all pl-props in a map.
  protected plPropValues: Record<string, unknown> = {};

  // Gets the value of a specified pl-prop.
  protected getPLProp(prop: string): unknown {
    return this.plPropValues[prop];
  }

  // Only called by `setPLProp` to set or remove the specified attribute.
  private setPLAttributeInternal(name: string, value: string | null) {
    if (value === null) {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value);
    }
  }

  protected mustGetPLPropType(name: string): PlumPropType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const propType = (this.constructor as any).plProps[name] as PlumPropType | undefined;
    if (!propType) {
      throw new Error(`Prop "${name}" is not defined`);
    }
    return propType;
  }

  // Sets the value of a specified pl-prop.
  protected setPLProp(
    name: string,
    value: unknown,
    // Determines if this pl-prop change is triggered by an attribute change.
    attrInfo?: {
      oldValue: string | null;
      newValue: string | null;
    },
  ) {
    const currentPropValue = this.getPLProp(name);
    if (currentPropValue !== value) {
      this.plPropValues[name] = value;
      this.onPLPropUpdated(name, currentPropValue, value, !!attrInfo);

      // `onPLPropUpdated` and `onPLAttributeUpdated` must fire in pairs.
      if (!attrInfo) {
        const attrValue = this.plPropToAttribute(value, this.mustGetPLPropType(name));
        this.setPLAttributeInternal(name, attrValue);
        this.onPLAttributeUpdated(name, null, attrValue, false);
      } else {
        // Here, prop change is triggered by an attribute change, no need to update
        // attribute again. But we still need to call `onPLAttributeUpdated`.
        this.onPLAttributeUpdated(name, attrInfo.oldValue, attrInfo.newValue, true);
      }
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    // Get prop value from attribute value.
    const propValue = this.plAttributeToProp(newValue, this.mustGetPLPropType(name));
    // Sync attributes with props.
    this.setPLProp(name, propValue, { oldValue, newValue });
  }

  // Called when a pl-prop is updated.
  // `attrToPropUpdate` true if this pl-prop change is triggered by an attribute change.
  protected onPLPropUpdated(
    _name: string,
    _oldValue: unknown,
    _newValue: unknown,
    _attrToPropUpdate: boolean,
  ) {}

  // Called when an attribute is updated in response to a pl-prop update.
  // `attrToPropUpdate` true if this pl-prop change is triggered by an attribute change.
  protected onPLAttributeUpdated(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null,
    _attrToPropUpdate: boolean,
  ) {}

  protected plAttributeToProp(value: string | null, type: PlumPropType): unknown {
    switch (type) {
      case 's':
        return value ?? undefined;

      case 'n':
        return value === null ? undefined : parseInt(value, 10);

      case 'b':
        return value !== null;

      case 'a':
      case 'o':
        return value === null ? undefined : JSON.parse(value);

      default:
        return value;
    }
  }

  protected plPropToAttribute(value: unknown, type: PlumPropType): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    switch (type) {
      case 's':
      case 'n':
        return `${value}`;

      case 'b':
        return value === true ? '' : null;

      case 'a':
      case 'o':
        return JSON.stringify(value);

      default:
        return `${value}`;
    }
  }
}
