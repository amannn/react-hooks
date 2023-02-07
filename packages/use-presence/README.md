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
    <div style={{
      overflow: 'hidden',
      maxHeight: 0,
      opacity: 0,
      transitionDuration: `${transitionDuration}ms`,
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionProperty: 'max-height, opacity',
      ...(isVisible && {
        maxHeight: 500,
        opacity: 1,
        transitionTimingFunction: 'cubic-bezier(0.8, 0, 0.6, 1)'
      }),
      ...(isAnimating && {willChange: 'max-height, opacity'})
    }}>
      {children}
    </div>
  );
}
```

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
    /** Duration in milliseconds used for enter transitions (overrides `transitionDuration` if provided). */
    enterTransitionDuration: number;
    /** Duration in milliseconds used for exit transitions (overrides `transitionDuration` if provided). */
    exitTransitionDuration: number;
    /** Opt-in to animating the entering of an element if `isVisible` is `true` during the initial mount. */
    initialEnter?: boolean;
  }
)
```

# Animating a switch-out between state values

## The problem

Another common animation challenge is the case where you have state that represents an item that you want to see switch out and be replaced with a new item. This can be tricky because you want to make sure that the old item remains available and rendered until it has fully transitioned out. However, when React states are updated there is no warning that would give you time to transition out before the new state has appeared.

## This solution

This package exports a secondary wrapper hook to the first which will give you the an instance of the state that should be rendered during transition periods.

## Example

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
      <div style={{display: 'flex', gap: '1rem'}}>
        {tabs.map(({title}, index) => (
          <button key={title} onClick={() => setTabIndex(index)} type="button">
            {title}
          </button>
        ))}
      </div>
      <TabContent tab={tabs[tabIndex]} />
    </>
  );
}

function TabContent({tab, transitionDuration = 500}) {
  const {isAnimating, isMounted, isVisible, mountedItem} = usePresenceSwitch(
    tab,
    {transitionDuration}
  );

  if (!isMounted) {
    return null;
  }

  return (
    <div
      style={{
        overflow: 'hidden',
        maxHeight: 0,
        opacity: 0,
        transitionDuration: `${transitionDuration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionProperty: 'max-height, opacity',
        ...(isVisible && {
          maxHeight: 500,
          opacity: 1,
          transitionTimingFunction: 'cubic-bezier(0.8, 0, 0.6, 1)'
        }),
        ...(isAnimating && {willChange: 'max-height, opacity'})
      }}
    >
      {mountedItem.content}
    </div>
  );
}
```

## API

```tsx
const {
  /** The item that should currently be rendered with respect to your transition state. */
  mountedItem,
  /** Returns all other states that usePresence returns. */
  ...renderingStates
} = usePresence<ItemType>(
  /** The item to be tracked. If `null` or `undefined`, the state will transition out and `isMounted` will become false. */
  item: ItemType | null | undefined,
  /** Extends the options for the underlying call to usePresence. */
  opts: Parameters<typeof usePresence>[1]
)
```

## Related

- [`AnimatePresence` of `framer-motion`](https://www.framer.com/docs/animate-presence/)
- [`Transition` of `react-transition-group`](http://reactcommunity.org/react-transition-group/transition)
