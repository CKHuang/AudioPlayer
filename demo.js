const share = require('./build/Release/shm.node');
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

var count = 0;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {

    if (req.url.indexOf('favicon.ico') > -1 ) {
       return ;
    }

    if ( req.url.indexOf('delete') > -1 ) {
      share.delt();
      res.writeHead(200);
      res.end('delete success\n');
      return ;
    };

    if ( req.url.indexOf('read') > -1 ) {
      var data = share.read();
      res.writeHead(200);
      res.end( 'buff.length : ' + data.length );
      return false;
    }

    var buff = share.read();
    buff = buff + 'T';
    share.write(buff);
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
