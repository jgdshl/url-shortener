const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI
    .replace('PSWD',process.env.PSWD)
    .replace('DBNAME', process.env.DBNAME),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
).catch(err => console.log(err));

const urlShortsSchema = new mongoose.Schema({
  longUrl: {
  type: String, 
    required: true,
    unique: true,
  },
  shortUrl: {
    type: Number,
    unique: true,
    default: 0,
  }
});

const UrlShorts = mongoose.model('UrlShorts', urlShortsSchema);

exports.UrlShorts = UrlShorts;