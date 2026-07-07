import { db } from './index.ts';
import { users, bookings, submissions } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

// Two-Layer Robust Error Handling
// Query Layer: Wraps queries in try/catch and throws sanitized generic errors with cause.

export async function getOrCreateUser(uid: string, email: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Failed to get or create user:", error);
    throw new Error("Failed to authenticate user profile in database.", { cause: error });
  }
}

export async function getBookings(dbUserId?: number) {
  try {
    if (dbUserId !== undefined) {
      return await db.select()
        .from(bookings)
        .where(eq(bookings.userId, dbUserId))
        .orderBy(desc(bookings.createdAt));
    } else {
      return await db.select()
        .from(bookings)
        .orderBy(desc(bookings.createdAt));
    }
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    throw new Error("Database query failed while fetching bookings.", { cause: error });
  }
}

export async function createBooking(data: {
  name: string;
  email: string;
  businessName: string;
  packageName: string;
  scheduledDate: string;
  scheduledTime: string;
  userId?: number;
}) {
  try {
    const result = await db.insert(bookings)
      .values({
        userId: data.userId || null,
        name: data.name,
        email: data.email,
        businessName: data.businessName,
        packageName: data.packageName,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        status: 'pending',
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Failed to create booking:", error);
    throw new Error("Database insert failed while creating booking.", { cause: error });
  }
}

export async function getSubmissions(dbUserId?: number) {
  try {
    if (dbUserId !== undefined) {
      return await db.select()
        .from(submissions)
        .where(eq(submissions.userId, dbUserId))
        .orderBy(desc(submissions.submittedAt));
    } else {
      return await db.select()
        .from(submissions)
        .orderBy(desc(submissions.submittedAt));
    }
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    throw new Error("Database query failed while fetching submissions.", { cause: error });
  }
}

export async function createSubmission(data: {
  businessName: string;
  businessType: string;
  designPreference: string;
  keyFeatures: string[];
  primaryColor: string;
  email: string;
  userId?: number;
}) {
  try {
    const result = await db.insert(submissions)
      .values({
        userId: data.userId || null,
        businessName: data.businessName,
        businessType: data.businessType,
        designPreference: data.designPreference,
        keyFeatures: data.keyFeatures,
        primaryColor: data.primaryColor,
        email: data.email,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Failed to create design submission:", error);
    throw new Error("Database insert failed while creating submission.", { cause: error });
  }
}
