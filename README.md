# Punchline

![Punchline — fresh jokes, one punchline at a time](public/og-image.png)

## About

Punchline serves up one joke at a time, with text-to-speech, endless random navigation, and a lightweight admin
mode (behind Cognito auth) for adding and editing jokes. It's a static Next.js site backed by
[jokes-api](https://github.com/davidbowland/jokes-api) and deployed to S3 + CloudFront via AWS SAM.

Site: [jokes.dbowland.com](https://jokes.dbowland.com/)

## Tech Stack

- [Next.js](https://nextjs.org/) (Pages Router, static export) + [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) v4 with a custom design system (`src/assets/css/index.css`)
- [TanStack Query](https://tanstack.com/query/latest) for data fetching/caching
- [AWS Amplify](https://aws.amazon.com/amplify/) for Cognito authentication
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) via [Fontsource](https://fontsource.org/)
- AWS SAM + S3 + CloudFront for hosting

## Local Development

### Prerequisites

1. [Node.js](https://nodejs.org/en/) (see `engines` in `package.json` for the required version)
2. [npm](https://www.npmjs.com/)

### Getting Started

Install dependencies and start the dev server, which hot-reloads as source files change:

```bash
npm install
npm start
```

Then view the site at <http://localhost:3000/>.

To build and serve the static production output locally instead:

```bash
npm run serve
```

### Testing

Unit tests run via [Jest](https://jestjs.io/) and execute automatically on commit (via Husky + lint-staged) and
in CI. Coverage thresholds are enforced — see `jest.config.ts`.

```bash
npm test
```

### Type Checking & Linting

```bash
npm run typecheck
npm run lint
```

`lint` runs [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) with `--fix`.

## Deployment

Merging to `master` triggers the CI pipeline (`.github/workflows/pipeline.yaml`), which runs the test suite,
builds the static site, and deploys it to production automatically.

To deploy manually (requires the `developer` role and the [AWS SAM CLI](https://aws.amazon.com/serverless/sam/)):

```bash
npm run deploy
```
