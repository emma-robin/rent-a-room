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
CREATE TYPE contract_type AS ENUM ('rolling_monthly', 'fixed_term_six_months', 'fixed_term_twelve_months', 'short_let');

CREATE TABLE listings (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_type    listing_type NOT NULL,
    contract_type   contract_type NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    price_pcm       NUMERIC(8,2) NOT NULL,          -- price per calendar month
    address         VARCHAR(255) NOT NULL,
    latitude        NUMERIC(9,6),                    -- for map search / radius filtering
    longitude       NUMERIC(9,6),
    move_in_date    DATE,
    move_out_date    DATE,
    bedrooms         SMALLINT,
    en_suite        BOOLEAN DEFAULT FALSE,
    parking         BOOLEAN DEFAULT FALSE,
    outdoor_space   BOOLEAN DEFAULT FALSE,
    kitchen_length_m NUMERIC(6, 3),
    kitchen_width_m  NUMERIC(6, 3),
    bedroom_length_m NUMERIC(6, 3),
    bedroom_width_m  NUMERIC(6, 3),
    house_rules     TEXT,                            -- guests, bills, cleanliness
    accepts_pets    BOOLEAN DEFAULT FALSE,
    accepts_benefits BOOLEAN DEFAULT FALSE,
    legislation_declared BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_date_range CHECK (
        move_in_date IS NULL
        OR move_out_date IS NULL
        OR move_out_date > move_in_date
    )
);

CREATE INDEX idx_listings_price ON listings(price_pcm);
CREATE INDEX idx_listings_location ON listings(latitude, longitude);
CREATE INDEX idx_listings_user ON listings(user_id);

CREATE TYPE shift_pattern AS ENUM ('standard 9-5', 'nightshift only', 'rotating shifts','early shift', 'late shift','flexible' );
CREATE TYPE looking_for AS ENUM ('room', 'person');

CREATE TABLE profiles (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio             TEXT,
    budget_min      NUMERIC(8,2),
    budget_max      NUMERIC(8,2),
    move_in_date    DATE,
    shift_pattern   shift_pattern,
    has_car         BOOLEAN DEFAULT TRUE,
    looking_for     looking_for NOT NULL,
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
    owner_id    INTEGER NOT NULL,
    url         VARCHAR(500) NOT NULL,
    is_primary  BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_photos_owner ON photos(owner_type, owner_id);


CREATE TABLE chats (
    id                  SERIAL PRIMARY KEY,
    chat_name                VARCHAR(255),
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
