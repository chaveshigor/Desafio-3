const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

// Middlewares
function checkIfRepoExist(request, response, next) {
  const { id } = request.params
  const currentRepo = repositories.find((repo) => repo.id === id)

  if(!currentRepo) {
    return response.status(404).json({ error: "Repository not found" })
  }

  request.repo = currentRepo

  return next()
}


app.get("/repositories", (request, response) => {
  return response.json(repositories);
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

  return response.json(repository);
});

app.put("/repositories/:id", checkIfRepoExist, (request, response) => {
  const { repo } = request
  const { url, title, techs } = request.body;

  repo.url = url
  repo.title = title
  repo.techs = techs

  return response.status(200).json(repo);
});

app.delete("/repositories/:id", checkIfRepoExist, (request, response) => {
  const { repo } = request
  repositories.splice(repositories.indexOf(repo), 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", checkIfRepoExist, (request, response) => {
  const { repo } = request

  repo.likes = repo.likes + 1

  const likes = repo.likes

  return response.json({likes});
});

module.exports = app;
