import {Heart} from 'lucide-react'
export default function CardProducts({...props}){
    return(
        <>
            <div className="w-[200px] h-[250px] border border-black flex flex-col rounded-2xl">
                <img src={props.src} alt={props.alt} className="w-full h-1/2 object-cover rounded-t-2xl "/>
               <div className="p-2 flex flex-col gap-1">
                <h2 className="font-bold capitalize">{props.nameProduct}</h2>
                <p className="uppercase">{props.nomVendeur}</p>
                <h2 className="font-bold">{props.prix}</h2>
                <div className="flex justify-end">
                    <Heart />
                </div>
               </div>
               
            </div>

        </>
    )
}