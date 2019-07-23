'use strict';

/* global store */

// eslint-disable-next-line no-unused-vars
const api = (function() {

  const baseURL = 'https://thinkful-list-api.herokuapp.com/sam';
  
  function handleError(res) {
    if (!res.ok) {
      store.errorText = (res.status);
      store.error=true;
      console.log(store.errorText);
      throw 'error';
    }
    return res.json();
  }

  function getList() {
    return fetch(baseURL+'/bookmarks');
  }

  function submitNewBookmark(bookObj) {
    const newBookmark = JSON.stringify(bookObj);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: newBookmark
    };
    return fetch(baseURL+'/bookmarks', options);
  }

  function deleteBookmark(id) {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return fetch(baseURL+'/bookmarks/'+id, options);
  }

  return {
    handleError,
    getList,
    submitNewBookmark,
    deleteBookmark
  };
})();