CREATE TABLE gtpro_lists(
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES gtpro_projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);