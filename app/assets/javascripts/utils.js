//= require vue
/* global Vue */
/* exported onAnyOfPages, makeReactive, vueDelete */

function onAnyOfPages(pages) {
  let found = false;
  $.each(pages, (controller) => {
    pages[controller].forEach((action) => {
      if (action == '*') found = true;
      if ($(`.controller-${controller}.action-${action}`).length) found = true;
    });
  });
  return found;
}

function makeReactive(object, key) {
  let tmp = object[key];
  delete object[key];
  Vue.set(object, key, tmp);
}

function vueDelete(object, key) {
  object[key] = '';
  Vue.delete(object, key);
}
