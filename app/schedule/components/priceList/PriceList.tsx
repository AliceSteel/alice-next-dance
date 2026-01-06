"use client";
import Btn from "@/components/formElements/Btn";
import type { Pass } from "@/types/Pass";
import { useState, useRef, useEffect, memo } from "react";
/* import { addToCart, openBasketDrawer } from "@/store/slices/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn } from "@/store/slices/user/userSlice";
import { openModal } from "@/store/slices/modal/modalSlice";
import type { RootState } from "@/store/store"; */

const PriceList = ({
  prices,
}: {
  prices: { passes: Pass[]; purchaseButtonTitle: string };
}) => {
  /* const isLoggedIn = useSelector(selectIsLoggedIn);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const { passes, purchaseButtonTitle } = prices;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const dispatch = useDispatch();

  const detailsRefs = useRef<Record<number, HTMLDivElement | null>>({});
  useEffect(() => {
    passes.forEach((_, index) => {
      const el = detailsRefs.current[index];
      if (!el) return;
      if (openIndex === index) {
        el.style.maxHeight = el.scrollHeight + "px";
      } else {
        el.style.maxHeight = "0px";
      }
    });
  }, [openIndex, passes]);

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const addToBasket =
    (pass: Pass) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!isLoggedIn) {
        dispatch(openModal("login"));
        return;
      }
      dispatch(addToCart(pass));
    };
  return (
    <ul className="flex flex-col">
      {passes &&
        passes.map((pass: Pass, index: number) => {
          const isInCart = cartItems.some((item: Pass) => item.id === pass.id);
          const label = isInCart ? "Added" : purchaseButtonTitle;
          const isOpen = openIndex === index;

          return (
            <li
              key={index}
              className="w-full relative transition-all duration-300 border-b-2 border-white/20 px-5"
            >
              <div
                role="button"
                className={
                  `flex w-full items-start justify-start flex-wrap sm:flex-nowrap py-4 text-left relative pr-6` +
                  (isOpen ? "cursor-pointer" : "cursor-auto")
                }
                onClick={() => toggleIndex(index)}
                aria-expanded={isOpen}
                aria-controls={`pass-details-${index}`}
              >
                <span className="text-white text-sm basis-1/5">{`[${
                  index + 1
                }]`}</span>
                <span className="text-white uppercase basis-3/5 sm:basis-1/5">
                  {pass.name}
                </span>
                <div
                  id={`pass-details-${index}`}
                  ref={(el) => {
                    detailsRefs.current[index] = el;
                  }}
                  className={`relative overflow-hidden transition-all duration-500 max-h-0 flex w-full sm:basis-3/5 justify-between items-start ${
                    isOpen
                      ? "border-t border-dotted border-white/10 sm:border-none "
                      : "border-none"
                  }`}
                >
                  <div className="w-3/4 sm:w-2/4 flex flex-col gap-2 pt-2">
                    {" "}
                    {pass.terms &&
                      pass.terms.map((term, i) => (
                        <p key={i} className="text-gray-300">
                          {term}
                        </p>
                      ))}
                  </div>

                  <div className="mt-auto self-end flex items-end gap-4 mr-5">
                    <span className=" text-white font-semibold w-1/4 text-center mt-auto">
                      {pass.price}
                    </span>{" "}
                    <Btn
                      size="small"
                      variant="secondary"
                      label={label}
                      onClick={addToBasket(pass)}
                      disabled={isInCart}
                    />
                    {isInCart && (
                      <button
                        onClick={() => dispatch(openBasketDrawer())}
                        className="underline text-xs cursor-pointer"
                        title="Go To Basket"
                      >
                        <span>Go to Basket</span>
                      </button>
                    )}
                  </div>
                </div>
          
                <span
                  aria-hidden="true"
                  className={
                    "absolute right-0 top-4 w-3 h-3 border-r-2 border-b-2 border-white transform transition-transform duration-300 " +
                    (isOpen ? "-rotate-135" : "rotate-45")
                  }
                />
              </div>
            </li>
          );
        })}
    </ul>
  ); */
  return <div>Price List Component</div>;
};
export default memo(PriceList);
