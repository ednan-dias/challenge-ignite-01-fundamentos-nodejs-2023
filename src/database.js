import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table) {
    return this.#database[table] ?? [];
  }

  selectId(table, id) {
    let task;

    if (this.#database[table]) {
      task = this.#database[table].find((task) => task.id === id);
    }

    return Boolean(task);
  }

  insert(table, data) {
    if (this.#database[table]) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();
  }

  update(table, id, data) {
    const taskIndex = this.#database[table].findIndex((task) => task.id === id);

    if (taskIndex !== -1) {
      this.#database[table][taskIndex] = {
        ...this.#database[table][taskIndex],
        ...data,
      };

      this.#persist();
    }
  }

  delete(table, id) {
    const taskIndex = this.#database[table].findIndex((task) => task.id === id);

    if (taskIndex !== -1) {
      this.#database[table] = this.#database[table].filter(
        (task) => task.id !== id
      );

      this.#persist();
    }
  }
}
