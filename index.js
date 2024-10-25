/*
   _request Body => { "name":"karlos", "age":17 }

   _GET           => Buscar informação no Back-end
   _POST          => Criar informação no Back-end
   _PUT / PATCH   => Alterar / Atualizar informação no back-end
   _DELETE        => Deletar informação no Back-end

   _Middleware => INTERCEPTADOR => tem o poder de parar ou alterar dados da requisição

*/

const express = require('express');
const uuid = require('uuid');
const app = express();
const port = 3000;

app.use(express.json());

const users = [];

// Middleware para verificar se o usuário existe
const checkUserid = (request, response, next) => {
    const { id } = request.params;
    const index = users.findIndex(user => user.id === id);

    if (index < 0) {
        return response.status(404).json({ message: "User not found" });
    }

    request.userIndex = index;
    request.userid = id
    next();
};

app.get('/users', (request, response) => {
    return response.json(users);
});

app.post('/users', (request, response) => {
    const { name, age } = request.body;
    const user = { id: uuid.v4(), name, age };
    users.push(user);
    return response.status(201).json(user);
});

// Aplica o middleware checkUserid nas rotas que precisam
app.put('/users/:id', checkUserid, (request, response) => {
    const { name, age } = request.body;
    const index = request.userIndex;
    const id = request.userid

    const updatedUser = { id: request.params.id, name, age };
    users[index] = updatedUser;

    return response.json(updatedUser);
});

app.delete('/users/:id', checkUserid, (request, response) => {
    const index = request.userIndex;

    users.splice(index, 1);

    return response.status(204).json();
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});