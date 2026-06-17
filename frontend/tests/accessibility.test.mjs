import { test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), 'utf8');

test('document declares language, viewport, and descriptive metadata', () => {
  const html = read('index.html');

  expect(html).toMatch(/<html lang="en"/);
  expect(html).toMatch(/<meta name="viewport"/);
  expect(html).toMatch(/<meta name="description"/);
});

test('app exposes a skip link and main content target for keyboard users', () => {
  const app = read('src/App.jsx');
  const css = read('src/index.css');

  expect(app).toMatch(/href="#main-content"/);
  expect(app).toMatch(/id="main-content"/);
  expect(css).toMatch(/\.skip-link/);
});

test('shared input component connects labels, errors, and descriptions with aria attributes', () => {
  const input = read('src/components/ui/Input.jsx');

  expect(input).toMatch(/aria-invalid/);
  expect(input).toMatch(/aria-describedby/);
  expect(input).toMatch(/role="alert"/);
});

test('navigation communicates menu state and current page to assistive technology', () => {
  const navbar = read('src/components/Navbar.jsx');

  expect(navbar).toMatch(/aria-label="Primary navigation"/);
  expect(navbar).toMatch(/aria-expanded/);
  expect(navbar).toMatch(/aria-current/);
});

test('calculator page connects sliders and radio inputs with accessible label tags', () => {
  const calc = read('src/pages/Calculator.jsx');

  expect(calc).toMatch(/id="carDistance"/);
  expect(calc).toMatch(/htmlFor="carDistance"/);
  expect(calc).toMatch(/id="diet-vegetarian"/);
  expect(calc).toMatch(/htmlFor="diet-vegetarian"/);
});
