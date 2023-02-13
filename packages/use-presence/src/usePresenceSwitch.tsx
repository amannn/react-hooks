import {useState, useEffect} from 'react';
import usePresence from './usePresence';

export default function usePresenceSwitch<ItemType>(
  item: ItemType | undefined,
  opts: Parameters<typeof usePresence>[1]
) {
  const [mountedItem, setMountedItem] = useState(item);
  const [shouldBeMounted, setShouldBeMounted] = useState(item !== undefined);
  const {isMounted, ...rest} = usePresence(shouldBeMounted, opts);

  useEffect(() => {
    if (mountedItem !== item) {
      if (isMounted) {
        setShouldBeMounted(false);
      } else if (item !== undefined) {
        setMountedItem(item);
        setShouldBeMounted(true);
      }
    } else if (item === undefined) {
      setShouldBeMounted(false);
    } else if (item !== undefined) {
      setShouldBeMounted(true);
    }
  }, [item, mountedItem, shouldBeMounted, isMounted]);

  return {
    ...rest,
    isMounted: isMounted && mountedItem !== undefined,
    mountedItem
  };
}
