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

    
    //en-suite
if (request.query.enSuite === 'true') {
  conditions.push(`listings.en_suite = TRUE`);
} else if (request.query.enSuite === 'false') {
  conditions.push(`listings.en_suite = FALSE`);
}
//move-in date
    if (request.query.moveInDate) {
      values.push(request.query.moveInDate);
       conditions.push(`listings.move_in_date <= $${values.length}`);
    }

    //kitchen size
    if (request.query.kitchenSize) {
      values.push(request.query.kitchenSize);
      conditions.push(`listings.kitchen_size = $${values.length}`);
    }

  //title
    if (request.query.title) {
  values.push(`%${request.query.title}%`);
  conditions.push(`listings.title ILIKE $${values.length}`);
}

    //description
    if (request.query.description) {
  values.push(`%${request.query.description}%`);
  conditions.push(`listings.description ILIKE $${values.length}`);
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

    //en-suite
if (request.query.enSuite === 'true') {
  conditions.push(`listings.en_suite = TRUE`);
} else if (request.query.enSuite === 'false') {
  conditions.push(`listings.en_suite = FALSE`);
}

//move-in date
    if (request.query.moveInDate) {
      values.push(request.query.moveInDate);
       conditions.push(`listings.move_in_date <= $${values.length}`);
    }

      //kitchen size
    if (request.query.kitchenSize) {
      values.push(request.query.kitchenSize);
      conditions.push(`listings.kitchen_size = $${values.length}`);
    }
    //bio
    if (request.query.profileBio) {
  values.push(`%${request.query.profileBio}%`);
  conditions.push(`profiles.bio ILIKE $${values.length}`);
}

  //title
    if (request.query.title) {
  values.push(`%${request.query.title}%`);
  conditions.push(`listings.title ILIKE $${values.length}`);
}

    //description
    if (request.query.description) {
  values.push(`%${request.query.description}%`);
  conditions.push(`listings.description ILIKE $${values.length}`);
}

    //SQL
    const sql = `
    SELECT listings.*, users.username, profiles.bio, profiles.budget_min, profiles.budget_max FROM listings
JOIN users ON users.id = listings.user_id
LEFT JOIN profiles ON profiles.user_id = users.id
      WHERE ${conditions.join(' AND ')}
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


    // Max budget
    if (request.query.maxBudget) {
      values.push(request.query.maxBudget);
      conditions.push(`profiles.budget_max <= $${values.length}`);
    }

    // Min Budget
    if (request.query.minBudget) {
      values.push(request.query.minBudget);
      conditions.push(`profiles.budget_min >= $${values.length}`);
    }

    //Shift pattern
      if (request.query.shiftPattern) {
      values.push(request.query.shiftPattern);
      conditions.push(`profiles.shift_pattern = $${values.length}`);
    }
  //Looking for
      if (request.query.lookingFor) {
      values.push(request.query.lookingFor);
      conditions.push(`profiles.looking_for = $${values.length}`);
    }

 //Has car
if (request.query.hasCar === 'true') {
  conditions.push(`profiles.has_car = TRUE`);
}
if (request.query.hasCar === 'false') {
  conditions.push(`profiles.has_car = FALSE`);
}
//move-in date
    if (request.query.moveInDate) {
      values.push(request.query.moveInDate);
      conditions.push(`profiles.move_in_date <= $${values.length}`);
    }

    //bio
    if (request.query.profileBio) {
  values.push(`%${request.query.profileBio}%`);
  conditions.push(`profiles.bio ILIKE $${values.length}`);
}

    //SQL needed to add where seperate as no standard listing_type

const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

const sql = `
  SELECT profiles.*, users.username 
  FROM profiles 
  JOIN users ON users.id = profiles.user_id
  ${where}
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