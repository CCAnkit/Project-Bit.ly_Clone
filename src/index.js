const express = require("express");;
const bodyParser = require("body-parser");
const route = require("./routes/route.js");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(bodyParser.json());
app.use("/", route);  
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://CCAnkit:CCAnkit09@clusternew.gds9x.mongodb.net/group24Databasee", {
    useNewUrlParser: true})
.then(() => console.log('MongoDb is connected'))
.catch(err => console.log('Connection error'))


app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + 
    (process.env.PORT || 3000));
});
