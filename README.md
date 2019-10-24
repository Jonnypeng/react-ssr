<p align="center">😎 React SSR 😎</p>
<p align="center">React SSR as a view template engine</p>

## Features

- Blazing fast SSR (Server Side Rendering)
- Passing the server data to the client `props`
- Dynamic `props` without caring about SSR
  - Suitable for dynamic routes like blogging
- Hot relaoding when `process.env.NODE_ENV !== 'production'`
- TypeScript support

## Usage

Install it:

```bash
$ npm install --save @react-ssr/express react react-dom
```

and add a script to your package.json like this:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

Populate files below inside your project:

**`./server.js`**

```js
const express = require('@react-ssr/express');
const app = express();

app.get('/', (req, res) => {
  const message = 'Hello World!';
  res.render('index', { message });
});

app.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});
```

**`./views/index.jsx`**

```jsx
import React from 'react';

export default function Index({ message }) {
  return <p>{message}</p>;
}
```

and then just run `npm start` and go to `http://localhost:3000`.

You'll see `Hello World!`.

## Rules

- The each view must be a single entry point
  - Don't create other components in the views directory
- The each view's extension must be either `.jsx` or `.tsx`
  - We can decide freely with other components' extension

## Configuration

### Constructor Configuration

```js
const express = require('@react-ssr/express');

// default configuration
const app = express({
  viewsDir: 'views',
  cacheDir: '.cache',
});
```

### `ssr.config.js`

```js
module.exports = {
  webpack: (config, env) => {
    // we can override default webpack config here
    return config;
  },
};
```

For example, let's consider we want to import css files directly:

**views/index.jsx**

```jsx
import '../styles/index.css';
```

**styles/index.css**

```css
body {
  background-color: burlywood;
}
```

Then, we must override the default webpack config like this:

**ssr.config.js**

```js
module.exports = {
  webpack: (config, env) => {
    config.module.rules = [
      ...(config.module.rules),
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ];
    return config;
  },
};
```

A working example is here: [examples/basic-css](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-css)

## Custom Layout

In the layout, we must inject `@react-ssr/express/script` in the body tag:

**./components/layout.jsx**

```jsx
import ReactSsrScript from '@react-ssr/express/script';

export const Layout = (props) => {
  const {
    children,
    script, // passed from the entry point (./views/index.jsx)
  } = props;

  return (
    <html>
      <head>
        <title>Hello Layout</title>
      </head>
      <body>
        {children}
        <ReactSsrScript script={script} />
      </body>
    </html>
  );
};
```

And then, just use it like before:

**./views/index.jsx**

```jsx
import React from 'react';
import { Layout } from '../components/layout';

const Index = (props) => {
  const { script } = props; // `props.script` is injected by @react-ssr/express automatically

  return (
    <Layout
      script={script} // pass it to the layout component for the dynamic SSR
    >
      <p>Hello Layout!</p>
    </Layout>
  );
};

export default Index;
```

A working example is here: [examples/custom-layout](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-layout)

## Supported UI Framework

