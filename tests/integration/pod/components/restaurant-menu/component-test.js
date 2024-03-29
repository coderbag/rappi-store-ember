import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('restaurant-menu', 'Integration | Component | restaurant menu', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{restaurant-menu}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#restaurant-menu}}
      template block text
    {{/restaurant-menu}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
