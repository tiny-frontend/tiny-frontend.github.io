# Architecture

## Overview

Here is a diagram of the general architecture:

![General architecture diagram](/images/docs/General-Architecture.jpg)

Boxes with pink borders are their own GitHub repositories.

There are basically 4 of them:

- [example tiny frontend](https://github.com/tiny-frontend/example-tiny-frontend): A simple micro frontend
- [api-cloudflare](https://github.com/tiny-frontend/api-cloudflare): an API using Cloudflare Workers where the latest bundled for that micro frontend is deployed
- [example-host-remix-node](https://github.com/tiny-frontend/example-host-remix-node): An example Remix app consuming that micro frontend
- [tiny-client](https://github.com/tiny-frontend/tiny-client): A small library to consume the micro frontend at runtime

