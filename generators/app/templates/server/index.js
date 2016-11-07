const path = require(`path`);
const pluginHandler = require(`./lib/pluginHandler`);

require(`dotenv`).load({silent: true});

const {PORT: port} = process.env;

const Server = require(`hapi`).Server;

const server = new Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, `public`)
      }
    }
  }
});

server.connection({port});

server.register(require(`./modules/`), pluginHandler);
server.register(require(`./routes/`), pluginHandler);

server.start(err => {
  if (err) console.error(err);
  console.log(`Server running at: http://localhost:${port}`);
});
