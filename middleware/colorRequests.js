const clog = require('../utils/colorLogging');

/**
 * Custom middleware that logs out the type and path of each request to the server as well as an emoji
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const cRequests = (req, res, next) => {   
    const openHands = String.fromCodePoint(0x1F932);
    const handWriting = String.fromCodePoint(0x270D);
    const pointing = String.fromCodePoint(0x1F446);
    const bomb = String.fromCodePoint(0x1F631);	
    let user_logged_in = req.session.logged_in? true: false;
    switch (req.method) {
      case 'GET': {
        clog(`${openHands}  ${req.method} request to ${req.path} from user logged in: ${user_logged_in}`, 'green');
        // clog.logGreen(`${openHands}  ${req.method} request to ${req.path}`);
        break;
      }
      case 'POST': {
        clog(`${handWriting}  ${req.method} request to ${req.path} from user logged in: ${user_logged_in}`, 'blue');
        // clog.logBlue(`${handWriting}  ${req.method} request to ${req.path}`);
        break;
      }
      case 'PUT': {
        clog(`${pointing}  ${req.method} request to ${req.path} from user logged in: ${user_logged_in}`, 'magenta');
        // clog.logMagenta(`${pointing}  ${req.method} request to ${req.path}`)
        break;
      }
      case 'DELETE': {
        clog(`${pointing}  ${req.method} request to ${req.path} from user logged in: ${user_logged_in}`, 'magenta');
        clog(`${bomb}  ${req.method} request to ${req.path} `, 'red');
        // clog.logRed(`${bomb}  ${req.method} request to ${req.path}`)
        break;
      }
      default:
        clog(`${pointing}  ${req.method} request to ${req.path} from user logged in: ${user_logged_in}`, 'magenta');
        clog(`${req.method} request to ${req.path} `, 'black')
    }
  
    next();
  };
  
module.exports= cRequests;
  