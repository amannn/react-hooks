import {useState, useEffect} from 'react';
import usePresence from './use-presence';

export default function usePresenceSwitch<ItemType>(
  item: ItemType,
  opts: Parameters<typeof usePresence>[1]
) {
  const [mountedItem, setMountedItem] = useState(item);
  const [shouldBeMounted, setShouldBeMounted] = useState(!isNil(item));
  const {isMounted, ...otherStates} = usePresence(shouldBeMounted, opts);
  useEffect(() => {
    if (mountedItem !== item) {
      if (isMounted) {
        setShouldBeMounted(false);
      } else if (!isNil(item)) {
        setMountedItem(item);
        setShouldBeMounted(true);
      }
    } else if (isNil(item)) {
      setShouldBeMounted(false);
    } else if (!isNil(item)) {
      setShouldBeMounted(true);
    }
  }, [item, mountedItem, shouldBeMounted, isMounted]);

  return {
    ...otherStates,
    isMounted: isMounted && !isNil(mountedItem),
    mountedItem
  };
}

function isNil<ItemType>(value: ItemType) {
  return value == null;
}
