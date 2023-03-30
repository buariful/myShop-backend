class ApiFliter {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    const removingQueries = ["keyword", "page", "limit"];
    removingQueries.forEach((key) => delete queryCopy[key]);

    let queryObject = JSON.stringify(queryCopy);

    queryObject = queryObject.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );

    this.query = this.query.find(JSON.parse(queryObject));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skipResults = resultPerPage * (currentPage - 1);
    // console.log(this.query);

    this.query = this.query.limit(resultPerPage).skip(skipResults);

    return this;
  }
}
module.exports = ApiFliter;
