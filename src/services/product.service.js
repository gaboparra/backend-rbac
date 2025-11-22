import Product from "../models/Product.js";

export const getProductsService = async () => {
  const products = await Product.find({ isActive: true });
  return products;
};

export const getProductByIdService = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw { status: 404, message: "Product not found" };
  }

  return product;
};

export const createProductService = async (productData) => {
  const { name, description, price, stock } = productData;

  const product = await Product.create({
    name,
    description,
    price,
    stock: stock || 0,
  });

  return product;
};

export const updateProductService = async (productId, updateData) => {
  const { name, description, price, stock, isActive } = updateData;

  const product = await Product.findById(productId);
  if (!product) {
    throw { status: 404, message: "Product not found" };
  }

  if (name) product.name = name;
  if (description) product.description = description;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;
  if (typeof isActive === "boolean") product.isActive = isActive;

  await product.save();
  return product;
};

export const deleteProductService = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    throw { status: 404, message: "Product not found" };
  }
};
