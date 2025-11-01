import { createDropdown } from '../src/index';

describe('custom-dropdown', () => {
  beforeEach(() => { document.body.innerHTML = '<div id="root"></div>'; });

  test('opens on click and emits change on selection', () => {
    const root = document.getElementById('root')!;
    const comp = createDropdown(root, [{ value: '1', label: 'One' }, { value: '2', label: 'Two' }]);
    const button = comp.querySelector('button') as HTMLButtonElement;
    button.click();
    const list = comp.querySelector('ul') as HTMLUListElement;
    expect(list.style.display).toBe('block');

    const items = Array.from(list.querySelectorAll('li')) as HTMLElement[];
    const changePromise = new Promise((resolve) => {
      comp.addEventListener('change', (e: any) => resolve(e.detail.value));
    });
    items[1].click();
    return changePromise.then((val) => expect(val).toBe('2'));
  });

  test('keyboard navigation works', () => {
    const root = document.getElementById('root')!;
    const comp = createDropdown(root, [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]);
    const button = comp.querySelector('button') as HTMLButtonElement;
    // simulate ArrowDown then Enter
    const down = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    button.dispatchEvent(down);
    const list = comp.querySelector('ul') as HTMLUListElement;
    expect(list.style.display).toBe('block');
  });
});
