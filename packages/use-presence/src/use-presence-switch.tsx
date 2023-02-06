import {useState, useEffect} from 'react';
import usePresence from './use-presence';

export function usePresenceSwitch<ItemType>(
  latestItem: ItemType,
  opts: Parameters<typeof usePresence>[1]
) {
  const [item, setItem] = useState(latestItem);
  const [shouldBeMounted, setShouldBeMounted] = useState(!isNil(item));
  const {isMounted, ...otherStates} = usePresence(shouldBeMounted, opts);
  useEffect(() => {
    if (item !== latestItem) {
      if (isMounted) {
        setShouldBeMounted(false);
      } else if (!isNil(latestItem)) {
        setItem(latestItem);
        setShouldBeMounted(true);
      }
    } else if (isNil(latestItem)) {
      setShouldBeMounted(false);
    } else if (!isNil(latestItem)) {
      setShouldBeMounted(true);
    }
  }, [latestItem, item, shouldBeMounted, isMounted]);

  return {
    ...otherStates,
    isMounted: isMounted && !isNil(item),
    item
  };
}

function isNil<ItemType>(value: ItemType) {
  return value === null || value === undefined;
}
