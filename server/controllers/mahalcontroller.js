const express = require('express');
const router = express.Router();
const db = require('./../db');
const { getUserFromHeader } = require('../middelware/authmiddleware');
require('dotenv').config();

const getMahals= (req, res) => {
    const location = req.query.location;

    let query = 'SELECT * FROM mahals'; // use let instead of const

    if (location) {
        query += ' WHERE location = ?'; // add space before WHERE
        db.query(query, [location], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    } else {
        db.query(query, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    }
};


const getMahalsbyId = (req,res)=>{
    const id = req.params.id;

    const query = `SELECT * FROM mahals WHERE id = ?`;
    db.query(query,[id],(err,result)=>{
        if(err) return res.status(500).json({error:err.message});
        if(result.length === 0) return res.status(404).json({message:"Mahal not found"});
        res.status(200).json(result[0]);
    })
}


const addMahal = (req,res)=>{
    
    try{

        const {id:userId, role} = getUserFromHeader(req);

        console.log("🔥 Token Info:", { userId, role });
        if(role !== 'admin' && role !== 'owner'){
            return res.status(403).json({message:"You are not authorized to add mahal"});
        }

        console.log("🧪 Token Info:", { userId, role });

        const {name,location,capacity,price,description,contact} = req.body;
        const image_url = req.file?req.file.filename:null;
        const query = `INSERT INTO mahals (name, location, capacity, price, image_url, description, contact, owner_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

db.query(query, [name, location, capacity, price, image_url, description, contact, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Mahal added successfully" });
});
        console.log("🧪 Token Info:", { userId, role });


        console.log("🧪 Reached addMahal route");
console.log("🧑‍💼 User info:", req.user); // should show id and role

    }
    catch(err){
        res.status(500).send({error:err.message});
    }
};

const updateMahal = (req, res) => {
  const { id: userId, role } = getUserFromHeader(req);
  const mahalid = req.params.id;

  db.query('SELECT * FROM mahals WHERE id = ?', [mahalid], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ message: 'Mahal not found' });
    }

    const ownerId = result[0].owner_id;
    if (role !== 'admin' && ownerId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this mahal' });
    }

    const { name, location, capacity, price, description } = req.body;
    let image_url = result[0].image_url;

    if (req.file) {
      image_url = req.file.filename;
    }

    if (!name || !location || !capacity || !price || !description) {
      return res.status(400).json({ message: 'All fields except image are required' });
    }

    const updateQuery = `
      UPDATE mahals
      SET name = ?, location = ?, capacity = ?, price = ?, image_url = ?, description = ?
      WHERE id = ?
    `;

    db.query(updateQuery, [name, location, capacity, price, image_url, description, mahalid], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(200).json({
        message: 'Mahal updated successfully',
        updated: { id: mahalid, name, location, capacity, price, image_url, description }
      });
    });
  });
};

const deleteMahal = (req, res) => {
    const { id: userId, role } = getUserFromHeader(req);    
    const mahalid = req.params.id;

    db.query(`SELECT owner_id FROM mahals WHERE id = ?`,[mahalid],(err,result)=>{
        if(err || result.length === 0) {
            return res.status(404).json({message:"Mahal not found"});
        }

        const ownerId = result[0].owner_id;

        if(role !== 'admin' && ownerId !== userId){
            return res.status(403).json({message:"You are not authorized to delete this mahal"});
        }

        db.query(`DELETE FROM mahals WHERE id = ?`,[mahalid],(err)=>{
            if(err) return res.status(500).json({error:err.message});
            res.status(200).json({message:"Mahal deleted successfully"});
        })
    })
};

module.exports = {
  addMahal,
  getMahals,
  updateMahal,
  deleteMahal,
  getMahalsbyId
};
