import classNames from 'classnames';
import React from 'react';
import BalanceSvg from '../../icons/BalanceSvg';
import CartSvg from '../../icons/CartSvg';

import styles from './styles.module.scss';

interface IProduct {}

const Product: React.FC<IProduct> = () => {
  return (
    <div className={styles.root}>
      <p className={styles.root__mainTag}>#Stoc limitat</p>
      <img
        className={styles.root__image}
        src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone15pro-digitalmat-gallery-3-202309?wid=364&hei=333&fmt=png-alpha&.v=1693081542150"
      />
      <p className={styles.root__properties}>ONE HAND SWORD, MAX SPEED</p>
      <div className={styles.root__tags}>
        <button className={styles.root__tag}>#Apple</button>
        <button className={styles.root__tag}>#iPhone</button>
        <button className={styles.root__tag}>#Silver</button>
      </div>
      <p className={styles.root__title}>iPhone 15 Pro</p>
      <div className={(styles.root__bottom, styles.bottom)}>
        <div className={styles.bottom__price}>
          <div className={styles.bottom__priceType}>
            <span className={styles.bottom__initialPrice}>67 999 lei</span>
            <span className={styles.bottom__discount}> - 1000 lei </span>
          </div>
          <p className={styles.bottom__finalPrice}>
            66 999 <span className={styles.bottom__currency}>lei</span>
          </p>
          <p className={styles.bottom__cashback}>Cashback 500 lei</p>
        </div>
        <div className={classNames(styles.bottom__features, styles.features)}>
          <button className={styles.features__balance}>
            <BalanceSvg />
          </button>
          <button className={styles.features__cart}>
            <CartSvg />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
