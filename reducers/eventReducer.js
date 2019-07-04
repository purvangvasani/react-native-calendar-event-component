import {ADD_EVENT, DELETE_EVENT, UPDATE_EVENT} from '../actions/type'
import AsyncStorage from '@react-native-community/async-storage'

const initialState = {
    id: 0,
    toDate: '',
    fromDate: '',
    start: '',
    end: '',
    title: '',
    summary: '',
    events: [],
}

const eventReducer = (state=initialState, action) => {
    switch(action.type){
        case ADD_EVENT:
            return Object.assign({}, state, {
                events: state.events.concat({
                    id: action.payload.id,
                    fromDate: action.payload.fromDate,
                    toDate: action.payload.toDate,
                    start: action.payload.startTime,
                    end: action.payload.endTime,
                    title: action.payload.title,
                    summary: action.payload.summary,
                })
            })
        case UPDATE_EVENT:
            AsyncStorage.removeItem('DEMO');
            return Object.assign({}, state, { 
                events: state.events.map((data)=>{ 
                    if(data.id === action.payload.id) {
                        return {
                            id: action.payload.id,
                            fromDate: action.payload.fromDate,
                            toDate: action.payload.toDate,
                            start: action.payload.start,
                            end: action.payload.end,
                            title: action.payload.title,
                            summary: action.payload.summary,
                        }
                    } else return data
                })
            })
        case DELETE_EVENT:
            AsyncStorage.removeItem('DEMO')
            return Object.assign({}, state, { 
                events: state.events.filter((data)=>{
                    if(data.id === action.payload) {       
                        events: state.events.filter((data, i)=>i!=action.payload)
                    } else return data
                })
            })
        default:
            return state
    }
}


export default eventReducer