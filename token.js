const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
    // Autenticação do usuário
    const token = jwt.sign({ userId: user.id }, 'seuSegredo', { expiresIn: '1h' });
    res.json({ token });
});
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.get('/protected', verifyToken, (req, res) => {
    jwt.verify(req.token, 'seuSegredo', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({ message: 'Acesso permitido', authData });
        }
    });
});
