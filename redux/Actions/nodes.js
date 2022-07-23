import { GET_NOTES, SET_NOTES } from "./actionTypes"

export const getNotes =(data)=> {
    return {
        type: GET_NOTES,
        data
    }
}

export const setNotes =(data)=> {
    return {
        type: SET_NOTES,
        data
    }
}