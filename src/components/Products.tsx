import ProductCard from "@/components/ProductCard";
import products from "@/data/products.json";
export default function Products() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2 container mx-auto">
      {products.map(({ product_code, product_name, price, color, origin, image, sizes }) => (
        <ProductCard
          key={product_code}
          product_code={product_code}
          product_name={product_name}
          image={image}
          title="Adidas UltraBoost"
          sizes={sizes}
          price={price}
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
