class Test {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.user = {
      name: 'kahef',
      age: '34',
    };
  }

  test() {
    const { query, queryString } = this;
    const { name, age } = this.user;
    console.log(query, queryString);
    console.log(name, age);
  }
}

const feature = new Test('Q', 'QS');

feature.test();
