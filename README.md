# spriteCloud test automation

[![CI](https://github.com/marynaSosnytska/spritecloud-test-automation/actions/workflows/ci.yml/badge.svg)](https://github.com/marynaSosnytska/spritecloud-test-automation/actions/workflows/ci.yml)

Playwright and TypeScript tests for the saucedemo.com UI and the dummyjson.com API. Latest report: https://marynasosnytska.github.io/spritecloud-test-automation/

The report is published from `main` on every push or manual run, also when tests fail. Every run also uploads the `playwright-report` artifact (kept 14 days). To run other browsers in CI: Actions > CI > Run workflow > browsers.

## Quickstart

Needs Node 24. Copy `.env.example` to `.env` first and fill in `SAUCE_PASSWORD` (shown on the saucedemo login page) and `DUMMYJSON_USERNAME` / `DUMMYJSON_PASSWORD` (any user from https://dummyjson.com/users). Without them the run stops with an error naming the missing variables.

```bash
npm ci
npx playwright install --with-deps
npm test
```

`npm test` runs the `chromium` and `api` projects. Other scripts: `test:chromiumui`, `test:api`, `test:firefoxui`, `test:webkitui`, `test:all`, `report` (open the last HTML report), `lint`, `typecheck`, `format:check`. Filter by tag with `npx playwright test --grep @smoke` (tags: `@ui`, `@api`, `@smoke`, `@negative`).

## Brief items and where they are tested

| Brief item                      | Spec                                                   | Test                                                                                                                 |
| ------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| UI 1: checkout, 2+ items, price | `tests/ui/checkout.spec.ts`                            | user buys two products and pays the right total                                                                      |
| UI 2: sort by name Z-A          | `tests/ui/sorting.spec.ts`                             | user can sort products by name from Z to A                                                                           |
| UI 3: failed login              | `tests/ui/login.spec.ts`                               | user cannot log in with a wrong password; locked out user cannot log in                                              |
| API 1: successful login         | `tests/api/auth.spec.ts`                               | user can log in and use the token they get                                                                           |
| API 2: get a product            | `tests/api/products.spec.ts`                           | product can be fetched by id and its data makes sense                                                                |
| API 3: cart with 3 products     | `tests/api/carts.spec.ts`                              | user can create a cart with 3 products                                                                               |
| API 4: DELETE                   | `tests/api/products.spec.ts`                           | deleted product is returned with a deletion mark                                                                     |
| API 5: two negative scenarios   | `tests/api/auth.spec.ts`, `tests/api/products.spec.ts` | user cannot log in with a wrong password (`/auth/login`); product that does not exist returns 404 (`/products/{id}`) |

## Structure

Specs contain only the scenario and its assertions. Locators live in page objects, HTTP calls in API services, and test data (users, messages, product names, limits) in `src/test-data`. Configuration comes from environment variables, validated at startup.

```
.github/workflows/ci.yml   lint, format, typecheck, tests, report publishing
playwright.config.ts       projects: chromium, firefox, webkit (UI) and api
tests/ui, tests/api        specs
src/pages                  page objects, components/ holds header and product card
src/api                    ApiClient, services/, schemas/, contract.ts, cart-invariants.ts
src/fixtures/index.ts      page objects, API services, customer, login and API session
src/framework/step.ts      @step decorator
src/config/env.ts          environment validation
src/test-data              users, products, messages, tags, customer factory
src/utils                  price (cents math), sort
```

## Why these tools

- `@step` decorator: page object methods become boxed `test.step`s titled "[LoginPage] Log in as standard_user", so the report reads as user actions and a failure points at the spec line.
- Zod schemas as a tolerant reader (as in consumer-driven contract testing): a missing or mistyped field the tests rely on fails the test, fields the API adds are ignored. The schemas were derived from product 1, so `brand` is required there; it is absent for product ids >= 16.
- Fixtures: page objects, API services, the logged-in inventory page, the customer and the API session are injected, so specs have no setup code.
- Faker with a logged seed: the `customer` fixture seeds faker and records the seed in the `faker-seed` annotation of the report, so a failing customer can be regenerated with `faker.seed(<value>)`. The wrong passwords are also random but not taken from that seed.
- Money in cents: prices are parsed to integer cents and tax is `Math.round(itemTotal * 0.08)`, so checkout totals are compared exactly.
- Login fixture instead of `storageState`: `loggedInInventory` logs in through the UI in each test that needs it. Tests stay independent and the login is visible in each trace. `storageState` would be faster but needs a setup project and a shared session file, which is not worth it for 2 logged-in tests.
- Env validation: `src/config/env.ts` parses the variables with zod and throws one error listing every missing or invalid variable. `UI_BASE_URL` and `API_BASE_URL` default to the two sites.

Secrets: `ApiClient` masks `password`, `accessToken`, `refreshToken` and the `Authorization` header in the request and response attachments. Playwright's own step titles and traces are not masked: the saucedemo password shows in step titles, and traces (kept for failed tests) also hold the API requests with their tokens. This is accepted because both sites use public demo credentials; a real project would keep reports private. The credentials still come from `.env` locally and from GitHub secrets in CI, and `.env` is git-ignored.

## Assumptions

| Question                                                                                                                  | Assumption taken                                                                                                          | What changes if the answer differs                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Validate the final price": validate the tax rate, or only total = item total + displayed tax?                            | Both: item total = sum of the prices, tax = 8% of the item total (observed, not specified), total = item total + tax.     | `TAX_RATE` in `src/utils/price.ts`. To drop the rate check, remove the tax assertion in `tests/ui/checkout.spec.ts` and compute the expected total from the displayed tax. |
| dummyjson does not save carts or deletes. Is checking the response contract and its consistency the expected depth?       | Yes: schema plus internal invariants, and the DELETE response compared to a GET of the same product. No read-after-write. | Add read-after-write steps in `tests/api/carts.spec.ts` and `tests/api/products.spec.ts`. They would fail against dummyjson by design, so a different backend is needed.   |
| Should CI run all browsers, or Chromium on push with Firefox and WebKit on demand?                                        | Chromium on push and PR; Firefox and WebKit through the manual run.                                                       | The `browsers` default and the push trigger in `.github/workflows/ci.yml`.                                                                                                 |
| Should the repository be public, or private with a reviewer invited?                                                      | Public.                                                                                                                   | Repository visibility. Pages on a private repo needs a paid plan, so the report link would become the CI artifact.                                                         |

Also assumed:

- "The same user id" (API 3) is the `id` from the login response, taken by the `authSession` fixture.
- The saucedemo credentials are treated as secrets even though they are public: passwords are read from env and are not in the code.

## How to debug

- Failed tests keep a trace, screenshot and video (`retain-on-failure`); CI retries a failed test once. Open the HTML report (`npm run report`, or the Pages link) and use the Trace tab, or run `npx playwright show-trace <trace.zip>` on a file under `test-results/`.
- API tests attach each request and response as JSON (secrets masked), so a failing contract shows the exact body.
- A contract failure lists the offending fields (`Response breaks the contract: ...`).
- Run one test with `npx playwright test -g "sort" --project=chromium --headed`. Use `--debug` instead of `--headed` to step through it.

## Also noticed

- dummyjson `GET /auth/me` returns the user's plaintext password.
- `brand` is absent from products with id >= 16.
- dummyjson rounds the cart `discountedPrice` to whole units, so the discount check uses a tolerance of 1.

## AI usage

Claude Code (Anthropic) was used throughout. It drafted the implementation plan and most of the code, the CI workflow and this README, and reviewed changes with separate agents. Changes were checked by breaking code or data on purpose to confirm the tests fail.

The author chose the tools and the design (each decision was discussed one by one), and reviewed, adjusted and committed every change.
