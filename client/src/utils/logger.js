// this is the logger for the browser
// import axios from 'axios';
import pino from 'pino';
import moment from 'moment';

// const config = {
//   serverUrl: process.env.REACT_APP_API_PATH || 'http://localhost:3000',
//   env: process.env.NODE_ENV,
//   publicUrl: process.env.PUBLIC_URL
// };

const pinoConfig = {
  browser: {
    Object: true
  },
  formatters: {
    level: (label) => {
      return { level: label };
    }
  }
};

// Below method is to push data on remote location
// pinoConfig.browser.transmit = {
//   level: 'info',
//   send: (level, logEvent) => {
//     const msg = logEvent.messages[0];

//     const headers = {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Headers':
//         'Origin, X-Requested-With, Content-Type, Accept',
//       type: 'application/json'
//     };

//     (async () => {
//       try {
//         await axios.post('http://localhost:3200/logs', {
//           level,
//           data: JSON.stringify({ msg, level })
//         });
//       } catch (error) {
//         console.error('ERROR: Failed to post logs', error);
//       }
//     })();
//   }
// };

const dateFormat = 'MM/DD/YYYY HH:mm:ssA [GMT]Z';

const logger = pino(pinoConfig);

export const info = (msg) =>
  logger.info({
    ts: moment().format(dateFormat),
    level: 'INFO',
    message: msg
  });
export const error = (msg) =>
  logger.error({
    ts: moment().format(dateFormat),
    level: 'ERROR',
    message: msg
  });
export const warn = (msg) =>
  logger.warn({
    ts: moment().format(dateFormat),
    level: 'WARN',
    message: msg
  });

export default logger;
