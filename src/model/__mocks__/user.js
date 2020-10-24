exports.User = class User {
  constructor(userObj) {
    this.user = userObj;
    return this;
  }

  save() {
    return Promise.resolve(undefined);
  }

  static findOne() {
    return Promise.resolve(undefined);
  }
};
