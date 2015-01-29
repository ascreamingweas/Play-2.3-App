/*
 * The first JS file to be loaded. Takes care of setting up all of
 * the required paths for requireJs.
 */

// Configure RequireJS
var require = {
  baseUrl: "/assets/javascripts", // relative to app
  paths: {
      // specify a path to jquery, the second declaration is the local fallback
      jquery: ['https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
               'lib/jquery-1.10.2.min'],
      bootstrap: ['https://netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min',
                  'lib/bootstrap.min'],
      jvb2wrk: ['https://use.typekit.net/jvb2wrk',
                'lib/jvb2wrk']
  },
  shim: {
    "bootstrap": ["jquery"]
  }
};
