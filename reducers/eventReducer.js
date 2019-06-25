import {ADD_EVENT, ADD_SUB_EVENT, DELETE_EVENT, UPDATE_EVENT} from '../actions/type'
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
    id: 0,
    title: '',
    hour: '', 
    heading: '', 
    description: '',
    data: [],
    events: [
        {
            title: '2019-06-20',
            data: [
                {
                    id: 0,
                    title: '2019-06-20',
                    hour: '12:20',
                    heading: 'Demo Event: Do not Update or Delete this Event',
                    description: 'hello'
                }
            ]
        },
    ]
}

const eventReducer = (state=initialState, action) => {
    switch(action.type){
        case ADD_EVENT:
            return Object.assign({}, state, {
                events: state.events.concat({
                    title: action.payload.title,
                    data: state.data.concat({
                        id: action.payload.id,
                        title: action.payload.title,
                        hour: action.payload.hour,
                        heading: action.payload.heading,
                        description: action.payload.description,
                    }),
                })
            })
        case ADD_SUB_EVENT:
            return Object.assign({}, state, {
                events: state.events.map((data)=>{console.log("action-",action.payload,"data-", data.data) 
                    if(data.title === action.payload.title) {console.log("Conditon Check-",data.title === action.payload.title)       
                        return {
                            ...data,
                            data: [...data.data,{
                                id: action.payload.id,
                                title: action.payload.title,
                                hour: action.payload.hour,
                                heading: action.payload.heading,
                                description: action.payload.description,
                            }],
                        }
                    } else return
                })
                // events: state.events.concat({ 
                //     events :state.events.map((data)=>{
                //         if(data.title === action.payload.title) {       
                //             return {
                //                 ...data,
                //                 data: [...data.data,
                //                     {
                //                         id: action.payload.id,
                //                         title: action.payload.title,
                //                         hour: action.payload.hour,
                //                         heading: action.payload.heading,
                //                         description: action.payload.description,
                //                     }
                //                 ]
                //             }
                //         } 
                //     })
                //     // else{console.log(data);
                //     //  return [...data,{
                //     //         title: action.payload.title,
                //     //         data: state.data.concat({
                //     //             id: action.payload.id,
                //     //             title: action.payload.title,
                //     //             hour: action.payload.hour,
                //     //             heading: action.payload.heading,
                //     //             description: action.payload.description,
                //     //         }),
                //     //     }] }
                // })
            })
        case UPDATE_EVENT:
            AsyncStorage.removeItem('event')
            return Object.assign({}, state, { 
                events: state.events.map((data)=>{console.log("action-",action.payload,"data-", data.data) 
                    if(data.title === action.payload.title) {console.log("Conditon Check-",data.title === action.payload.title)       
                        return {
                            ...data,
                            data: state.data.concat({
                                id: action.payload.id,
                                title: data.title,
                                hour: action.payload.hour,
                                heading: action.payload.heading,
                                description: action.payload.description,
                            }),
                        }
                    } else return data
                })
            })
        case DELETE_EVENT:
            return Object.assign({}, state, { 
                events: state.events.filter((data)=>{console.log("action-",action.payload,"data-", data.title) 
                    if(data.title === action.payload) {       
                        events: state.events.filter((data, i)=>i!=action.payload)
                    } else return data
                })
            })
        default:
            return state
    }
}


export default eventReducer