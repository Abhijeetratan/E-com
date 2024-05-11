import Product from '../models/Product.js'; // Import the Product model

class ApiFilter {
    constructor(query, querystr) {
        this.query = query;
        this.querystr = querystr || {}; // Set a default empty object if querystr is undefined
    }

    search() {
        const keywordFilter = this.querystr.keyword
            ? {
                name: {
                    $regex: this.querystr.keyword,
                    $options: 'i',
                },
            }
            : {};

        // Update the query object directly
        this.query = { ...this.query, ...keywordFilter };

        return this;
    }

    filters() {
        const queryCopy = { ...this.querystr };

        // Fields to remove
        const fieldsToRemove = ["keyword", "page"];
        fieldsToRemove.forEach((el) => delete queryCopy[el]);

        // Convert queryCopy to MongoDB query operators
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

        // Log the transformed query for debugging
        console.log("============================");
        console.log(queryCopy);
        console.log("============================");

        // Use the transformed query to filter the data
        this.query = Product.find(JSON.parse(queryStr)); // Assuming 'Product' is a model

        return this; // Return the modified query if needed
    }

    pagination(resPerPage) {
        const currentPage = Number(this.querystr.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

export default ApiFilter;
