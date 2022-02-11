# Architecture

## Overview

Here is a diagram of the general architecture:

![General architecture diagram](/images/docs/General-Architecture.jpg)

Each box with pink border is a GitHub repository.
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

In the case of this Cloudflare implementation, I use KV to store the source of the latest bundles and serves them at runtime.

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

Then, when React will rehydrate the page, your tiny frontend will already be loaded and the component will get rehydrated ✨ !

:::warning
Loading a tiny frontend on server side requires an environment that support runtime JS source evaluation (`new Function(source)`).

This is currently [not supported on Cloudflare Workers](https://developers.cloudflare.com/workers/runtime-apis/web-standards#javascript-standards) (for security reason), therefore this won't work if you deploy your app to that platform.

You can however still use the client side only version in that case.
:::
