# Using custom-dropdown in Next.js and Angular

This document contains copy-paste examples and guidance for integrating the `custom-dropdown` library into Next.js (both App Router and Pages Router) and Angular projects. It covers SSR considerations, styling, and testing tips.

---

## Install

```bash
npm install custom-dropdown
```

---

## Next.js (App Router) — client component

The `createDropdown` function uses DOM APIs, so you must run it on the client. Use a client component (`'use client'`) in the App Router.

```tsx
// app/components/DropdownClient.tsx
'use client';
import React, { useRef, useEffect } from 'react';
import { createDropdown, OptionItem } from 'custom-dropdown';

export default function DropdownClient({ options }: { options: OptionItem[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = createDropdown(ref.current, options);
    const onChange = (e: any) => console.log('selected', e.detail.value);
    el.addEventListener('change', onChange);
    return () => {
      el.removeEventListener('change', onChange);
      if (ref.current && ref.current.contains(el)) ref.current.removeChild(el);
    };
  }, [options]);

  return <div ref={ref} />;
}
```

Then use your client component inside a server or client page.

---

## Next.js (Pages Router)

Follow the same approach but put the component under `components/` and import it in your page. Ensure the `createDropdown` code runs in `componentDidMount` or `useEffect` so it executes only on the client.

---

## Next.js (Static export / SSG)

If you export a static site, the dropdown will be hydrated on the client only. Ensure any state tied to server-rendered markup is handled in client code.

---

## Angular (Integration guide)

Angular apps use templates and components. Because `createDropdown` manipulates the DOM, call it after the view initializes and remove it on destroy.

### Angular component example (TypeScript)

```ts
// dropdown.component.ts
import { Component, ElementRef, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { createDropdown, OptionItem } from 'custom-dropdown';

@Component({
  selector: 'app-custom-dropdown',
  template: '<div #container></div>'
})
export class DropdownComponent implements AfterViewInit, OnDestroy {
  @Input() options: OptionItem[] = [];
  constructor(private el: ElementRef) {}
  private containerEl: HTMLElement | null = null;

  ngAfterViewInit() {
    const host = (this.el.nativeElement as HTMLElement).querySelector('div');
    if (host) {
      this.containerEl = createDropdown(host, this.options);
      this.containerEl.addEventListener('change', this.onChange as EventListener);
    }
  }

  ngOnDestroy() {
    if (this.containerEl) {
      this.containerEl.removeEventListener('change', this.onChange as EventListener);
      if (this.containerEl.parentElement) this.containerEl.parentElement.removeChild(this.containerEl);
    }
  }

  onChange(e: any) {
    console.log('selected', e.detail.value);
  }
}
```

### Usage in Angular template

```html
<app-custom-dropdown [options]="myOptions"></app-custom-dropdown>
```

### Nested / multi-level lists

`custom-dropdown` supports nested option trees via the `children` property. Keyboard navigation supports ArrowRight to open a child list and ArrowLeft to close it.

Example options:

```ts
const myOptions = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two', children: [ { value: '2-1', label: 'Two-One' } ] },
  { value: '3', label: 'Three', children: [ { value: '3-1', label: 'Three-One', children: [ { value: '3-1-1', label: 'Deep' } ] } ] }
];
```

---

## Styling

- Use global styles (e.g. `styles.css`) to style `.custom-dropdown`, `.cd-list`, `.cd-button`, etc.
- In Angular, ensure your global styles are not encapsulated away from the global classes (use `::ng-deep` or global stylesheet).

---

## Accessibility & SSR notes

- `createDropdown` uses DOM APIs; always call it in client lifecycle hooks (`useEffect`, `ngAfterViewInit`).
- The component includes ARIA attributes (role=listbox, role=option, aria-expanded). For screen readers, you can add live-region announcements on selection if your app requires it.

---

## Testing

- Next.js: Use React Testing Library to mount the client component and simulate user interactions. For SSR tests, make sure DOM code is not executed during server render.
- Angular: Use Angular TestBed to create a host component and assert DOM updates. For E2E, use Playwright or Cypress to interact with the demo page.

---

If you'd like, I can add a small Next.js example app or an Angular sample component into `/examples` in this repo.
