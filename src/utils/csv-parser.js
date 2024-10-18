import fs from 'fs';
import { parse } from 'csv-parse';
import { URL } from 'node:url';

export async function CsvParser() {
  const databasePath = new URL('../data.csv', import.meta.url);

  const buffers = []

  // Abrindo o arquivo como um stream
  const parser = fs.createReadStream(databasePath).pipe(parse());

  for await (const record of parser) {
    buffers.push(record)
    //req.body = record
    await new Promise((resolve) => setTimeout(resolve, 100));
  }


  const fullStreamContent = Buffer.concat(buffers).toString()
  console.log(fullStreamContent)

  return fullStreamContent
}