const assert = require('assert');
const cli = require('../');

describe('basic execution', _ => {
  it('should pass a param into through argv', done => {
    let a, b;
    const randomNumber = Math.floor(Math.random() * 9999);
    
    process.argv = [null, null, randomNumber];
    new cli(_ => (a = _.pop()), _ => (b = randomNumber));
    
    assert.strictEqual(a, randomNumber);
    assert.strictEqual(b, undefined, 'b should be undefined');
    
    done();
  });

  it('should pass a param into through pipe', done => {
    return done();
    let a;
    const randomNumber = Math.floor(Math.random() * 9999);

    // Overwrite argv to prevent primary condition
    process.argv = [];
    
    new cli(_ => (a = randomNumber), _ => (b = randomNumber));

    // We need to add a timeout because the pipe check returns a promise
    setTimeout(_ => {
      const stdin = process.openStdin();
      stdin.write(randomNumber.toString());
      stdin.end();
      assert.strictEqual(a, randomNumber, 'a should be assigned');
      assert.strictEqual(b, undefined, 'b should undefined');

      // @TODO:  Finish this test to pass args through pipe
  
      done();
    }, 100);
  });

  it('should assign a param with our no args function', done => {
    let a, b;
    const randomNumber = Math.floor(Math.random() * 9999);

    // Overwrite argv to prevent primary condition
    process.argv = [];

    new cli(_ => (a = randomNumber), _ => (b = randomNumber));

    // We need to add a timeout because the pipe check returns a promise
    setTimeout(_ => {
      assert.strictEqual(a, undefined, 'a should be undefined');
      assert.strictEqual(b, randomNumber, 'b should be assigned');
  
      done();
    }, 11);
  });

});
