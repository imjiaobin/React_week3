// import ProductDetail from "./ProductDetail"

function Products({ products}) {
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>分類</th>
            <th>產品名稱</th>
            <th>原價</th>
            <th>售價</th>
            <th>是否啟用</th>
            <th>編輯</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((item) => (
              <tr key={item.id}>
                <td>{item.category}</td>
                <td>{item.title}</td>
                <td>{item.origin_price}</td>
                <td>{item.price}</td>
                <td className={`${item.is_enabled && "text-success"}`}>{item.is_enabled ? "啟用" : "未啟用"}</td>
                <td>
                  <div
                    className="btn-group btn-group-sm"
                    role="group"
                    aria-label="Small button group"
                  >
                    <button type="button" className="btn btn-outline-primary">
                      編輯
                    </button>
                    <button type="button" className="btn btn-outline-danger">
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">尚無產品資料</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Products;
