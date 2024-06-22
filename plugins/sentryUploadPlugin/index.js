const path = require('path')
const fs = require('fs')
const axios = require('axios').default;
const FormData = require('form-data');
const promiseQueue = require('./task')

/**
 * @description 创建 Sentry 发布
 * @class
 */
class SentryUploadPlugin {
   /**
   * @param {Object} options - 用户信息对象
   * @param {string} options.domain - 域名
   * @param {number} options.token - Token
   * @param {string} options.organization - 组织名称
   * @param {string} options.project - 组织名称
   * @param {string} options.release - 版本号
   */
  constructor(options) {
    this.name = 'SentryUploadPlugin';
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(this.name, async (compilation, callback) => {
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

  createUrlPrefix() {
    return `${this.options.domain}/api/0/organizations/${this.options.organization}/releases`
  }

  async createRelease() {
    const response = await axios.post(`${this.createUrlPrefix()}/`,{
      version: this.options.release,
      projects: [this.options.project],
    }, {
      headers: {
        'Authorization': `Bearer ${this.options.token}`,
        'Content-Type': 'application/json'
      },
    })
    return response
  }

  uploadFile(filePath) {
    const that = this;
    promiseQueue.addTask(async () => {
      const fileContent = fs.createReadStream(filePath);
      const fileName = path.basename(filePath);
      const form = new FormData();
      form.append('name', `~/${fileName}`);
      form.append('file', fileContent);

      const response = await axios.post(`${that.createUrlPrefix()}/${that.options.release}/files/`, 
        form , 
        {
          headers: {
            'Authorization': `Bearer ${that.options.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
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