'use strict';

/* global api, store */

function render() {

  const bookmarkAddButton = `
    <button class="bookmark-adder">Add new bookmark</button>
  `;

  const noBookmarks = `
    <section>
      You currently have no bookmarks. Click "Add new bookmark" up above to get started and create your first bookmark!
    </section>
  `;

  $('main').html(`
    ${store.addingBookmark ? displayNewBookmarkForm() : bookmarkAddButton}
    <label>
      Minimum Rating:
      <select class="star-filter">
        <option value="">Unfiltered</option>
        <option value="2">2 Stars</option>
        <option value="3">3 Stars</option>
        <option value="4">4 Stars</option>
        <option value="5">5 Stars</option>
      </select>
      ${(store.list.length > 0) ? generateBookmarksHTML(store.list) : noBookmarks}
  `);
}

function bookmarkStringifier(bookmark) {
  const displayExpander = '<button class="expander">expand</button>';
  const displayShrinker = '<button class="shrinker">shrink</button>';
  const extraInfo = `
  <section class="details">
    <div class="description">${bookmark.desc}</div>
    <button class="website-link" data-url="${bookmark.url}">Visite site</button>
    <button class="delete">delete</button>
    <button class="edit-submit">submit</button>
  </section>
  `;
  
  if (bookmark.rating >= store.filter) {
    return `
      <section class="bookmark" id="${bookmark.id}">
        <div class="title">${bookmark.title}</div>
        <div class="rating">${bookmark.rating} stars</div>
        ${bookmark.expanded ? displayShrinker : displayExpander}
        ${bookmark.expanded ? extraInfo : ''}
      </section>
    `;
  }
}

function generateBookmarksHTML(list) {
  const arr = [];
  list.forEach(element => arr.push(bookmarkStringifier(element)));
  return arr.join('');
}

function displayNewBookmarkForm() {
  return `
    <form class="bookmark-form">
      <fieldset>
      <legend>New Bookmark</legend>
        <label>
          Title:
          <input class="title" name="title" required>
        </label>
        <label>
        Website:
          <input class="website" name="url" type="url" required>
        </label>
        <label>
          Rating:
          <select name="rating" class="rating">
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star </option>
          </select>
        </label>
        <label>
        Description:
          <textarea rows="4" class="description" name="desc" required></textarea>
        </label>
      </fieldset>
      ${store.error ? '<div class="error-display">Error</div>' : ''}
      <button type="reset" class="cancel">Cancel</button>
      <button type="submit" class="new-bookmark-submit">Add Bookmark</button>
    </form>
  `;
}

function handleAddNewBookmarkClicked() {
  $('main').on('click', '.bookmark-adder', function(event) {
    store.addingBookmark=true;
    render();
  });
}

function handleFilterChanged() {
  $('main').on('change', '.star-filter', function(event) {
    console.log($(this).val());
  });
}

function handleExpandClicked() {
  $('main').on('click', '.expander', function(event) {
    console.log($(this));
  });
}

function handleCancelClicked() {
  $('main').on('click', '.cancel', function(event) {
    event.preventDefault();
    store.addingBookmark=false;
    render();
  });
}

function handlebookmarkSubmit() {
  $('main').on('submit', '.bookmark-form', function(event) {
    event.preventDefault();
    console.log($(this));
  });
}

function handleShrinkClicked() {
  $('main').on('click', '.shrinker', function(event) {
    console.log($(this));
  });
}

function handleSiteClicked() {
  $('main').on('click', '.website-link', function(event) {
    console.log($(this));
  });
}

function handleDeleteClicked() {
  $('main').on('click', '.delete', function(event) {
    //get id from event
    api.deleteBookmark(id)
      .then(res => api.handleError(res))
      .then(store.findAndDelete(id));
    render();
  });
}

// function handleEditClicked() {

// }

function handlePageLoad() {
  api.getList()
    .then(res => api.handleError(res))
    .then(list => store.list = list);
  handleAddNewBookmarkClicked();
  handleFilterChanged();
  handleExpandClicked();
  handleCancelClicked();
  handlebookmarkSubmit();
  handleShrinkClicked();
  handleSiteClicked();
  handleDeleteClicked();
  render();
}

$(handlePageLoad);