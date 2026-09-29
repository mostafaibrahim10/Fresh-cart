
import Slider from "../Slider/Slider";
import Products from "../Products/Products";
import Categories from "../Categories/Categories";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8">
      <Slider />
      <Categories />
      <Products />
    </div>
  );
}
