const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { parser } = require('html-metadata-parser');
dotenv.config()
const ShortId = () =>{
    var shortId = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for ( let i = 0; i < 5; i++ ) {
      shortId += characters.charAt(Math.floor(Math.random() * charactersLength))
   }
   return shortId
}
const LinkSchema = new mongoose.Schema({
    link :{
        type: String,
        required: true
    },
    data: {},
    views : {
        type: Number,
        default : 0
    },
    shorturl : {
        type: String,
        unique: true, 
        required: true, 
        default: ShortId
    },
    by : {
        type:String,
        required: true
    }
})
;

LinkSchema.methods.getLinkData = async function (link) {
   try{ 
        let parsed = await parser(link)
        this.data = parsed
    }
    catch(error){
        this.data = null
    }
  };

const Link = mongoose.model("links", LinkSchema);
module.exports = Link