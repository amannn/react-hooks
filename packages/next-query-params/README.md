# next-query-params

[![Stable release](https://img.shields.io/npm/v/next-query-params.svg)](https://npm.im/next-query-params)

A small wrapper for [`use-query-params`](https://www.npmjs.com/package/use-query-params) in Next.js apps.

## Installation

```sh
npm install next-query-params
```

```jsx
// _app.js
import {NextQueryParamProvider} from 'next-query-params';

export default function App({ Component, pageProps }) {
  return (
    <NextQueryParamProvider>
      <Component {...pageProps} />
    </NextQueryParamProvider>
  );
}
```

## Usage

Please refer to the usage of [`use-query-params`](https://www.npmjs.com/package/use-query-params). This library only configures the provider for usage with Next.js and additionally re-exports all modules from `use-query-params` for convenience. Note that `use-query-params` and `query-string` is bundled in this library to support IE11.

```jsx
import { useQueryParam, StringParam, withDefault } from 'next-query-params';

export default function IndexPage() {
  const [name, setName] = useQueryParam('name', withDefault(StringParam, ''));

  function onNameInputChange(event) {
    setName(event.target.value);
  }

  return (
    <p>My name is <input value={name} onChange={onNameInputChange} /></p>
  );
}

// Note that if query parameters affect the server-rendered HTML of the page,
// you should define this function. Statically generated pages only have
// access to query parameters on the client side.
export function getServerSideProps() {
  return {props: {}};
}
```

## Credits

This library is just a small wrapper around [`use-query-params`](https://github.com/pbeshai/use-query-params) by [Peter Beshai](https://github.com/pbeshai) and uses the code that was collaboratively created in [use-query-params#13](https://github.com/pbeshai/use-query-params/issues/13). I mostly moved the code to a reusable library.
