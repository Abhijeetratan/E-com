import React from 'react';
import MetaData from './layout/MetaData';
import { useGetProductsQuery } from '../redux/api/productapi';
import ProductItem from './product/productItem';
import Loader from './layout/Loader';
import CustomPagination from './layout/CustomPagination';
import { useSearchParams } from 'react-router-dom';

const Home = () => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const keyword = searchParams.get("keyword") || "";
    const params = { page, keyword }; 
    
    const { data, isLoading, isError } = useGetProductsQuery(keyword);

    if (isLoading) return <Loader />;
    if (isError) return <div>Error fetching data</div>;
    
    console.log(data);
    return (
        <>
            <MetaData title="Buy Best Products Online" />
            <div className="row">
                <div className="col-12 col-sm-6 col-md-12">
                <h1 id="products_heading" className="text-secondary">{keyword ? `Results for "${keyword}"` : "Latest Products"}</h1>


                    <section id="products" className="mt-5">
                        <div className="row">
                        {data && data.products && data.products.map((product) => (
    <ProductItem key={product._id} product={product} />
))}

                        </div>
                    </section>
                    <CustomPagination resPerPage={data?.resPerPage} filteredProductsCount={data?.filteredProductsCount} />
                </div>
            </div>
        </>
    );
}

export default Home;
