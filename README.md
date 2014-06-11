Topeka
------

There are 2 ways to get your dependencies up-and-running:

### Direct Git:

This is the best way to not be broken. The Polymer team doesn't use bower in day-to-day development and so Topeka might be broken more frequently if you use the Bower-based workflow.

  1. Checkout topeka
  1. Use tools-private/pull-all.sh to get a copy of all of Polymer
  1. Symlink `projects/topeka/components` to the `components`.

### Bower

  1. Checkout topeka
  1. Make sure you have `npm` and `bower` [installed](http://bower.io/) installed.
  1. `cd topeka` and `bower install`