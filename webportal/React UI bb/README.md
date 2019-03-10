# Setup

## Software
- Python 2.7
- PHP 7
- NodeJS 10
- MySQL 8
- optional: VS Code as the IDE

## MySQL
- user: root, password: BoatsnHoes, using default port 3306
- run "create-databse.sql" and then "populate-db.sql"
- I also had to execute "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'BoatsnHoes'" in order to talk to NodeJS

## React / Babel / php / py
- in the React folder, run "sudo npm i" to install all the dependencies that React and Babel need
- run "sudo npx babel --watch src --out-dir . --presets react --plugins transform-async-to-generator"
	-  this can be left running or stopped (ctrl-c) and started as needed
	- all the React code is written in the "src" folder, Babel compiles it 
	- have to refresh page everytime React code is recompiled
- in another terminal, run "php -S localhost:8081"
	- go to localhost:8081 to interact with the website, otherwise you'll get cross origin errors
	- have to restart server everytime api.php is changed

# Updates
- now using React on the web. Should work on Sandcastle
- Node is out. With a bit of work, Python can be called by a PHP script and will talk to MySQL on Sandcastle

# Major TODOs
- fix file uploads (src/Student/Assignment.js): right now the user has to upload a zip file. Javascript, by design, can't zip folders recursively. We need to decide whether the user has to zip or can select several files in the same directory to be zipped. 
- fix file saving (api.php): right now a zipped folder just gets dumped in the React directory with a default name. PHP needs to parse the url to get aid, cid, and sid, and create a directory structure. I think it's easiest to save the file with php and then ask python to unzip it and anonymize it.
- add comments :)
- make it pretty (google "free react themes")

# Notes
- dummy data includes username/password t/t for a teacher and s/s for a student
- can click on courses and assignments once logged in
- most of the buttons don't work, some do
- right now a big old object in the state of Teacher or Student is keeping track of most info. Not sure if this is the best way to go about it. The whole project is not the most performant? but should still work
