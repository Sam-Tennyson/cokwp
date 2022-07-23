import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNotes } from '../redux/Actions/nodes'

const Notes = () => {
    const data = useSelector((state)=>state.notes)
    const [authTT, setAuthTT] = useState("")
    const dispatch = useDispatch()
    useEffect( ()=>{
        const token = localStorage.getItem("authToken")
        setAuthTT(token)
        if (token) {
            fetch("https://strapi-for-cokwp.herokuapp.com/api/notes/", {
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
        // console.log(val[ind])
        return (
            <div key={val?.id}>
                <h1>{val[ind]?.id}   {val[ind]?.attributes?.Title}  {val[ind]?.attributes?.Description}</h1>
            </div>
        )
    }) : null}
    {!authTT.length ? <h1>Please login</h1> : null}
    </>
  )
}

export default Notes