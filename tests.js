var configValidator = require('optimizely-server-sdk/lib/utils/config_validator');
var Optimizely = require('optimizely-server-sdk/lib/optimizely');
var optimizelyFactory = require('./');
var packageJSON = require('./package.json');

var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');

describe('javascript-sdk', function() {
  describe('APIs', function() {
    describe('createInstance', function() {
      var fakeErrorHandler = { handleError: function() {}};
      var fakeEventDispatcher = { dispatchEvent: function() {}};
      var fakeLogger = { log: function() {}};

      beforeEach(function() {
        sinon.spy(console, 'error');
        sinon.stub(configValidator, 'validate');
      });

      afterEach(function() {
        console.error.restore();
        configValidator.validate.restore();
      });

      it('should not throw if the provided config is not valid', function() {
        configValidator.validate.throws(new Error('Invalid config or something'));
        assert.doesNotThrow(function() {
          optimizelyFactory.createInstance({
            datafile: {},
          });
        });
      });

      it('should create an instance of optimizely', function() {
        var optlyInstance = optimizelyFactory.createInstance({
          datafile: {},
          errorHandler: fakeErrorHandler,
          eventDispatcher: fakeEventDispatcher,
          logger: fakeLogger,
        });

        assert.instanceOf(optlyInstance, Optimizely);
      });

      it('should set the Javascript client engine and version', function() {
        var optlyInstance = optimizelyFactory.createInstance({
          datafile: {},
          errorHandler: fakeErrorHandler,
          eventDispatcher: fakeEventDispatcher,
          logger: fakeLogger,
        });

        assert.equal('javascript-sdk', optlyInstance.clientEngine);
        assert.equal(packageJSON.version, optlyInstance.clientVersion);
      });
    });
  });
});
