// arthor: Precious Affiah 2022
// this is the schema for the Article database (how the articles will be displayed in the datbase)
const mongoose = require("mongoose");
const schema = mongoose.Schema(
    {

        created: "String",
        topic:"String",
        category:"String",
        text:"String",
        user_id:"String"
       
    },
    {timestamps: true}
);

const article = mongoose.model('article', schema);
module.exports = article;