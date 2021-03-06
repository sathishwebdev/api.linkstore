var express = require('express'),cors = require('cors')
require('./db')
const PORT = process.env.PORT ,app = express()
const linkController = require("./controllers/link.controller");
app.use(express.json())
app.use(cors())
app.use(require("./helpers/errorHandler"))
app.use(require("./helpers/jwt")());

app.use("/api/users", require("./routes/user.routes"));
app.use("/api/links", require("./routes/link.routes"));

// app.get('/:shortId', linkController.redirectUrl)

app.get('/', (req, res)=>{res.send("LINK STORE")})

app.listen(PORT, ()=>{console.log("Server started " + PORT)})