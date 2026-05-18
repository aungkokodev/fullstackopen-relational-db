CREATE TABLE blogs
(
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs 
(author, url, title) VALUES
('Steve', 'http://example.com/mastering-react', 'Mastering React'),
('Alice', 'http://example.com/postgresql-basic', 'Postgresql Basic');


