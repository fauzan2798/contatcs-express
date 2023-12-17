const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { body, check, validationResult } = require('express-validator');
const {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContacts,
} = require('./utils/contact');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(flash());

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
  const contacts = loadContact();
  res.render('contact', {
    layout: 'layouts/main-layout',
    title: 'Halaman Contact',
    contacts,
    msg: req.flash('msg'),
  });
});

app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title: 'Halaman Add Contact',
    layout: 'layouts/main-layout',
  });
});

app.post('/contact', [
  body('nama').custom((value) => {
    const duplikat = cekDuplikat(value);

    if (duplikat) {
      throw new Error('Nama contact sudah digunakan');
    }

    return true;
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('nohp', 'Nomor hp tidak valid!').isMobilePhone('id-ID'),
], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
    res.render('add-contact', {
      title: 'Halaman Add Contact',
      layout: 'layouts/main-layout',
      errors: errors.array(),
    });
  } else {
    addContact(req.body);
    // Kirim flash message
    req.flash('msg', 'Data contact berhasil ditambahkan');
    res.redirect('/contact');
  }
});

app.get('/contact/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama);

  if (!contact) {
    res.status(404);
    res.send('<h1>404</h1>');
  } else {
    deleteContact(req.params.nama);
    req.flash('msg', 'Data contact berhasil dihapus');
    res.redirect('/contact');
  }
});

app.get('/contact/edit/:nama', (req, res) => {
  const contact = findContact(req.params.nama);

  res.render('edit-contact', {
    title: 'Halaman Ubah Contact',
    layout: 'layouts/main-layout',
    contact,
  });
});

app
  .post('/contact/update', [
    body('nama').custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error('Nama contact sudah digunakan');
      }

      return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('nohp', 'Nomor hp tidak valid!').isMobilePhone('id-ID'),
  ], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
      res.render('edit-contact', {
        title: 'Halaman Edit Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContacts(req.body);
      // Kirim flash message
      req.flash('msg', 'Data contact berhasil diubah');
      res.redirect('/contact');
    }
  });

app.get('/contact/:nama', (req, res) => {
  const contact = findContact(req.params.nama);

  res.render('detail', {
    layout: 'layouts/main-layout',
    title: 'Halaman Detail Contact',
    contact,
  });
});

app.use((req, res) => {
  res.status(404);
  res.send('<h1>404</h1>');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
