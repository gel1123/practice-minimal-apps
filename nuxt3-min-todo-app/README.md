# nuxt3-mini-todo-app

## 備忘録

SST v3のNuxtコンポーネントでAWSにデプロイしようとしたが下記Issueにより断念。

https://github.com/sst/sst/issues/5259

昔やっていたみたいに静的サイトとしてビルドして、サーバーは別途APIを立てるのが妥当かもしれない。

...が、今回は Nuxt3 API Route + Hono RPC を試したかったので、あえてSSR構成のまま残している。

------------------------

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
