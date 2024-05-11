import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();

        if (keyword?.trim()) {
            navigate(`/?keyword=${keyword}`);
        } else {
            navigate(`/`);
        }
    };

    const clearHandler = () => {
        setKeyword("");
    };

    return (
        <form onSubmit={submitHandler}>
            <div className="input-group">
                <input
                    type="text"
                    id="search_field"
                    aria-label="Search products"
                    className="form-control"
                    placeholder="Enter Product Name ..."
                    name="keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                {keyword && (
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={clearHandler}
                    >
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                )}
                <button className="btn btn-primary" type="submit" id="search_btn">
                    <i className="fa fa-search" aria-hidden="true"></i>
                </button>
            </div>
        </form>
    );
};

export default Search;
