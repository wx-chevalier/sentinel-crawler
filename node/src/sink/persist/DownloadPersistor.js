// @flow
import Persistor from "./Persistor";
import { errorLogger } from "../../utils/logger";
const download = require("image-downloader");

export default class DownloadPersistor extends Persistor {
  /**
   * @function 将图片保存到本地
   * @param imageUrls
   * @param dest
   * @returns {Promise.<void>}
   */
  async saveImage(imageUrls: [string], dest = "/tmp/images"): Promise<boolean> {
    try {
      for (let imageUrl of imageUrls) {
        const { filename, image } = await download.image({
          url: imageUrl,
          dest
        });
      }

      return true;
    } catch (e) {
      errorLogger.error(e.message);

      return false;
    }
  }
}

export const downloadPersistor: DownloadPersistor = new DownloadPersistor();
