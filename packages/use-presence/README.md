# use-presence

[![Stable release](https://img.shields.io/npm/v/use-presence.svg)](https://npm.im/use-presence)

A 1kb React hook to animate the presence of an element.

<img width="400" src="https://raw.githubusercontent.com/amannn/react-hooks/main/packages/use-presence/media/use-presence-demo.gif" />

[Demo app](https://codesandbox.io/s/usepresence-demo-1u6vq?file=/src/Expander.js)

## The problem

There are two problems that you have to solve when animating the presence of an element:

1. During enter animations, you have to render an initial state where the element is hidden and only after this has flushed to the DOM, you can can animate the final state that the element should animate towards.
2. Exit animations are a bit tricky in React, since this typically means that a component unmounts. However when the component has already unmounted, you can't animate it anymore. A workaround is often to keep the element mounted, but that keeps unnecessary elements around and can hurt accessibility, as hidden interactive elements might still be focusable.

## This solution

This hook provides a lightweight solution where the animating element is only mounted the minimum of time, while making sure the animation is fully visible to the user. The rendering is left to the user to support all kinds of styling solutions.

## Example

```jsx
import usePresence from 'use-presence';

function Expander({children, isOpen, transitionDuration = 500}) {
  const {isMounted, isVisible, isAnimating} = usePresence(isOpen, {transitionDuration});

  if (!isMounted) {
    return null;
  }

  return (
    <div
      style={{
        display: 'grid',
        overflow: 'hidden',
        opacity: 0,
        transitionDuration: `${transitionDuration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionProperty: 'grid-template-rows, opacity',
        gridTemplateRows: isVisible ? '1fr' : '0fr',
        ...(isVisible && {opacity: 1}),
        ...(isAnimating && {willChange: 'grid-template-rows, opacity'})
      }}
    >
      <div style={{overflow: 'hidden'}}>{children}</div>
    </div>
  );
}
```

(this uses a [CSS grid auto height trick](https://css-tricks.com/css-grid-can-do-auto-height-transitions/))

## API

```tsx
const {
  /** Should the component be returned from render? */
  isMounted,
  /** Should the component have its visible styles applied? */
  isVisible,
  /** Is the component either entering or exiting currently? */
  isAnimating,
  /** Is the component entering currently? */
  isEntering,
  /** Is the component exiting currently? */
  isExiting
} = usePresence(
  /** Indicates whether the component that the resulting values will be used upon should be visible to the user. */
  isVisible: boolean,
  opts: {
    /** Duration in milliseconds used both for enter and exit transitions. */
    transitionDuration: number;
    /** Opt-in to animating the entering of an element if `isVisible` is `true` during the initial mount. */
    initialEnter?: boolean;
  }
)
```

If you want to use different transition durations for enter and exit, you can configure `transitionDuration` conditionally:

```tsx
const {isMounted, isVisible} = usePresence(isOpen, {
  transitionDuration: isOpen ? /* enter */ 500 : /* exit */ 300
});
```

## `usePresenceSwitch`

If you have multiple items where only one is visible at a time, you can use the supplemental `usePresenceSwitch` hook to animate the items in and out. Previous items will exit before the next item transitions in.

### API

```tsx
const {
  /** The item that should currently be rendered. */
  mountedItem,
  /** Returns all other properties from `usePresence`. */
  ...rest
} = usePresence<ItemType>(
  /** The current item that should be visible. If `undefined` is passed, the previous item will animate out. */
  item: ItemType | undefined,
  /** See the `opts` argument of `usePresence`. */
  opts: Parameters<typeof usePresence>[1]
)
```

### Example

```jsx
const tabs = [
  {
    title: 'Tab 1',
    content: 'Tab 1 content'
  },
  {
    title: 'Tab 2',
    content: 'Tab 2 content'
  },
  {
    title: 'Tab 3',
    content: 'Tab 3 content'
  }
];

function Tabs() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      {tabs.map((tab, index) => (
        <button key={index} onClick={() => setTabIndex(index)} type="button">
          {tab.title}
        </button>
      ))}
      <TabContent>{tabs[tabIndex].content}</TabContent>
    </>
  );
}

function TabContent({children, transitionDuration = 500}) {
  const {isMounted, isVisible, mountedItem} = usePresenceSwitch(children, {
    transitionDuration
  });

  if (!isMounted) {
    return null;
  }

  return (
    <div
      style={{
        opacity: 0,
        transitionDuration: `${transitionDuration}ms`,
        transitionProperty: 'opacity',
        ...(isVisible && {
          opacity: 1
        })
      }}
    >
      {mountedItem}
    </div>
  );
}
```

## Related

- [`AnimatePresence` of `framer-motion`](https://www.framer.com/docs/animate-presence/)
- [`Transition` of `react-transition-group`](http://reactcommunity.org/react-transition-group/transition)
