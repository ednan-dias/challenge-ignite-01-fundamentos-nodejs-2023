import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';
import { importCSV } from './utils/import-csv.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks');

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify('Title e description são obrigatórios!'));
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert('tasks', task);

      return res
        .writeHead(201)
        .end(JSON.stringify('Task foi criada com sucesso!'));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks/import-csv'),
    handler: async (req, res) => {
      await importCSV();

      return res
        .writeHead(200)
        .end(JSON.stringify('Importação concluída com sucesso!'));
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const idExists = database.selectId('tasks', id);

      if (!idExists) {
        return res
          .writeHead(404)
          .end(JSON.stringify('o ID informado não existe!'));
      }

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify('Title e description são obrigatórios!'));
      }

      database.update('tasks', id, {
        title,
        description,
        updated_at: new Date(),
      });

      return res
        .writeHead(200)
        .end(JSON.stringify('Task foi atualizada com sucesso!'));
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      const idExists = database.selectId('tasks', id);

      if (!idExists) {
        return res
          .writeHead(404)
          .end(JSON.stringify('o ID informado não existe!'));
      }

      database.update('tasks', id, {
        completed_at: new Date(),
      });

      return res.writeHead(200).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const idExists = database.selectId('tasks', id);

      if (!idExists) {
        return res
          .writeHead(404)
          .end(JSON.stringify('o ID informado não existe!'));
      }

      database.delete('tasks', id);

      return res.writeHead(200).end();
    },
  },
];
