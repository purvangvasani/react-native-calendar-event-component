import {ADD_EVENT, ADD_SUB_EVENT, DELETE_EVENT, UPDATE_EVENT} from './type'

export const addEvent = (id, title, hour, heading, description) => {
    console.log('==Action==================================');
    console.log(id, title, hour, heading, description);
    console.log('====================================');
    return {
        type: ADD_EVENT,
        payload: {id, title, hour, heading, description}
    }
}

export const addSubEvent = (id, title, hour, heading, description) => {
    return {
        type: ADD_SUB_EVENT,
        payload: {id, title, hour, heading, description}
    }
}

export const updateEvent = (id, title, hour, heading, description) => {
    return{
        type: UPDATE_EVENT,
        payload: {id, title, hour, heading, description}
    }
}

export const deleteEvent = title => {
    return{
        type: DELETE_EVENT,
        payload: title
    }
}