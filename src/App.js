import React, { useEffect , useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { API, graphqlOperation } from 'aws-amplify'
import awsExports from "./aws-exports";
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
Amplify.configure(awsExports);

const initialState = {name:"", description:""}
const initialFormState = "";
function App() {

  const [formState , setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(()=>{
     
  },[])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  const fetchTodos = async ()=> {
     try{
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
     }catch(error){console.log("todos faild to fetch 404!")}
  }


  const addTodo = async () => {
    try{
       if(!formState.name || !formState.description)return
       const todo = {...formState};
       setTodos([...todos,todo])
       setFormState(initialState)
       await API.graphql(graphqlOperation(createTodo, {input:todo}))
    }catch(error){
       console.log("error createing todo", error)
    }
  }

  // image uploade onChange function

  const [formData, setFormData] = useState([]);

async function onChange (e){
  if(!e.target.files[0])return
  const file =e.target.file[0] 
  setFormData({...formData,image: file.name})
  await Storage.put(file.name,file)
  fetchNots();
}

// fetch image from graphql schema

const [notes, setNotes] = useState()

async function fetchNots(){
  const listNotes = "";
  const apiData = await API.graphql({query: listNotes})
  const notsFromAPI = API.apiData.listNotes.items ;
  await Promise.all(notsFromAPI.map(async note=>{
    if(note.image){
      const image = await Storage.get(note.image)
      note.image = image ;
    }
    return note
  }))
  setNotes(apiData.data.listNotes.item)
}
//. Update the createNote function to add the image to the local image array if an image is associated with the note:
async function createNote(){
  let createNoteMutation = "";
      if(!formData.name || !formData.description)return
      await API.graphql({query: createNoteMutation, variables: {input:formData}})
      if(formData.image){
        const image = await Storage.get(formData.image);
        formData.image = image;
      }
      setNotes([...notes, formData])
      setFormData(initialFormState)
}


  return (
    <div className="app">
     
     <Authenticator>
    {({ signOut, user }) => (
      <div style={styles.container}>
        <h1>Hello {user.username}</h1>
        <button style={styles.button} onClick={signOut}>Sign out</button>
        <br />
        <h2>Amplify Todos</h2>
        <input
          onChange={event => setInput('name', event.target.value)}
          style={styles.input}
          value={formState.name}
          placeholder="Name"
        />
        <input
          onChange={event => setInput('description', event.target.value)}
          style={styles.input}
          value={formState.description}
          placeholder="Description"
        />
       
        <button style={styles.button} onClick={addTodo}>Create Todo</button>
   
        {
          todos.map((todo, index) => (
            <div key={todo.id ? todo.id : index} style={styles.todo}>
              <p style={styles.todoName}>{todo.name}</p>
              <p style={styles.todoDescription}>{todo.description}</p>
            </div>
          ))
        }
            <input
          type="file"
          onChange={onChange}
        />
        {
  //       notes.map(note => (
  //         <div key={note.id || note.name}>
  //           <h2>{note.name}</h2>
  //           <p>{note.description}</p>
  //           {/* <button onClick={() => deleteNote(note)}>Delete note</button> */}
  //           {
  //             note.image && <img src={note.image} style={{width: 400}} />
  //           }
  //          </div>
  // ))
}
      </div>
    )}
     </Authenticator>
    </div>
  );
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default (App);
