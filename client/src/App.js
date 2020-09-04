import React, { useEffect, useState } from 'react';
import axios from 'axios';
const baseUrl = '/api/persons'

function App() {
  const [book, setBook] = useState([]);
  const [name, setName] = useState();
  const [number, setNumber] = useState();

  const fetch = async () => {
    const { data } = await axios.get(baseUrl)
    setBook(data);
  }

  useEffect(() => {
    fetch();
  }, [])

  const handleDelete = (e) => {
    axios.delete(`${baseUrl}/${e.target.id}`)
    fetch();
  }

  const handleSubmit = async () => {
    await axios.post(baseUrl, {
      name, 
      number
    })
    fetch();
  }

  return (
    <div className="App">
      <h1>Phone Book</h1>
      <ul>
        {book.map(item => 
          <li>{item.name} {item.number} <button id={item.id} onClick={handleDelete}>delete</button></li>
        )}
      </ul>

      <form onSubmit={handleSubmit}>
        <input onChange={(e) => setName(e.target.value)} type='text' placeholder='name'/>
        <input onChange={(e) => setNumber(e.target.value)} type='text' placeholder='number'/>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default App;