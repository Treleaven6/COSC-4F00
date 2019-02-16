# Setup
## MySQL
- user: root, password: BoatsnHoes, using default port 3306
- run "create-databse.sql" and then "populate-db.sql"
- I also had to execute "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'BoatsnHoes'" in order to talk to NodeJS
- tested on 8.0.14

## NodeJS
- use sudo/run-as-administrator as necessary
- create folder "MOCD", cd into folder
- run "npm init", can keep everything default
- run "npm install express" and "npm install mysql"
- copy "server.js" into folder
- run "node server.js"
- should respond on localhost:8081
- shutdown with ctrl-C

## React
- use sudo/run-as-administrator as necessary
- run "npx create-react-app hello-world" 
- might have to run "chown -R <your_username> hello-world/" (or whatever the equivalent is on windows) to fix permissions
- cd into "hello-world"
- copy "package.json" into folder (overwrite)
- cd into "src"
- copy "App.js" and the Landing, Login, Student, and Teacher folders into folder (overwrite App.js)
- cd ..
- run "npm start"
- should open localhost:3000
- shutdown with ctrl-C

# Major TODOs
- change React folder from "hello-world" to something better
- add comments :)
- [use React on the web](https://reactjs.org/docs/add-react-to-a-website.html) rather than whatever it's doing now
- make it pretty (google "free react themes")
- what to do about NodeJS?

## Reasons to not use NodeJS
- don't think it will work on sandcastle

## Reasons to use NodeJS
- doesn't have to work on sandcastle as long as we can demo it?
- all the examples online use React + NodeJS
- it's been pretty easy to write so far
- NodeJS can hook into Java if we want?

# Notes
- dummy data includes username/password t/t for a teacher and s/s for a student
- can click on courses and assignments once logged in
- most of the buttons don't work, some do
- right now a big old object in the state of Teacher or Student is keeping track of most info. Not sure if this is the best way to go about it
