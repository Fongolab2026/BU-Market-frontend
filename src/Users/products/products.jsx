import useProducts from '../Hooks/hooks'
import CardProducts from './ui/cardProduct'
import { ProductGridSkeleton } from '../../components/skeletons'

function Products(){
    const {data, loading, err} = useProducts('/api/products/')

    return(
        <>
            <div className="w-full min-h-[100vh] flex flex-wrap gap-4 justify-center items-center">
                {
                    data.map((product)=>{
                        return <CardProducts
                            key={product.id}
                            product={product}
                        />
                })
                }
                {err && <p className="text-red-500">{err.message}</p>}
                {loading && <ProductGridSkeleton count={8} className="mt-4 flex flex-wrap justify-center gap-4" />}

            </div>
        </>
    )
}

export default Products