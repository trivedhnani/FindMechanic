class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    let queryObj = { ...this.queryString };
    const notFilter = ['page', 'limit', 'sort', 'fields'];
    notFilter.forEach(el => {
      delete queryObj[el];
    });
    let tempQueryString = JSON.stringify(queryObj);
    tempQueryString = tempQueryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );
    queryObj = JSON.parse(tempQueryString);
    this.query = this.query.find(queryObj);
    // console.log(queryObj);
    return this;
  }
  sort() {
    if (this.queryString['sort']) {
      let sortString = this.queryString['sort'];
      sortString = sortString.replace(/,/g, ' ');
      this.query = this.query.sort(sortString);
      //   console.log(this.queryString);
    } else {
      this.query = this.query.sort('name');
    }
    return this;
  }
  fields() {
    if (this.queryString['fields']) {
      let fieldString = this.queryString['fields'];
      fieldString = fieldString.replace(/,/g, ' ');
      this.query = this.query.select(fieldString);
      //   console.log(this.queryString);
    }
    //  else {
    //   this.query = this.query.select('name email password');
    // }
    return this;
  }
  limit() {
    const page = this.queryString.page ? this.queryString.page * 1 : 1;
    const limitperPage = this.queryString.limit
      ? this.queryString.limit * 1
      : 50;
    this.query = this.query.skip((page - 1) * limitperPage).limit(limitperPage);
    return this;
  }
}
module.exports = ApiFeatures;
