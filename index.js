const express = require('express');
const app = express();
const mysql = require('mysql2');
const PORT = process.env.PORT || 3000;

app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'N3CAMARGO'
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err.stack);
        return;
    }
    console.log('Conectado ao banco de dados com sucesso.');
});


app.get('/prestador/:id', (req, res) => {
    const { id } = req.params;

    let query = `SELECT * FROM Prestador WHERE codigo_prestador = ?`;

    connection.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Prestador de serviço não encontrado.');
        }
    });
});
app.put('/prestador/:id', (req, res) => {
    const { id } = req.params;
    const { nome, cpf, experiencia, id_categoria } = req.body;

    let query = `UPDATE Prestador SET nome_prestador = ?, cpf_prestador = ?, experiencia = ?, id_categoria = ? WHERE codigo_prestador = ?`;

    connection.query(query, [nome, cpf, experiencia, id_categoria, id], (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (results.affectedRows > 0) {
            res.status(200).json({ message: "Prestador de serviço atualizado com sucesso." });
        } else {
            res.status(404).send('Prestador de serviço não encontrado.');
        }
    });
});
app.delete('/prestador/:id', (req, res) => {
    const { id } = req.params;

    let query = `DELETE FROM Prestador WHERE codigo_prestador = ?`;

    connection.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (results.affectedRows > 0) {
            res.status(200).json({ message: "Prestador de serviço deletado com sucesso." });
        } else {
            res.status(404).send('Prestador de serviço não encontrado.');
        }
    });
});
app.post('/categoria', (req, res) => {
    const { nome } = req.body;

    let query = `INSERT INTO Categoria (nome_categoria) VALUES (?)`;

    connection.query(query, [nome], (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(201).json({ message: "Categoria criada com sucesso." });
        }
    });
});
app.get('/categoria/:id', (req, res) => {
    const { id } = req.params;

    let query = `SELECT * FROM Categoria WHERE id_categoria = ?`;

    connection.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Categoria não encontrada.');
        }
    });
});
app.put('/categoria/:id', (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    let query = `UPDATE Categoria SET nome_categoria = ? WHERE id_categoria = ?`;

    connection.query(query, [nome, id], (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (results.affectedRows > 0) {
            res.status(200).json({ message: "Categoria atualizada com sucesso." });
        } else {
            res.status(404).send('Categoria não encontrada.');
        }
    });
});
app.delete('/categoria/:id', (req, res) => {
    const { id } = req.params;

    let query = `DELETE FROM Categoria WHERE id_categoria = ?`;

    connection.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (results.affectedRows > 0) {
            res.status(200).json({ message: "Categoria deletada com sucesso." });
        } else {
            res.status(404).send('Categoria não encontrada.');
        }
    });
});
function calcularValorServico(experiencia) {
    const valorBase = 50; // R$ 50,00 por hora

    if (experiencia === 3) {
        return valorBase * 1.30; // Acréscimo de 30%
    } else if (experiencia > 3 && experiencia <= 5) {
        return valorBase * 1.50; // Acréscimo de 50%
    } else if (experiencia > 5) {
        return valorBase * 1.75; // Acréscimo de 75%
    } else {
        return valorBase; // Sem acréscimo para experiência menor que 3 anos
    }
}
app.post('/prestador', (req, res) => {
    const { nome, cpf, experiencia, id_categoria } = req.body;
    let valorServico = calcularValorServico(experiencia);

    let query = `INSERT INTO Prestador (nome_prestador, cpf_prestador, experiencia, id_categoria, valor_servico) VALUES (?, ?, ?, ?, ?)`;

    connection.query(query, [nome, cpf, experiencia, id_categoria, valorServico], (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(201).json({ message: "Prestador de serviço criado com sucesso.", valorServico: valorServico });
        }
    });
});
app.listen(PORT, () => {
    console.log(`Live on port ${PORT}`);
});

