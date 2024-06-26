import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../layout/Loader';
import StarRatings from 'react-star-ratings';
import { useGetProductsDetailsQuery } from '../../redux/api/productapi';
import { useDispatch } from 'react-redux';
import { setCartItem } from '../../redux/features/cartSlice';

const ProductDetail = () => {
    const params = useParams(); 

    const dispatch = useDispatch();

    const [quantity, setQuantity] = useState(1); // Changed setquantity to setQuantity
    const { data } = useGetProductsDetailsQuery(params?.id);
    const product = data?.product;
    const [activeImg, setActiveImg] = useState('');

    useEffect(() => {
        if (product) {
            setActiveImg(product?.images[0]?.url || "/images/default_product.png");
        }
    }, [product]);

    const increaseQty = () => {
        if (quantity < product?.stock) {
            setQuantity(quantity + 1);
        }
    };
     
    const decreaseQty = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    
    const setItemToCart = () => {
        const cartItem = {
            product: product?.id,
            name: product?.name,
            price: product?.price,
            image: product?.images[0]?.url, // Updated this line
            stock: product?.stock,
            quantity
        };
        dispatch(setCartItem(cartItem));
    };
    

    if (!product) {
        return <Loader />;
    }

    return (
        <div className="row d-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
                <div className="p-3">
                    <img
                        className="d-block w-100"
                        src={activeImg}
                        alt={product?.name}
                        width="340"
                        height="390"
                    />
                </div>
                <div className="row justify-content-start mt-5">
                    {product?.images?.map((img, index) => (
                        <div className="col-2 ms-4 mt-2" key={index}>
                            <a role="button">
                                <img
                                    className={`d-block border rounded p-3 cursor-pointer ${img.url === activeImg ? "border-warning" : ""}`}
                                    height="100"
                                    width="100"
                                    src={img.url}
                                    alt={img.url}
                                    onClick={() => setActiveImg(img.url)}
                                />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-12 col-lg-5 mt-5">
                <h3>{product?.name}</h3>
                <p id="product_id">{product?._id}</p>

                <hr />

                <div className="d-flex">
                    <StarRatings
                        rating={product?.ratings}
                        starRatedColor="#ffb829"
                        numberOfStars={5}
                        name='rating'
                        starDimension='22px'
                        starSpacing='1px'
                    />
                    <span id="no-of-reviews" className="pt-1 ps-2">{" "} ({product?.numofReview} Reviews)</span>
                </div>
                <hr />

                <p id="product_price">${product?.price}</p>
                <div className="stockCounter d-inline">
                    <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>
                    <input
                        type="number"
                        className="form-control count d-inline"
                        value={quantity}
                        readOnly
                    />
                    <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                </div>
                <button
                    type="button"
                    id="cart_btn"
                    className="btn btn-primary d-inline ms-4"
                    disabled={product.stock<=0}
                    onClick={setItemToCart}
                >
                    Add to Cart
                </button>

                <hr />

                <p>
                    Status:{" "} <span id="stock_status" className={product?.stock > 0 ? "greencolor" : "redcolor"}>{product?.stock > 0 ? "In Stock" : "Out of Stock"}</span>
                </p>

                <hr />

                <h4 className="mt-2">Description:</h4>
                <p>{product?.description}</p>
                <hr />
                <p id="product_seller mb-3">Sold by: <strong>{product?.seller}</strong></p>

                <div className="alert alert-danger my-5" type="alert">
                    Login to post your review.
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
