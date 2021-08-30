# next-query-params

[![Stable release](https://img.shields.io/npm/v/next-query-params.svg)](https://npm.im/next-query-params)

A small wrapper for [`user-query-params`](https://www.npmjs.com/package/use-query-params) for Next.js apps.

## Installation

```sh
npm install next-query-params query-string
```

**Note:** For IE11 support, please use `query-string@5.1.1`.

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

Please refer to the usage of [`use-query-params`](https://www.npmjs.com/package/use-query-params). This library only configures the provider for usage with Next.js and additionally re-exports all modules from `use-query-params` for convenience.

```jsx
import { useQueryParam, StringParam, withDefault } from 'next-query-params';

export default function Index() {
  const [name, setName] = useQueryParam('name', withDefault(StringParam, ''));

  function onNameInputChange(event) {
    setName(event.target.value);
  }

  return (
    <p>My name is <input value={name} onChange={onNameInputChange} /></p>
  );
}
```

## Credits

Everyone who participated in [use-query-params#13](https://github.com/pbeshai/use-query-params/issues/13). I only moved the code to a reusable library.
