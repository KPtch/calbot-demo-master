var jwt = require('../index');
var expect = require('chai').expect;
var jws = require('jws');

describe('signing a token asynchronously', function() {

  describe('when signing a token', function() {
    var secret = 'shhhhhh';

    it('should return the same result as singing synchronously', function(done) {
      jwt.sign({ foo: 'bar' }, secret, { algorithm: 'HS256' }, function (err, asyncToken) {
        if (err) return done(err);
        var syncToken = jwt.sign({ foo: 'bar' }, secret, { algorithm: 'HS256' });
        expect(asyncToken).to.be.a('string');
        expect(asyncToken.split('.')).to.have.length(3);
        expect(asyncToken).to.equal(syncToken);
        done();
      });
    });

    it('should work with empty options', function (done) {
      jwt.sign({abc: 1}, "secret", {}, function (err, res) {
        expect(err).to.be.null();
        done();
      });
    });

    it('should work without options object at all', function (done) {
      jwt.sign({abc: 1}, "secret", function (err, res) {
        expect(err).to.be.null();
        done();
      });
    });

    it('should return error when secret is not a cert for RS256', function(done) {
      //this throw an error because the secret is not a cert and RS256 requires a cert.
      jwt.sign({ foo: 'bar' }, secret, { algorithm: 'RS256' }, function (err) {
        expect(err).to.be.ok();
        done();
      });
    });

    it('should return error on wrong arguments', function(done) {
      //this throw an error because the secret is not a cert and RS256 requires a cert.
      jwt.sign({ foo: 'bar' }, secret, { notBefore: {} }, function (err) {
        expect(err).to.be.ok();
        done();
      });
    });

    it('should return error on wrong arguments (2)', function(done) {
      jwt.sign('string', 'secret', {noTimestamp: true}, function (err) {
        expect(err).to.be.ok();
        expect(err).to.be.instanceof(Error);
        done();
      });
    });

    it('should not stringify the payload', function (done) {
      jwt.sign('string', 'secret', {}, function (err, token) {
        if (err) { return done(err); }
        expect(jws.decode(token).payload).to.equal('string');
        done();
      });
    });

    describe.only('secret must have a value', function(){
      [undefined, '', 0].forEach(function(secret){
        it('should return an error if the secret is falsy: ' + secret, function(done) {
        // This is needed since jws will not answer for falsy secrets
          jwt.sign('string', secret, {}, function(err, token) {
            expect(err).to.be.exist();
            expect(err.message).to.equal('secretOrPrivateKey must have a value');
            expect(token).to.not.exist;
            done();
          });
        });
      });
    });
  });
});
