import { client } from "../../api/client";

const initialState = [
    // { id: 0, text: 'Learn React', completed: true },
    // { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
    // { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
]

function nextTodoId(todos) {
    const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
    return maxId + 1
}

export default function todosReducer(state = initialState, action) {
    switch (action.type) {
        case 'todos/todoAdded': {
            return [
                ...state,
                {
                    id: nextTodoId(state),
                    text: action.payload,
                    completed: false
                }
            ]
        }
        case 'todos/todoToggled': {
            console.log('dispatch action');
            return state.map(todo => {
                if (todo.id !== action.payload) {
                    return todo
                }
                return {
                    ...todo,
                    completed: !todo.completed
                }
            })
        }
        case 'todos/colorSelected': {
            const {color, todoId} = action.payload
            return state.map(todo => {
                if (todo.id !== todoId) {
                    return todo
                }
                return {
                    ...todo,
                    color
                }
            })
        }
        case 'todos/todoDeleted': {
            return state.filter(todo => todo.id !== action.payload)
        }
        case 'todos/allCompleted': {
            return state.map(todo => {
                return {...todo, completed: true}
            })
        }
        case 'todos/CompletedCleared': {
            return state.filter(todo => !todo.completed)
        }
        case 'todos/todosLoaded': {
            return action.payload
        }
        default:
            return state
    }
}

//Thunk function
export async function fetchTodos(dispatch, getState) {
    const response = await client.get('/fakeApi/todos')
    dispatch({type: 'todos/todosLoaded', payload: response.todos})
}