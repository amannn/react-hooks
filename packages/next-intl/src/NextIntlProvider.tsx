import React, {ReactNode} from 'react';
import NextIntlContext from './NextIntlContext';
import NextIntlMessages from './NextIntlMessages';

type Props = {
  children: ReactNode;
  messages: NextIntlMessages;
};

export default function NextIntlProvider({children, messages}: Props) {
  return (
    <NextIntlContext.Provider value={{messages}}>
      {children}
    </NextIntlContext.Provider>
  );
}
