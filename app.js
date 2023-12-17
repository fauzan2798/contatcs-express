const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));

app.get('/', (req, res) => {
  const mahasiswa = [
    {
      nama: 'Sandhika Galih',
      email: 'sandhikagalih@gmail.com',
    },
    {
      nama: 'Erik',
      email: 'erik@gmail.com',
    },
    {
      nama: 'Doddy',
      email: 'doddy@gmail.com',
    },
  ];
  res.render('index', {
    layout: 'layouts/main-layout',
    nama: 'Sandhika Galih',
    mahasiswa,
    title: 'Halaman Home',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'Halaman About',
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    layout: 'layouts/main-layout',
    title: 'Halaman Contact',
  });
});

app.use((req, res) => {
  res.status(404);
  res.send('<h1>404</h1>?');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
