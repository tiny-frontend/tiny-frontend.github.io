import{r as a,o as i,c as d,a as e,b as n,w as l,F as c,d as s,e as t}from"./app.ee617076.js";import{_ as h}from"./plugin-vue_export-helper.21dcd24c.js";var p="/images/docs/general-architecture.jpg",u="/images/docs/consume-tiny-fe-meme.jpg";const _={},m=s('<h1 id="architecture" tabindex="-1"><a class="header-anchor" href="#architecture" aria-hidden="true">#</a> Architecture</h1><h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h2><p>Here is a diagram of the general architecture:</p><p><img src="'+p+'" alt="General architecture diagram"></p><p>Each pink box is a GitHub repository. There are four of them:</p>',5),f={href:"https://github.com/tiny-frontend/example-tiny-frontend",target:"_blank",rel:"noopener noreferrer"},y=t("example tiny frontend"),b=t(": A simple micro frontend to be deployed and consumed"),g={href:"https://github.com/tiny-frontend/api-cloudflare",target:"_blank",rel:"noopener noreferrer"},w=t("api-cloudflare"),x=t(": an API using Cloudflare Workers where the latest bundle for that micro frontend is deployed"),v=t("Example host: "),k={href:"https://github.com/tiny-frontend/example-host-remix-node",target:"_blank",rel:"noopener noreferrer"},T=t("example-host-remix-node"),S=t(": An example Remix app consuming that micro frontend"),R={href:"https://github.com/tiny-frontend/example-host-nextjs",target:"_blank",rel:"noopener noreferrer"},C=t("example-host-nextjs"),j=t(": An example Next.js app consuming that micro frontend"),F={href:"https://github.com/tiny-frontend/tiny-client",target:"_blank",rel:"noopener noreferrer"},I=t("tiny-client"),L=t(": A small library to consume the micro frontend at runtime"),E=s('<h2 id="example-tiny-frontend" tabindex="-1"><a class="header-anchor" href="#example-tiny-frontend" aria-hidden="true">#</a> Example Tiny Frontend</h2><p>This is the code of the micro frontend you want to use in a host app. It has two folders:</p><ul><li><code>app</code></li><li><code>contract</code></li></ul><h3 id="app" tabindex="-1"><a class="header-anchor" href="#app" aria-hidden="true">#</a> <code>app</code></h3><p>The app is the source of the component you want to expose. In this case it exposes a component called <code>ExampleTinyFrontend</code>.</p>',5),N=t("It's bundled as a JavaScript "),W=e("code",null,"UMD",-1),A=t(" bundle, and a CSS bundle using "),P={href:"https://vitejs.dev/guide/build.html#library-mode",target:"_blank",rel:"noopener noreferrer"},q=t("Vite library mode"),M=t(". "),O=e("code",null,"React",-1),B=t(" is marked as external for the build. It will be provided by the host."),D=s('<p>Both bundles are then deployed to the Api Cloudflare to be consumed by the host.</p><h3 id="contract" tabindex="-1"><a class="header-anchor" href="#contract" aria-hidden="true">#</a> <code>contract</code></h3><p>The contract is a regular npm package. It contains:</p><ul><li>The TypeScript type for <code>ExampleTinyFrontend</code></li><li>Two functions to consume the latest deployed <code>app</code> at runtime: <ul><li><code>loadExampleTinyFrontendServer</code> to be used on SSR</li><li><code>loadExampleTinyFrontendClient</code> to be used client side</li></ul></li><li>Peer dependencies (in this case <code>React</code>)</li></ul><p>This package will pull the latest deployed <code>app</code> bundle at runtime from the <code>api</code>.</p><h2 id="api-cloudflare" tabindex="-1"><a class="header-anchor" href="#api-cloudflare" aria-hidden="true">#</a> Api Cloudflare</h2>',6),V=t("This is an example implementation of a tiny frontend api using "),U={href:"https://workers.cloudflare.com/",target:"_blank",rel:"noopener noreferrer"},H=t("Cloudflare Workers"),J=t(" and "),Y={href:"https://www.cloudflare.com/products/workers-kv/",target:"_blank",rel:"noopener noreferrer"},G=t("KV"),K=t("."),X=s(`<p>The repository has two folders:</p><ul><li><code>api</code></li><li><code>deploy</code></li></ul><h3 id="api" tabindex="-1"><a class="header-anchor" href="#api" aria-hidden="true">#</a> <code>api</code></h3><p>A tiny frontend api must have the two following endpoints:</p><ul><li><code>/tiny/latest/{tinyFrontendName}/{contractVersion}</code> should respond with:</li></ul><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;umdBundle&quot;</span><span class="token operator">:</span> <span class="token string">&quot;tinyFrontend-umd-bundle-name.js&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;cssBundle&quot;</span><span class="token operator">:</span> <span class="token string">&quot;tinyFrontend-css-bundle-name.css&quot;</span> <span class="token comment">// Optional</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><ul><li><code>/tiny/bundle/{bundleName}</code> should respond with the source of the bundle with <code>bundleName</code>.</li></ul><p>In the case of this Cloudflare implementation, we use KV to store the source of the latest bundles and serves them at runtime.</p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>You could write this API with whatever stack you want. As long as you have the correct endpoints, and a way of deploying bundles to it, it would work.</p></div><h3 id="deploy" tabindex="-1"><a class="header-anchor" href="#deploy" aria-hidden="true">#</a> <code>deploy</code></h3>`,10),z=t("A simple npm package that can be used to deploy a bundle to "),Q=e("code",null,"api",-1),Z=t(". It's used by the "),$={href:"https://github.com/tiny-frontend/example-tiny-frontend/blob/main/app/deploy/deploy.js#L19",target:"_blank",rel:"noopener noreferrer"},ee=t("Example Tiny Frontend "),te=e("code",null,"app",-1),ne=t(" to deploy its bundle."),oe=s(`<p>It exposes the following function:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">deployBundle</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  cloudflare<span class="token punctuation">,</span> <span class="token comment">// Cloudflare credentials</span>
  name<span class="token punctuation">,</span> <span class="token comment">// Name of the tiny frontend to deploy</span>
  contractVersion<span class="token punctuation">,</span> <span class="token comment">// Version of the contract to deploy for</span>
  umdBundlePath<span class="token punctuation">,</span> <span class="token comment">// Path of the JS UMD bundle on disk</span>
  cssBundlePath<span class="token punctuation">,</span> <span class="token comment">// Path of the CSS bundle on disk</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div>`,2),se=t("When you call this method it uses the "),ae={href:"https://api.cloudflare.com/#workers-kv-namespace-write-key-value-pair",target:"_blank",rel:"noopener noreferrer"},re=t("Cloudflare API"),ie=t(" to push the JS UMD and CSS bundles source to KV."),de=s('<h2 id="tiny-client" tabindex="-1"><a class="header-anchor" href="#tiny-client" aria-hidden="true">#</a> Tiny Client</h2><p>This is where the magic happens \u2728 ! This package can fetch and evaluate a tiny frontend at runtime either client or server side.</p><p>The <strong>main steps</strong> it always follows are:</p><ul><li>Call a <code>tiny-api</code> to fetch the name of the latest UMD and CSS bundles.</li><li>Fetch the latest UMD JS bundle source.</li><li>Evaluate the UMD bundle source while providing dependencies to it.</li><li>Return a reference to the component(s) exported by the UMD JS bundle.</li></ul><h3 id="client-side-only" tabindex="-1"><a class="header-anchor" href="#client-side-only" aria-hidden="true">#</a> Client side only</h3><p>The <strong>main steps</strong> above will happen first. Then, if there is a CSS bundle, it will create a <code>link</code> to that CSS file.</p><h3 id="server-side-ssr-with-client-side-rehydration" tabindex="-1"><a class="header-anchor" href="#server-side-ssr-with-client-side-rehydration" aria-hidden="true">#</a> Server side (SSR) with client side rehydration</h3><p>The server side loading function executes the <strong>main steps</strong> above.</p><p>It also returns a piece of HTML to be added to the SSR result. This piece of HTML will:</p><ul><li>Add a <code>link preload</code> to the UMD JS bundle.</li><li>Add a <code>link</code> to the CSS bundle.</li><li>Expose the config fetched from the <code>tiny-api</code> on window to make sure both client and server will use the same bundle.</li></ul><p>Once on the client side, before calling <code>ReactDOM.hydrate</code>, you need to call <code>loadTinyFrontendClient</code>. This will load and evaluate the UMD bundle based on the config exposed on window.</p><p>Then, when <code>React</code> will rehydrate the page, your tiny frontend will already be loaded and the component will get rehydrated \u2728 !</p>',12),le={class:"custom-container warning"},ce=e("p",{class:"custom-container-title"},"WARNING",-1),he=e("p",null,[t("Loading a tiny frontend on server side requires an environment that support runtime JS source evaluation ("),e("code",null,"new Function(source)"),t(").")],-1),pe=t("This is currently "),ue={href:"https://developers.cloudflare.com/workers/runtime-apis/web-standards#javascript-standards",target:"_blank",rel:"noopener noreferrer"},_e=t("not supported on Cloudflare Workers"),me=t(" (for security reason), therefore this won't work if you deploy your host apps to that platform."),fe=e("p",null,"You can however still use the client side only version in that case.",-1),ye=s('<h3 id="cache-and-retry-policy" tabindex="-1"><a class="header-anchor" href="#cache-and-retry-policy" aria-hidden="true">#</a> Cache and Retry Policy</h3><p>Both <code>loadTinyFrontendClient</code> and <code>loadTinyFrontendServer</code> accept some <code>LoadingOptions</code>.</p><h4 id="cachettlinms" tabindex="-1"><a class="header-anchor" href="#cachettlinms" aria-hidden="true">#</a> <code>cacheTtlInMs</code></h4><p>By default, tiny frontend will cache the latest fetched bundle in memory for 2 minutes. This means that for 2 minutes, all calls to <code>loadTinyFrontendClient</code> or <code>loadTinyFrontendServer</code> will return the same bundle even if there is a newer bundle deployed.</p><p>There is a compromise to be had between speed of response, and speed of reflecting changes when new bundle are deployed.</p><p>If you wish to change that behaviour you can pass the <code>cacheTtlInMs</code> loading option to alter it:</p><ul><li>Passing <code>null</code> or <code>undefined</code> will cache for as long as your server is running and never fetch again.</li><li>Passing <code>0</code> will disable the cache (we will fetch the latest configuration for each request)</li><li>Passing any other number <code>X</code> will result in reusing the bundle in memory if it has been fetched less than <code>X</code> milliseconds ago.</li></ul><h4 id="retrypolicy" tabindex="-1"><a class="header-anchor" href="#retrypolicy" aria-hidden="true">#</a> <code>retryPolicy</code></h4><p>By default, tiny frontend won&#39;t retry if there is an error fetching either the name of the latest bundle from the API or its content, and just throw.</p><p>If you want tiny frontend to automatically retry in case of errors, you can pass <code>retryPolicy</code> to the loading options:</p><ul><li><code>retryPolicy.maxRetries</code> maximum number of retries after the first failure (defaults to <code>0</code>).</li><li><code>retryPolicy.delayInMs</code> delay between each retries in milliseconds. The delay will be doubled between each tried. For example for a delay of <code>100ms</code> and <code>3 retries</code>, it will do: <ul><li>Try once, <strong>fails</strong>. <em>Wait 100ms.</em></li><li>First retry, <strong>fails</strong>. <em>Wait 200ms</em></li><li>Second retry, <strong>fails</strong>. <em>Wait 400ms</em></li><li>Third retry, <strong>fails</strong>. <em>Give up and throw error.</em></li></ul></li></ul><h2 id="example-hosts" tabindex="-1"><a class="header-anchor" href="#example-hosts" aria-hidden="true">#</a> Example Hosts</h2><p>There are two example hosts:</p>',13),be=t("A "),ge={href:"https://github.com/tiny-frontend/example-host-remix-node",target:"_blank",rel:"noopener noreferrer"},we=t("Remix app"),xe=t(" deployed on "),ve={href:"https://fly.io/",target:"_blank",rel:"noopener noreferrer"},ke=t("Fly.io"),Te=t("A "),Se={href:"https://github.com/tiny-frontend/example-host-nextjs",target:"_blank",rel:"noopener noreferrer"},Re=t("Next.js app"),Ce=t(" deployed on "),je={href:"https://vercel.com/",target:"_blank",rel:"noopener noreferrer"},Fe=t("Vercel"),Ie=s('<p>They both have the Example Tiny Frontend <code>contract</code> as an npm dependency.</p><p>As everything is better explained with a meme:</p><p style="text-align:center;"><img alt="" src="'+u+'" width="450"></p><h3 id="remix" tabindex="-1"><a class="header-anchor" href="#remix" aria-hidden="true">#</a> Remix</h3><h4 id="client-side-only-1" tabindex="-1"><a class="header-anchor" href="#client-side-only-1" aria-hidden="true">#</a> Client side only</h4>',5),Le=t("To consume the example tiny frontend on client side, "),Ee={href:"https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/routes/client-side-only.tsx#L25",target:"_blank",rel:"noopener noreferrer"},Ne=t("we simply load it in a "),We=e("code",null,"useEffect",-1),Ae=t(" by calling "),Pe=e("code",null,"loadExampleTinyFrontendClient",-1),qe=t(" and passing the URL of our "),Me=e("code",null,"tiny-api",-1),Oe=t("."),Be=s('<p>While the tiny frontend is loading, we show a <code>Loading...</code> label.</p><p>When the tiny frontend is loaded, we set the component we receive in a <code>useState</code>. We then simply renders it like any other <code>React</code> component \u{1F430} .</p><h4 id="server-side-ssr-with-client-side-rehydration-1" tabindex="-1"><a class="header-anchor" href="#server-side-ssr-with-client-side-rehydration-1" aria-hidden="true">#</a> Server side (SSR) with client side rehydration</h4><p>This is a bit more involved, but still rather straightforward.</p><h5 id="on-the-server" tabindex="-1"><a class="header-anchor" href="#on-the-server" aria-hidden="true">#</a> On the server</h5>',5),De=t("In "),Ve={href:"https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/entry.server.tsx#L13",target:"_blank",rel:"noopener noreferrer"},Ue=e("code",null,"entry.server.ts",-1),He=t(" we load the tiny frontend"),Je=t(" by calling "),Ye=e("code",null,"loadExampleTinyFrontendServer",-1),Ge=t(" before rendering happens."),Ke=t("We then "),Xe={href:"https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/routes/ssr.tsx#L10",target:"_blank",rel:"noopener noreferrer"},ze=t("use the server side loaded component in our Remix route"),Qe=t("."),Ze=t("In "),$e={href:"https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/root.tsx#L32",target:"_blank",rel:"noopener noreferrer"},et=e("code",null,"root.ts",-1),tt=t(" while on server we add a "),nt=e("code",null,"__TINY_FRONTEND_SSR__",-1),ot=t(" label. (It's a similar approach taken for "),st={href:"https://remix.run/docs/en/v1/guides/styling#css-in-js-libraries",target:"_blank",rel:"noopener noreferrer"},at=t("Styled Components with Remix"),rt=t(".)"),it=t("Finally, once we rendered, "),dt={href:"https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/entry.server.tsx#L24",target:"_blank",rel:"noopener noreferrer"},lt=t("we replace "),ct=e("code",null,"__TINY_FRONTEND_SSR__",-1),ht=t(" in the output HTML string with whatever was returned by "),pt=e("code",null,"loadExampleTinyFrontendServer",-1),ut=t("."),_t=e("p",null,"Our Remix app is now loading that tiny frontend on the server and rendering it \u2728! Let's see what we need to add to be able to rehydrate.",-1),mt=e("h5",{id:"on-the-client",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#on-the-client","aria-hidden":"true"},"#"),t(" On the client")],-1),ft=t("In "),yt={href:"https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/entry.client.tsx#L6",target:"_blank",rel:"noopener noreferrer"},bt=e("code",null,"entry.client.ts",-1),gt=t(" we load the tiny frontend"),wt=t(" by calling "),xt=e("code",null,"loadExampleTinyFrontendClient",-1),vt=t(" before rehydration."),kt=t("We then "),Tt={href:"https://github.com/tiny-frontend/example-host-remix-node/blob/main/app/routes/ssr.tsx#L10",target:"_blank",rel:"noopener noreferrer"},St=t("use the client side loaded component in our Remix route"),Rt=t("."),Ct=e("p",null,[t("And... That's it, we now have "),e("strong",null,"fully working, independently deployed frontend component, with SSR and rehydration"),t(" \u{1F631} !")],-1),jt=e("h3",{id:"next-js",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#next-js","aria-hidden":"true"},"#"),t(" Next.js")],-1),Ft=e("h4",{id:"client-side-only-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#client-side-only-2","aria-hidden":"true"},"#"),t(" Client side only")],-1),It=t("To consume the example tiny frontend on client side, "),Lt={href:"https://github.com/tiny-frontend/example-host-nextjs/blob/main/pages/client-side-only.tsx#L27",target:"_blank",rel:"noopener noreferrer"},Et=t("we simply load it in a "),Nt=e("code",null,"useEffect",-1),Wt=t(" by calling "),At=e("code",null,"loadExampleTinyFrontendClient",-1),Pt=t(" and passing the URL of our "),qt=e("code",null,"tiny-api",-1),Mt=t("."),Ot=s('<p>While the tiny frontend is loading, we show a <code>Loading...</code> label.</p><p>When the tiny frontend is loaded, we set the component we receive in a <code>useState</code>. We then simply renders it like any other <code>React</code> component \u{1F430} .</p><h4 id="server-side-ssr-with-client-side-rehydration-2" tabindex="-1"><a class="header-anchor" href="#server-side-ssr-with-client-side-rehydration-2" aria-hidden="true">#</a> Server side (SSR) with client side rehydration</h4><p>This is a bit more involved, but still rather straightforward.</p><h5 id="on-the-server-1" tabindex="-1"><a class="header-anchor" href="#on-the-server-1" aria-hidden="true">#</a> On the server</h5>',5),Bt=t("In "),Dt={href:"https://github.com/tiny-frontend/example-host-nextjs/blob/main/pages/_document.tsx#L61",target:"_blank",rel:"noopener noreferrer"},Vt=e("code",null,"_document.ts",-1),Ut=t(" we load the tiny frontend"),Ht=t(" by calling "),Jt=e("code",null,"loadExampleTinyFrontendServer",-1),Yt=t(" before rendering happens. We also inject the JS and CSS script tags for the Tiny Frontend "),Gt={href:"https://github.com/tiny-frontend/example-host-nextjs/blob/main/pages/_document.tsx#L28",target:"_blank",rel:"noopener noreferrer"},Kt=t("in the document head"),Xt=t("."),zt=t("We then "),Qt={href:"https://github.com/tiny-frontend/example-host-nextjs/blob/main/pages/ssr.tsx#L11",target:"_blank",rel:"noopener noreferrer"},Zt=t("use the server side loaded component in our Next.js page"),$t=t("."),en=e("p",null,"Our Next.js app is now loading that tiny frontend on the server and rendering it \u2728! Let's see what we need to add to be able to rehydrate.",-1),tn=e("h5",{id:"on-the-client-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#on-the-client-1","aria-hidden":"true"},"#"),t(" On the client")],-1),nn=t("We create "),on={href:"https://github.com/tiny-frontend/example-host-nextjs/blob/main/components/ExampleTinyFrontend/ExampleTinyFrontend.client.tsx#L9",target:"_blank",rel:"noopener noreferrer"},sn=t("a client side version of our component"),an=t(" that can load itself on the client and suppresses hydration warnings using the "),rn={href:"https://github.com/tiny-frontend/tiny-client-react/blob/main/src/withHydrationSuppress.tsx#L16",target:"_blank",rel:"noopener noreferrer"},dn=e("code",null,"withHydrationSuppress",-1),ln=t(" HOC"),cn=t(". This uses the same technique as "),hn={href:"https://www.npmjs.com/package/react-lazy-hydration",target:"_blank",rel:"noopener noreferrer"},pn=t("react-lazy-hydration"),un=t("."),_n=t("We then "),mn={href:"https://github.com/tiny-frontend/example-host-nextjs/blob/main/pages/ssr.tsx#L11",target:"_blank",rel:"noopener noreferrer"},fn=t("use the client side component in our Next.js page"),yn=t(" when the Server side component is undefined."),bn=s('<p>And... That&#39;s it, we now have <strong>fully working, independently deployed frontend component, with SSR and rehydration</strong> \u{1F631} !</p><h2 id="current-known-limitations" tabindex="-1"><a class="header-anchor" href="#current-known-limitations" aria-hidden="true">#</a> Current known limitations</h2><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>Below is a list of limitations <strong>I&#39;m currently aware of</strong> with the example hosts. Contributions are welcome to help solve them, or to add new limitations to the list \u{1F609} .</p></div><h4 id="\u{1F501}-the-tiny-frontend-is-loaded-on-every-request" tabindex="-1"><a class="header-anchor" href="#\u{1F501}-the-tiny-frontend-is-loaded-on-every-request" aria-hidden="true">#</a> \u{1F501}\xA0\xA0The tiny frontend is loaded on every request</h4><p>This one is easily overcome. You could implement a simple server side cache, and refresh the tiny frontend in the background every <code>X</code> minutes for example. We just haven&#39;t done it in this example.</p><h4 id="\u{1F5D1}-the-tiny-frontend-is-loaded-for-every-route-no-matter-if-it-used-or-not" tabindex="-1"><a class="header-anchor" href="#\u{1F5D1}-the-tiny-frontend-is-loaded-for-every-route-no-matter-if-it-used-or-not" aria-hidden="true">#</a> \u{1F5D1}\xA0\xA0The tiny frontend is loaded for every route, no matter if it used or not</h4><p>This could potentially be fixed with a more involved implementation. We could for example imagine &quot;collecting&quot; rendered components on server on a route, and only loading those before client rehydration.</p><p>However, that solution probably would require some new hooks in Remix or Next.js, for example async client side route transitions guards.</p>',8),gn={class:"custom-container tip"},wn=e("p",{class:"custom-container-title"},"TIP",-1),xn=t("This could also be solved using "),vn={href:"https://github.com/reactwg/react-18/discussions/37",target:"_blank",rel:"noopener noreferrer"},kn=t("Suspense for data fetching on SSR"),Tn=t(" in React 18, as a tiny frontend could be loaded as part of a Suspense boundary when a given route is rendered."),Sn=e("h4",{id:"\u{1F4BF}-the-tiny-frontend-can-t-load-its-own-data-before-ssr",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#\u{1F4BF}-the-tiny-frontend-can-t-load-its-own-data-before-ssr","aria-hidden":"true"},"#"),t(" \u{1F4BF}\xA0\xA0The tiny frontend can't load its own data before SSR")],-1),Rn=e("p",null,"The tiny frontend might be able to provide some kind of data loader, but again this might require some hooks in Remix or Next.js to call them at the right time.",-1),Cn={class:"custom-container tip"},jn=e("p",{class:"custom-container-title"},"TIP",-1),Fn=t("Once again "),In={href:"https://github.com/reactwg/react-18/discussions/37",target:"_blank",rel:"noopener noreferrer"},Ln=t("Suspense for data fetching on SSR"),En=t(" in React 18 could save us here, as a tiny frontend could use its own Suspense boundary to load its data when it's rendered."),Nn=e("h4",{id:"\u{1F68F}-the-tiny-frontend-can-t-declare-its-own-routes",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#\u{1F68F}-the-tiny-frontend-can-t-declare-its-own-routes","aria-hidden":"true"},"#"),t(" \u{1F68F}\xA0\xA0The tiny frontend can't declare its own routes")],-1),Wn=t("As stated in the: "),An=t("what tiny frontend isn't"),Pn=t(" section, this is not something this approach is trying to solve at the moment."),qn=e("h4",{id:"\u26C5\uFE0F-ssr-doesn-t-work-in-cloudflare-workers",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#\u26C5\uFE0F-ssr-doesn-t-work-in-cloudflare-workers","aria-hidden":"true"},"#"),t(" \u26C5\uFE0F\xA0\xA0SSR doesn't work in Cloudflare Workers")],-1),Mn=t("Sadly, Clouflare Workers doesn't provide "),On={href:"https://developers.cloudflare.com/workers/runtime-apis/web-standards#javascript-standards",target:"_blank",rel:"noopener noreferrer"},Bn=t("any way of loading JS dynamically at runtime"),Dn=t(". This means this approach won't work in that environment for SSR \u{1F622} .");function Vn(Un,Hn){const o=a("ExternalLinkIcon"),r=a("RouterLink");return i(),d(c,null,[m,e("ul",null,[e("li",null,[e("a",f,[y,n(o)]),b]),e("li",null,[e("a",g,[w,n(o)]),x]),e("li",null,[v,e("ul",null,[e("li",null,[e("a",k,[T,n(o)]),S]),e("li",null,[e("a",R,[C,n(o)]),j])])]),e("li",null,[e("a",F,[I,n(o)]),L])]),E,e("p",null,[N,W,A,e("a",P,[q,n(o)]),M,O,B]),D,e("p",null,[V,e("a",U,[H,n(o)]),J,e("a",Y,[G,n(o)]),K]),X,e("p",null,[z,Q,Z,e("a",$,[ee,te,n(o)]),ne]),oe,e("p",null,[se,e("a",ae,[re,n(o)]),ie]),de,e("div",le,[ce,he,e("p",null,[pe,e("a",ue,[_e,n(o)]),me]),fe]),ye,e("ul",null,[e("li",null,[be,e("a",ge,[we,n(o)]),xe,e("a",ve,[ke,n(o)])]),e("li",null,[Te,e("a",Se,[Re,n(o)]),Ce,e("a",je,[Fe,n(o)])])]),Ie,e("p",null,[Le,e("a",Ee,[Ne,We,n(o)]),Ae,Pe,qe,Me,Oe]),Be,e("p",null,[De,e("a",Ve,[Ue,He,n(o)]),Je,Ye,Ge]),e("p",null,[Ke,e("a",Xe,[ze,n(o)]),Qe]),e("p",null,[Ze,e("a",$e,[et,tt,nt,n(o)]),ot,e("a",st,[at,n(o)]),rt]),e("p",null,[it,e("a",dt,[lt,ct,n(o)]),ht,pt,ut]),_t,mt,e("p",null,[ft,e("a",yt,[bt,gt,n(o)]),wt,xt,vt]),e("p",null,[kt,e("a",Tt,[St,n(o)]),Rt]),Ct,jt,Ft,e("p",null,[It,e("a",Lt,[Et,Nt,n(o)]),Wt,At,Pt,qt,Mt]),Ot,e("p",null,[Bt,e("a",Dt,[Vt,Ut,n(o)]),Ht,Jt,Yt,e("a",Gt,[Kt,n(o)]),Xt]),e("p",null,[zt,e("a",Qt,[Zt,n(o)]),$t]),en,tn,e("p",null,[nn,e("a",on,[sn,n(o)]),an,e("a",rn,[dn,ln,n(o)]),cn,e("a",hn,[pn,n(o)]),un]),e("p",null,[_n,e("a",mn,[fn,n(o)]),yn]),bn,e("div",gn,[wn,e("p",null,[xn,e("a",vn,[kn,n(o)]),Tn])]),Sn,Rn,e("div",Cn,[jn,e("p",null,[Fn,e("a",In,[Ln,n(o)]),En])]),Nn,e("p",null,[Wn,n(r,{to:"/guide/about.html#%F0%9F%99%85%E2%80%8D-what-tiny-frontend-isn-t"},{default:l(()=>[An]),_:1}),Pn]),qn,e("p",null,[Mn,e("a",On,[Bn,n(o)]),Dn])],64)}var Gn=h(_,[["render",Vn]]);export{Gn as default};