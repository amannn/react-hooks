# use-optional-state

[![Stable release](https://img.shields.io/npm/v/use-optional-state.svg)](https://npm.im/use-optional-state)

A React hook to enable a component state to either be controlled or uncontrolled.

## The problem

[Controlled components](https://reactjs.org/docs/forms.html#controlled-components) are a concept mostly known from form elements. They allow the owner to specify exactly what a component should render and to execute custom logic when the component calls a change handler.

In contrast to this, there are [uncontrolled components](https://reactjs.org/docs/uncontrolled-components.html) which handle the state internally.

The tradeoff comes down to controlled components being more flexible in their usage but uncontrolled components being easier to use if the owner is not concerned with the state. Sometimes it's desireable for an owner at least configure an initial value and to potentially [reset the child state later with a `key`](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).

When implementing a component, it's sometimes hard to choose one or the other since there are valid use cases for both approaches.

## This solution

This hook helps you to support both patterns in your components, increasing flexibility while also ensuring ease of use.

Since the solution can be applied on a per-prop basis, you can also enable this behaviour for multiple props that are orthogonal (e.g. a `<Prompt isOpen inputValue="" />` component).

## Example

**Implementation:**

```jsx
import useOptionalState from 'use-optional-state';

function Expander({
  expanded: controlledExpanded,
  initialExpanded = false,
  onChange
}) {
  const [expanded, setExpanded] = useOptionalState({
    controlledValue: controlledExpanded,
    initialValue: initialExpanded,
    onChange
  });

  function onToggle() {
    setExpanded(!expanded);
  }

  return (
    <>
      <button onClick={onToggle} type="button">
        Toggle
      </button>
      {expanded && <div>{children}</div>}
    </>
  );
}
```

**Usage:**

```jsx
// Controlled
<Expander expanded={expanded} onChange={onExpandedChange} />

// Uncontrolled using the default value for the `initialExpanded` prop
<Expander />

// Uncontrolled, but with a change handler if the owner wants to be notified
<Expander initialExpanded onChange={onExpandedChange} />
```
