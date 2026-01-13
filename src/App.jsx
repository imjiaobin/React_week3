import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import * as bootstrap from 'bootstrap';
import LoginForm from "./LoginForm";
import Products from "./Products";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "jiaobin"; 

// ### 登入資訊
// 1. token 儲存 + 登入驗證 ( 同時 getProduct() ) => OK

// ### Modal
// 1. 建立 tempProduct state
// 2. 把 Modal 的所有欄位 和 tempProduct 綁定
// 3. 加上「模式」：新增 or 編輯（isNew / modalMode）

// ### 商品
// 1. 建立 products state 與取得商品列表的方法
// 2. 產品 CRUD
// 3. 啟用/關閉顏色 

function App() {
  // 初始化商品
  const defaultProduct = {
    title: '',
    category: '',
    unit: '',
    origin_price: '',
    price: '',
    description: '',
    content: '',
    is_enabled: 0, 
    imageUrl: '',
    imagesUrl: [],
  };

  // useState
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [products, setProducts] = useState([]);
  const [isAuth, setisAuth] = useState(false);
  const [tempProduct, setTempProduct] =  useState(defaultProduct);

  // useRef
  const productModalRef = useRef(null);
  
  // 頁面初始化功能
  // 取得商品列表
  async function getProducts(){

      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      const productList = res.data.products;
      setProducts(productList);

      return productList
  }

  // 登入
  async function handleLogin(e){
     e.preventDefault();
    try
    {
      const res = await axios.post( `${API_BASE}/admin/signin`, formData);
      const {token, expired} = res.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = `${token}`;

      setisAuth(true); // 修改驗證狀態為 登入成功
      getProducts();   // 重新渲染列表
        
    }
    catch(err)
    {
      console.dir(err);
      setisAuth(false); // 修改驗證狀態為 登入失敗
    }
    finally{
      console.log('登入function執行完畢')
    }
  }

  // useEffect
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if(token){
      axios.defaults.headers.common.Authorization = token;
    }else{
      console.log('未取得token');
    }
    
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false
    });

    const checkAdmin = async () => {
      try {
        await axios.post(`${API_BASE}/api/user/check`);
        setisAuth(true);
        getProducts();
      } catch (err) {
        console.log(err.response.data.message);
      }
    };

    checkAdmin();
    
  }, []);

  
  // input狀態改變共用方法
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  // 商品
  // 商品表單
  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;

    setTempProduct((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (checked ? 1 : 0)
          : type === 'number'
            ? (value === '' ? '' : Number(value))
            : value,
    }));
  };
  // 新增表單
  const addProduct = () => {
    productModalRef.current.show();
    setTempProduct(defaultProduct);
  }
  // 修改
  const EditProduct = (product) => {
    setTempProduct(product);
    productModalRef.current.show();
  }

  return (
    <>
      {isAuth ? (
          <div className="container">
            <h2>產品列表</h2>
            <div className="text-end mt-4">
              <button className="btn btn-primary" onClick={addProduct}>建立新的產品</button>
            </div>
            <Products products={products} addProduct={addProduct}/>
          </div>
      ) : (
        <LoginForm user={formData} handleLogin={handleLogin} handleInputChange={handleInputChange} />
      )}
      <div
        id="productModal"
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
        ref={productModalRef}
        >
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
            <div className="modal-header bg-dark text-white">
              <h5 id="productModalLabel" className="modal-title">
                <span>新增產品</span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        id='imageUrl'
                        type="text"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        name = 'imageUrl'
                        value= {tempProduct.imageUrl}
                        onChange={handleProductChange}
                        />
                    </div>
                    <img className="img-fluid" src={tempProduct.imageUrl || null} alt={tempProduct.title || ''} />
                  </div>
                  <div>
                    <button className="btn btn-outline-primary btn-sm d-block w-100">
                      新增圖片
                    </button>
                  </div>
                  <div>
                    <button className="btn btn-outline-danger btn-sm d-block w-100">
                      刪除圖片
                    </button>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">標題</label>
                    <input
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      name='title'
                      value={tempProduct.title}
                      onChange={handleProductChange}
                      />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">分類</label>
                      <input
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        name = 'category'
                        value = {tempProduct.category}
                        onChange={handleProductChange}
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">單位</label>
                      <input
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        name='unit'
                        value={tempProduct.unit}
                        onChange={handleProductChange}
                        />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">原價</label>
                      <input
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        name='origin_price'
                        value={tempProduct.origin_price}
                        onChange={handleProductChange}
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">售價</label>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        name='price'
                        value={tempProduct.price}
                        onChange={handleProductChange}
                        />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">產品描述</label>
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      name='description'
                      value={tempProduct.description}
                      onChange={handleProductChange}
                      ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">說明內容</label>
                    <textarea
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      name='content'
                      value={tempProduct.content}
                      onChange={handleProductChange}
                      ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        name='is_enabled'
                        value={tempProduct.is_enabled}
                        checked={!!tempProduct.is_enabled}
                        onChange={handleProductChange}
                        />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                >
                取消
              </button>
              <button type="button" className="btn btn-primary">確認</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App
