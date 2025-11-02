# Nested menus, JSON schema, and accessibility notes

This document covers visual diagrams of nested menus, a JSON schema for option trees used by `simple-custom-dropdown`, and accessibility recommendations for deep nested lists.

---

## Visual diagrams

Simple 2-level menu (ASCII):

```
[ Button ]
  ▾
  - One
  - Two
    ▸ Two-One
    ▸ Two-Two
  - Three
```

3-level menu (ASCII):

```
[ Button ]
  ▾
  - A
  - B
    ▸ B-1
    ▸ B-2
      ▸ B-2-a
      ▸ B-2-b
  - C
```

SVG-like sketch (lightweight):

- Root list
  - List item
    - Sublist
      - Sublist item

(You can copy the ASCII art into docs or slide decks.)

---

## Diagram images

Below are visual diagram images (SVG) that illustrate 2-level and 3-level nested menus. The images are placed in `docs/images/`.

![2-level nested menu](./images/nested-2level.svg)

*Figure: 2-level nested menu (sublist opens to the right of the parent item).* 

![3-level nested menu](./images/nested-3level.svg)

*Figure: 3-level nested menu (deep submenu opens from a second-level item).* 


## JSON schema for option tree

Below is a JSON Schema (draft-07 compatible) that models the shape accepted by `createDropdown`.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DropdownOption",
  "type": "object",
  "properties": {
    "value": { "type": "string" },
    "label": { "type": "string" },
    "onClick": { "type": ["null", "string"], "description": "optional named callback identifier" },
    "children": {
      "type": "array",
      "items": { "$ref": "#" }
    }
  },
  "required": ["value", "label"],
  "additionalProperties": false
}
```

Example option tree (JSON):

```json
[
  { "value": "1", "label": "One" },
  {
    "value": "2",
    "label": "Two",
    "children": [
      { "value": "2-1", "label": "Two-One" },
      { "value": "2-2", "label": "Two-Two", "children": [ { "value": "2-2-1", "label": "Deep" } ] }
    ]
  }
]
```

Notes:
- `onClick` cannot be serialized directly; if you need to persist callbacks, store a string identifier and map it to a function at runtime.

---

## Accessibility notes for deep nested lists

Deeply nested menus bring additional accessibility considerations. Below are recommendations:

1. Keyboard navigation
   - ArrowDown/ArrowUp: move within the current list.
   - ArrowRight: open child sublist and move focus into it.
   - ArrowLeft: close sublist and return focus to parent item.
   - Enter/Space: activate the focused option (select or open child).
   - Escape: close the current list (or entire menu if at root).

2. Focus management
   - Use a focus stack (we use one in the component) so focus is always on the active item.
   - Avoid trapping focus; Escape should always collapse.

3. ARIA roles & properties
   - Use `role="listbox"` on lists and `role="option"` on items.
   - When an item has children, set `aria-expanded="true|false"` on that item.
   - Consider `aria-haspopup="listbox"` on the trigger button.

4. Announcements and live regions
   - For deep menus, consider announcing when submenus open/closes with a polite `aria-live` region to assist screen reader users.
   - Announce selection changes (`aria-live` polite) to confirm the chosen value.

5. Visual affordances
   - Provide clear hover + focus styles (`:focus`, `.focused`) so keyboard users can see focus.
   - Show indicators for items with children (e.g., a chevron ▸) so users know a submenu exists.

6. Mobile/touch
   - Ensure touch targets are large enough.
   - Consider tapping an item with children to open the submenu rather than selecting immediately.

7. Testing
   - Use axe-core (browser or automated) to catch common issues.
   - Run manual tests with NVDA/VoiceOver/JAWS.
   - Include keyboard-only tests in E2E suites (Cypress/Playwright or similar).

---

If you want, I can also generate a printable PNG of the ASCII diagram or add a simple SVG file to the `docs/` folder. Which would you prefer?"
