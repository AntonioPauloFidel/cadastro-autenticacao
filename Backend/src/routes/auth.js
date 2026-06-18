const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../database');

const router = express.Router();

const registerValidations = [
  body('name')
    .trim()
    .notEmpty().withMessage('O nome é obrigatório.')
    .isLength({ min: 2 }).withMessage('O nome deve ter pelo menos 2 caracteres.'),
  body('email')
    .trim()
    .notEmpty().withMessage('O e-mail é obrigatório.')
    .isEmail().withMessage('Informe um e-mail válido.'),
  body('password')
    .notEmpty().withMessage('A senha é obrigatória.')
    .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.'),
  body('confirmPassword')
    .notEmpty().withMessage('A confirmação de senha é obrigatória.')
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('As senhas não coincidem.');
      return true;
    }),
];

const loginValidations = [
  body('email')
    .trim()
    .notEmpty().withMessage('O e-mail é obrigatório.')
    .isEmail().withMessage('Informe um e-mail válido.'),
  body('password')
    .notEmpty().withMessage('A senha é obrigatória.'),
];

router.post('/register', registerValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ errors: [{ msg: 'Este e-mail já está cadastrado.' }] });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      userId: result.lastID,
    });
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.' }] });
  }
});

router.post('/login', loginValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ errors: [{ msg: 'E-mail ou senha inválidos.' }] });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ errors: [{ msg: 'E-mail ou senha inválidos.' }] });
    }

    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.' }] });
  }
});

router.get('/users', async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(20, Math.max(1, parseInt(req.query.limit) || 8));
    const search = (req.query.search || '').trim();
    const offset = (page - 1) * limit;

    const where  = search ? 'WHERE name LIKE ? OR email LIKE ?' : '';
    const params = search ? [`%${search}%`, `%${search}%`] : [];

    const { count } = await db.get(
      `SELECT COUNT(*) AS count FROM users ${where}`,
      params
    );

    const users = await db.all(
      `SELECT id, name, email, created_at FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return res.status(200).json({
      users,
      pagination: {
        total:      count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.' }] });
  }
});

module.exports = router;
