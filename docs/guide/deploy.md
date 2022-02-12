# Deploy your own

If you like this architecture and want to deploy your own, this guide is for you!
You mostly to 3 things:

- A tiny frontend api to deploy your bundle to.

- A tiny frontend of your own to deploy to that api.

- The `contract` npm package to publish to an npm registry to consume your tiny frontend at runtime.

:::warning
This section will make much more sense if you have read the [Architecture](architecture.md) one before!
:::

## Deploying the tiny frontend Cloudflare api

This is where your tiny frontend bundles will be deployed to.

1. If you don't have one already, [setup a Cloudflare account](https://workers.cloudflare.com/).

2. Fork the [tiny frontend api cloudflare](https://github.com/tiny-frontend/api-cloudflare) repository on GitHub.

3. Enable GitHub actions for your forked repo under the `Actions` tab.

4. Add two new secrets in your forked [GitHub repository secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository):
   - `CF_ACCOUNT_ID` you can find it in the [workers section of your Cloudflare dashboard](https://dash.cloudflare.com/?to=/:account/workers/overview). 

   - `CF_API_TOKEN` you can create one in your [Cloudflare profile settings](https://dash.cloudflare.com/profile/api-tokens):
       - Select `Create Token`.
       - Next to `Edit Cloudflare Workers` click `Use template`.
       - Under `Account Resources` select the account you want to deploy the API to.
       - Under `Zone Resources` select `All zones from an account` and the account you want to deploy the API to.
       - Continue to summary and finally click `Create Token`.

5. Clone your forked GitHub repository locally.

6. [Create a KV namespace](https://dash.cloudflare.com/?to=/:account/workers/kv/namespaces) in Cloudflare to deploy your tiny frontends to, the name doesn't matter.

7. Edit `wrangler.toml` and set the `TinyFrontendKv` `id` value to the `KV namespace` you've created above.
   (You can ignore the `preview_id` for now.)

8. Commit and push your changes to `main`, this will trigger the `Deploy Cloudflare Worker` GitHub action.

You should see the worker appear in your [Cloudflare workers dashboard](https://dash.cloudflare.com/?to=/:account/workers/overview), along with its URL 🎉 .

## Deploying the example tiny frontend

This is your actual tiny frontend you will deploy to the tiny frontend api above.

### Setting up the repository

1. Fork the [tiny frontend example](https://github.com/tiny-frontend/example-tiny-frontend) repository on GitHub.

3. Enable GitHub actions for your forked repo under the `Actions` tab.

4. Add three new secrets in your forked [GitHub repository secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository):
  - `CF_ACCOUNT_ID` you can find it in the [workers section of your Cloudflare dashboard](https://dash.cloudflare.com/?to=/:account/workers/overview).

  - `CF_API_TOKEN` this can be the same as the one created for the tiny frontend Cloudflare api above.
If you don't have it anymore, you can follow the same steps again to create a new one.

  - `CF_KV_NAMESPACE_TINY_FRONTEND` set it to the id of the KV namespace you created before.

4. Clone your forked GitHub repository locally.

:::tip
In the future, I'd like to have some kind of generator for this step instead of relying on forking the example.
:::

### Making changes to the tiny frontend

Sure, my example component is ✨ Amazing ✨, but you probably want something different.

#### Running it locally

To let you work on your tiny frontend independently of any host, you can use the included [vite](https://vitejs.dev/) dev server:

```bash
cd app
npm run dev
```

This starts a small dev server on [http://localhost:3000](http://localhost:3000) with `app/index.html` and `app/src/main.tsx`.

#### Changing the props

In `contract/src/props.ts`, change `ExampleTinyFrontendProps` to whichever props your component will need.

Then change the dev app in `app/src/App.tsx` to pass the required props.

:::warning
Changing props is usually a breaking change.

**If you have already published a version** of your `contract`, you should also update the version of your tiny frontend in `contract/package.json`.

This will ensure your new `app` with breaking changes doesn't get pulled by consumers of the current contract, who might not be compatible at runtime with your change. 
:::

#### Changing the implementation

In `app/lib/index.tsx`, you can change the implementation of your component.

#### Deploying the `app`

Once you're happy with your frontend, simply commit and push.
This should trigger the `Deploy Tiny Frontend` GitHub action, and deploy your frontend to your tiny api for your `contract` version.

### Consuming the `contract` locally

If you don't want to publish the `contract` npm package to a npm repository to try it out, you can consume it locally using [yalc](https://www.npmjs.com/package/yalc).

First, "publish" your `contract` on your machine:

```bash
cd contract
npm run build
npx yalc publish
```

:::tip
This won't publish it online, only locally on your computer!
:::

Create an example Remix app, or [clone the example host remix one](https://github.com/tiny-frontend/example-host-remix-node).

Install your local `contract` package:

```bash
cd my-remix-app
npx yalc add @tiny-frontend/example-tiny-frontend-contract
npm i
```

You can now [use your tiny frontend](architecture.md#example-remix-host) in your Remix app by **pointing to your deployed tiny api**:

```ts
// ⚠️ Notice the `/api` at the end of that URL!
loadExampleTinyFrontendClient("https://YOUR-CLOUDFLARE-WORKER.workers.dev/api")
```

### Publishing the `contract`

The `contract` can be deployed like any regular npm package.

The example tiny frontend include a `Publish` GitHub action that publishes to the public npm repository when you create a GitHub release.

Checkout [GitHub actions documentation](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages) on how to publish to other npm repositories.
