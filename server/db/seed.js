const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('Starting seed...');

    // Clear all data in the tables but holds tables
    await pool.query(`
      TRUNCATE TABLE messages, chat_members, chats, photos,
                     profile_tags, listing_tags, tags,
                     profiles, listings, users
      RESTART IDENTITY CASCADE;
    `);
    console.log('Cleared existing data');

//using a single password hash for time being
 const passwordHash = await bcrypt.hash('password123', 10);

 //userlist
const usersResult = await pool.query(
  `INSERT INTO users (email, password_hash, username, user_type)
   VALUES
     ('marieh@gmail.com',            $1, 'MarieH',          'propertyholder'),
     ('LisburnRd@outlook.co.uk',   $1, 'LisburnRdHouse','household'),
     ('johndoe@hotmail.com',         $1, 'johndoe',         'individual'),
     ('susiew@gmail.com',            $1, 'susie_wilson',    'individual')
   RETURNING id, email, user_type;`,
  [passwordHash]
);
   console.log('Inserted users:', usersResult.rows);

    // Extracting IDs by type to link properties
    const landlordId  = usersResult.rows.find(u => u.user_type === 'propertyholder').id;
    const householdId = usersResult.rows.find(u => u.user_type === 'household').id;
    const individualIds = usersResult.rows
      .filter(u => u.user_type === 'individual')
      .map(u => u.id);

    // listings list
    const listingsResult = await pool.query(
      `INSERT INTO listings
         (user_id, listing_type, title, description, price_pcm, address,
          latitude, longitude, move_in_date, bedrooms,
          en_suite, parking, outdoor_space, kitchen_size, house_rules)
       VALUES
         ($1, 'propertyholder_property', 'Bright 2-bed flat',
          'Modern flat with great natural light. Close to shops and buses.',
          850.00, '45 Ormeau Road, Belfast', 54.586700, -5.928200,
          '2027-05-01', 2, true, true, false, 'medium', NULL),
         ($2, 'household_room', 'Cosy room in friendly flatshare',
          'Room available in a relaxed shared house. Bills split evenly.',
          480.00, '12 Lisburn Road, Belfast', 54.583800, -5.935200,
          '2027-05-01', 3, false, true, true, 'large',
          'No smoking indoors. Guests welcome with notice. Cleanliness expected: moderate.'),
         ($2, 'household_room', 'Spacious room with en-suite',
          'Large room with private bathroom in a lively house.',
          550.00, '8 Stranmillis Road, Belfast', 54.579200, -5.932100,
          '2027-06-01', 4, true, true, true, 'large',
          'Non-smokers preferred. Cats live here. Quiet weekday evenings.')
       RETURNING id, title, price_pcm;`,
      [landlordId, householdId]
    );
    console.log('Inserted listings:', listingsResult.rows);

    // profiles for individual
    const profilesResult = await pool.query(
      `INSERT INTO profiles
         (user_id, bio, budget_min, budget_max, move_in_date,
          shift_pattern, has_car, looking_for)
       VALUES
         ($1, '28, work nights in healthcare, quiet, tidy.', 500.00, 700.00,
          '2027-05-01', 'nights 3x/week', true, 'room'),
         ($2, 'PhD student, tidy, loves dogs.', 450.00, 600.00,
          '2027-06-01', 'standard weekdays', false, 'room')
       RETURNING id, user_id;`,
      [individualIds[0], individualIds[1]]
    );
    console.log('Inserted profiles:', profilesResult.rows);

    // tags list
    const tagLabels = [
      'non-smoker', 'pet-owner', 'tidy', 'quiet',
      'has-car', 'night-shift', 'outdoor-space', 'en-suite','enjoys-parties',
    ];
    const tagsResult = await pool.query(
      `INSERT INTO tags (label)
       SELECT unnest($1::text[])
       RETURNING id, label;`,
      [tagLabels]
    );
    console.log('Inserted tags:', tagsResult.rows);

    // Mapping the label to id
    const tagId = Object.fromEntries(tagsResult.rows.map(t => [t.label, t.id]));

 

    // Link tags to listings
    const listingIds = listingsResult.rows.map(l => l.id);
    const listingTagPairs = [
      [listingIds[0], tagId['en-suite']],
      [listingIds[0], tagId['outdoor-space']],
      [listingIds[1], tagId['quiet']],
      [listingIds[1], tagId['non-smoker']],
      [listingIds[2], tagId['en-suite']],
      [listingIds[2], tagId['non-smoker']],
      [listingIds[2], tagId['outdoor-space']],
    ];
    for (const [listingId, tId] of listingTagPairs) {
      await pool.query(
        'INSERT INTO listing_tags (listing_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;',
        [listingId, tId]
      );
    }
    console.log(`Linked ${listingTagPairs.length} listing tags`);

    // Link tags to profiles
    const profileIds = profilesResult.rows.map(p => p.id);
    const profileTagPairs = [
      [profileIds[0], tagId['non-smoker']],
      [profileIds[0], tagId['night-shift']],
      [profileIds[0], tagId['quiet']],
      [profileIds[1], tagId['pet-owner']],
      [profileIds[1], tagId['non-smoker']],
      [profileIds[1], tagId['tidy']],
    ];
    for (const [profileId, tId] of profileTagPairs) {
      await pool.query(
        'INSERT INTO profile_tags (profile_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;',
        [profileId, tId]
      );
    }
    console.log(`Linked ${profileTagPairs.length} profile tags`);

    console.log('Seed complete');

  
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await pool.end();
  }
}

seed();