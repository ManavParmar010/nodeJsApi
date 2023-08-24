
const express =require('express');
const db =require('../db/dbcon');
const fs = require('fs');

const router = express.Router();

router.post("/",function (req,res){
  console.log("1");
dbcon = db.connect();
  dbcon.getConnection((err,con)=>
  {
  if(err)
  return res.send(err);
  

fs.readFile('JSON/Footware.json', 'utf8', (err, data) => {
  if (err) {
       console.error('Error reading JSON file:', err);
       return res.send(err);
    
  }

  // Parse the JSON data
  const jsonData = JSON.parse(data);

  // Insert each record from JSON into the database
  jsonData.forEach(record => {
    const sql = 'INSERT INTO Shoe (shoeName,image,description,id_category,id_colour,id_size) VALUES (?, ?, ?,?,?,?)';
    const values = [record.name,record.image,record.description,record.category,1,1]; // Adjust according to your JSON structure
    
    con.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting record:', err);
        return res.send(err);
      } 
        return res.send(result);
      
    });
  })
})
})
})
   
module.exports = router;