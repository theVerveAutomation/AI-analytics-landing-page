import { Product } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}
const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="group relative w-48 flex-shrink-0"
    >
      <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-all duration-300 hover:shadow-md">
        {/* Image and Discount Badge */}
        <div className="relative h-40 overflow-hidden bg-muted">
          <Image
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            width={400}
            height={400}
          />
          {/* {product.discount && (
            <div className="absolute left-2 top-2 rounded-md bg-green-200 px-2 py-0.5 text-xs font-semibold text-destructive-foreground">
              {product.discount}
            </div>
          )} */}
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-3 p-4">
          {/* <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{product.deliveryTime}</span>
          </div> */}
          <h3 className="h-10 truncate text-sm font-medium text-foreground">
            {product.name}
          </h3>
          {/* <p className="text-xs text-muted-foreground">{product.quantity}</p> */}

          {/* Pricing and Add Button */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-base font-semibold text-foreground">
                ₹{product.price}
              </span>
              {/* {product.original_price && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.original_price}
                </span>
              )} */}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="rounded-lg border border-primary bg-background px-6 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              ADD
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
