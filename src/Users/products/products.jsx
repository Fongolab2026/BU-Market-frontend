import useProducts from '../Hooks/hooks'
import Loading from '../Composants/Loading'
import CardProducts from './ui/cardProduct'

function Products(){
    const {data,loading,err} = useProducts('/products')
    
    return(
        <>
            <div className="w-full min-h-[100vh] flex flex-wrap gap-4 justify-center items-center">
                {
                    data.map((product)=>{
                        return  <CardProducts
                         key={product.id}
                    />
                })
                }
                {err && <p className="text-red-500">{err.message}</p>}
                {loading && <Loading />}

            </div>
        </>
    )
}

export default Products