# paulb.pro

Eleventy 3 portfolio. Start with the [site decisions](docs/decisions.md) and the rules in [docs/](docs/). Site copy lives in `content/`.

With Node 22:

```sh
npm ci
npm run dev
```

Open http://localhost:8080. `npm run build:preview` writes `dist/`. Browser checks use Chrome; set `CHROME_PATH` if needed. Reports and screenshots are in `reference/`.

Use the [deploy guide](docs/deploy.md) for checks and publishing. Review everyday changes on the [protected dev preview](https://dev--paulbpro.netlify.app/).
