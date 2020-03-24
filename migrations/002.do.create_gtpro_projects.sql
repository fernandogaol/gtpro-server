CREATE TABLE gtpro_projects(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES gtpro_users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);
