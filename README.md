# PatriotPanganBackEnd

#spec
- node v8.10.0
- npm 3.5.2
- framework express (im not sure i really use all of function in express)
- orm sequelize@4.37.10 (migrate from mongoose 5.1.4)
- db mysql2 (migrate from mongo)
- dbms phpmyadmin (migrate from mongodb)
#instalasi
- this server run in port 3000, you can change port in bin/www
- before install, make sure already installed git, nodejs and npm in your PC
- im make structur folder with npm install express-generator
- beware about asynchronous when accessing db, and complex functions, im still hendled with promise, i still try hendled it with async await
##Dependencies
- npm install
- npm install nodemon -g (global) or npm install nodemon (local)
- npm start
##Database
- cd database/
- node Table.database.js
- import manualy all file sql.zip in database/datbase_kodepos sequentially
