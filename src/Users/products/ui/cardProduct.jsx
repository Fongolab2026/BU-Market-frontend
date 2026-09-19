import {Heart} from 'lucide-react'
export default function CardProducts({...props}){
    return(
        <>
            <div className="card bg-base-100 w-52 shadow-sm">
    <figure>
    <img
      src={props.src}
      alt={props.alt} />
  </figure>
  <div className="card-body">
    <h2 className="card-title">
      {props.nameProduct}
      <div className="badge badge-secondary">NEW</div>
    </h2>
    <p>{props.descritption}</p>
    <div className="card-actions justify-end">
      <div className="badge badge-outline">{props.category}</div>
      <div className="badge badge-outline">{props.prix}</div>
    </div>
  </div>
</div>

        </>
    )
}