# Read Later

A small implementation of a Read Later feature across React Native and React web.

The mobile app is the primary surface and includes the article feed, saved state, and save/unsave interactions. The web app consumes the same shared Read Later behaviour.

## Project structure

    apps/
      mobile/       Expo / React Native app
      web/          React / Vite app
      mock-api/     Local Express API

    packages/
      shared-core/  Shared API client, queries, mutations and types

The web and mobile UIs are separate, while Read Later behaviour is shared through `shared-core`.

## Requirements

- Node.js 22+
- npm
- Xcode / iOS Simulator for running the iOS app

## Install

From the repository root:

    npm install

npm workspaces install dependencies for all apps and packages.

## Run the mock API

    npm run dev --workspace=mock-api

The API runs at:

    http://localhost:3001

Saved articles are persisted locally by the mock API.

## Run mobile

In another terminal:

    npm run ios --workspace=mobile

Alternatively:

    npm run start --workspace=mobile

and press `i` to launch the iOS Simulator.

The mobile app assumes the API is available at `http://localhost:3001`.

> `localhost` works with the iOS Simulator. A physical device would need the API host configured to use the development machine's network address.

## Run web

In another terminal:

    npm run dev --workspace=web

Open the local URL printed by Vite.

The web app uses `http://localhost:3001` by default. It can be overridden with:

    VITE_API_URL=http://your-api-url

## Simulating mutation failures

The mock API can intentionally fail save/unsave requests so optimistic rollback can be tested.

Stop the normal API and run:

    MOCK_FAIL_MUTATIONS=true npm run dev --workspace=mock-api

Then save or remove an article.

The UI updates immediately, the request fails, and the optimistic change is rolled back.

## Main behaviour

- Fetch article feed
- Save and unsave articles
- Persistent Read Later state
- Optimistic save/unsave
- Rollback when mutations fail
- Server reconciliation after mutations
- Shared Read Later behaviour between web and mobile
