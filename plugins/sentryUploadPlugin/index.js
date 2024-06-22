const path = require('path')
const fs = require('fs')
const axios = require('axios').default;
const FormData = require('form-data');
const promiseQueue = require('./task')

const DOMAIN = 'https://sentry.guanmai.cn'
const TOKEN = '8c47388015df4aa0b35257ba16fcd4a952379795f0f142fdb65c7530743e0e45'


class SentryUploadPlugin {
  constructor() {
    this.name = 'SentryUploadPlugin';

  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(this.name, async (compilation, callback) => {
      const assets = compilation.assets;
      const outputPath = (compilation.outputOptions.path) ?? path.resolve();
      const buildArtifacts = Object.keys(compilation.assets).map(
        (asset) => path.join(outputPath, asset)
      );
      const response = await this.createRelease();
      await this.uploadFiles(buildArtifacts)
      console.log(response.data)
      // https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/troubleshooting_js/legacy-uploading-methods/
      console.log(buildArtifacts)
      // 上传代码到 Sentry
      console.log('Uploading code to Sentry...');
      callback()
    });
  }

  async createRelease() {
    const response = await axios.post(`${DOMAIN}/api/0/organizations/guanmai/releases/`,{
      version: '7.1.0',
      projects: ['demo-test'],
    }, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
    })
    return response
  }

  uploadFile(filePath) {
    promiseQueue.addTask(async () => {
      const fileContent = fs.createReadStream(filePath);
      const fileName = path.basename(filePath);
      const form = new FormData();
      form.append('name', `~/${fileName}`);
      form.append('file', fileContent);

      const response = await axios.post(`${DOMAIN}/api/0/organizations/guanmai/releases/7.1.0/files/`, 
        form , 
        {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log(response.data)
      return response
    })
  }

  uploadFiles(buildArtifacts) {
    // 上传文件到 Sentry
    buildArtifacts.forEach((file) => {
      this.uploadFile(file);
    })

    return promiseQueue.start()
  }
}

module.exports = SentryUploadPlugin;