# D&D&D (Dungeons and Dragons and Databases)

## How to setup

### Pre-requisites

- Install [Docker](https://docs.docker.com/get-started/get-docker/) or compatible tools
- Install [MySQL Client Tools](https://dev.mysql.com/doc/refman/8.4/en/mysql.html)

### Setup `.env`

Copy `.env.example` into `.env`. Update all `changeme` values to appropriate values. In develop any value suffices.

### Launch the development server

```bash
docker compose up -d
```

Alternatively:
```bash
npm install
npm run dev
```

### Load the sample data

```bash
mysql -u [username] -p -h localhost -P 3306 --skip-ssl [database name]
```

Type in the password you configure earlier when prompted.

When prompted run the following MySQL file:

```mysql
SOURCE db/fixtures/load_sample.sql;
quit
```

### Access the application

Go to http://localhost:3000 to access your platform.

## Supported Features

R6. Users creating an account and logging in/out


R7. Users viewing a list of their created characters

R9. Users changing skills for their created characters
