import {ADD_EVENT, DELETE_EVENT, UPDATE_EVENT} from './type'

export const addEvent = (id, fromDate, toDate, startTime, endTime, title, summary) => {
    return {
        type: ADD_EVENT,
        payload: {id, fromDate, toDate, startTime, endTime, title, summary}
    }
}

export const updateEvent = (id, fromDate, toDate, start, end, title, summary) => {
    return{
        type: UPDATE_EVENT,
        payload: {id, fromDate, toDate, start, end, title, summary}
    }
}

export const deleteEvent = id => {
    return{
        type: DELETE_EVENT,
        payload: id
    }
}