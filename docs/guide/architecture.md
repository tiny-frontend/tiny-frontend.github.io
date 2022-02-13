# Architecture

## Overview

Here is a diagram of the general architecture:

![General architecture diagram](/images/docs/general-architecture.jpg)

Each pink box is a GitHub repository.
There are four of them:

- [example tiny frontend](https://github.com/tiny-frontend/example-tiny-frontend): A simple micro frontend to be deployed and consumed
- [api-cloudflare](https://github.com/tiny-frontend/api-cloudflare): an API using Cloudflare Workers where the latest bundle for that micro frontend is deployed
- [example-host-remix-node](https://github.com/tiny-frontend/example-host-remix-node): An example Remix app consuming that micro frontend
- [tiny-client](https://github.com/tiny-frontend/tiny-client): A small library to consume the micro frontend at runtime

## Example Tiny Frontend

This is the code of the micro frontend you want to use in a host app.
It has two folders:
- `app`
- `contract`

### `app`

The app is the source of the component you want to expose.
In this case it exposes a component called `ExampleTinyFrontend`.

It's bundled as a JavaScript `UMD` bundle, and a CSS bundle using [Vite library mode](https://vitejs.dev/guide/build.html#library-mode).
`React` is marked as external for the build.
It will be provided by the host.

Both bundles are then deployed to the Api Cloudflare to be consumed by the host.

### `contract`

The contract is a regular npm package.
It contains:

- The TypeScript type for `ExampleTinyFrontend`
- Two functions to consume the latest deployed `app` at runtime:
  - `loadExampleTinyFrontendServer` to be used on SSR
  - `loadExampleTinyFrontendClient` to be used client side
- Peer dependencies (in this case `React`)

This package will pull the latest deployed `app` bundle at runtime from the `api`. 

## Api Cloudflare

This is an example implementation of a tiny frontend api using [Cloudflare Workers](https://workers.cloudflare.com/) and [KV](https://www.cloudflare.com/products/workers-kv/).

The repository has two folders:
- `api`
- `deploy`

### `api`

A tiny frontend api must have the two following endpoints:

- `/tiny/latest/{tinyFrontendName}/{contractVersion}` should respond with:

```json
{
  "umdBundle": "tinyFrontend-umd-bundle-name.js",
  "cssBundle": "tinyFrontend-css-bundle-name.css" // Optional
}
```

- `/tiny/bundle/{bundleName}` should respond with the source of the bundle with `bundleName`.

In the case of this Cloudflare implementation, we use KV to store the source of the latest bundles and serves them at runtime.

:::tip
You could write this API with whatever stack you want.
As long as you have the correct endpoints, and a way of deploying bundles to it, it would work.
:::

### `deploy`

A simple npm package that can be used to deploy a bundle to `api`.
It's used by the [Example Tiny Frontend `app`](https://github.com/tiny-frontend/example-tiny-frontend/blob/main/app/deploy/deploy.js#L19) to deploy its bundle.

It exposes the following function:

```ts
async function deployBundle({
  cloudflare, // Cloudflare credentials
  name, // Name of the tiny frontend to deploy
  contractVersion, // Version of the contract to deploy for
  umdBundlePath, // Path of the JS UMD bundle on disk
  cssBundlePath, // Path of the CSS bundle on disk
}): Promise<void> {
  // ...
};
```

When you call this method it uses the [Cloudflare API](https://api.cloudflare.com/#workers-kv-namespace-write-key-value-pair) to push the JS UMD and CSS bundles source to KV.

## Tiny Client

This is where the magic happens ✨  !
This package can fetch and evaluate a tiny frontend at runtime either client or server side.

The **main steps** it always follows are:

- Call a `tiny-api` to fetch the name of the latest UMD and CSS bundles.
- Fetch the latest UMD JS bundle source.
- Evaluate the UMD bundle source while providing dependencies to it.
- Return a reference to the component(s) exported by the UMD JS bundle.

### Client side only

The **main steps** above will happen first.
Then, if there is a CSS bundle, it will create a `link` to that CSS file.

### Server side (SSR) with client side rehydration

The server side loading function executes the **main steps** above.

It also returns a piece of HTML to be added to the SSR result.
This piece of HTML will:

- Add a `link preload` to the UMD JS bundle.
- Add a `link` to the CSS bundle.
- Expose the config fetched from the `tiny-api` on window to make sure both client and server will use the same bundle.

Once on the client side, before calling `ReactDOM.hydrate`, you need to call `loadTinyFrontendClient`.
This will load and evaluate the UMD bundle based on the config exposed on window.

Then, when `React` will rehydrate the page, your tiny frontend will already be loaded and the component will get rehydrated ✨ !

:::warning
Loading a tiny frontend on server side requires an environment that support runtime JS source evaluation (`new Function(source)`).

This is currently [not supported on Cloudflare Workers](https://developers.cloudflare.com/workers/runtime-apis/web-standards#javascript-standards) (for security reason), therefore this won't work if you deploy your host apps to that platform.

You can however still use the client side only version in that case.
:::

## Example Remix Host

This is just regular Node.js Remix app [deployed on Fly.io](https://fly.io/) that have the Example Tiny Frontend `contract` as an npm dependency.

As everything is better explained with a meme:

<p style="text-align: center">
<img alt="" src="/images/docs/consume-tiny-fe-meme.jpg" width="450" />
</p>

### Client side only

To consume the example tiny frontend on client side, [we simply load it in a `useEffect`](https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/routes/client-side-only.tsx#L25) by calling `loadExampleTinyFrontendClient` and passing the URL of our `tiny-api`.

While the tiny frontend is loading, we show a `Loading...` label.

When the tiny frontend is loaded, we set the component we receive in a `useState`.
We then simply renders it like any other `React` component 🐰 .

### Server side (SSR) with client side rehydration

This is a bit more involved, but still rather straightforward.

#### On the server

In [`entry.server.ts` we load the tiny frontend](https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/entry.server.tsx#L13) by calling `loadExampleTinyFrontendServer` before rendering happens.

We then [use the server side loaded component in our Remix route](https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/routes/ssr.tsx#L10).

In [`root.ts` while on server we add a `__TINY_FRONTEND_SSR__`](https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/root.tsx#L32) label.
(It's a similar approach taken for [Styled Components with Remix](https://remix.run/docs/en/v1/guides/styling#css-in-js-libraries).)

Finally, once we rendered, [we replace `__TINY_FRONTEND_SSR__`](https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/entry.server.tsx#L24) in the output HTML string with whatever was returned by `loadExampleTinyFrontendServer`.

Our Remix app is now loading that tiny frontend on the server and rendering it ✨!
Let's see what we need to add to be able to rehydrate.

#### On the client

In [`entry.client.ts` we load the tiny frontend](https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/entry.client.tsx#L6) by calling `loadExampleTinyFrontendClient` before rehydration.

We then [use the client side loaded component in our Remix route](https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/routes/ssr.tsx#L10).

And... That's it, we now have **fully working, independently deployed frontend component, with SSR and rehydration** 😱 !

## Current known limitations

:::tip
Below is a list of limitations **I'm currently aware of** with the example Remix host.
Contributions are welcome to help solve them, or to add new limitations to the list 😉 .
:::

#### 🔁  The tiny frontend is loaded on every request

This one is easily overcome.
You could implement a simple server side cache, and refresh the tiny frontend in the background every `X` minutes for example.
We just haven't done it in this example.

#### 🗑  The tiny frontend is loaded for every route, no matter if it used or not

This could potentially be fixed with a more involved implementation.
We could for example imagine "collecting" rendered components on server on a route, and only loading those before client rehydration.

However, that solution probably would require some new hooks in Remix, for example async client side route transitions guards.

:::tip
This could also be solved using [Suspense for data fetching on SSR](https://github.com/reactwg/react-18/discussions/37) in React 18,
as a tiny frontend could be loaded as part of a Suspense boundary when a given route is rendered.
:::

#### 💿  The tiny frontend can't load its own data before SSR

The tiny frontend might be able to provide some kind of data loader, but again this might require some hooks in Remix to call them at the right time.

:::tip
Once again [Suspense for data fetching on SSR](https://github.com/reactwg/react-18/discussions/37) in React 18 could save us here,
as a tiny frontend could use its own Suspense boundary to load its data when it's rendered.
:::

#### 🚏  The tiny frontend can't declare its own routes

As stated in the: [what tiny frontend isn't](about.md#🙅‍-what-tiny-frontend-isn-t) section, this is not something this approach is trying to solve at the moment.

#### ⛅️  SSR doesn't work in Cloudflare Workers

Sadly, Clouflare Workers doesn't provide [any way of loading JS dynamically at runtime](https://developers.cloudflare.com/workers/runtime-apis/web-standards#javascript-standards).
This means this approach won't work in that environment for SSR 😢 .
