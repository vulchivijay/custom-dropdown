# Using custom-dropdown in React

This document shows concise, copy-paste examples for using `custom-dropdown` in React projects (JavaScript and TypeScript), plus tips for SSR, styling, and testing.

## Install

```bash
npm install custom-dropdown
```

## Basic usage (React JavaScript)

```jsx
import React, { useRef, useEffect } from 'react';
import { createDropdown } from 'custom-dropdown';

export default function MyDropdown() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = createDropdown(containerRef.current, [
      { value: '1', label: 'One' },
      { value: '2', label: 'Two' }
    ]);

    // listen for change events
    const onChange = (e) => console.log('selected', e.detail.value);
    el.addEventListener('change', onChange);

    return () => {
      // cleanup: remove element and listeners
      el.removeEventListener('change', onChange);
      if (containerRef.current && containerRef.current.contains(el)) {
        containerRef.current.removeChild(el);
      }
    };
  }, []);

  return <div ref={containerRef} />;
}
```

## TypeScript usage (React + TSX)

```tsx
import React, { useRef, useEffect } from 'react';
import { createDropdown, OptionItem } from 'custom-dropdown';

export default function MyDropdown(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items: OptionItem[] = [
      { value: '1', label: 'One' },
      { value: '2', label: 'Two', children: [{ value: '2-1', label: 'Two-One' }] }
    ];
    const el = createDropdown(containerRef.current, items);

    const onChange = (e: any) => console.log('selected', e.detail.value);
    el.addEventListener('change', onChange as EventListener);

    return () => {
      el.removeEventListener('change', onChange as EventListener);
      if (containerRef.current && containerRef.current.contains(el)) {
        containerRef.current.removeChild(el);
      }
    };
  }, []);

  return <div ref={containerRef} />;
}
```

## Passing callbacks per item

```jsx
createDropdown(root, [
  { value: 'save', label: 'Save', onClick: (v) => console.log('save', v) }
]);
```

### Nested / multi-level lists

The component supports nested children. Use the same `OptionItem` shape and nest `children` arrays. Keyboard navigation supports ArrowRight to open a child list and ArrowLeft to return to the parent.

```ts
const items: OptionItem[] = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two', children: [ { value: '2-1', label: 'Two-One' } ] },
  { value: '3', label: 'Three', children: [ { value: '3-1', label: 'Three-One', children: [ { value: '3-1-1', label: 'Deep' } ] } ] }
];
```

## Styling

- The component attaches `.custom-dropdown`, `.cd-button`, `.cd-list`, `.cd-sublist` and `.focused` classes.
- Add global CSS or CSS-in-JS styles to override.

## Testing in React

- In unit tests, mount the component container, call `createDropdown`, and query the DOM for changes.
- For interaction tests, consider Playwright or React Testing Library + user-event (jsdom) for keyboard events.

## Server-Side Rendering

- `createDropdown` uses DOM APIs; avoid calling it during SSR. Wrap usage in `useEffect` so it runs only on the client.

## Accessibility

- The component provides basic ARIA attributes (listbox, option, aria-expanded). Consider additional live-region announcements if required.

## Troubleshooting

- If you don't see styling, ensure your app's CSS isn't scoped away from the global `.custom-dropdown` classes.
- For bundlers, prefer the ESM import path.

---

If you want, I can also add a small React wrapper component (a thin adapter that handles mount/unmount and types) and include it in this repo under `src/react/`.
