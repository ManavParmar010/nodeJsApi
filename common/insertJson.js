const db = require('../db/dbcon');
const fs = require('fs');

// function insertDataFromJson()

fs.readFile('Footware.json', 'utf8', (err, data) => {
    if (err) {
        return console.error('Error reading JSON file:', err);
      
    }
  
    // Parse the JSON data
    const jsonData = JSON.parse(data);
  
    // Insert each record from JSON into the database
    jsonData.forEach(record => {
      const sql = 'INSERT INTO Shoe (shoeName, image, description,id_category) VALUES (?, ?, ?)';
      const values = [record.name, record.image, record.description,record.category]; // Adjust according to your JSON structure
      var dbcon = db.connect();

      dbcon.getconnection((err,con)=>
      {
      if(err)
      throw err;
      
      con.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error inserting record:', err);
        } else {
          console.log('Record inserted:', result);
        }
      });
    })
})
})