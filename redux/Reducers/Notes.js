import { SET_NOTES } from "../Actions/actionTypes";

const set_Notes = (state=[], action)=> {
    console.log(action)
    // const [value, setValue] = useState('')
    switch(action.type) {
        case SET_NOTES:
            console.log(action,"Action");
            let item = action.data;
            return  [...state,item];

        default:
            return state;
    }
}

export default set_Notes