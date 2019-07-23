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
        <option value=2 ${store.filter==='2' ? 'selected' : ''}>2 Stars</option>
        <option value=3 ${store.filter==='3' ? 'selected' : ''}>3 Stars</option>
        <option value=4 ${store.filter==='4' ? 'selected' : ''}>4 Stars</option>
        <option value=5 ${store.filter==='5' ? 'selected' : ''}>5 Stars</option>
      </select>
      <div class="bookmark-list">
        ${(store.list.length > 0) ? generateBookmarksHTML(store.list) : noBookmarks}
      </div>
  `);
}

function starGenerator(num) {
  if (num===1) {
    return '&#9733&#9734&#9734&#9734&#9734';
  }
  if (num===2) {
    return '&#9733&#9733&#9734&#9734&#9734';
  }
  if (num===3) {
    return '&#9733&#9733&#9733&#9734&#9734';
  }
  if (num===4) {
    return '&#9733&#9733&#9733&#9733&#9734';
  }
  if (num===5) {
    return '&#9733&#9733&#9733&#9733&#9733';
  }
}

function bookmarkStringifier(bookmark) {
  const displayExpander = '<button class="expander">expand</button>';
  const displayShrinker = '<button class="shrinker">shrink</button>';
  const extraInfo = `
  <section class="details">
    <div class="description">${bookmark.desc}</div>
    <div class="detail-buttons">
      <button class="delete">delete</button>
      <button class="website-link" data-url="${bookmark.url}">Visite site</button>
    </div>
  </section>
  `;
  
  if (bookmark.rating >= store.filter) {
    return `
      <section class="bookmark" id="${bookmark.id}">
        <div class="basic-info">
          <div class="title">${bookmark.title}</div>
          <div class="rating">${starGenerator(bookmark.rating)}</div>
          ${bookmark.expanded ? displayShrinker : displayExpander}
        </div>
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
        <label class="label">
          Title:
          <input name="title" required>
        </label>
        <label class="label">
        Website:
          <input value="https://" class="website" name="url" type="url" required>
        </label>
        <label>
          Rating:
          <select name="rating" class="rating-label">
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star </option>
          </select>
        </label>
        <label class="label">
        Description:
          <textarea rows="4" class="description" name="desc" required></textarea>
        </label>
      </fieldset>
      ${store.error ? `<div class="error-display">${store.errorText}</div>` : ''}
      <button type="reset" class="cancel">Cancel</button>
      <button type="submit" class="new-bookmark-submit">Add Bookmark</button>
    </form>
  `;
}

function handleAddNewBookmarkClicked() {
  $('main').on('click', '.bookmark-adder', function() {
    store.addingBookmark=true;
    render();
  });
}

function handleFilterChanged() {
  $('main').on('change', '.star-filter', function() {
    store.filter = $(this).val();
    render();
  });
}

function handleExpandClicked() {
  $('main').on('click', '.expander', function() {
    const bookmarkID = $(this).parent().parent().attr('id');
    const bkmk = store.findById(bookmarkID);
    bkmk.expanded=true;
    render();
  });
}

function handleCancelClicked() {
  $('main').on('click', '.cancel', function(event) {
    event.preventDefault();
    store.addingBookmark=false;
    render();
  });
}

$.fn.extend({
  serializeJson: function() {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return o;
  }
});

function handleBookmarkSubmit() {
  $('main').on('submit', '.bookmark-form', function(event) {
    event.preventDefault();
    const newBookmark = $(event.target).serializeJson();
    api.submitNewBookmark(newBookmark)
      .then((res => api.handleError(res)))
      .then(res => {
        store.addBookmark(res);
        store.addingBookmark=false;
        render();
      })
      .catch(function() {
        store.error=true;
        if(!store.errorText) {
          store.errorText='There was a problem reaching the server, your internet may be down';
        }
        render();
        store.error=false;
      });
  });
}

function handleShrinkClicked() {
  $('main').on('click', '.shrinker', function() {
    const bookmarkID = $(this).parent().parent().attr('id');
    const bkmk = store.findById(bookmarkID);
    bkmk.expanded=false;
    render();
  });
}

function handleSiteClicked() {
  $('main').on('click', '.website-link', function() {
    const id = $(this).parent().parent().parent().attr('id');
    const bkmk = store.findById(id);
    window.open(bkmk.url);
  });
}

function handleDeleteClicked() {
  $('main').on('click', '.delete', function() {
    const id = $(this).parent().parent().parent().attr('id');
    api.deleteBookmark(id)
      .then(res => api.handleError(res))
      .then(function() {
        store.findAndDelete(id);
        render();
      });
  });
}

function handlePageLoad() {
  handleAddNewBookmarkClicked();
  handleFilterChanged();
  handleExpandClicked();
  handleCancelClicked();
  handleBookmarkSubmit();
  handleShrinkClicked();
  handleSiteClicked();
  handleDeleteClicked();
  api.getList()
    .then(res => api.handleError(res))
    .then(list => {
      store.list = list;
      render();
    });
}

$(handlePageLoad);