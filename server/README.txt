WHERE EACH FILE GOES (inside your server folder)

server/server.js                 <- replace
server/createAdmin.js            <- new
server/models/Record.js          <- replace (real model, NOT the commented one)
server/middleware/auth.js        <- new folder + file
server/routes/auth.js            <- new
server/routes/api.js             <- replace
server/.env                      <- add JWT_SECRET and JWT_EXPIRES (see .env.example)

client/record.js                 <- the browser code (from "// record.js: admin login..." to the end)

Then, in the server folder:
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"   (copy output into JWT_SECRET)
  node createAdmin.js admin YourStrongPassword
  npm start
Open http://localhost:5000 and press Ctrl+Shift+R.
