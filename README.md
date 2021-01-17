# plum-element

[![Build Status](https://github.com/mgenware/plum-element/workflows/Build/badge.svg)](https://github.com/mgenware/plum-element/actions)
[![npm version](https://img.shields.io/npm/v/plum-element.svg?style=flat-square)](https://npmjs.com/package/plum-element)
[![Node.js Version](http://img.shields.io/node/v/plum-element.svg?style=flat-square)](https://nodejs.org/en/)

A tiny base class for web components to sync between properties and attributes. No dependencies, less than 1KB gzipped.

## Installation

```sh
yarn add plum-element
```

## Usage

```ts
class ToDoElement extends PlumElement {
  // Declare properties.
  static get plProps(): PlumPropDefs {
    return {
      // Define a string property named 'description'.
      description: 's',
      // Define a boolean property named 'completed'.
      completed: 'b',
    };
  }

  // Description getter and setter.
  get description(): string {
    return this.getPLProp('description');
  }
  set description(val: string) {
    this.setPLProp('description', val);
  }

  // Completed getter and setter.
  get completed(): boolean {
    return this.getPLProp('completed');
  }
  set completed(val: boolean) {
    this.setPLProp('completed', val);
  }
}
customElements.define('todo-element', ToDoElement);
```

PlumElement properties and attributes are automatically in sync:

```html
<todo-element id="element" description="Fix bugs" completed></todo-element>

<script>
  const element = document.getElementById('element');

  // Get initial attributes.
  element.description; // 'Fix bugs'
  element.completed; // true

  // Property changes are reflected in attributes.
  element.description = 'Create bugs';
  element.getAttribute('description'); // Returns 'Create bugs'

  // Attribute changes are also reflected in properties.
  element.removeAttribute('completed');
  element.completed; // Returns false
</script>
```

### Supported property types

- `s` string.
- `n` number.
- `b` boolean. `false` removes attribute.
- `a` array. JSON is used for serialization / deserialization.
- `object` object. JSON is used for serialization / deserialization.

NOTE: `null` or `undefined` property values always removes attribute value.

### Property / attribute change callback

Whenever a property or attribute changes, these two functions are always called in pairs.

```ts
class MyElement extends PlumElement {
  // Called when a property is updated.
  // `attrToPropUpdate` true if this is triggered by an attribute change.
  onPLPropUpdated(name: string, oldValue: unknown, newValue: unknown, attrToPropUpdate: boolean) {}

  // Called when an attribute is updated.
  // `attrToPropUpdate` true if this is triggered by an attribute change.
  onPLAttributeUpdated(
    name: string,
    oldValue: string | null,
    newValue: string | null,
    attrToPropUpdate: boolean,
  ) {}
}
```

Just like the standard `attributeChangedCallback`, these two functions are also called before an element is connected, use `HTMLElement.isConnected` if you are only interested in changes when an element is connected:

```ts
class MyElement extends PlumElement {
  connectedCallback() {
    // Handle property values all at once in `connectedCallback`.
  }

  onPLPropUpdated(name: string, oldValue: unknown, newValue: unknown, attrToPropUpdate: boolean) {
    // Ignore property changes when the element is not connected.
    if (!this.isConnected) {
      return;
    }
    // Handle property changes.
  }
}
```
