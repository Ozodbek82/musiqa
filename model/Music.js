const mongoose = require("mongoose");

const MusicSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  singer: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  orignUser:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
  },
  imageName:{
    type:String,
    default:"defIm",
    // required: true,
  },
  audioName:{
    type:String,
    // required: true,
  },
});

module.exports = mongoose.model("music", MusicSchema);