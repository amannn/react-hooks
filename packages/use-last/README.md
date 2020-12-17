# use-last

[![Stable release](https://img.shields.io/npm/v/use-last.svg)](https://npm.im/use-last)

A React hook to conditionally render the last value that has met a certain criteria.

## The problem

You have a React component that has a state or prop that changes over time, but you want to conditionally skip some values.

## This solution

A hook that returns the latest value that meets the specified condition.

## Example

**Implementation:**

```jsx
function LastEvenValue({value}: Props) {
  const evenValue = useLast(value, value % 2 === 0);
  return <p>{evenValue}</p>;
}
```

**Usage:**

```jsx
// Rendered
<LastEvenValue value={2} />

// Skipped, still rendering "2"
<LastEvenValue value={3} />

// Rendered
<LastEvenValue value={4} />
```

The second parameter is optional and defaults to `value !== undefined`, i.e. undefined values are ignored.
