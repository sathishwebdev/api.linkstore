const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { parser } = require('html-metadata-parser');
dotenv.config()

const LinkSchema = new mongoose.Schema({
    link :{
        type: String,
        required: true
    },
    data: {}
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