# MIT Climate Risk Map Web Service

## Configure and setup

Install [rust and cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html), [sqlx-cli](https://github.com/launchbadge/sqlx/tree/HEAD/sqlx-cli).

```
curl https://sh.rustup.rs -sSf | sh
cargo install sqlx-cli
```

Install docker, then run the script to create the database, replacing the placeholder values with your preferred username, password, database name, port, and host.

```
DATABASE_USER=username DATABASE_PASSWORD=password DATABASE_NAME=database DATABASE_PORT=5432 DATABASE_HOST=localhost ./init_db.sh
```

> [!NOTE]
> If you get an error `psql: error: connection to server at "localhost" (::1), port 5432 failed: FATAL:  role "username" does not exist` it means you are likely running postgres already on your local machine (not in docker) and that postgres instance is interrupting your connection to the docker one. Simply shut down your local postgres service via `brew services stop postgresql@17` (replace 17 with the version you are running).

Copy `.env.template` to `.env` and replace values with your own, or set them as environment variables. Use the same database credentials for `DATABASE_URL` that you used for `./init_db.sh`.

Environment variables overwrite anything in the `.env` file. The `.env` file is an optional convenience mostly for dev builds.

`sqlx migrate run` to run a new migration.

## Build and run

`cargo run` to run a dev build

`cargo run --release` to run a release build
