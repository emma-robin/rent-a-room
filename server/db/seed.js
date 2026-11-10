const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function seed() {
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  });

   try {
    await client.connect();
    
     const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8'));

    console.log('Starting seed...')

    // Clear all data in the tables but holds tables in place
    await client.query(`
      TRUNCATE TABLE messages, chat_members, chats, photos,
                     profile_tags, listing_tags, tags,
                     profiles, listings, users
      RESTART IDENTITY CASCADE;
    `);
    console.log('Cleared existing data');

//using a single password hash for time being
 const passwordHash = await bcrypt.hash('password123', 10);

 //userlist
const usersResult = {}; 
    for (const user of data.users) {
      const result = await client.query(
        `INSERT INTO users (email, password_hash, username, user_type)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [user.email, passwordHash, user.username, user.type]
      );
      usersResult[user.username] = result.rows[0].id;
    }
    console.log('Inserted users');


    // listings list
    const listingsResult =[];
        for (const listing of data.listings) {
      const result = await client.query(
      `INSERT INTO listings (
           user_id, listing_type, title, description, price_pcm, address,
           latitude, longitude, move_in_date, bedrooms,
           en_suite, parking, outdoor_space, kitchen_size, house_rules
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
        [
          usersResult[listing.owner_username],
          listing.type,
          listing.title,
          listing.description,
          listing.price,
          listing.address,
          listing.lat,
          listing.lng,
          listing.move_in_date,
          listing.bedrooms,
          listing.en_suite,
          listing.parking,
          listing.outdoor_space,
          listing.kitchen_size,
          listing.house_rules
        ]
      );
      listingsResult.push(result.rows[0].id);
    }
    console.log('Inserted listings:');

    // profiles for individual
    const profilesResult = [];
    for (const profile of data.profiles) {
      const result = await client.query(
        `INSERT INTO profiles (
           user_id, bio, budget_min, budget_max, move_in_date,
           shift_pattern, has_car, looking_for
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [
          usersResult[profile.user_id],
          profile.bio,
          profile.budget_min,
          profile.budget_max,
          profile.move_in_date,
          profile.shift_pattern,
          profile.has_car,
          profile.looking_for
        ]
      );
      profilesResult.push(result.rows[0].id);
    }
    console.log('Inserted profiles');
    // tags list
   
  
      const tagsResult = await client.query(
      `INSERT INTO tags (label)
       SELECT unnest($1::text[])
       RETURNING id, label;`,
      [data.tagLabels]
    );
    const tagId = Object.fromEntries(tagsResult.rows.map(t => [t.label, t.id]));
    console.log('Inserted tags');
  

    // Link tags to listings
    const listingTagPairs = [
      [listingsResult[0], tagId['en-suite']],
      [listingsResult[0], tagId['outdoor-space']],
      [listingsResult[1], tagId['quiet']],
      [listingsResult[1], tagId['non-smoker']],
      [listingsResult[2], tagId['en-suite']],
      [listingsResult[2], tagId['non-smoker']],
      [listingsResult[2], tagId['outdoor-space']],
    ];
    for (const [listingsResult, tId] of listingTagPairs) {
      await client.query(
        'INSERT INTO listing_tags (listing_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;',
        [listingsResult, tId]
      );
    }
    console.log(`Linked ${listingTagPairs.length} listing tags`);

    // Link tags to profiles
    const profileTagPairs = [
      [profilesResult[0], tagId['non-smoker']],
      [profilesResult[0], tagId['night-shift']],
      [profilesResult[0], tagId['quiet']],
      [profilesResult[1], tagId['pet-owner']],
      [profilesResult[1], tagId['non-smoker']],
      [profilesResult[1], tagId['tidy']],
    ];
    for (const [profileId, tId] of profileTagPairs) {
      await client.query(
        'INSERT INTO profile_tags (profile_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;',
        [profileId, tId]
      );
    }
    console.log(`Linked ${profileTagPairs.length} profile tags`);

    console.log('Seed complete');

  
    console.log('Database seeded successfully!')
  } catch (err) {
    console.error('Error seeding database:', err)
  } finally {
    await client.end()
  }
}

seed();