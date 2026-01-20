import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQty,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../redux/cartSlice";
import { Trash2 } from "lucide-react";

export default function Cart() {
  const dispatch = useDispatch();

  const items = useSelector(selectCartItems);
  const totalQty = useSelector(selectCartTotalQty);
  const totalPrice = useSelector(selectCartTotalPrice);

  const formatPrice = (n) => `€${Number(n || 0).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold">Cart ({items.length})</h2>
            <div className="text-sm text-gray-500">
              Total items: <span className="font-semibold">{totalQty}</span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-2xl p-6 text-gray-600">
              Your cart is empty.
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl border border-gray-200 object-cover"
                  />

                  {/* info */}
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Unit price:{" "}
                      <span className="font-semibold">
                        {formatPrice(item.price)}
                      </span>
                    </p>

                    <p className="mt-2 text-lg font-extrabold text-gray-900">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>

                  {/* qty + remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    {/* qty control like AliExpress: - 1 + */}
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <button
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        className="w-10 h-10 flex items-center justify-center font-extrabold text-lg hover:bg-gray-100 active:bg-gray-200"
                      >
                        -
                      </button>

                      <div className="w-12 h-10 flex items-center justify-center font-bold border-x border-gray-300">
                        {item.quantity}
                      </div>

                      <button
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        className="w-10 h-10 flex items-center justify-center font-extrabold text-lg hover:bg-gray-100 active:bg-gray-200"
                      >
                        +
                      </button>
                    </div>

                    {/* remove */}
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-300 
             hover:bg-red-50 hover:text-red-600 active:bg-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Summary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 lg:sticky lg:top-6 h-fit">
          <h3 className="text-xl font-extrabold mb-4">Summary</h3>

          <div className="flex items-center justify-between py-2 text-gray-700">
            <span>Estimated total</span>
            <span className="font-extrabold">{formatPrice(totalPrice)}</span>
          </div>

          <div className="flex items-center justify-between py-2 text-gray-700">
            <span>Total quantity</span>
            <span className="font-extrabold">{totalQty}</span>
          </div>

          <button
            disabled={items.length === 0}
            className={`mt-4 w-full rounded-2xl py-3 font-extrabold text-white
              ${
                items.length === 0
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 active:bg-red-700"
              }
            `}
            onClick={() => alert("Proceed to checkout")}
          >
            Checkout ({totalQty})
          </button>

          <div className="mt-4 rounded-2xl border border-gray-200 p-4">
            <p className="font-bold text-gray-900">Buyer protection</p>
            <p className="text-sm text-gray-600 mt-1">
              Get a full refund if the item is not as described or not
              delivered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
