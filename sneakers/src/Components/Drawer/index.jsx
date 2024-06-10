import React, { Fragment, useState, useContext } from 'react';
import axios from 'axios';
import Info from '../Info';
import AppContext from '../../context';
import { useCart } from '../../Hooks/useCart';
import styles from './Drawer.module.scss';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const Drawer = ({ onClose, onRemove, items = [], opened }) => {
  const { URL_API } = useContext(AppContext);
  const [orderId, setOrderId] = useState(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { cartItems, setCartItems, totalPrice } = useCart();

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(URL_API + '/orders', {
        items: cartItems,
      });
      setOrderId(data.id);
      setIsOrderComplete(true);
      setCartItems([]);

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete(URL_API + '/cart/' + item.id);
        await delay(2000);
      }
    } catch (error) {
      alert('Ошибка при создании заказа');
    }
    setIsLoading(false);
  };

  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
      <div className={styles.drawer}>
        <div className="d-flex justify-between mb-30">
          <h2>Корзина</h2>
          <button className="button" onClick={onClose}>
            <img src="/img/btn-remove.svg" alt="Close" />
          </button>
        </div>
        {items.length > 0 ? (
          <Fragment>
            <div className={styles.items}>
              {items.map(obj => (
                <div key={obj.id} className="cart-item d-flex align-center mb-20">
                  <div style={{ backgroundImage: `url(${obj.imageUrl})` }} className="cart-item-img"></div>
                  <div className="mr-20 flex">
                    <p className="mb-5">{obj.title}</p>
                    <b>{obj.price} смн.</b>
                  </div>
                  <button className="remove-btn button" onClick={() => onRemove(obj.id)}>
                    <img src="/img/btn-remove.svg" alt="Remove" />
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-total-block">
              <ul>
                <li>
                  <span>Итого:</span>
                  <div />
                  <b>{totalPrice} смн.</b>
                </li>
                <li>
                  <span>Налог 5%:</span>
                  <div />
                  <b>{Math.round((totalPrice / 100) * 5)} смн. </b>
                </li>
              </ul>
              <button disabled={isLoading} onClick={onClickOrder} className="green-button">
                Оформить заказ <img src="/img/arrow.svg" alt="Arrow" />
              </button>
            </div>
          </Fragment>
        ) : (
          <Info
            title={isOrderComplete ? 'Заказ оформлен!' : 'Корзина пустая'}
            description={
              isOrderComplete
                ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                : 'Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ.'
            }
            image={isOrderComplete ? '/img/complete-order.jpg' : '/img/empty-cart.jpg'}
          />
        )}
      </div>
    </div>
  );
};

export default Drawer;
