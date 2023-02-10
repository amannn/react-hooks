import {useState, useEffect} from 'react';
import usePresence from './usePresence';

export default function usePresenceSwitch<ItemType>(
  item: ItemType | undefined,
  opts: Parameters<typeof usePresence>[1]
) {
  const [mountedItem, setMountedItem] = useState(item);
  const [shouldBeMounted, setShouldBeMounted] = useState(!isUndefined(item));
  const {isMounted, ...rest} = usePresence(shouldBeMounted, opts);

  useEffect(() => {
    if (mountedItem !== item) {
      if (isMounted) {
        setShouldBeMounted(false);
      } else if (!isUndefined(item)) {
        setMountedItem(item);
        setShouldBeMounted(true);
      }
    } else if (isUndefined(item)) {
      setShouldBeMounted(false);
    } else if (!isUndefined(item)) {
      setShouldBeMounted(true);
    }
  }, [item, mountedItem, shouldBeMounted, isMounted]);

  return {
    ...rest,
    isMounted: isMounted && !isUndefined(mountedItem),
    mountedItem
  };
}

function isUndefined<ItemType>(value: ItemType) {
  return value === undefined;
}
