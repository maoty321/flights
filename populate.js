const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

// Use your provided connection string
const uri = 'mongodb+srv://phone-vendor:78870780@maoty.t5tctwo.mongodb.net/flight?retryWrites=true&w=majority&appName=Maoty';

const dbName = 'flight';            // your database name from URI
const collectionName = 'airports';  // desired collection name

async function importAirports() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const airports = [];

    fs.createReadStream('airports.csv')
      .pipe(csv())
      .on('data', (data) => {
        data.latitude_deg = parseFloat(data.latitude_deg);
        data.longitude_deg = parseFloat(data.longitude_deg);
        data.elevation_ft = data.elevation_ft ? parseInt(data.elevation_ft) : null;
        airports.push(data);
      })
      .on('end', async () => {
        console.log(`Parsed ${airports.length} airports from CSV`);

        try {
          await collection.deleteMany({});
          console.log('Cleared existing airport data');

          const result = await collection.insertMany(airports);
          console.log(`Inserted ${result.insertedCount} airports into MongoDB Atlas`);

          await client.close();
          console.log('Disconnected from MongoDB Atlas');
        } catch (err) {
          console.error('Error inserting data:', err);
          await client.close();
        }
      });
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
  }
}

importAirports();
