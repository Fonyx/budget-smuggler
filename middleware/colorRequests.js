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

    let user_logged_in = req.session.logged_in? 'Logged In': 'Not Logged In';

    clog(`user: ${req.session.user_id} is: ${user_logged_in}`,`cyan`);

    // log the method type and destination
    switch (req.method) {
      case 'GET': {
        clog(`${openHands}  ${req.method} request to ${req.path}`, 'green');
        // clog.logGreen(`${openHands}  ${req.method} request to ${req.path}`);
        break;
      }
      case 'POST': {
        clog(`${handWriting}  ${req.method} request to ${req.path}`, 'blue');
        // clog.logBlue(`${handWriting}  ${req.method} request to ${req.path}`);
        break;
      }
      case 'PUT': {
        clog(`${pointing}  ${req.method} request to ${req.path}`, 'magenta');
        // clog.logMagenta(`${pointing}  ${req.method} request to ${req.path}`)
        break;
      }
      case 'DELETE': {
        // clog(`${pointing}  ${req.method} request to ${req.path}`, 'magenta');
        clog(`${bomb}  ${req.method} request to ${req.path} `, 'red');
        // clog.logRed(`${bomb}  ${req.method} request to ${req.path}`)
        break;
      }
      default:
        // clog(`${pointing}  ${req.method} request to ${req.path}`, 'magenta');
        clog(`${req.method} request to ${req.path} `, 'black')
    }
  
    next();
  };
  
module.exports= cRequests;
  