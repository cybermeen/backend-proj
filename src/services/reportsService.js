const pool = require('../config/db');
const productModel = require('../models/productModel');
const orderModel = require('../models/orderModel');
const purchaseModel = require('../models/purchaseModel');
const reportsModel = require('../models/reportsModel');
const errorMessages = require('../utils/errorMessages');

async function getCounters() {
  const row = await reportsModel.getCounters();
  return {
    todaySales: Number(row.today_sales),
    todayOrders: Number(row.today_orders),
    totalSales: Number(row.total_sales),
    totalOrders: Number(row.total_orders),
    totalProducts: Number(row.total_products),
    totalCategories: Number(row.total_categories),
    totalPurchases: Number(row.total_purchases_amount),
    lowStockProducts: Number(row.low_stock_products),
  };
}

async function getSalesSummary() {
  const row = await reportModel.getSalesSummary();
  return {
    totalSales: Number(row.total_sales),
    totalOrders: Number(row.total_orders),
    averageOrderValue: Number(row.average_order_value),
    totalItemsSold: Number(row.total_items_sold),
    totalDiscount: Number(row.total_discount),
    totalTax: Number(row.total_tax),
  };
}

async function getDailySales(date) {
  const row = await reportModel.getDailySales(date);
  const sales = Number(row.sales);
  const tax = Number(row.tax);
  const discount = Number(row.discount);
  return {
    date,
    orders: Number(row.orders),
    sales,
    tax,
    discount,
    netSales: sales - discount + tax, //derived value
  };
}

async function getSalesRange(from, to) {
  const row = await reportModel.getSalesRange(from, to);
  return {
    from,
    to,
    totalOrders: Number(row.total_orders),
    totalSales: Number(row.total_sales),
    totalTax: Number(row.total_tax),
    totalDiscount: Number(row.total_discount),
  };
}

async function getPaymentsSummary() {
  const rows = await reportModel.getPaymentsSummary();
  return rows.map((row) => ({
    paymentMethod: row.payment_method,
    orders: Number(row.orders),
    amount: Number(row.amount),
  }));
}

async function getTopSellingProducts(limit) {
  const rows = await reportModel.getTopSellingProducts(limit);
  return rows.map((row) => ({
    productId: row.product_id,
    productName: row.product_name,
    quantitySold: Number(row.quantity_sold),
    sales: Number(row.sales),
  }));
}

async function getProductSummary(productId) {
  const row = await reportModel.getProductSummary(productId);
  if (!row) {
    const error = new Error(errorMessages.getProductNotFoundMessage());
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }
  return {
    productId: row.productId,
    productName: row.productName,
    produced: Number(row.produced),
    sold: Number(row.sold),
    remaining: row.remaining,
    salesAmount: Number(row.salesAmount),
  };
}

async function getCategorySummary() {
  const rows = await reportModel.getCategorySummary();
  return rows.map((row) => ({
    categoryId: row.category_id,
    categoryName: row.category_name,
    itemsSold: Number(row.items_sold),
    sales: Number(row.sales),
  }));
}

async function getPurchasesSummary() {
  const row = await reportModel.getPurchasesSummary();
  return {
    totalPurchases: Number(row.total_purchases),
    totalPurchaseAmount: Number(row.total_purchase_amount),
    averagePurchase: Number(row.average_purchase),
  };
}

async function getDailyPurchases(date) {
  const row = await reportModel.getDailyPurchases(date);
  return {
    date,
    purchaseCount: Number(row.purchase_count),
    totalAmount: Number(row.total_amount),
  };
}

async function getInventorySummary() {
  const row = await reportModel.getInventorySummary();
  return {
    totalProducts: Number(row.total_products),
    totalStock: Number(row.total_stock),
    lowStockProducts: Number(row.low_stock_products),
    outOfStockProducts: Number(row.out_of_stock_products),
  };
}

async function getLowStockInventory() {
  const rows = await reportModel.getLowStockInventory();
  return rows.map((row) => ({
    productId: row.product_id,
    productName: row.product_name,
    stock: row.stock,
    minimumStock: row.minimum_stock,
  }));
}

module.exports = {
  getCounters, getSalesSummary, getDailySales, getSalesRange, getPaymentsSummary,
  getTopSellingProducts, getProductSummary, getCategorySummary,
  getPurchasesSummary, getDailyPurchases, getInventorySummary, getLowStockInventory,
};