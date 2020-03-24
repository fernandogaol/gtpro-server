CREATE TABLE gtpro_cards(
  id SERIAL PRIMARY KEY,
  list_id INTEGER REFERENCES gtpro_lists(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);
