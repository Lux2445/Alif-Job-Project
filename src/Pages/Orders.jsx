import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Card from '../Components/Card';
import AppContext from '../context';

function Orders() {
  const { URL_API } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(URL_API + '/orders');
        setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
        setIsLoading(false);
      } catch (error) {
        alert('Ошибка при запросе заказов');
        console.error(error);
      }
    })();
  }, [URL_API]);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои заказы</h1>
      </div>
      <div className="d-flex flex-wrap">
        {(isLoading ? [...Array(8)] : orders).map((item, index) => (
          <Card key={isLoading ? index : item.id} loading={isLoading} {...item} />
        ))}
      </div>
    </div>
  );
}

export default Orders;
