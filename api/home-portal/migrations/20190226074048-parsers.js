const parsersFixture = [
  {
      "_id": "5c74f17f3cafd6093cc18891",
      "description": "Kinogo",
      "url": "kinogo.cc"
  },
  {
      "_id": "5c74f1e93cafd6093cc18892",
      "description": "Kinokrad",
      "url": "kinokrad.co"
  }
];

module.exports = {
  async up(db) {
    // TODO write your migration here. Return a Promise (and/or use async & await).
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    for (const parser of parsersFixture) {
      const existing = await db.getParser({ url : parser.url });
  
      if (!existing.length) {
        await db.insertDocuments('parsers', [data]);
      }
    }
  },

  down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
