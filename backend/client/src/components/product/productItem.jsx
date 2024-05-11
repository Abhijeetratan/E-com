import React from 'react';
import { Link } from "react-router-dom";
import StarRatings from 'react-star-ratings';

const ProductItem = ({ product }) => {
  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded">
        <img
          className="card-img-top mx-auto"
          src={product?.images[0]?.url}
          alt={product?.name}
        />
        <div className="card-body ps-3 d-flex justify-content-center flex-column">
          <h5 className="card-title">
            <Link to={`/product/${product?._id}`}>{product?.name}</Link>
          </h5>
          <StarRatings
            rating={product?.ratings}
            starRatedColor="#ffb829"
            numberOfStars={5} // Changed to 5 stars
            name='rating'
            starDimension='22px'
            starSpacing='1px'
          />
          <span id="no_of_reviews" className="pt-2 ps-2">
            {" "}
            {product?.numofReviews}
          </span>
        </div>
        <p className="card-text mt-2">${product?.price}</p>
        <Link to={`/product/${product?._id}`} id="view_btn" className="btn btn-block"> {/* Changed to Link */}
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductItem;
