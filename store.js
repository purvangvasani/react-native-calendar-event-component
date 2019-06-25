import {combineReducers, createStore} from 'redux'
import eventReducer from './reducers/eventReducer'

const rootReducer = combineReducers({
    event: eventReducer,
})

const configureStore = () =>{
    return createStore(rootReducer)
}

export default configureStore