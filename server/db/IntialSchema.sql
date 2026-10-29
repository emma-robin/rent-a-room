CREATE TYPE user_type AS ENUM ('propertyholder', 'household', 'individual');

CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    username            VARCHAR(255) NOT NULL,
    user_type    user_type NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TYPE listing_type AS ENUM ('propertyholder_property', 'household_room');

CREATE TABLE listings (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_type    listing_type NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    price_pcm       NUMERIC(8,2) NOT NULL,          -- price per calendar month
    address         VARCHAR(255) NOT NULL,
    latitude        NUMERIC(9,6),                    -- for map search / radius filtering
    longitude       NUMERIC(9,6),
    move_in_date    DATE,
    bedrooms        SMALLINT,
    en_suite        BOOLEAN DEFAULT FALSE,
    parking         BOOLEAN DEFAULT FALSE,
    outdoor_space   BOOLEAN DEFAULT FALSE,
    kitchen_size    VARCHAR(50),                     -- e.g. 'small', 'medium', 'large'
    house_rules     TEXT,                            -- guests, bills, cleanliness (household_room only)
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_listings_price ON listings(price_pcm);
CREATE INDEX idx_listings_location ON listings(latitude, longitude);
CREATE INDEX idx_listings_user ON listings(user_id);


CREATE TABLE profiles (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio             TEXT,
    budget_min      NUMERIC(8,2),
    budget_max      NUMERIC(8,2),
    move_in_date    DATE,
    shift_pattern   VARCHAR(100),                    -- e.g. 'nights 3x/week'
    has_car         BOOLEAN DEFAULT TRUE,
    looking_for     VARCHAR(50),                      -- 'room' or 'group'
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_budget ON profiles(budget_min, budget_max);


CREATE TABLE tags (
    id      SERIAL PRIMARY KEY,
    label   VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE listing_tags (
    listing_id  INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    tag_id      INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, tag_id)
);

CREATE TABLE profile_tags (
    profile_id  INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tag_id      INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, tag_id)
);


CREATE TYPE photo_owner_type AS ENUM ('listing', 'profile');

CREATE TABLE photos (
    id          SERIAL PRIMARY KEY,
    owner_type  photo_owner_type NOT NULL,
    owner_id    INTEGER NOT NULL,          -- references listings.id or profiles.id, depending on owner_type
    url         VARCHAR(500) NOT NULL,
    is_primary  BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_photos_owner ON photos(owner_type, owner_id);


CREATE TABLE chats (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(255),                 -- e.g. "Ormeau Rd Flatshare"; null for plain 1:1 chats
    max_members         SMALLINT NOT NULL DEFAULT 8,
    origin_listing_id   INTEGER REFERENCES listings(id) ON DELETE SET NULL,
    origin_profile_id   INTEGER REFERENCES profiles(id) ON DELETE SET NULL,
    created_by          INTEGER NOT NULL REFERENCES users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TYPE member_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE member_role AS ENUM ('owner', 'member');

CREATE TABLE chat_members (
    chat_id         INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          member_status NOT NULL DEFAULT 'pending',
    role            member_role NOT NULL DEFAULT 'member',
    invited_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at    TIMESTAMPTZ,
    PRIMARY KEY (chat_id, user_id)
);

CREATE INDEX idx_chat_members_user ON chat_members(user_id, status);



CREATE TABLE messages (
    id          SERIAL PRIMARY KEY,
    chat_id     INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id   INTEGER NOT NULL REFERENCES users(id),
    content     TEXT NOT NULL,
    sent_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_chat ON messages(chat_id, sent_at);
