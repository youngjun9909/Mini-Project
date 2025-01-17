import React, { useReducer, useRef, useState } from 'react';
import './Cart.css';

// 상품 정보 인터페이스 정의
interface Product {
  id: number;        // 상품 ID
  name: string;      // 상품 이름
  price: number;     // 상품 가격
}

// 장바구니에 추가된 상품 인터페이스 정의 (상품 + 수량)
interface CartItem extends Product {
  quantity: number;  // 수량
}

// 상태의 구조 정의
interface State {
  cart: CartItem[];  // 장바구니에 담긴 상품들
  total: number;     // 총 금액
}

// 액션 타입 정의
type Action = 
  | { type: 'add'; product: Product }             // 상품 추가
  | { type: 'remove'; productId: number }        // 상품 제거
  | { type: 'increment'; productId: number }     // 수량 증가
  | { type: 'decrement'; productId: number }     // 수량 감소
  | { type: 'clear' };                           // 장바구니 비우기

// 초기 상태 정의
const initialState: State = {
  cart: [],       // 비어있는 장바구니
  total: 0        // 총 금액 초기값
};

// 리듀서 함수 정의
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'add':
      // 장바구니에 이미 같은 상품이 있는지 확인
      const existingItem = state.cart.find((item) => item.id === action.product.id);
      if (existingItem) {
        // 이미 있는 상품의 수량 증가
        return {
          ...state,
          cart: state.cart.map((item) => 
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.product.price,  // 총 금액 업데이트
        };
      } else {
        // 새 상품 추가
        return {
          ...state,
          cart: [...state.cart, { ...action.product, quantity: 1 }],
          total: state.total + action.product.price,  // 총 금액 업데이트
        };
      }

    case 'remove':
      // 특정 상품 제거
      const itemToRemove = state.cart.find((item) => item.id === action.productId);
      if (itemToRemove) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== action.productId),  // 상품 필터링
          total: state.total - itemToRemove.price * itemToRemove.quantity,  // 총 금액 업데이트
        };
      }
      return state;

    case 'increment':
      // 특정 상품 수량 증가
      const item = state.cart.find((item) => item.id === action.productId)!;
      return {
        ...state,
        cart: state.cart.map((item) => 
          item.id === action.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
        total: state.total + item.price,  // 총 금액 업데이트
      };

    case 'decrement':
      // 특정 상품 수량 감소
      const itemToDecrement = state.cart.find((item) => item.id === action.productId)!;
      if (itemToDecrement.quantity > 1) {
        return {
          ...state,
          cart: state.cart.map((item) => 
            item.id === action.productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
          total: state.total - itemToDecrement.price,  // 총 금액 업데이트
        }
      } else {
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== action.productId),  // 수량이 1인 경우 제거
          total: state.total - itemToDecrement.price,  // 총 금액 업데이트
        };
      }

    case 'clear':
      // 장바구니 비우기
      return initialState;

    default: 
      throw new Error('Unhandled action type');
  }
}

// Cart 컴포넌트
export default function Cart() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: '노트북', price: 1000 },
    { id: 2, name: '핸드폰', price: 500 },
    { id: 3, name: '컴퓨터', price: 300 },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0
  });

  const productIdRef = useRef(4);

  // 새 상품 추가 함수
  const handleAddProduct = () => {
    const product = {
      id: productIdRef.current,
      ...newProduct
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      price: 0
    });

    productIdRef.current += 1;
  }

  return (
    <div>
      <hr />
      <div className="shopping-cart">
        <h2>상품들</h2>
        <ul className="product-list">
          {products.map((product) => (
            <li key={product.id} className="product-item">
              {product.name} - ${product.price}
              <button onClick={() => dispatch({ type: "add", product })}>
                장바구니 추가
              </button>
            </li>
          ))}
        </ul>

        <h2>상품 추가</h2>
        <div className="add-product">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Product Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: Number(e.target.value) })
            }
          />
          <button onClick={handleAddProduct}>추가</button>
        </div>

        <h2>장바구니 </h2>
        <ul className="cart-list">
          {state.cart.map((item) => (
            <li key={item.id} className="cart-item">
              {item.name} - ${item.price} x {item.quantity}
              <button
                onClick={() =>
                  dispatch({ type: "increment", productId: item.id })
                }
              >
                +
              </button>
              <button
                onClick={() =>
                  dispatch({ type: "decrement", productId: item.id })
                }
              >
                -
              </button>
              <button
                onClick={() => dispatch({ type: "remove", productId: item.id })}
              >
                삭제 
              </button>
            </li>
          ))}
        </ul>
        <p>총 금액: ${state.total}</p>
        <button onClick={() => dispatch({ type: "clear" })}>
          비우기
        </button>
      </div>
      <hr />
    </div>
  );
}