- [x] [emotion](https://emotion.sh)
- [x] [styled-components](https://www.styled-components.com)
- [x] [material-ui](https://material-ui.com)
- [ ] [antd](https://ant.design)
- [ ] and more...

### With Emotion

In order to enable SSR, we must install these dependencies:

- `babel-plugin-emotion`
- `emotion`
- `emotion-server`

A minimal `package.json` is like this:

```json
{
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "@emotion/core": "latest",
    "@emotion/styled": "latest",
    "@react-ssr/express": "latest",
    "emotion": "latest",
    "emotion-server": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "babel-plugin-emotion": "latest"
  }
}
```

And then, populate `.babelrc` in your project root:

```json
{
  "presets": [
    "@react-ssr/express/babel"
  ],
  "plugins": [
    "emotion"
  ]
}
```

Finally, with custom layout, inject `@react-ssr/express/script` at the bottom of the body tag:

```jsx
import ReactSsrScript from '@react-ssr/express/script';

export const Layout = (props) => {
  const { script } = props;

  return (
    <html>
      <head>
        <title>Hello Emotion</title>
      </head>
      <body>
        {children}
        <ReactSsrScript script={script} />
      </body>
    </html>
  );
};
```

A working example is here: [examples/with-jsx-emotion](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-emotion)

### With styled-components

In order to enable SSR, we must install `babel-plugin-styled-components` as devDependencies:

A minimal `package.json` is like this:

```json
{
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "@react-ssr/express": "latest",
    "react": "latest",
    "react-dom": "latest",
    "styled-components": "latest"
  },
  "devDependencies": {
    "babel-plugin-styled-components": "latest"
  }
}
```

And then, populate `.babelrc` in your project root:

```json
{
  "presets": [
    "@react-ssr/express/babel"
  ],
  "plugins": [
    "styled-components"
  ]
}
```

Finally, with custom layout, inject `@react-ssr/express/script` at the bottom of the body tag:

```jsx
import ReactSsrScript from '@react-ssr/express/script';

export const Layout = (props) => {
  const { script } = props;

  return (
    <html>
      <head>
        <title>Hello styled-components</title>
      </head>
      <body>
        {children}
        <ReactSsrScript script={script} />
      </body>
    </html>
  );
};
```

A working example is here: [examples/with-jsx-styled-components](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-styled-components)

### With Material UI

We can use [material-ui](https://material-ui.com) without extra configuration.

A working example is here: [examples/with-jsx-material-ui](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-material-ui)

### With Ant Design

WIP

## TypeScript Support

To enable TypeScript engine (`.tsx`), just put `tsconfig.json` in your project root directory.

The code of TypeScript will be like this:

**`./package.json`**

```json
{
  "scripts": {
    "start": "ts-node server.ts"
  }
}
```

**`./server.ts`**

```ts
import express, { Request, Response } from '@react-ssr/express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  const message = 'Hello World!';
  res.render('index', { message });
});

app.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});
```

**`./views/index.tsx`**

```tsx
import React from 'react';

interface IndexProps {
  message: string;
}

export default function Index({ message }: IndexProps) {
  return <p>{message}</p>;
}
```

## Packages

| package | version |
| --- | --- |
| [@react-ssr/core](https://github.com/saltyshiomix/react-ssr/blob/master/packages/core/README.md) | ![@react-ssr/core](https://img.shields.io/npm/v/@react-ssr/core.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/core.svg) |
| [@react-ssr/express](https://github.com/saltyshiomix/react-ssr/blob/master/packages/express/README.md) | ![@react-ssr/express](https://img.shields.io/npm/v/@react-ssr/express.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/express.svg) |
| [@react-ssr/nestjs-express](https://github.com/saltyshiomix/react-ssr/blob/master/packages/nestjs-express/README.md) | ![@react-ssr/nestjs-express](https://img.shields.io/npm/v/@react-ssr/nestjs-express.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/nestjs-express.svg) |

## Examples

- [examples/basic-blogging](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-blogging)
- [examples/basic-css](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-css)
- [examples/basic-jsx](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-jsx)
- [examples/basic-nestjs](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-nestjs)
- [examples/basic-nestjs-nodemon](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-nestjs-nodemon)
- [examples/basic-tsx](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-tsx)
- [examples/custom-babelrc](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-babelrc)
- [examples/custom-layout](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-layout)
- [examples/custom-views](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-views)
- [examples/with-jsx-emotion](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-emotion)
- [examples/with-jsx-material-ui](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-material-ui)
- [examples/with-jsx-styled-components](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-styled-components)

Each example uses `@react-ssr/{express|nestjs-express}@canary` by default, so it may have some bugs.

To use the stable version, please rewrite to `@react-ssr/{express|nestjs-express}@latest`:

```json
{
  "dependencies": {
    "@react-ssr/express": "latest"
  }
}
```

## Starters

- [react-ssr-starter](https://github.com/saltyshiomix/react-ssr-starter)
- [react-ssr-nestjs-starter](https://github.com/saltyshiomix/react-ssr-nestjs-starter)

## Develop `examples/<example-folder-name>`

```bash
$ git clone https://github.com/saltyshiomix/react-ssr.git
$ cd react-ssr
$ yarn
$ yarn dev <example-folder-name>
```

## Articles

[The React View Template Engine for Express](https://dev.to/saltyshiomix/the-react-view-template-engine-for-express-42f0)

[[Express] React as a View Template Engine?](https://dev.to/saltyshiomix/express-react-as-a-view-template-engine-h37)

## How it works

WIP

## Related

[reactjs/express-react-views](https://github.com/reactjs/express-react-views)
