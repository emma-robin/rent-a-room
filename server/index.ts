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

//move-out date
    if (request.query.moveOutDate) {
      values.push(request.query.moveOutDate);
       conditions.push(`listings.move_out_date <= $${values.length}`);
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

//address
if (request.query.location) {
  values.push(`%${request.query.location}%`);
  conditions.push(`listings.address ILIKE $${values.length}`);
}

// contract type
if (request.query.contractType) {
  values.push(request.query.contractType);
  conditions.push(`listings.contract_type = $${values.length}`);
}

//parking
if (request.query.parking === 'true') {
  conditions.push(`listings.parking = TRUE`);
} else if (request.query.parking === 'false') {
  conditions.push(`listings.parking = FALSE`);
}

//outdoor space
if (request.query.outdoorSpace === 'true') {
  conditions.push(`listings.outdoor_space = TRUE`);
} else if (request.query.outdoorSpace === 'false') {
  conditions.push(`listings.outdoorSpace = FALSE`);
}

// accepts pets
if (request.query.acceptsPets === 'true') {
  conditions.push(`listings.accepts_pets = TRUE`);
} else if (request.query.acceptsPets === 'false') {
  conditions.push(`listings.acceptsPets = FALSE`);
}

// accepts benefits
if (request.query.acceptsBenefits === 'true') {
  conditions.push(`listings.accepts_benefits = TRUE`);
} else if (request.query.acceptsBenefits === 'false') {
  conditions.push(`listings.acceptsBenefits = FALSE`);
}

// legislation declared
if (request.query.legislationDeclared === 'true') {
  conditions.push(`listings.legislation_declared = TRUE`);
} else if (request.query.legislation_declared === 'false') {
  conditions.push(`listings.legislation_declared = FALSE`);
}

  //listing tags
if (request.query.listingTags) {
  const tags = String(request.query.listingTags).split(',');
  values.push(tags);
  conditions.push(`
    EXISTS (
      SELECT 1 FROM listing_tags lt
      JOIN tags t ON t.id = lt.tag_id
      WHERE lt.listing_id = listings.id
      AND t.label = ANY($${values.length})
    )
  `);
}

//searchbox 
if (request.query.search) {
  values.push(`%${request.query.search}%`);
  conditions.push(`(
    listings.title ILIKE $${values.length}
    OR listings.description ILIKE $${values.length}
    OR listings.address ILIKE $${values.length}
  )`);
}

    //SQL
    const sql = `
  SELECT listings.*, users.username,
    COALESCE(array_agg(DISTINCT tags.label) FILTER (WHERE tags.label IS NOT NULL), '{}') AS tags
  FROM listings 
  JOIN users ON users.id = listings.user_id 
  LEFT JOIN listing_tags ON listing_tags.listing_id = listings.id
  LEFT JOIN tags ON tags.id = listing_tags.tag_id
  WHERE ${conditions.join(' AND ')}
  GROUP BY listings.id, users.username
`;

    const listings = await pool.query(sql, values);
    response.json({ status: 'success', data: listings.rows });
  } catch (err:any) {
    console.error(err);
    response.status(500).json({ status: 'error', message: err.message });
  }
});

