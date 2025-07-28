# D&D&D (Dungeons and Dragons and Databases)

## How to setup

### Pre-requisites

-   Install [Docker](https://docs.docker.com/get-started/get-docker/) or compatible tools
-   Install [MySQL Client Tools](https://dev.mysql.com/doc/refman/8.4/en/mysql.html)

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
SOURCE db/fixtures/load_sample.sql; -- to load sample data
SOURCE db/fixtures/load_production.sql; -- to load production data
quit
```

### Create new sample data

Create an openAI API key and store it as your API_KEY in the .env file.
Then navigate to the db/fixtures folder and run
```bash
python database_constructor.py
```
The constraints of the database can be changed via the variables in the top of that python file.
Running this file will create 9 sql files that can be run to add new data to your database.

### Access the application

Go to http://localhost:3000 to access your platform.

## Features and Query Locations

R6. Users creating an account and logging in/out

app\lib\models\users\query.ts

R7. Activating/deactivating spell/ability

app\api\characters\[id]\[spell_id]\route.ts

R8. Giving a character an item/spell/ability

app\(character)\character\[id]\add\abilities\actions.ts

app\(character)\character\[id]\add\items\actions.ts

app\(character)\character\[id]\add\skills\actions.ts

R9. Equipping/unequipping an item

app/api/unequip/route.ts

app/api/equip/route.ts

R10. Listing available items/spells/abilities

app\(character)\character\[id]\add\abilities\page.tsx

app\(character)\character\[id]\add\skills\page.tsx

app\(character)\character\[id]\add\items\page.tsx

R11. Creating spells/items/abilities

app\api\abilities\route.ts

app\api\skills\route.ts

app\api\items\route.ts

R12. Changing skills

app\lib\models\skillDeltas\query.ts

R13. View character list

app/api/characters/[id]/route.ts

R14. Long rest

app/api/long-rest/route.ts

R15. Calculate skills

app/(character)/character/[id]/add/abilities/actions.ts

app/(character)/character/[id]/add/items/actions.ts

app/(character)/character/[id]/add/spells/actions.ts
