import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../Hooks/useCart';

const Header = props => {
  const { totalPrice } = useCart();
  return (
    <header className="d-flex justify-between align-center p-40">
      <Link to="/">
        <div className="d-flex align-center">
          <img width={40} height={40} src="/img/logo.png" alt="logo" />
          <div>
            <h3 className="text-uppercase">Alif Project Sneakers</h3>
          </div>
        </div>
      </Link>
      <ul className="d-flex align-center">
        <li onClick={props.onClickCart} className="mr-30 cu-p">
          <img width={18} height={18} src="/img/cart.svg" alt="Корзина" />
          <span>{totalPrice} смн.</span>
        </li>
        <li className="mr-20 cu-p">
          <Link to="/favorites">
            <img width={18} height={18} src="/img/heart.svg" alt="Закладки" />
          </Link>
        </li>
        <li>
          <Link to="/orders">
            <img width={18} height={18} src="/img/user.svg" alt="Пользователь" />
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
