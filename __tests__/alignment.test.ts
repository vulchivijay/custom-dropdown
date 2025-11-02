import { createDropdown } from '../src/index';

describe('sublist alignment', () => {
  beforeEach(() => { document.body.innerHTML = '<div id="root"></div>'; });

  test('aligns sublist left when not enough space on right', () => {
    const root = document.getElementById('root')!;
    const comp = createDropdown(root, [
      { value: '1', label: 'One', children: [ { value: '1-1', label: 'One-One' } ] }
    ]);

    // mock parent bounding rect to be near right edge
    const parentLi = comp.querySelector('li') as HTMLElement;
    const sub = parentLi.querySelector('ul') as HTMLElement;

    // Mock getBoundingClientRect for parent to simulate being near right edge
    parentLi.getBoundingClientRect = () => ({
      left: 900,
      right: 950,
      top: 100,
      bottom: 120,
      width: 50,
      height: 20,
      x: 900,
      y: 100,
      toJSON: () => {}
    } as DOMRect);

    // Mock sub width to be larger than space on right
    sub.getBoundingClientRect = () => ({
      width: 200,
      left: 0, right: 0, top:0, bottom:0, height:0, x:0, y:0, toJSON: () => {}
    } as DOMRect);

    // set window width small so spaceOnRight < sub width
    (global as any).innerWidth = 1000;

  // run alignment helper (attached by the component) or fallback to mouseenter
  const fn = (sub as any).__applyAlignment;
  if (typeof fn === 'function') fn(parentLi, sub);
  else parentLi.dispatchEvent(new Event('mouseenter'));

  expect(sub.classList.contains('scd-sublist--align-left')).toBe(true);
  });

  test('aligns sublist right when enough space on right', () => {
    const root = document.getElementById('root')!;
    const comp = createDropdown(root, [
      { value: '1', label: 'One', children: [ { value: '1-1', label: 'One-One' } ] }
    ]);

    const parentLi = comp.querySelector('li') as HTMLElement;
    const sub = parentLi.querySelector('ul') as HTMLElement;

    parentLi.getBoundingClientRect = () => ({
      left: 100,
      right: 150,
      top: 100,
      bottom: 120,
      width: 50,
      height: 20,
      x: 100,
      y: 100,
      toJSON: () => {}
    } as DOMRect);

    sub.getBoundingClientRect = () => ({
      width: 100,
      left: 0, right: 0, top:0, bottom:0, height:0, x:0, y:0, toJSON: () => {}
    } as DOMRect);

    (global as any).innerWidth = 1000;

  const fn2 = (sub as any).__applyAlignment;
  if (typeof fn2 === 'function') fn2(parentLi, sub);
  else parentLi.dispatchEvent(new Event('mouseenter'));

  expect(sub.classList.contains('scd-sublist--align-right')).toBe(true);
  });
});
