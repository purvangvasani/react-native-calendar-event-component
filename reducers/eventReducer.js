import {ADD_EVENT, ADD_SUB_EVENT, DELETE_EVENT, UPDATE_EVENT} from '../actions/type'
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
    id: 0,
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
                    start: action.payload.startTime,
                    end: action.payload.endTime,
                    title: action.payload.title,
                    summary: action.payload.summary,
                })
            })
        // case ADD_SUB_EVENT:
        //     return Object.assign({}, state, {
        //         events: state.events.map((data)=>{
        //             if(data.title === action.payload.title) {
        //                 return {
        //                     ...data,
        //                     data: [...data.data,{
        //                         id: action.payload.id,
        //                         title: action.payload.title,
        //                         hour: action.payload.hour,
        //                         heading: action.payload.heading,
        //                         description: action.payload.description,
        //                     }],
        //                 }
        //             } else return
        //         })
        //     })
        case UPDATE_EVENT:
            return Object.assign({}, state, { 
                events: state.events.map((data)=>{ 
                    if(data.id === action.payload.id) {
                        return {
                            id: action.payload.id,
                            start: action.payload.start,
                            end: action.payload.end,
                            title: action.payload.title,
                            summary: action.payload.summary,
                        }
                    } else return data
                })
            })
        case DELETE_EVENT:
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