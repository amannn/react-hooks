# use-debounced

![Gzipped size](https://badgen.net/bundlephobia/minzip/use-debounced)[![Stable release](https://img.shields.io/npm/v/use-debounced.svg)](https://npm.im/use-debounced)

A React hook to debounce the provided value in render. If `delay` is zero, the value is updated synchronously.

## Example

```jsx
function DebouncedValue() {
  const debouncedValue = useDebounced('Hello', 100);
  return <p>{debouncedValue}</p>;
}
```

This will initially render an empty text (since `debouncedValue` is `undefined`) and after 100ms the rendered value will be changed to `Hello`.
