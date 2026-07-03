# ts-express-mvc-boilerplate

A minimal starting point for building a REST API with **Express**, **TypeScript**, **Mongoose**, and **Zod**, following the MVC pattern (models / controllers / routes). Clone or use as a GitHub template whenever you're starting a new API from scratch.

## What's included

- A working Express server (`src/server.ts`) with `cors` and JSON body parsing already wired up.
- A MongoDB connection helper (`src/dbinit.ts`) that fails fast with a clear error if `MONGODB_URI` is missing.
- `zod` installed and ready to import for request validation.
- A `tsconfig.json` set up for native TypeScript execution via Node's `--experimental-strip-types` (no `ts-node`/`tsx` needed), plus a `tsc` build step for production.
- A `#*` import alias (in `package.json` → `imports`) that resolves to `./src/*.ts` in dev and `./dist/*.js` in the built app, so the same import path works in both.

What's **not** included on purpose: no `models/`, `controllers/`, `routes/`, or `zod/` folders, and no authentication. Every project's resources and auth needs are different, so those get added fresh each time — see [Adding a new resource](#adding-a-new-resource) below.

## Getting started

### 1. Use this repo as a starting point

```sh
git clone https://github.com/JimeBlue/ts-express-mvc-boilerplate.git my-new-api
cd my-new-api
rm -rf .git && git init -b main
```

(Or click "Use this template" on GitHub if this repo is marked as a template.) Update `name` in `package.json` to match your new project.

### 2. Install dependencies

```sh
npm install
```

### 3. Environment

Copy the example env file and fill in your own MongoDB connection string:

```sh
cp .env.example .env
```

```
PORT = 8080
MONGODB_URI = your MongoDB Atlas (or local) connection string
```

### 4. Run

```sh
npm run dev
```

```sh
MongoDB connected successfully: <db-name>
Example app listening on port 8080
```

## Scripts

| Script          | Description                                          |
| ---------------- | ----------------------------------------------------- |
| `npm run dev`   | Runs `src/server.ts` directly with Node, restarts on file changes (`--watch`) |
| `npm run build` | Type-checks and compiles `src/` to `dist/` with `tsc` |
| `npm start`     | Builds, then runs the compiled app from `dist/`       |

## Project structure

```
.
├── .env.example
├── package.json
├── tsconfig.json
└── src/
    ├── server.ts     # express app: middleware, route mounting, listen()
    └── dbinit.ts     # mongoose connection, called once on startup
```

## Adding a new resource

For each resource (e.g. `events`, `students`), add one file per layer, following this order:

1. **Model** — `src/models/<Resource>.ts`: a Mongoose schema + a TypeScript interface describing the document shape, passed as the schema's generic type.
2. **Zod schema** — `src/zod/<resource>Schema.ts`: validates `req.body` before it reaches Mongoose, mirroring the same constraints as the model (required fields, lengths, ranges, etc).
3. **Controller** — `src/controllers/<resource>.ts`: the CRUD functions (`getAll`, `getOne`, `create`, `update`, `delete`), each parsing `req.body` with the Zod schema before writing to the model.
4. **Router** — `src/routes/<resource>.ts`: an `express.Router()` wiring HTTP verbs + paths to the controller functions.
5. Mount the router in `src/server.ts`:

   ```ts
   import <resource> from "#routes/<resource>";
   app.use("/api/v1/<resource>", <resource>);
   ```

## Tech stack

| Area       | Library    |
| ---------- | ---------- |
| Server     | Express 5  |
| Language   | TypeScript |
| Database   | MongoDB + Mongoose |
| Validation | Zod        |
| CORS       | cors       |
