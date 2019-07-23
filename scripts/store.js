'use strict';

// eslint-disable-next-line no-unused-vars
const store = (function() {
  const list = [];
  let addingBookmark = false;
  let error = false;
  let filter = '';
  let errorText;

  const addBookmark = function(bkmk) {
    this.list.push(bkmk);
  };

  const findById = function(id) {
    return this.list.find(item => item.id === id);
  };

  const findAndDelete = function(id) {
    this.list = this.list.filter(item => item.id !== id);
  };

  const setFilter = function(val) {
    this.filter=val;
  };

  return {
    list,
    addingBookmark,
    error,
    filter,
    errorText,
    addBookmark,
    findById,
    findAndDelete,
    setFilter
  };
})();