//api for listings details
app.get('/api/listings/:id', async (request:Request, response: Response) => {
  try {
      const { id } = request.params;
const sql = 
` SELECT listings.*, users.username,
    COALESCE(array_agg(DISTINCT tags.label) FILTER (WHERE tags.label IS NOT NULL), '{}') AS tags
  FROM listings 
  JOIN users ON users.id = listings.user_id 
  LEFT JOIN listing_tags ON listing_tags.listing_id = listings.id
  LEFT JOIN tags ON tags.id = listing_tags.tag_id
  WHERE listings.id = $1
  GROUP BY listings.id, users.username
`;
;
const listings = await pool.query(sql, [id]);
    response.json({ status: 'success', data: listings.rows[0] });
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
    
//address
if (request.query.location) {
  values.push(`%${request.query.location}%`);
  conditions.push(`listings.address ILIKE $${values.length}`);
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

    //bio
    if (request.query.profileBio) {
  values.push(`%${request.query.profileBio}%`);
  conditions.push(`profiles.bio ILIKE $${values.length}`);
     }
     
     //gender 
if (request.query.gender) {
  values.push(request.query.gender);
  conditions.push(`profiles.gender = $${values.length}`);
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

// contract type
if (request.query.contractType) {
  values.push(request.query.contractType);
  conditions.push(`listings.contract_type = $${values.length}`);
}

// accepts pets
if (request.query.acceptsPets === 'true') {
  conditions.push(`listings.accepts_pets = TRUE`);
} else if (request.query.acceptsPets === 'false') {
  conditions.push(`listings.acceptsPets = FALSE`);
}


// accepts benefits
if (request.query.acceptsBenefits === 'true') {
  conditions.push(`listings.accepts_benefits = TRUE`);
} else if (request.query.acceptsBenefits === 'false') {
  conditions.push(`listings.acceptsBenefits = FALSE`);
}

// legislation declared
if (request.query.legislationDeclared === 'true') {
  conditions.push(`listings.legislation_declared = TRUE`);
} else if (request.query.legislation_declared === 'false') {
  conditions.push(`listings.legislation_declared = FALSE`);
}

//parking
if (request.query.parking === 'true') {
  conditions.push(`listings.parking = TRUE`);
} else if (request.query.parking === 'false') {
  conditions.push(`listings.parking = FALSE`);
}

//outdoor space
if (request.query.outdoorSpace === 'true') {
  conditions.push(`listings.outdoor_space = TRUE`);
} else if (request.query.outdoorSpace === 'false') {
  conditions.push(`listings.outdoorSpace = FALSE`);
}

//profile tags
if (request.query.profileTags) {
  const tags = String(request.query.profileTags).split(',');
  values.push(tags);
  conditions.push(`
    EXISTS (
      SELECT 1 FROM profile_tags pt
      JOIN tags t ON t.id = pt.tag_id
      WHERE pt.profile_id = profiles.id
      AND t.label = ANY($${values.length})
    )
  `);
}

  //listing tags
  if (request.query.listingTags) {
  const tags = String(request.query.listingTags).split(',');
  values.push(tags);
  conditions.push(`
    EXISTS (
      SELECT 1 FROM listing_tags lt
      JOIN tags t ON t.id = lt.tag_id
      WHERE lt.listing_id = listings.id
      AND t.label = ANY($${values.length})
    )
  `);
}

//searchbox 
if (request.query.search) {
  values.push(`%${request.query.search}%`);
  conditions.push(`(
    listings.title ILIKE $${values.length}
    OR listings.description ILIKE $${values.length}
    OR listings.address ILIKE $${values.length}
    OR profiles.bio ILIKE $${values.length}
  )`);}

    //SQL

const sql = `
  SELECT 
    listings.*, users.username, profiles.bio, profiles.budget_min, profiles.budget_max,profiles.gender,
    COALESCE(array_agg(DISTINCT tags.label) FILTER (WHERE tags.label IS NOT NULL), '{}') AS tags
  FROM listings 
  JOIN users ON users.id = listings.user_id
  LEFT JOIN profiles ON profiles.user_id = users.id
  LEFT JOIN listing_tags ON listing_tags.listing_id = listings.id
  LEFT JOIN tags ON tags.id = listing_tags.tag_id
  WHERE ${conditions.join(' AND ')}
  GROUP BY listings.id, users.username, profiles.bio, profiles.budget_min, profiles.budget_max,profiles.gender
`;
    const listings = await pool.query(sql, values);
    response.json({ status: 'success', data: listings.rows });
  } catch (err:any) {
    console.error(err);
    response.status(500).json({ status: 'error', message: err.message });
  }
});



//api for shared home details
app.get('/api/sharedhomes/:id', async (request:Request, response: Response) => {

      try {
  const { id } = request.params;
 
   const sql = `
      SELECT listings.*, users.username, profiles.bio, profiles.budget_min, profiles.budget_max,
        COALESCE(array_agg(DISTINCT tags.label) FILTER (WHERE tags.label IS NOT NULL), '{}') AS tags
      FROM listings
      JOIN users ON users.id = listings.user_id
      LEFT JOIN profiles ON profiles.user_id = users.id
      LEFT JOIN listing_tags ON listing_tags.listing_id = listings.id
      LEFT JOIN tags ON tags.id = listing_tags.tag_id
     WHERE listings.id = $1
GROUP BY listings.id, users.username, profiles.bio, profiles.budget_min, profiles.budget_max;`
const sharedhome = await pool.query(sql, [id]);
    response.json({ status: 'success', data: sharedhome.rows[0] });
  } catch (err:any) {
    console.error(err);
    response.status(500).json({ status: 'error', message: err.message });
  }});

//api for housemates 
app.get('/api/housemates', async (request:Request, response: Response) => {
  try {
    const conditions: string[] = [];
    const values: any[] = [];

 conditions.push("profiles.looking_for = 'room'");
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

//move-out date
    if (request.query.moveOutDate) {
      values.push(request.query.moveOutDate);
      conditions.push(`profiles.move_out_date <= $${values.length}`);
    }

    //bio
    if (request.query.profileBio) {
  values.push(`%${request.query.profileBio}%`);
  conditions.push(`profiles.bio ILIKE $${values.length}`);
}

//gender 
if (request.query.gender) {
  values.push(request.query.gender);
  conditions.push(`profiles.gender = $${values.length}`);
}

//profile tags
if (request.query.profileTags) {
  const tags = String(request.query.profileTags).split(',');
  values.push(tags);
  conditions.push(`
    EXISTS (
      SELECT 1 FROM profile_tags pt
      JOIN tags t ON t.id = pt.tag_id
      WHERE pt.profile_id = profiles.id
      AND t.label = ANY($${values.length})
    )
  `);
}

//searchbox 
if (request.query.search) {
  values.push(`%${request.query.search}%`);
  conditions.push(`(
    users.username ILIKE $${values.length}
    OR profiles.bio ILIKE $${values.length} 
  )`); }

    //SQL needed to add where seperate as no standard listing_type

const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

const sql = `
  SELECT 
    profiles.*, users.username,
    COALESCE(array_agg(DISTINCT tags.label) FILTER (WHERE tags.label IS NOT NULL), '{}') AS tags
  FROM profiles 
  JOIN users ON users.id = profiles.user_id
  LEFT JOIN profile_tags ON profile_tags.profile_id = profiles.id
  LEFT JOIN tags ON tags.id = profile_tags.tag_id
  ${where}
  GROUP BY profiles.id, users.username
`;
    const listings = await pool.query(sql, values);
    response.json({ status: 'success', data: listings.rows });
  } catch (err:any) {
    console.error(err);
    response.status(500).json({ status: 'error', message: err.message });
  }
});


//api for housemate details
app.get('/api/housemates/:id', async (request:Request, response: Response) => {
  try {
  const { id } = request.params;
const sql = `
  SELECT
    profiles.*, users.username,
    COALESCE(array_agg(DISTINCT tags.label) FILTER (WHERE tags.label IS NOT NULL), '{}') AS tags
  FROM profiles
  JOIN users ON users.id = profiles.user_id
  LEFT JOIN profile_tags ON profile_tags.profile_id = profiles.id
  LEFT JOIN tags ON tags.id = profile_tags.tag_id
  WHERE profiles.id = $1
  GROUP BY profiles.id, users.username
`;
const housemate = await pool.query(sql, [id]);
    response.json({ status: 'success', data: housemate.rows[0] });
  } catch (err:any) {
    console.error(err);
    response.status(500).json({ status: 'error', message: err.message });
  }
});

io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[socket] disconnected: ${socket.id}`);
  });
});

httpServer.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
});