const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

/*
{
  id: uuid(),
  title,
  url,
  techs,
  likes: 0
}
*/

function findRepositoryIndexById(request, response, next) {
  const { id } = request.params

  if (!id) {
    return response.status(400).json({error: "O id não foi informado para esta consulta!"})
  }
  
  const repositoryIndex = repositories.findIndex( (repository) => repository.id === id )

  if (repositoryIndex < 0) {
    
    return response.status(404).json({error: "Repositório não foi encontrado!"})
  }

  request.repositoryIndex = repositoryIndex
  next()
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories).send();
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)
  return response.status(201).json(repository).send();
});

app.put("/repositories/:id", findRepositoryIndexById, (request, response) => {
  
  const updatedRepository = request.body;
  const { repositoryIndex } = request
  const itemsRemove = ["id","likes"]

  for (var prop in updatedRepository) {

    if (itemsRemove.includes(prop)) {

      delete updatedRepository[prop]
    }
  }
  
  repositories[repositoryIndex] = {...repositories[repositoryIndex], ...updatedRepository}
  return response.status(200).json(repositories[repositoryIndex]).send;
});

app.delete("/repositories/:id", findRepositoryIndexById, (request, response) => {
  
  const { repositoryIndex } = request

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", findRepositoryIndexById, (request, response) => {

  const { repositoryIndex } = request;

  const likes = ++repositories[repositoryIndex].likes;

  return response.status(200).json(repositories[repositoryIndex]).send();
});

module.exports = app;
