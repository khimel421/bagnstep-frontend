import ProductCard from "@/components/ProductCard";
import products from "@/data/products.json";
export default function Products() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2 max-w-5xl mx-auto">
      {products.map(({ product_code, product_name, price, color, origin, image, sizes,id}) => (
        <ProductCard
          key={id}
          product_code={product_code}
          product_name={product_name}
          image={image}
          title="Adidas UltraBoost"
          sizes={sizes}
          price={price}
          id={id}
        />
      ))}
      {/* <ProductCard
        image="/images/shoe.jpg"
        title="Adidas UltraBoost"
        price="140"
      /> */}
    </div>
  );
}
