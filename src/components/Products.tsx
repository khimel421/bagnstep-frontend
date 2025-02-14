import ProductCard from "@/components/ProductCard";

export default function Products() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      <ProductCard 
        image="/images/shoe.jpg"
        title="Nike Air Max"

        price="120"
      />
      <ProductCard 
        image="/images/shoe.jpg"
        title="Adidas UltraBoost"
        price="140"
      />
    </div>
  );
}
