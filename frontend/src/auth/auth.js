// routes/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const generarToken = (usuario) => {
  return jwt.sign(
    {
      sub: usuario.id.toString(),
      name: usuario.nombre,
      'https://hasura.io/jwt/claims': {
        'x-hasura-user-id': usuario.id.toString(),
        'x-hasura-default-role': usuario.rol,
        'x-hasura-allowed-roles': ['usuario', 'admin', 'dev'],
      },
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = await obtenerUsuario(email, password); // tu lógica
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const token = generarToken(usuario);
  res.json({
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
      foto_perfil: usuario.foto_perfil,
    },
  });
});
module.exports = { generarToken };