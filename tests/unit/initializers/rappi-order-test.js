import Ember from 'ember';
import RappiOrderInitializer from 'rappi/initializers/rappi-order';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | rappi order', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  RappiOrderInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
