# Setup

username: c4f00g03
password: j4g6x7b3

## Software
- Python 2.7
- PHP 7
- NodeJS 10
- Postgres 8
- optional: VS Code as the IDE

## Postgres
- user: c4f00g03, password: j4g6x7b3, database: c4f00g03
- run "create-databse.sql" and then "populate-db.sql"

## React / Babel / php / py
- in the React folder, run "sudo npm i" to install all the dependencies that React and Babel need
- run "sudo npx babel --watch src --out-dir . --presets react --plugins transform-async-to-generator"
	- this can be left running or stopped (ctrl-c) and started as needed
	- all the React code is written in the "src" folder, Babel compiles it 
	- have to refresh page everytime React code is recompiled
- in another terminal, run "php -S localhost:8081"
	- go to localhost:8081 to interact with the website, otherwise you'll get cross origin errors

__Modify the files in the `src` folder, and they will get "compiled" to the top level.__

# Updates
- Uploads are anonymized
- teachers and students can upload files
- a zip package is ready to be sent offsite

# Major TODOs
- add comments :)
- make it pretty (google "free react themes")
- encrypt passwords
- use https
- create scripts for easy enrollment, course creation, and account creation
- get email working for account and password request
- display results from Algo nicely (write some json to a file, update database, get it from React, parse it?)

# Notes
- dummy data includes username/password t/t for a teacher and s/s for a student
- can click on courses and assignments once logged in
- most of the buttons don't work, some do
- if using VS code, install Prettier and use shift + option + F to format
