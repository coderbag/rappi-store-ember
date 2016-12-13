import Ember from 'ember';
import ENV from 'rappi/config/environment';

const {
  stLat,
  stLng,
  stAddress,
  stAddressId,
  stStoreType
  } = ENV.storageKeys;

export default Ember.Route.extend({

  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('home').send('myAccountAccessed');
    controller.set('parentController', this.controllerFor('home.my-accounts'));
  },
  model(){
    return this.store.findAll('address');
  },
  actions: {
    updateActiveAddress: function () {
      var _this = this;
      let parentController = this.controllerFor('home.my-accounts')
      var inactiveModel = this.controller.get('inactiveAddressModel');
      var activeModel = this.controller.get('activeAddressModel');
      if (activeModel !== null) {
        activeModel.set('active', false);
      }
      if (inactiveModel !== null) {
        inactiveModel.set('active', true);
      }
      if (inactiveModel !== null) {
        parentController.set('currentlyLoading', true);
        inactiveModel.save().then((response)=> {
          _this.cart.clearCart(_this.storage.get(stStoreType));
          _this.storage.set(stLat, response.get('lat'));
          _this.storage.set(stLng, response.get('lng'));
          _this.storage.set(stAddress, response.get('address'));
          _this.storage.set(stAddressId, response.get('id'));
          parentController.set('currentlyLoading', false);
        }).catch(()=> {
          parentController.set('currentlyLoading', false);
        });
      }
    }
  }
});
