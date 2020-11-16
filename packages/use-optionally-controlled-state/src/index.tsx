import * as React from 'react';

export function Bold({ message }: { message: string }) {
  return <b>{message}</b>;
}

export function Zop({ message }: { message: string }) {
  return <i>{message}</i>;
}
