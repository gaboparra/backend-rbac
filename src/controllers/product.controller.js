import {
  getProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "../services/product.service.js";
import logger from "../config/logger.js";

export const getProducts = async (req, res) => {
  try {
    const products = await getProductsService();

    return res.status(200).json({ products });
  } catch (error) {
    logger.error("Error fetching products:", error);
    res.status(500).json({
      error: "Error fetching products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);

    return res.status(200).json({ product });
  } catch (error) {
    logger.error("Error fetching product:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error fetching product",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).json({
        error: "Name, description and price are required",
      });
    }

    if (price < 0) {
      return res.status(400).json({
        error: "Price cannot be negative",
      });
    }

    const product = await createProductService({
      name,
      description,
      price,
      stock,
    });

    return res.status(201).json({ product });
  } catch (error) {
    logger.error("Error creating product:", error);
    res.status(500).json({
      error: "Error creating product",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, isActive } = req.body;

    if (price !== undefined && price < 0) {
      return res.status(400).json({
        error: "Price cannot be negative",
      });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        error: "Stock cannot be negative",
      });
    }

    const product = await updateProductService(req.params.id, {
      name,
      description,
      price,
      stock,
      isActive,
    });

    return res.status(200).json({ product });
  } catch (error) {
    logger.error("Error updating product:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error updating product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await deleteProductService(req.params.id);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting product:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error deleting product",
    });
  }
};
