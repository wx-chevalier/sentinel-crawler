/** umd rollup 配置 */

import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/index.browser.js',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ],
  format: 'umd',
  moduleName: 'dc'
};
