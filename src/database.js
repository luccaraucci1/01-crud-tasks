import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)



export class Database{
  #database = {}

  constructor(){
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }


  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search){
    let data = this.#database[table] ?? []


    if(search){
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data){
    if(Array.isArray(this.#database[table])){
      this.#database[table].push(data)


    }else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data

  }

  delete(table, id){
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex > -1){
     this.#database[table].splice(rowIndex, 1)
     this.#persist()
    }
  }

  update(table, id, data, completed){
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex > -1){
      if(!completed){
        this.#database[table][rowIndex] = 
          {
            id, 
            ...data, 
            updated_at: new Date(), 
            created_at: this.#database[table][rowIndex].created_at, 
            completed_at: this.#database[table][rowIndex].completed_at
          }
      }
      else{
        this.#database[table][rowIndex].completed_at = new Date()
      }
     this.#persist()
    }
  }
}