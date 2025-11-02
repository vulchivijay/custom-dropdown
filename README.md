# simple-custom-dropdown

Install and usage
-----------------

```sh
npm install simple-custom-dropdown
```
```js
import { createDropdown } from 'simple-custom-dropdown';

const root = document.getElementById('app');

Quick copy-paste snippet for other projects
------------------------------------------

README to show how to install and use `simple-custom-dropdown`.
Install

```powershell
npm install simple-custom-dropdown
```
Minimal usage (ESM)
--------------------

```html
<div id="app"></div>
<script type="module">
	import { createDropdown } from 'simple-custom-dropdown';
	createDropdown(document.getElementById('app'), [
		{ value: '1', label: 'One' },
		{ value: '2', label: 'Two' }
	]);
</script>
``` 
Browser embed (CDN)
-------------------

```html
<script type="module">
	import { createDropdown } from 'https://unpkg.com/simple-custom-dropdown@0.1.0/dist/index.esm.js';
	createDropdown(document.getElementById('app'), [{ value: '1', label: 'One' }]);
</script>
```
Event handling example
-----------------------

```js
const container = createDropdown(root, items);
container.addEventListener('change', (e) => console.log('selected', e.detail.value));
```
Multi-level (nested) lists
--------------------------

`simple-custom-dropdown` supports nested option trees. Each option can include a `children` array with more options. Keyboard support includes ArrowRight to open a child sublist and ArrowLeft to go back to the parent.

Example:

```js
createDropdown(root, [
	{ value: 'a', label: 'A' },
	{ value: 'b', label: 'B', children: [
		{ value: 'b-1', label: 'B-1' },
		{ value: 'b-2', label: 'B-2', children: [ { value: 'b-2-1', label: 'B-2-1' } ] }
	] }
]);
```

Try the demo
------------

1. Build the package: `npm run build`
2. Serve the `demo` folder with a static server (examples):

```powershell
npx serve demo -p 5000
# or
npx http-server demo -p 5000
```

3. Open `http://localhost:5000` in your browser and interact with the dropdown.

Usage: nested options
---------------------

You can pass nested options and per-item onClick callbacks:

```js
import { createDropdown } from 'simple-custom-dropdown';

const root = document.getElementById('app');
createDropdown(root, [
	{ value: '1', label: 'One' },
	{ value: '2', label: 'Two', children: [ { value: '2-1', label: 'Two-One' } ] },
	{ value: '3', label: 'Three', onClick: (v) => console.log('clicked', v) }
]);
```


# simple-custom-dropdown

A tiny, dependency-free custom dropdown component (library scaffold).

Install and usage

```sh
npm install simple-custom-dropdown
```

```js
import { createDropdown } from 'simple-custom-dropdown';

const root = document.getElementById('app');
createDropdown(root, [{ value: '1', label: 'One' }, { value: '2', label: 'Two' }]);
```

Ways to check the UI
--------------------

1) Manual demo (fast)

- Build and serve the demo:

```powershell
npm run build
npx serve demo -p 5000
# or
npx http-server demo -p 5000
```

Open http://localhost:5000 and click/hover/keyboard test the dropdown.

2) Local dev server with HMR (recommended for iterative development)

- Use Vite for fast dev with HMR. Steps (one-time):

```powershell
npm init vite@latest demo-site --template vanilla
# copy demo/index.html and import from src or dist
cd demo-site
npm install
npm run dev
```

Quick copy-paste snippet for other projects
------------------------------------------

Use this short block in another project's docs or README to show how to install and use `simple-custom-dropdown`.

Install

```powershell
npm install simple-custom-dropdown
```

Minimal usage (ESM)

```html
<div id="app"></div>
<script type="module">
	import { createDropdown } from 'simple-custom-dropdown';
	createDropdown(document.getElementById('app'), [
		{ value: '1', label: 'One' },
		{ value: '2', label: 'Two' }
	]);
</script>
```

Browser embed (CDN)

```html
<script type="module">
	import { createDropdown } from 'https://unpkg.com/simple-custom-dropdown@0.1.0/dist/index.esm.js';
	createDropdown(document.getElementById('app'), [{ value: '1', label: 'One' }]);
</script>
```

Event handling example

```js
const container = createDropdown(root, items);
container.addEventListener('change', (e) => console.log('selected', e.detail.value));
```

Multi-level (nested) lists
--------------------------

`simple-custom-dropdown` supports nested option trees. Each option can include a `children` array with more options. Keyboard support includes ArrowRight to open a child sublist and ArrowLeft to go back to the parent.

Example:

```js
createDropdown(root, [
	{ value: 'a', label: 'A' },
	{ value: 'b', label: 'B', children: [
		{ value: 'b-1', label: 'B-1' },
		{ value: 'b-2', label: 'B-2', children: [ { value: 'b-2-1', label: 'B-2-1' } ] }
	] }
]);
```