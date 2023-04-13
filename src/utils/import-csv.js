import { parse } from 'csv-parse';
import fs from 'node:fs/promises';

export async function importCSV() {
  const filePath = new URL('../../file.csv', import.meta.url);
  const fileCsv = await fs.readFile(filePath, { encoding: 'utf8' });

  const parser = parse(fileCsv);

  let count = 0;

  for await (const [title, description] of parser) {
    if (count > 0) {
      await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, description }),
      });
    }

    count++;
  }
}
