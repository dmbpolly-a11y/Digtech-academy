import React from 'react';
import { renderToString } from 'react-dom/server';

async function test() {
  try {
    console.log('Testing App import...');
    const App = (await import('./src/App.tsx')).default;
    console.log('Rendering App to string...');
    const html = renderToString(React.createElement(App));
    console.log('Successfully rendered App! HTML length:', html.length);
    console.log('HTML snippet:', html.substring(0, 300));
  } catch (err) {
    console.error('FAILED to render App:', err);
  }
}

test();
