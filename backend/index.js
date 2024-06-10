const { readFileSync, writeFileSync } = require('fs');
const { createServer } = require('http');
const path = require('path');
const DB_FILE = process.env.DB_FILE || path.resolve(__dirname, 'db.json');
const PORT = process.env.PORT || 1721;
const URI_PREFIX = '/sneakers';

class ApiError extends Error {
  constructor(statusCode, data) {
    super();
    this.statusCode = statusCode;
    this.data = data;
  }
}

const getItemsList = () => {
  const sneakers = JSON.parse(readFileSync(DB_FILE) || '[]');
  return sneakers;
};

const getItems = (item = 'items') => {
  const sneakers = JSON.parse(readFileSync(DB_FILE) || '[]');
  return sneakers[item];
};

const getJsonData = req => {
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(JSON.parse(data));
    });
  });
};

const createItems = (item, data) => {
  const items = getItemsList();
  items[item].push(data);
  writeFileSync(DB_FILE, JSON.stringify(items), {
    encoding: 'utf8',
  });
  return items[item];
};

const deleteItems = (item, itemId) => {
  const data = getItemsList();
  const itemIndex = data[item].findIndex(({ id }) => id === Number(itemId));
  if (itemIndex === -1) throw new ApiError(404, { message: 'Items Not Found' });
  data[item].splice(itemIndex, 1);
  writeFileSync(DB_FILE, JSON.stringify(data), { encoding: 'utf8' });
  return data[item];
};
createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }


  const uri = req.url.substring(URI_PREFIX.length);

  try {
    const body = await (async () => {
      if (uri === '' || uri === '/items') {
        if (req.method === 'GET') return getItems();
      }
      if (uri.includes('favorites')) {
        const [fav, itemId] = uri.substring(1).split('/');
        if (req.method === 'GET') return getItems(fav);
        if (req.method === 'POST') return createItems(fav, await getJsonData(req));
        if (req.method === 'DELETE') return deleteItems(fav, itemId);
      }
      if (uri.includes('orders')) {
        const [orders, itemId] = uri.substring(1).split('/');
        if (req.method === 'GET') return getItems(orders);
        if (req.method === 'POST') return createItems(orders, await getJsonData(req));
        if (req.method === 'DELETE') return deleteItems(orders, itemId);
      }
      if (uri.includes('cart')) {
        const [cart, itemId] = uri.substring(1).split('/');
        if (req.method === 'GET') return getItems(cart);
        if (req.method === 'POST') return createItems(cart, await getJsonData(req));
        if (req.method === 'DELETE') return deleteItems(cart, itemId);
      }
      return null;
    })();
    res.end(JSON.stringify(body));
  } catch (err) {
    if (err instanceof ApiError) {
      res.writeHead(err.statusCode);
      res.end(JSON.stringify(err.data));
    } else {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: 'Server Error' }));
      console.error(err);
    }
  }
})
  .on('listening', () => {
    if (process.env.PROD !== 'true') {
      console.log(`Сервер запущен. Вы можете использовать его по адресу http://localhost:${PORT}`);
      console.log('Нажмите CTRL+C, чтобы остановить сервер');
    }
  })
  .listen(PORT, 'localhost');
