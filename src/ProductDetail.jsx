function ProductDetail({ product }) {

  return (
    <div className="card mb-3">
      <img
        src={product.imageUrl}
        className="card-img-top primary-image"
        alt="主圖"
      />
      <div className="card-body">
        <h5 className="card-title">
          {product.title}
          <span className="badge bg-primary ms-2">{product.category}</span>
        </h5>

        <p className="card-text">商品描述：{product.description}</p>
        <p className="card-text">商品內容：{product.content}</p>

        <div className="d-flex">
          <p className="card-text text-secondary mb-0">
            <del>{product.origin_price}</del>
          </p>
          <span className="ms-2">元 / {product.price} 元</span>
        </div>

        <h5 className="mt-3">更多圖片：</h5>
        <div className="d-flex flex-wrap">
          {product.imagesUrl?.map((url, index) => (
            <img key={index} src={url} className="images" alt={`副圖 ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
