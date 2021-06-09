const { createWriteStream, unlinkSync, statSync } = require('fs');
const { join } = require('path');
const { get } = require('https');

/**
 * Check if the downloaded vUSB is bigger than 5MB
 * @param {string} filePath
 * @returns {boolean}
 */
function isValidFileSize(filePath) {
  const stats = statSync(filePath);
  const fileSizeInBytes = stats.size;
  const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

  return fileSizeInMegabytes > 5;
}

/**
 * Download a the vUSB client based on a url
 * @param {string} url
 * @param {string} destination
 */
function downloadFile(url, destination) {
  try {
    // eslint-disable-next-line no-console
    console.log('🚮 Start removing existing vUSB client.');
    unlinkSync(destination);
    // eslint-disable-next-line no-console
    console.log('✅  Existing vUSB client was successfully removed.');
  } catch (error) {
    if (error.message.includes('no such file or directory')) {
      // eslint-disable-next-line no-console
      console.log('✔️ No vUSB client found, proceed with downloading.');
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `❗Something went wrong removing '${destination}', please see error: '${error.message}'. Proceed downloading a new file.`
      );
    }
  }

  // eslint-disable-next-line no-console
  console.log('💾 Starting to download the vUSB client.');

  const request = get(url, (response) => {
    const fileStream = createWriteStream(destination);

    response.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close();
      if (!isValidFileSize(destination)) {
        throw new Error('❌ Wrong file downloaded, please check the url.');
      }
      // eslint-disable-next-line no-console
      console.log(
        `✅  vUSB client downloaded and can be found here: '${destination}'`
      );
    });

    fileStream.on('error', (error) => {
      throw new Error(
        `❌ There was an error when storing the vUSB client, ${error}`
      );
    });
  });

  request.on('error', (error) => {
    throw new Error(
      `❌ There was an error when downloading the vUSB client, ${error}`
    );
  });
}

downloadFile(
  'https://saucelabs-vusb.s3-eu-west-1.amazonaws.com/v2.0.0/virtual-usb-client.jar',
  join('assets', 'virtual-usb-client.jar')
);
