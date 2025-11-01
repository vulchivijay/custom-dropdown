// Minimal, dependency-free custom dropdown library (example)

export type Option = { value: string; label: string };

export type OptionItem = {
  value: string;
  label: string;
  onClick?: (value: string) => void;
  children?: OptionItem[];
};

export function createDropdown(root: HTMLElement, options: OptionItem[], placeholder = 'Select') {
  const container = document.createElement('div');
  container.className = 'custom-dropdown';
  container.tabIndex = -1;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'cd-button';
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = placeholder;
  container.appendChild(button);

  const list = document.createElement('ul');
  list.className = 'cd-list';
  list.setAttribute('role', 'listbox');
  list.setAttribute('tabindex', '-1');
  list.style.display = 'none';

  function renderOptions(listEl: HTMLElement, items: OptionItem[]) {
    items.forEach((opt, i) => {
      const li = document.createElement('li');
      li.textContent = opt.label;
      li.dataset.value = opt.value;
      li.setAttribute('role', 'option');
      li.setAttribute('tabindex', '-1');
      li.dataset.index = String(i);

      if (opt.children && opt.children.length) {
        const sublist = document.createElement('ul');
        sublist.className = 'cd-sublist';
        sublist.setAttribute('role', 'listbox');
        sublist.style.display = 'none';
        renderOptions(sublist, opt.children);
        li.appendChild(sublist);

        // open sublist on hover for mouse users
        li.addEventListener('mouseenter', () => (sublist.style.display = 'block'));
        li.addEventListener('mouseleave', () => (sublist.style.display = 'none'));
      }

      listEl.appendChild(li);
    });
  }

  renderOptions(list, options);
  container.appendChild(list);

  let open = false;

  type Frame = { listEl: HTMLElement; items: HTMLElement[]; index: number; parentLi?: HTMLElement };
  const focusStack: Frame[] = [];

  function pushFrame(listEl: HTMLElement, parentLi?: HTMLElement, startIndex = 0) {
    const items = Array.from(listEl.querySelectorAll(':scope > li')) as HTMLElement[];
    const frame: Frame = { listEl, items, index: Math.min(Math.max(0, startIndex), Math.max(0, items.length - 1)), parentLi };
    focusStack.push(frame);
    syncFocus();
  }

  function popFrame() {
    const popped = focusStack.pop();
    if (popped && popped.parentLi) {
      const sub = popped.parentLi.querySelector(':scope > ul') as HTMLElement | null;
      if (sub) sub.style.display = 'none';
      popped.parentLi.setAttribute('aria-expanded', 'false');
    }
    syncFocus();
  }

  function currentFrame(): Frame | undefined {
    return focusStack[focusStack.length - 1];
  }

  function syncFocus() {
    // clear previous focused classes
    Array.from(container.querySelectorAll('li.focused')).forEach(el => el.classList.remove('focused'));
    const f = currentFrame();
    if (!f) return;
    const cur = f.items[f.index];
    if (cur) {
      cur.classList.add('focused');
      cur.focus();
    }
  }

  function openList() {
    list.style.display = 'block';
    button.setAttribute('aria-expanded', 'true');
    open = true;
    pushFrame(list);
  }

  function closeList() {
    // hide all sublists
    Array.from(container.querySelectorAll('ul')).forEach((ul) => {
      if (ul !== list) (ul as HTMLElement).style.display = 'none';
    });
    list.style.display = 'none';
    button.setAttribute('aria-expanded', 'false');
    open = false;
    focusStack.length = 0;
    button.focus();
  }

  button.addEventListener('click', () => {
    if (open) closeList(); else openList();
  });

  button.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); openList(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); openList(); }
  });

  list.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const li = target.closest('li');
    if (li && li.dataset && li.dataset.value) {
      const value = li.dataset.value;
      // find option item by value to call its onClick if provided
      const findItem = (items: OptionItem[]): OptionItem | undefined => {
        for (const it of items) {
          if (it.value === value) return it;
          if (it.children) {
            const found = findItem(it.children);
            if (found) return found;
          }
        }
        return undefined;
      };
      const item = findItem(options);
      if (item && item.onClick) item.onClick(value);
      selectOption(li as HTMLElement);
    }
  });

  list.addEventListener('keydown', (e) => {
    const frame = currentFrame();
    if (!frame) return;
    const { items } = frame;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      frame.index = Math.min(items.length - 1, frame.index + 1);
      syncFocus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      frame.index = Math.max(0, frame.index - 1);
      syncFocus();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const cur = items[frame.index];
      const sub = cur.querySelector(':scope > ul') as HTMLElement | null;
      if (sub) {
        sub.style.display = 'block';
        cur.setAttribute('aria-expanded', 'true');
        pushFrame(sub, cur, 0);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (focusStack.length > 1) popFrame(); else { closeList(); }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const cur = items[frame.index];
      if (cur) selectOption(cur);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeList();
    }
  });

  function selectOption(el: HTMLElement) {
    const value = el.dataset.value || '';
    // if this li has a sublist, open it instead of selecting
    const sub = el.querySelector(':scope > ul') as HTMLElement | null;
    if (sub) {
      sub.style.display = 'block';
      el.setAttribute('aria-expanded', 'true');
      pushFrame(sub, el, 0);
      return;
    }

    button.textContent = el.textContent || placeholder;
    const changeEvent = new CustomEvent('change', { detail: { value } });
    container.dispatchEvent(changeEvent);
    closeList();
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target as Node)) closeList();
  });

  root.appendChild(container);
  return container;
}
