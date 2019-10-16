const express = require('express');

const server = express();

server.use(express.json());

const projetos = [];
let numeroDeRequisicoes = 0;

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const projeto = projetos.find(p => p.id == id);

  if (!projeto) {
    return res.status(400).json({ error: 'O projeto não existe' });
  }

  return next();
}

function logRequests(req, res, next) {
  numeroDeRequisicoes++;

  console.log(`Número de requisições: ${numeroDeRequisicoes}`);

  return next();
}

server.use(logRequests);



server.post('/projects',(req, res) => {
  
  const { id , title } = req.body;
 
  const projeto = {
    id,
    title,
    task:[]
  };

  projetos.push(projeto);

  return res.json(projetos);
});


server.get('/projects',(req, res) => {
  return res.json(projetos);
});


server.put('/projects/:id',checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
 
  projetos[id].title = title;
 
  return res.json(projetos);
});

server.delete('/projects/:id',checkProjectExists,(req, res) => {
  const { id } = req.params;
  
  const projectIndex = projetos.findIndex(p => p.id == id);

  projetos.splice(projectIndex, 1);

  return res.send();
  
});

server.post('/projects/:id/task',checkProjectExists,(req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  
  const projeto = projetos.find(p => p.id == id);

  projeto.task.push(title);

  return res.json(projeto);
});

server.listen(3000);