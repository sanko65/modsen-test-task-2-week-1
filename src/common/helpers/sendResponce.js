const Response = require("../response/Response");

function sendResponce(res, status, data) {
  return res.status(status).json(new Response(data));
}

module.exports = sendResponce;
