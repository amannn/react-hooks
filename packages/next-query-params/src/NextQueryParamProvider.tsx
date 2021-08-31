import {useRouter} from 'next/router';
import React, {ComponentProps, memo, useMemo} from 'react';
// This dependency is bundled
// eslint-disable-next-line import/no-extraneous-dependencies
import {QueryParamProvider} from 'use-query-params';

type Props = Omit<
  ComponentProps<typeof QueryParamProvider>,
  'ReactRouterRoute' | 'reachHistory' | 'history' | 'location'
>;

function NextQueryParamProvider({children, ...rest}: Props) {
  const router = useRouter();
  const match = router.asPath.match(/[^?]+/);
  const pathname = match ? match[0] : router.asPath;

  const location: Location = useMemo(
    () =>
      typeof window !== 'undefined'
        ? window.location
        : // On the server side we only need a subset of the available
          // properties of `Location`. The other ones are only necessary
          // for interactive features on the client.
          ({search: router.asPath.replace(/[^?]+/u, '')} as Location),
    [router.asPath]
  );

  const history = useMemo(
    () => ({
      push: ({search}: Location) =>
        router.push(
          {pathname: router.pathname, query: router.query},
          {search, pathname},
          {shallow: true, scroll: false}
        ),
      replace: ({search}: Location) => {
        router.replace(
          {pathname: router.pathname, query: router.query},
          {search, pathname},
          {shallow: true, scroll: false}
        );
      },
      location
    }),
    [location, pathname, router]
  );

  return (
    <QueryParamProvider {...rest} history={history} location={location}>
      {children}
    </QueryParamProvider>
  );
}

export default memo(NextQueryParamProvider);
