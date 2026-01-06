'use client";';
//import { clearCart, closeBasketDrawer } from "@/store/slices/cart/cartSlice";
//import type { RootState } from "@/store/store";
//import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faXmark } from "@fortawesome/free-solid-svg-icons";
//import type { BasketItem } from "@/store/slices/cart/basketItemTypes";
import Btn from "@/components/formElements/Btn";

export default function BasketDrawer() {
  /*  const dispatch = useDispatch();
  const isBasketOpen = useSelector((s: RootState) => s.cart.isBasketOpen);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQtyItems = useSelector(
    (state: RootState) => state.cart.totalQtyItems
  );
  const cartTotal = useSelector((state: RootState) => state.cart.cartTotal);
 */
  type BasketItem = {
    id: string;
    name: string;
    price: string;
    quantity?: number;
    terms?: string[];
  }; // REMOVE THIS LINE WHEN USING REDUX
  let isBasketOpen = false; // REMOVE THIS LINE WHEN USING REDUX
  const cartItems = [
    { id: "1", name: "Dance Class A", price: "$20.00", quantity: 2 },
    { id: "2", name: "Dance Class B", price: "$15.00", quantity: 1 },
  ]; // REMOVE THIS LINE WHEN USING REDUX
  const totalQtyItems = 3; // REMOVE THIS LINE WHEN USING REDUX
  const cartTotal = 55.0; // REMOVE THIS LINE WHEN USING REDUX
  useEffect(() => {
    if (isBasketOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isBasketOpen]);

  const onClose = () => {
    //dispatch(closeBasketDrawer());
    isBasketOpen = false; // REMOVE THIS LINE WHEN USING REDUX
  };
  const redirectToCheckout = () => {
    // Implement checkout redirection logic here
    alert("Redirecting to checkout...");
    console.log("sending items", cartItems);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
          isBasketOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!isBasketOpen}
      />
      <aside
        className={`fixed right-0 top-0 z-40 h-full flex flex-col justify-start w-[min(100%,24rem)] bg-black text-white
          shadow-lg shadow-blue-500/40
          transform-gpu transition-transform duration-300 ease-out
          ${isBasketOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!isBasketOpen}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items- justify-between p-4 border-b border-white/10">
          <h2 className="text-xl">
            Basket{totalQtyItems ? ` (${totalQtyItems})` : ""}
          </h2>
          <button
            onClick={onClose}
            title="Close basket"
            className="hover:opacity-80 transition-opacity"
            aria-label="Close basket"
          >
            {/*  <FontAwesomeIcon
              icon={faXmark}
              size="lg"
              className="text-white/70"
            /> */}
            X
          </button>
        </div>
        <ul className="p-4 space-y-3 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-white/60">Your basket is empty.</p>
          ) : (
            cartItems.map((item: BasketItem) => (
              <li key={item.id} className="flex justify-between items-center">
                <div className="truncate">
                  <span className="text-white">{item.name}</span>
                  <span className="text-white/60"> × {item.quantity}</span>
                </div>
                <div className="text-white/80">
                  $
                  {(
                    parseFloat(item.price.replace("$", "")) * item.quantity
                  ).toFixed(2)}
                </div>
              </li>
            ))
          )}
        </ul>
        <button
          className={`text-xs underline w-fit self-end px-4 uppercase text-white ${
            cartItems.length === 0 ? "hidden" : "blocck cursor-pointer"
          }`}
          onClick={() => dispatch(clearCart())}
          disabled={cartItems.length === 0}
        >
          Clear Basket
        </button>
        <div className="mt-auto text-white p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <Btn
            label="Checkout"
            disabled={cartItems.length === 0}
            onClick={redirectToCheckout}
          />
        </div>
      </aside>
    </>
  );
}
