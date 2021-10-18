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
    required: true,
    unique: true,
  }
});

urlShortsSchema.pre('save', function(next) {
    if (!this.isNew) return next();
    UrlShorts
      .find({})
      .select('shortUrl')
      .sort({shortUrl: -1})
      .limit(1)
      .exec((err, doc) => {
          if (err) return next(err);
          this.shortUrl = doc[0].shortUrl + 1
      })
    next();
});

const UrlShorts = mongoose.model('UrlShorts', urlShortsSchema);

exports.UrlShorts = UrlShorts;