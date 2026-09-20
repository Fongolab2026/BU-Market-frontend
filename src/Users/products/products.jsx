import useProducts from '../Hooks/hooks'

function Products(){
    const {data,loading,err} = useProducts('/products')
    
    return(
        <>
            <div className="w-full min-h-[100vh] flex flex-wrap gap-4 justify-center items-center">
       

            </div>
        </>
    )
}

export default Products