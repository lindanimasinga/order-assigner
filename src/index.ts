import {OrderAssignerService} from './service/order-assigner-service'

exports.handler = async (event: any) => {

    console.log("body is " + JSON.stringify(event))
    var jsonBody = JSON.parse(event.body)
    var mobileNumber = jsonBody.mobileNumber
    var orderId = jsonBody.orderId
    var updatedOrder = await OrderAssignerService.assignDriver(mobileNumber, orderId)
    
    const response = {
        statusCode: 200,
        headers : {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods" : "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(updatedOrder),
    };
    return response;
};

/*

import * as http from 'http'
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  console.log(`request received.`);
  res.statusCode = 200;
  var body = ''
  req.on('data', (data) => { body += data })
  req.on('end', () => {
    var jsonBody = JSON.parse(body)
    var mobileNumber = jsonBody.mobileNumber
    var orderId = jsonBody.orderId

    console.log(`orderid : ${orderId}, mobileNumer: ${mobileNumber}`)

    OrderAssignerService.assignDriver(mobileNumber, orderId).then(order => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(order));
    })
  }); 
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

*/