import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNotes } from '../redux/Actions/nodes'

const API_LOCAL_URL="http://localhost:1337";
const API_HR_URL="https://strapi-for-cokwp.herokuapp.com";

const Notes = () => {
    const data = useSelector((state)=>state.notes)
    const [authTT, setAuthTT] = useState("")
    const dispatch = useDispatch()
    useEffect( ()=>{
        const token = localStorage.getItem("authToken")
        setAuthTT(token)
        if (token) {
            fetch(`${API_HR_URL}/api/notes/`, {
                method: "GET",
                headers: {
                    "content-Type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then((res)=>res.json()).then((res)=>dispatch(setNotes(res.data)))
        }
    },[])
    console.log(data, "notes")
  return (
    <>
    {authTT.length ? data && data.length && data.map((val,ind)=> {
        console.log(val[ind]?.attributes?.audioData)
        return (
            <div key={val?.id}>
                <h1>{val[ind]?.id}   {val[ind]?.attributes?.Title}  {val[ind]?.attributes?.Description}</h1>
                <br/>
                {/* {val[ind]?.attributes?.audioData && <img src={`${val[ind]?.attributes?.audioData}`} alt="jklk"></img>} */}
                {val[ind]?.attributes?.audioData && <audio src={`${val[ind]?.attributes?.audioData}`} alt="jklk"></audio>}
                {val[ind]?.attributes?.audioData && <audio controls> <source src={`${val[ind]?.attributes?.audioData}`} alt="jklk" /></audio>}
            </div>
        )
    }) : null}
    {!authTT.length ? <h1>Please login</h1> : null}
    </>
  )
}

export default Notes