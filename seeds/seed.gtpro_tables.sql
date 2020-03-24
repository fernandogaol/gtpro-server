BEGIN;

TRUNCATE
  gtpro_users,
  gtpro_projects,
  gtpro_lists,
  gtpro_cards
  RESTART IDENTITY CASCADE;

INSERT INTO gtpro_users (user_name, full_name, password)
VALUES
  ('dunder', 'Dunder Mifflin', 'password'),
  ('b.deboop', 'Bodeep Deboop', 'deboop'),
  ('c.bloggs', 'Charlie Bloggs', 'Charlie');

INSERT INTO gtpro_projects (title,user_id)
VALUES
  ('no title', 2),  
  ('Ruby Red Slippers', 2),
  ( 'Magic Lamp', 1);

INSERT INTO gtpro_lists (title, project_id) VALUES
  (
    'backlog',
    1
  ),
  (
    'upcoming',
    1
  ),
    (
    'to do',
    1
  ),
  (
    'upcoming',
    2
  ),
  (
    'upcoming',
    3
  );
INSERT INTO gtpro_cards (content, list_id) VALUES
('static app', 3), 
('API server', 3),
('style app',3), 
('build a chat system', 1);
 
COMMIT;
