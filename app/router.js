import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('list', { path: '/list' });
  this.route('live', { path: '/live' });
  this.route('single', { path: '/single/:camera' });

});

export default Router;
