import React, { useEffect , useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import awsExports from "./aws-exports";
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
Amplify.configure(awsExports);

const initialState = {name:"", description:""}

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

  return (
    <div className="app">
      {/* <Authenticator>

        <br />
        <br />
      <div style={styles.container}>
         <h2 style={{textAlign:"center"}}>Amplify Todo App</h2>
         <input 
          style={styles.input}
          placeholder="username"
          onChange={event => setInput("name",event.target.value)}
          value={formState.name}
         />
          <input 
          style={styles.input}
          placeholder="description"
          onChange={event => setInput("description",event.target.value)}
          value={formState.description}
         />
         <button style={styles.button} onClick={addTodo}>create todo</button>
         {
           todos.map((todo,index)=>(
             <div key={todo.id ? todo.id : index} style={styles.todo}>    
               <p style={styles.name}>{todo.name}</p>
               <p style={styles.description}>{todo.description}</p>
             </div>
           ))
         }
      </div>
              
      </Authenticator> */}





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
