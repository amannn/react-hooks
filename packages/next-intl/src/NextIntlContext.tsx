import {createContext} from 'react';
import Messages from './NextIntlMessages';

const NextIntlContext = createContext<{messages: Messages} | undefined>(
  undefined
);

export default NextIntlContext;
