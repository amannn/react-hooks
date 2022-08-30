# use-last

[![Stable release](https://img.shields.io/npm/v/use-last.svg)](https://npm.im/use-last)

> A React hook to conditionally return the last value that has met a certain criteria.

This is useful when you have a React component that has a state or prop that changes over time, but you want to conditionally skip some values.

## Example

**Implementation:**

```jsx
import useLast from 'use-last';

function LastValue({value}) {
  const lastDefinedValue = useLast(value);
  return <p>{lastDefinedValue}</p>;
}
```

**Usage:**

```jsx
// Renders "2"
<LastValue value={2} />

// Still renders "2"
<LastValue value={undefined} />

// Renders "4"
<LastValue value={4} />
```

## Configuration

By default, `value` is checked for being `!== undefined`. You can provide a second argument to customize this condition:

```jsx
import useLast from 'use-last';

function LastEvenValue({value}) {
  const lastEvenValue = useLast(value, value % 2 === 0);
  return <p>{lastEvenValue}</p>;
}
```
