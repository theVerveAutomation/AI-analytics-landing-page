"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ExternalLink, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { useCartStore } from "@/store/userCartStore";
import Image from "next/image";
import { useState } from "react";

export default function ShoppingCartDrawer() {
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const [quoteFormOpen, setQuoteFormOpen] = useState(false);

  return (
    <Drawer shouldScaleBackground={true} snapPoints={[1]}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="w-4 h-4" />
          <p className="text-sm hidden md:block">Shopping Cart</p>
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col h-[100dvh] max-h-[100dvh] w-full">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-4">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart ({getTotalItems()} items)
          </DrawerTitle>
          <DrawerDescription>
            Review your items before checkout.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-center min-w-full">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <DrawerClose asChild>
                <Button variant="outline">Continue Shopping</Button>
              </DrawerClose>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto border-y py-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.brand && (
                        <div className="text-xs text-gray-400 font-semibold">
                          Brand: {item.brand}
                        </div>
                      )}
                      {item.showPrice && (
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      {item.showPrice && (
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 mt-1"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Order Summary */}
              {/* <div className="flex pt-4 w-full justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm text-sm">
                  <span className="font-bold col-span-1">Total:</span>
                  <span className="font-bold text-right col-span-1">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div> */}
            </>
          )}
        </DrawerBody>
        <DrawerFooter className="grid-cols-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </DrawerClose>
          <Button
            className="w-full"
            disabled={items.length === 0}
            onClick={() => setQuoteFormOpen(true)}
          >
            <ExternalLink className="w-5 h-5" />
            Request Quote
            {/* (${getTotalPrice().toFixed(2)}) */}
          </Button>
          {/* Quote Request Modal for Cart */}
          <QuoteRequestForm
            open={quoteFormOpen}
            onOpenChange={setQuoteFormOpen}
            productDetails={items}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
