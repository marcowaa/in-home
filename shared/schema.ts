import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({
  username: true,
  password: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Delivery Drivers
export const deliveryDrivers = pgTable("delivery_drivers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  whatsappPhone: text("whatsapp_phone"),
  verificationCode: text("verification_code"),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  isAvailable: boolean("is_available").default(true),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default("0"),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0"),
  completedOrders: integer("completed_orders").default(0),
  profileImage: text("profile_image"),
  governorate: text("governorate"),
  city: text("city"),
  village: text("village"),
  idVerified: boolean("id_verified").default(false),
  criminalRecordVerified: boolean("criminal_record_verified").default(false),
  nationalIdImage: text("national_id_image"),
  nationalIdImageBack: text("national_id_image_back"),
  criminalRecordImage: text("criminal_record_image"),
  criminalRecordImageBack: text("criminal_record_image_back"),
  maxWeight: decimal("max_weight", { precision: 6, scale: 2 }),
  vehicleType: text("vehicle_type"),
  fullyVerified: boolean("fully_verified").default(false),
  referralCode: text("referral_code").unique(),
  referredBy: varchar("referred_by"),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"),
  totalRatings: integer("total_ratings").default(0),
  addedByAdmin: text("added_by_admin"),
  loginCount: integer("login_count").default(0),
  isHidden: boolean("is_hidden").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDeliveryDriverSchema = createInsertSchema(deliveryDrivers).omit({
  id: true,
  createdAt: true,
});

export type InsertDeliveryDriver = z.infer<typeof insertDeliveryDriverSchema>;
export type DeliveryDriver = typeof deliveryDrivers.$inferSelect;

// Payment Methods (used for driver deposits)
export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  description: text("description"),
  icon: text("icon"),
  instructions: text("instructions"),
  accountNumber: text("account_number"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
});

export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;

// Orders
export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: string;
  total: string;
}

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  customerCity: text("customer_city"),
  customerNotes: text("customer_notes"),
  items: jsonb("items").notNull().$type<OrderItem[]>(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethodId: varchar("payment_method_id").references(() => paymentMethods.id),
  paymentMethodName: text("payment_method_name"),
  status: text("status").default("pending"),
  isPaid: boolean("is_paid").default(false),
  amountCollected: decimal("amount_collected", { precision: 10, scale: 2 }),
  amountCollectedConfirmed: boolean("amount_collected_confirmed").default(false),
  trackingCode: text("tracking_code"),
  deliveryCode: text("delivery_code"),
  driverId: varchar("driver_id").references(() => deliveryDrivers.id),
  driverName: text("driver_name"),
  pickupDeadline: timestamp("pickup_deadline"),
  deliveryDeadline: timestamp("delivery_deadline"),
  pickedUpAt: timestamp("picked_up_at"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  pickupAddress: text("pickup_address"),
  shipmentType: text("shipment_type"),
  weight: decimal("weight", { precision: 6, scale: 2 }),
  frozenAmount: decimal("frozen_amount", { precision: 10, scale: 2 }),
  confirmationCode: text("confirmation_code"),
  driverCommission: decimal("driver_commission", { precision: 10, scale: 2 }),
  commissionPrepaid: boolean("commission_prepaid").default(false),
  commissionConfirmed: boolean("commission_confirmed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Driver Notifications
export const driverNotifications = pgTable("driver_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => deliveryDrivers.id).notNull(),
  orderId: varchar("order_id").references(() => orders.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  status: text("status").default("pending"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export type DriverNotification = typeof driverNotifications.$inferSelect;
export type InsertDriverNotification = typeof driverNotifications.$inferInsert;

// Order Driver Assignments
export const orderDriverAssignments = pgTable("order_driver_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  driverId: varchar("driver_id").references(() => deliveryDrivers.id).notNull(),
  status: text("status").default("pending"),
  rejectionReason: text("rejection_reason"),
  assignedAt: timestamp("assigned_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

export type OrderDriverAssignment = typeof orderDriverAssignments.$inferSelect;
export type InsertOrderDriverAssignment = typeof orderDriverAssignments.$inferInsert;

// Driver Wallet Transactions
export const driverWalletTransactions = pgTable("driver_wallet_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => deliveryDrivers.id).notNull(),
  type: text("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }),
  description: text("description"),
  orderId: varchar("order_id"),
  status: text("status").default("completed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DriverWalletTransaction = typeof driverWalletTransactions.$inferSelect;
export type InsertDriverWalletTransaction = typeof driverWalletTransactions.$inferInsert;

// Driver Withdrawal Requests
export const driverWithdrawalRequests = pgTable("driver_withdrawal_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => deliveryDrivers.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

export type DriverWithdrawalRequest = typeof driverWithdrawalRequests.$inferSelect;
export type InsertDriverWithdrawalRequest = typeof driverWithdrawalRequests.$inferInsert;

// Driver Deposit Requests
export const driverDepositRequests = pgTable("driver_deposit_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => deliveryDrivers.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethodId: varchar("payment_method_id").references(() => paymentMethods.id),
  paymentMethodName: text("payment_method_name"),
  status: text("status").default("pending"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

export type DriverDepositRequest = typeof driverDepositRequests.$inferSelect;
export type InsertDriverDepositRequest = typeof driverDepositRequests.$inferInsert;

// App Settings
export const appSettings = pgTable("app_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storeName: text("store_name").default("نظام المندوبين"),
  storeNameEn: text("store_name_en").default("Driver System"),
  siteTitle: text("site_title").default("نظام المندوبين - إدارة الشحن والتوصيل"),
  siteDescription: text("site_description").default("نظام متكامل لإدارة المندوبين والشحن والتوصيل - لوحة تحكم إدارية متقدمة ولوحة المندوب"),
  logo: text("logo"),
  appIcon: text("app_icon"),
  favicon: text("favicon"),
  whatsappNumber: text("whatsapp_number"),
  supportButtonEnabled: boolean("support_button_enabled").default(false),
  supportButtonType: text("support_button_type").default("whatsapp"),
  supportButtonValue: text("support_button_value"),
  supportButtonLabel: text("support_button_label").default("تواصل معنا"),
  primaryColor: text("primary_color").default("#ec4899"),
  currency: text("currency").default("ج.م"),
  adminDashboardBackground: text("admin_dashboard_background"),
  adminSidebarBackground: text("admin_sidebar_background"),
  adminLoginBackground: text("admin_login_background"),
  driverCommissionBase: decimal("driver_commission_base", { precision: 5, scale: 2 }).default("5"),
  driverCommissionVerifiedId: decimal("driver_commission_verified_id", { precision: 5, scale: 2 }).default("8"),
  driverCommissionVerifiedCriminal: decimal("driver_commission_verified_criminal", { precision: 5, scale: 2 }).default("12"),
  referralBonusAmount: decimal("referral_bonus_amount", { precision: 10, scale: 2 }).default("50"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAppSettingsSchema = createInsertSchema(appSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAppSettings = z.infer<typeof insertAppSettingsSchema>;
export type AppSettings = typeof appSettings.$inferSelect;

// Admin Notifications
export const adminNotifications = pgTable("admin_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedId: varchar("related_id"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AdminNotification = typeof adminNotifications.$inferSelect;
export type InsertAdminNotification = typeof adminNotifications.$inferInsert;

// Driver Ratings
export const driverRatings = pgTable("driver_ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => deliveryDrivers.id).notNull(),
  orderId: varchar("order_id").references(() => orders.id),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  comment: text("comment"),
  customerName: text("customer_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DriverRating = typeof driverRatings.$inferSelect;
export type InsertDriverRating = typeof driverRatings.$inferInsert;

// Driver Referrals
export const driverReferrals = pgTable("driver_referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").references(() => deliveryDrivers.id).notNull(),
  referredId: varchar("referred_id").references(() => deliveryDrivers.id).notNull(),
  bonus: decimal("bonus", { precision: 10, scale: 2 }).default("0"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DriverReferral = typeof driverReferrals.$inferSelect;
export type InsertDriverReferral = typeof driverReferrals.$inferInsert;

// API Keys for integrations
export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  apiKey: text("api_key").notNull().unique(),
  secretKey: text("secret_key").notNull(),
  permissions: jsonb("permissions").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  ipWhitelist: text("ip_whitelist"),
  rateLimit: integer("rate_limit").default(100),
  totalRequests: integer("total_requests").default(0),
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
  tenantDbName: text("tenant_db_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;

// Webhooks
export const webhooks = pgTable("webhooks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull(),
  events: jsonb("events").$type<string[]>().default([]),
  secret: text("secret"),
  headers: jsonb("headers").$type<Record<string, string>>().default({}),
  isActive: boolean("is_active").default(true),
  failCount: integer("fail_count").default(0),
  maxRetries: integer("max_retries").default(3),
  lastTriggeredAt: timestamp("last_triggered_at"),
  lastStatus: integer("last_status"),
  lastError: text("last_error"),
  tenantDbName: text("tenant_db_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = typeof webhooks.$inferInsert;

// API Logs
export const apiLogs = pgTable("api_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  apiKeyId: varchar("api_key_id"),
  apiKeyName: text("api_key_name"),
  method: text("method").notNull(),
  endpoint: text("endpoint").notNull(),
  statusCode: integer("status_code"),
  responseTime: integer("response_time"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  requestBody: jsonb("request_body"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ApiLog = typeof apiLogs.$inferSelect;
export type InsertApiLog = typeof apiLogs.$inferInsert;

// Operation Logs - unified log of all completed operations
export const operationLogs = pgTable("operation_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // delivery, commission, deposit, withdrawal, refund, penalty, referral_bonus, order_created, order_cancelled, driver_assigned
  driverId: varchar("driver_id").references(() => deliveryDrivers.id),
  driverName: text("driver_name"),
  orderId: varchar("order_id"),
  orderNumber: text("order_number"),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  description: text("description").notNull(),
  status: text("status").default("completed"), // completed, cancelled, pending
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type OperationLog = typeof operationLogs.$inferSelect;
export type InsertOperationLog = typeof operationLogs.$inferInsert;

// Webhook Logs
export const webhookLogs = pgTable("webhook_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  webhookId: varchar("webhook_id").references(() => webhooks.id).notNull(),
  event: text("event").notNull(),
  url: text("url").notNull(),
  requestBody: jsonb("request_body"),
  responseStatus: integer("response_status"),
  responseBody: text("response_body"),
  success: boolean("success").default(false),
  error: text("error"),
  duration: integer("duration"),
  createdAt: timestamp("created_at").defaultNow(),
})

export type WebhookLog = typeof webhookLogs.$inferSelect;
export type InsertWebhookLog = typeof webhookLogs.$inferInsert;

// Pro Admin Accounts (Tenants)
export const proAdmins = pgTable("pro_admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  dbName: text("db_name").notNull(),
  isActive: boolean("is_active").default(true),
  autoDisableAt: timestamp("auto_disable_at"),
  autoEnableAt: timestamp("auto_enable_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProAdminSchema = createInsertSchema(proAdmins).pick({
  username: true,
  password: true,
  name: true,
});

export type ProAdmin = typeof proAdmins.$inferSelect;
export type InsertProAdmin = z.infer<typeof insertProAdminSchema>;
