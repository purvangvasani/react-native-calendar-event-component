import {ADD_EVENT, ADD_SUB_EVENT, DELETE_EVENT, UPDATE_EVENT} from './type'

export const addEvent = (id, startTime, endTime, title, summary) => {
    return {
        type: ADD_EVENT,
        payload: {id, startTime, endTime, title, summary}
    }
}

// export const addSubEvent = (id, title, hour, heading, description) => {
//     return {
//         type: ADD_SUB_EVENT,
//         payload: {id, title, hour, heading, description}
//     }
// }

export const updateEvent = (id, start, end, title, summary) => {
    return{
        type: UPDATE_EVENT,
        payload: {id, start, end, title, summary}
    }
}

export const deleteEvent = id => {
    return{
        type: DELETE_EVENT,
        payload: id
    }
}