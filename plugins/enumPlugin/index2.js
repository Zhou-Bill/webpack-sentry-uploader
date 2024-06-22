const { RawSource } = require('webpack-sources');

class OptimizeEnumPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('OptimizeEnumPlugin', (compilation, callback) => {
      const enumRegex = /const\s+(\w+)\s*=\s*{\s*([\s\S]*?)\s*}/g;
      const assets = compilation.assets;
      Object.keys(assets).forEach((filename) => {
        if (filename.endsWith('.js')) {
          let source = assets[filename].source();
          let match;
          console.log(source, enumRegex.exec(source) )
          while ((match = enumRegex.exec(source)) !== null) {
            const enumName = match[1];
            const enumValues = match[2].split(',').map((value) => value.trim());
            const optimizedEnum = enumValues.reduce((acc, value, index) => {
              acc[value] = index;
              return acc;
            }, {});
            const optimizedEnumString = JSON.stringify(optimizedEnum);
            source = source.replace(match[0], `const ${enumName} = ${optimizedEnumString};`);
          }
          assets[filename] = new RawSource(source);
        }
      });
      callback();
    });
  }
}

module.exports = OptimizeEnumPlugin;
