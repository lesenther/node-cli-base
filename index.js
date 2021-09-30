/**
 * Cli Base
 * 
 * A base class for developing node cli applications
 * 
 */
class CliBase {

  /**
   * 
   * @param {callable} primary Function to execute if there are args
   * @param {callable} secondary Function to execute if there are no args
   */
  constructor(primary, secondary, opts = {}) {
    if (!primary || primary.constructor != Function) {
      throw new Error(`Invalid primary function`);
    }

    if (!secondary || secondary.constructor != Function) {
      throw new Error(`Invalid primary function`);
    }

    this.opts = {
      pipeTimeout: 10,
      splitChar: '\n',
      stdErr: console.error,
      ...opts,
    };

    this.run(primary, secondary);
  }

  /**
   * Run args
   */
  async run(primary, secondary) {
    const args = this.argv() || await this.pipe();

    if (args) {
      primary(args);
    } else {
      secondary();
    }
  }

  /**
   * Check the process argv for args
   * 
   * @returns Args if they were found in argv, false otherwise
   */
  argv() {
    const args = process.argv.slice(2);

    return args.length ? args : false;
  }

  /**
   * Check the stdin pipe for args
   * 
   * @returns Args if they were found in the stdin pipe, false otherwise
   */
  pipe() {
    return new Promise(resolve => {
      const args = [];
      const stdin = process.openStdin();
      
      stdin.on('data',  _ => args.push(..._.toString().split(this.opts.splitChar)));
      stdin.on('end',   _ => resolve(args));
      stdin.on('error', _ => this.opts.stdErr(`Error: `, _));
  
      setTimeout(_ => {
        if (!args.length) {
          stdin.destroy();
          resolve(false);
        }
      }, this.opts.pipeTimeout);
    });
  }

}

module.exports = CliBase;