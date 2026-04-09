const express = require('express');
const router = express.Router();
const db = require('./../db');
const { getUserFromHeader } = require('../middelware/authmiddleware');
require('dotenv').config();

const getMahals= (req, res) => {
    const location = req.query.location;

    let query = 'SELECT * FROM mahals'; // use let instead of const

    if (location) {
        query += ' WHERE location = $1'; // PostgreSQL uses $1
        db.query(query, [location], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result.rows);
        });
    } else {
        db.query(query, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result.rows);
        });
    }
};


const getMahalsbyId = (req,res)=>{
    const id = req.params.id;

    const query = `SELECT * FROM mahals WHERE id = $1`;
    db.query(query,[id],(err,result)=>{
        if(err) return res.status(500).json({error:err.message});
        if(result.rows.length === 0) return res.status(404).json({message:"Mahal not found"});
        res.status(200).json(result.rows[0]);
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

        const {name,location,capacity,price,description,contact,amenities,pricing_details,veg_price,non_veg_price} = req.body;
        const image_url = req.file?req.file.filename:null;
        const query = `INSERT INTO mahals (name, location, capacity, price, image_url, description, contact, owner_id, amenities, pricing_details, veg_price, non_veg_price)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;

db.query(query, [name, location, capacity, price, image_url, description, contact, userId, amenities, pricing_details, veg_price, non_veg_price], (err) => {
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

  db.query('SELECT * FROM mahals WHERE id = $1', [mahalid], (err, result) => {
    if (err || result.rows.length === 0) {
      return res.status(404).json({ message: 'Mahal not found' });
    }

    const ownerId = result.rows[0].owner_id;
    if (role !== 'admin' && ownerId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this mahal' });
    }

    const { name, location, capacity, price, description, contact, amenities, pricing_details, veg_price, non_veg_price } = req.body;
    let image_url = result.rows[0].image_url;

    if (req.file) {
      image_url = req.file.filename;
    }

    if (!name || !location || !capacity || !price || !description) {
      return res.status(400).json({ message: 'All fields except image, amenities and pricing details are required' });
    }

    const updateQuery = `
      UPDATE mahals
      SET name = $1, location = $2, capacity = $3, price = $4, image_url = $5, description = $6, contact = $7, amenities = $8, pricing_details = $9, veg_price = $10, non_veg_price = $11
      WHERE id = $12
    `;

    db.query(updateQuery, [name, location, capacity, price, image_url, description, contact, amenities, pricing_details, veg_price, non_veg_price, mahalid], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(200).json({
        message: 'Mahal updated successfully',
        updated: { id: mahalid, name, location, capacity, price, image_url, description, amenities, pricing_details, veg_price, non_veg_price }
      });
    });
  });
};

const deleteMahal = (req, res) => {
    const { id: userId, role } = getUserFromHeader(req);    
    const mahalid = req.params.id;

    db.query(`SELECT owner_id FROM mahals WHERE id = $1`,[mahalid],(err,result)=>{
        if(err || result.rows.length === 0) {
            return res.status(404).json({message:"Mahal not found"});
        }

        const ownerId = result.rows[0].owner_id;

        if(role !== 'admin' && ownerId !== userId){
            return res.status(403).json({message:"You are not authorized to delete this mahal"});
        }

        db.query(`DELETE FROM mahals WHERE id = $1`,[mahalid],(err)=>{
            if(err) return res.status(500).json({error:err.message});
            res.status(200).json({message:"Mahal deleted successfully"});
        })
    })
};

/**
 * Get mahals owned by the logged-in user (Owner Dashboard)
 */
const getOwnerMahals = (req, res) => {
    try {
        const { id: userId } = getUserFromHeader(req);
        db.query('SELECT * FROM mahals WHERE owner_id = $1 ORDER BY created_at DESC', [userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result.rows);
        });
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

module.exports = {
  addMahal,
  getMahals,
  updateMahal,
  deleteMahal,
  getMahalsbyId,
  getOwnerMahals
};
