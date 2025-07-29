const jsonServer = require('json-server');
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Seu arquivo db.json
const middlewares = jsonServer.defaults();
const bcrypt = require('bcryptjs');
const { SECRET_KEY } = require('./config');

const cors = require('cors');
server.use(cors({ origin: 'http://localhost:3000', credentials: true }));

server.use(middlewares);
server.use(jsonServer.bodyParser); // Para parsear o corpo das requisições POST

// Adicione uma rota de login personalizada
server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').value();
  const user = users.find(u => u.email === email);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

server.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  const users = router.db.get('users').value();

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Usuário já existe' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    role: role || 'OPERADOR',
  };

  router.db.get('users').push(newUser).write();
  return res.status(201).json({
    message: 'Usuário criado com sucesso',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });

});

server.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const users = router.db.get('users').value();
    const user = users.find(u => u.id === decoded.id);

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
});


server.use(router); // Use o roteador do json-server para outras rotas (ex: /users)

server.listen(3001, () => {
  console.log('JSON Server com JWT rodando na porta 3001');
});