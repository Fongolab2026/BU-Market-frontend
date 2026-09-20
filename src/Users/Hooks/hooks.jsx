import { useState,useEffect } from "react"
import {api} from "../../data/api"

export default function useProducts(url ){
    const [loading,setLoading]=useState(false)
    const [data,setData]= useState([])
    const [err,setErr]= useState(null)
    useEffect(()=>{
        const fetchData = async ()=>{
            setLoading(true)
            try{
                const rep = await api.get(url)
                if(rep.status!==200){
                    throw new Error(`echec de chargement statut ${rep.status}`)
                }
                const products = await rep.data.results
                setData(products)
            }catch(e){
                setErr(e instanceof Error? e: new Error("une erreur est arrivee"))
            }
            finally{
                setLoading(false)
            }
        }
        fetchData()
    },[url])
    return {data,err,loading}
    
}