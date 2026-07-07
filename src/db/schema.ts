import { integer, pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users Table (Firebase UID as mapping)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Bookings Table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // optional: nullable if guest, or linked
  name: text('name').notNull(),
  email: text('email').notNull(),
  businessName: text('business_name').notNull(),
  packageName: text('package_name').notNull(),
  scheduledDate: text('scheduled_date').notNull(),
  scheduledTime: text('scheduled_time').notNull(),
  status: text('status').default('pending').notNull(), // 'pending', 'confirmed', 'cancelled'
  createdAt: timestamp('created_at').defaultNow(),
});

// Design Form Submissions Table
export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  businessName: text('business_name').notNull(),
  businessType: text('business_type').notNull(),
  designPreference: text('design_preference').notNull(),
  keyFeatures: jsonb('key_features').default([]).notNull(), // JSON array of features
  primaryColor: text('primary_color').notNull(),
  email: text('email').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

// Define Relationships
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  submissions: many(submissions),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
}));
