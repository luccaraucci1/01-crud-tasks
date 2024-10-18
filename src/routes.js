import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-paths.js";
import { randomUUID } from 'node:crypto'
import { CsvParser } from "./utils/csv-parser.js";

const database = new Database

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res.writeHead(200).end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description} = req.body
      
      if(!title || !description){
        return res.writeHead(400).end("title or description missing")
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date(),
        completed_at: null,
        updated_at: new Date(),
      }

      database.insert('tasks', task)

      

      return res.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { id } = req.query

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end(JSON.stringify("task not found"))
      }

      database.delete('tasks', id)

    

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { id, data } = req.body

      if(!data.title || !data.description){
        return res.writeHead(400).end(JSON.stringify("title and description are required"))
      }


      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end(JSON.stringify("task not found"))
      }



      database.update('tasks', id, data)

    

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { id, completed } = req.query

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end(JSON.stringify("task not found"))
      }


      if(!completed){
        return res.writeHead(401).end(JSON.stringify("completed is required"))
      }


      database.update('tasks', id, undefined, completed)

    

      return res.writeHead(204).end()
    }
  },
]