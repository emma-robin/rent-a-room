import express from 'express'
import { type Request, type Response } from 'express';
import http from 'http'
import pool from './config/db.js'//for the database
import cors from 'cors'//protects API calls
import helmet from 'helmet'//security headers
import { Server } from 'socket.io'//for chat function
import env from './config/env.js'

const app = express();
const httpServer = http.createServer(app);

// Allows real-time and rest to share a port for Socket.IO
const io = new Server(httpServer, {
  cors: { origin: env.clientUrl, methods: ['GET', 'POST'] },
});

// Middleware added
app.use(helmet());
app.use(cors({ origin: env.clientUrl }));
app.use(express.json());


// Just to database works
app.get('/api/db-test', async (request:Request, response: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    response.json({ 
      status: 'success', 
      database_time: result.rows[0].now 
    });
  } catch (err:any) {
    console.error(err);
    response.status(500).json({ status: 'error', message: err.message });
  }
});



//api for listings 
app.get('/api/listings', async (request:Request, response: Response) => {
  try {
    const conditions: string[] = [];
    const values: any[] = [];

    conditions.push("listings.listing_type = 'propertyholder_property'");

    // Max Price
    if (request.query.maxPrice) {
      values.push(request.query.maxPrice);
      conditions.push(`listings.price_pcm <= $${values.length}`);
    }

    // Min Price
    if (request.query.minPrice) {
      values.push(request.query.minPrice);
      conditions.push(`listings.price_pcm >= $${values.length}`);
    }

    // Bedrooms
    if (request.query.bedrooms) {
      values.push(request.query.bedrooms);
      conditions.push(`listings.bedrooms = $${values.length}`);
    }

    //SQL
    const sql = `
      SELECT listings.*, users.username FROM listings JOIN users ON users.id = listings.user_id WHERE ${conditions.join(' AND ')}
    `;

    const listings = await pool.query(sql, values);
    response.json({ status: 'success', data: listings.rows });
  } catch (err:any) {
    console.error(err);
    response.status(500).json({ status: 'error', message: err.message });
  }
});

//api for sharedhomes 
app.get('/api/sharedhomes', async (request:Request, response: Response) => {
   try {
    const conditions: string[] = [];
    const values: any[] = [];

    conditions.push("listings.listing_type = 'household_room'");

    // Max Price
    if (request.query.maxPrice) {
      values.push(request.query.maxPrice);
      conditions.push(`listings.price_pcm <= $${values.length}`);
    }

    // Min Price
    if (request.query.minPrice) {
      values.push(request.query.minPrice);
      conditions.push(`listings.price_pcm >= $${values.length}`);
    }

    // Bedrooms
    if (request.query.bedrooms) {
      values.push(request.query.bedrooms);
      conditions.push(`listings.bedrooms = $${values.length}`);
    }

    //SQL
    const sql = `
      SELECT listings.*, users.username FROM listings JOIN users ON users.id = listings.user_id WHERE ${conditions.join(' AND ')}
    `;

    const listings = await pool.query(sql, values);
    response.json({ status: 'success', data: listings.rows });
  } catch (err:any) {
    console.error(err);
    response.status(500).json({ status: 'error', message: err.message });
  }
});

//api for listings 
app.get('/api/housemates', async (request:Request, response: Response) => {
  try {
    const conditions: string[] = [];
    const values: any[] = [];


    // Max Price
    if (request.query.maxPrice) {
      values.push(request.query.maxPrice);
      conditions.push(`listings.price_pcm <= $${values.length}`);
    }

    // Min Price
    if (request.query.minPrice) {
      values.push(request.query.minPrice);
      conditions.push(`listings.price_pcm >= $${values.length}`);
    }

    //SQL
    const sql = `
     "SELECT profiles.*, users.username FROM profiles JOIN users ON users.id = profiles.user_id;" WHERE ${conditions.join(' AND ')}
    `;

    const listings = await pool.query(sql, values);
    response.json({ status: 'success', data: listings.rows });
  } catch (err:any) {
    console.error(err);
    response.status(500).json({ status: 'error', message: err.message });
  }
});

// Just to check Socket.IO works
io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[socket] disconnected: ${socket.id}`);
  });
});

// Boot needed to allow Socket.IO
httpServer.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
});