import Ember from 'ember';
import ENV from 'rappi/config/environment';
/**
 * This controller is responsible for displaying data for
 * user profile and update data for user profile.
 */
export default Ember.Controller.extend({
  serverUrl: Ember.inject.service('server-url'),
  flashMessages: Ember.inject.service(),
  selectedCriteria: null,
  selectedGender: null,
  disableSubmit: false,
  session: Ember.inject.service('session'),
  tempPhone: null,
  phoneVerification: false,
  updateProcess: false,
  parentController: null,
  actions: {
    /**
     * Function to update the profile changes to the server
     * @param model
     */
    submit: function (model) {
      this.set('disableSubmit', true);
      let currentUrl = this.serverUrl.getUrl();

      let errMsg = "";
      if (Ember.isEmpty(model.get('first_name'))) {
        errMsg += "Primer nombre no puede estar en blanco, ";
      } else if (model.get('first_name').length > 20) {
        errMsg += "Primer nombre no puede ser superior a 20 caracteres, ";
      }
      if (Ember.isEmpty(model.get('last_name'))) {
        errMsg += "Apellido no puede estar en blanco, ";
      } else if (model.get('last_name').length > 20) {
        errMsg += "Apellido no puede ser superior a 20 caracteres, ";
      }
      if (Ember.isEmpty(model.get('phone'))) {
        errMsg += "El teléfono no puede estar en blanco, ";
      }

      if (errMsg.trim().length > 0) {
        errMsg = errMsg.substr(0, errMsg.lastIndexOf(','));
        this.get('flashMessages').info(errMsg);
        return;
      }

      let selectedGender = this.get('selectedGender');
      if (selectedGender) {
        model.set('gender', selectedGender);
        this.set('selectedGender', null);
      }

      let criteria = this.get('selectedCriteria');
      if (criteria) {
        model.set('replacement_criteria_id', criteria);
        this.set('selectedCriteria', null);
      }

      let birthDate = this.get('selectedBirthDate');
      if (birthDate) {
        model.set('birth_date', new Date(birthDate));
        this.set('selectedBirthDate', null);
      }

      this.get('parentController').set('currentlyLoading', true);
      model.save().then(()=> {
        this.get('parentController').set('currentlyLoading', false);
        this.set("updateProcess", false);
        this.get('flashMessages').success("Los datos guardados con éxito");
      }).catch((err)=> {
        this.get('parentController').set('currentlyLoading', false);
        this.get('flashMessages').danger("Algo salió mal.");
        this.set("updateProcess", false);
      });
      this.set('disableSubmit', true);
    },
    /**
     * Collect criteria value selected by the user
     * @param criteria
     */
    onSelectCriteria: function (criteria) {
      this.set('selectedCriteria', criteria);
    },
    /**
     * Collect gender value selected by the user
     * @param gender
     */
    onSelectGender: function (gender) {
      this.set('selectedGender', gender);
    },
    /**
     * To upload the image selected by the user
     * @param filePath
     */
    onImageSelect: function (thisController, event) {
      var file = event.target.files[0];
      let currentUrl = this.serverUrl.getUrl();

      var data = new FormData();
      data.append('image', file);
      var session = this.get('session');
      if (session.isAuthenticated) {
        var accessToken = session.get('data.authenticated.access_token');
        var headers = {};
        headers['Authorization'] = `Bearer ${accessToken}`;
        Ember.$.ajax({
          type: "POST",
          url: `${currentUrl}/${ENV.profilePicUrl}`,
          data: data,
          headers: headers,
          cache: false,
          contentType: false,
          processData: false
        }).then((rsp)=> {
          var model = this.get('model');
          model.set('pic', rsp);
        }).fail((err)=> {
          console.log("err>> is ...", err);
        });
      } else {
        this.transitionToRoute('index');
      }
    }, logout() {
      this.get('session').invalidate();
    }
  }
})
;

