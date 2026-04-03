"use client";
import { clearCart, closeBasketDrawer } from "@/store/slices/cart/cartSlice";
import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Lineicons } from "@lineiconshq/react-lineicons";
import type { BasketItem } from "@/types/basketItemTypes";
import Btn from "@/components/formElements/Btn";
import { XmarkOutlined } from "@lineiconshq/free-icons";
import useMounted from "@/app/composables/useMounted";
import { createOrder } from "@/helpers/actions";

export default function BasketDrawer() {
  const mounted = useMounted();

  const dispatch = useDispatch();
  const isBasketOpen = useSelector((s: RootState) => s.cart.isBasketOpen);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQtyItems = useSelector(
    (state: RootState) => state.cart.totalQtyItems,
  );
  const cartTotal = useSelector((state: RootState) => state.cart.cartTotal);
  const [buttonPending, setButtonPending] = useState(false);

  useEffect(() => {
    if (isBasketOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isBasketOpen]);

  const onClose = () => {
    dispatch(closeBasketDrawer());
  };

  const redirectToCheckout = async () => {
    setButtonPending(true);
    await createOrder(cartItems, parseFloat(cartTotal));
    dispatch(clearCart({ showToast: false }));
    onClose();
    setButtonPending(false);
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
      {mounted && (
        <aside
          className={`fixed right-0 top-0 z-40 h-full flex flex-col justify-start w-[min(100%,24rem)] bg-black text-white
          shadow-lg shadow-blue-500/40
          transform-gpu transition-transform duration-300 ease-out
          ${isBasketOpen ? "translate-x-0" : "translate-x-full"}`}
          aria-hidden={!isBasketOpen}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl">
              Basket{totalQtyItems ? ` (${totalQtyItems})` : ""}
            </h2>
            <button
              onClick={onClose}
              title="Close basket"
              className="hover:opacity-80 transition-opacity"
              aria-label="Close basket"
            >
              <Lineicons
                icon={XmarkOutlined}
                size={20}
                className="text-white/50"
              />
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
              cartItems.length === 0 ? "hidden" : "block cursor-pointer"
            }`}
            onClick={() => dispatch(clearCart({ showToast: true }))}
            disabled={cartItems.length === 0}
          >
            Clear Basket
          </button>
          <div className="mt-auto text-white p-4 border-t border-white/10 flex flex-col gap-3">
            {mounted && (
              <div className="flex items-center justify-between">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            )}
            <Btn
              label={buttonPending ? "Processing..." : "Checkout"}
              disabled={cartItems.length === 0 || buttonPending}
              onClick={redirectToCheckout}
            />
          </div>
        </aside>
      )}
    </>
  );
}
