

import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  SESSION_TOKEN_COOKIE_NAME,
  sendOTP,
  verifyOTP,
  getCurrentUser,
} from "@hey-boss/users-service/backend";

// Import MariaDB helpers
import { query, queryOne, insert, update, deleteRecord, getServerIP, testConnection } from "./lib/mariadb";

const app = new Hono<{
  Bindings: {
    API_KEY: string;
    USER_ID: string;
    PROJECT_ID: string;
    USER_EMAIL: string;
    AUTH_KEY: string;
  };
}>();

// =================================================================
// == AI-ASSISTANT / DEVELOPER: DO NOT MODIFY THE CODE BELOW      ==
// =================================================================
//
// The following four routes handle critical user authentication logic.
// They are essential for user login, session creation, and logout.
// Any changes to this section can break the entire authentication flow.
//
// PROTECTED ROUTES:
// - GET /api/oauth/google/redirect_url
// - POST /api/sessions
// - GET /api/users/me
// - GET /api/logout
// - POST /api/send-otp
// - POST /api/verify-otp
//
// Please add any new routes AFTER this block.
// =================================================================
const SHOPPING_SERVICE_ENDPOINT = "https://shopping.heybossai.com";

app.get("/api/oauth/google/redirect_url", async (c) => {
  const origin = c.req.query("originUrl") || "";
  const redirectUrl = await getOAuthRedirectUrl("google", {
    originUrl: origin,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(
    body.code,
    c.env.PROJECT_ID
  );

  setCookie(c, SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 1 * 24 * 60 * 60, // 1 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  //@ts-ignore
  return c.json(c.get("user"));
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken);
  }

  setCookie(c, SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

app.post("/api/send-otp", async (c) => {
  const body = await c.req.json();
  const email = body.email;
  if (!email) {
    return c.json({ error: "No email provided" }, 400);
  }
  const data = await sendOTP(email, c.env.PROJECT_ID);
  if (data.error) {
    return c.json({ error: data.error }, 400);
  }
  return c.json({ success: true }, 200);
});

app.post("/api/verify-otp", async (c) => {
  const body = await c.req.json();
  const email = body.email;
  const otp = body.otp;
  if (!email) {
    return c.json({ error: "No email provided" }, 400);
  }
  if (!otp) {
    return c.json({ error: "No otp provided" }, 400);
  }
  const data = await verifyOTP(email, otp);

  if (data.error) {
    return c.json({ error: data.error }, 400);
  }
  const sessionToken = data.sessionToken;

  setCookie(c, SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 1 * 24 * 60 * 60, // 1 day
  });
  return c.json({ success: true, data }, 200);
});

app.post("/api/create-checkout-session", async (c) => {
  const { products, successRouter, cancelRouter } = await c.req.json();
  let user = null;
  const sessionToken = getCookie(c, SESSION_TOKEN_COOKIE_NAME);
  if (sessionToken) {
    user = await getCurrentUser(sessionToken);
  }

  const url = new URL(c.req.url);

  const response = await fetch(
    `${SHOPPING_SERVICE_ENDPOINT}/api/payment/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-worker-origin": url.origin,
        "x-req-id": crypto.randomUUID(),
      },
      body: JSON.stringify({
        projectId: c.env.PROJECT_ID,
        customerEmail: user?.email,
        products,
        successUrl: successRouter,
        cancelUrl: cancelRouter,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    return c.json(data, 400);
  }
  return c.json(data, 200);
});

app.get("/api/products", async (c) => {
  const response = await fetch(
    `${SHOPPING_SERVICE_ENDPOINT}/api/products?projectId=${c.env.PROJECT_ID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-req-id": crypto.randomUUID(),
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    return c.json(data, 400);
  }
  return c.json(data, 200);
});

app.get("/api/products/purchase-detail", async (c) => {
  const sessionId = c.req.query("sessionId") || "";
  if (!sessionId) {
    return c.json({ error: "No sessionId provided" }, 400);
  }

  const response = await fetch(
    `${SHOPPING_SERVICE_ENDPOINT}/api/products/purchase-detail`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-req-id": crypto.randomUUID(),
      },
      body: JSON.stringify({
        projectId: c.env.PROJECT_ID,
        sessionId,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    return c.json(data, 400);
  }
  return c.json(data, 200);
});
// =================================================================
// == END OF PROTECTED AUTHENTICATION ROUTES                      ==
// =================================================================

// Import email service and config
import { handleFormSubmissionEmails } from "../shared/email-service";
import formConfig from "../shared/form-configs.json";

// =================================================================
// == ADMIN API ENDPOINTS WITH STRICT SECURITY                    ==
// =================================================================

// Admin status check
app.get("/api/admin/status", authMiddleware, async (c) => {
  //@ts-ignore
  const user = c.get("user");
  const isAdmin = user?.email === c.env.USER_EMAIL;
  return c.json({ isAdmin });
});

// Server IP endpoint for admin dashboard
app.get("/api/admin/server-ip", authMiddleware, async (c) => {
  //@ts-ignore
  const user = c.get("user");
  if (user?.email !== c.env.USER_EMAIL) {
    return c.json({ error: "Forbidden" }, 403);
  }

  try {
    const serverIP = await getServerIP();
    const connectionStatus = await testConnection();
    
    return c.json({ 
      serverIP,
      databaseConnectionStatus: connectionStatus ? 'Connected' : 'Disconnected',
      databaseHost: '217.77.6.254',
      databaseName: 'serbanca_production'
    });
  } catch (error) {
    console.error("Server IP fetch error:", error);
    return c.json({ error: "Failed to fetch server information" }, 500);
  }
});

// Schema discovery endpoints
app.get("/api/admin/schemas", authMiddleware, async (c) => {
  //@ts-ignore
  const user = c.get("user");
  if (user?.email !== c.env.USER_EMAIL) {
    return c.json({ error: "Forbidden" }, 403);
  }

  try {
    // Return schema names based on existing tables in MariaDB
    const schemaNames = [
      "users",
      "news", 
      "blogposts",
      "events",
      "eventbookings",
      "sponsors",
      "banners",
      "contact_submissions"
    ];
    return c.json(schemaNames);
  } catch (error) {
    console.error("Schema discovery error:", error);
    return c.json({ error: "Failed to load schemas" }, 500);
  }
});

app.get("/api/admin/schemas/:tableName", authMiddleware, async (c) => {
  //@ts-ignore
  const user = c.get("user");
  if (user?.email !== c.env.USER_EMAIL) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const tableName = c.req.param("tableName");
  
  try {
    // Mock schema response - in real implementation, you'd load from files
    const mockSchemas: Record<string, any> = {
      users: {
        "$id": "urn:table:users",
        "title": "Users",
        "description": "System users and administrators",
        "type": "object",
        "required": ["email"],
        "properties": {
          "id": { "type": "integer", "title": "ID", "readOnly": true, "primaryKey": true },
          "uuid": { "type": "string", "title": "UUID", "unique": true },
          "email": { "type": "string", "format": "email", "title": "Email Address" },
          "name": { "type": "string", "title": "Full Name" },
          "role": { "type": "string", "title": "Role", "enum": ["superadmin", "gestor"] },
          "is_active": { "type": "integer", "title": "Is Active", "default": 1 },
          "created_at": { "type": "string", "format": "date-time", "title": "Created At", "readOnly": true },
          "updated_at": { "type": "string", "format": "date-time", "title": "Updated At", "readOnly": true }
        }
      },
      news: {
        "$id": "urn:table:news",
        "title": "News Articles",
        "description": "News articles and press releases",
        "type": "object",
        "required": ["title", "body_html"],
        "properties": {
          "id": { "type": "integer", "title": "ID", "readOnly": true, "primaryKey": true },
          "title": { "type": "string", "title": "Title" },
          "slug": { "type": "string", "title": "URL Slug" },
          "subtitle": { "type": "string", "title": "Subtitle" },
          "body_html": { "type": "string", "title": "Content", "widget": "rich_text" },
          "categories": { "type": "string", "title": "Categories" },
          "tags": { "type": "string", "title": "Tags" },
          "publication_date": { "type": "string", "format": "date-time", "title": "Publication Date" },
          "author": { "type": "string", "title": "Author" },
          "is_featured": { "type": "integer", "title": "Is Featured", "default": 0 },
          "social_links": { "type": "string", "title": "Social Links" },
          "created_at": { "type": "string", "format": "date-time", "title": "Created At", "readOnly": true },
          "updated_at": { "type": "string", "format": "date-time", "title": "Updated At", "readOnly": true }
        }
      },
      blogposts: {
        "$id": "urn:table:blogposts",
        "title": "Blog Posts",
        "description": "Blog articles and opinion pieces",
        "type": "object",
        "required": ["title", "body_html"],
        "properties": {
          "id": { "type": "integer", "title": "ID", "readOnly": true, "primaryKey": true },
          "title": { "type": "string", "title": "Title" },
          "slug": { "type": "string", "title": "URL Slug" },
          "subtitle": { "type": "string", "title": "Subtitle" },
          "body_html": { "type": "string", "title": "Content", "widget": "rich_text" },
          "categories": { "type": "string", "title": "Categories" },
          "tags": { "type": "string", "title": "Tags" },
          "publication_date": { "type": "string", "format": "date-time", "title": "Publication Date" },
          "author": { "type": "string", "title": "Author" },
          "social_links": { "type": "string", "title": "Social Links" },
          "created_at": { "type": "string", "format": "date-time", "title": "Created At", "readOnly": true },
          "updated_at": { "type": "string", "format": "date-time", "title": "Updated At", "readOnly": true }
        }
      },
      events: {
        "$id": "urn:table:events",
        "title": "Events",
        "description": "Company events and meetings",
        "type": "object",
        "required": ["title", "event_date"],
        "properties": {
          "id": { "type": "integer", "title": "ID", "readOnly": true, "primaryKey": true },
          "title": { "type": "string", "title": "Title" },
          "slug": { "type": "string", "title": "URL Slug" },
          "description_html": { "type": "string", "title": "Description", "widget": "rich_text" },
          "event_date": { "type": "string", "format": "date", "title": "Event Date" },
          "event_time": { "type": "string", "title": "Event Time" },
          "location": { "type": "string", "title": "Location" },
          "banner_image_url": { "type": "string", "title": "Banner Image", "widget": "media_url" },
          "capacity": { "type": "integer", "title": "Capacity" },
          "created_at": { "type": "string", "format": "date-time", "title": "Created At", "readOnly": true },
          "updated_at": { "type": "string", "format": "date-time", "title": "Updated At", "readOnly": true }
        }
      },
      eventbookings: {
        "$id": "urn:table:eventbookings",
        "title": "Event Bookings",
        "description": "Event reservation submissions",
        "type": "object",
        "required": [],
        "properties": {
          "id": { "type": "integer", "title": "ID", "readOnly": true, "primaryKey": true },
          "event_id": { "type": "integer", "title": "Event ID" },
          "uniqueness_check": { "type": "string", "title": "Email/Phone", "description": "For deduplication" },
          "form_data": { "type": "string", "title": "Form Data", "widget": "textarea", "description": "JSON data from form" },
          "notification_email_sent": { "type": "integer", "title": "Notification Sent", "default": 0 },
          "reply_email_sent": { "type": "integer", "title": "Reply Sent", "default": 0 },
          "email_sent_at": { "type": "string", "format": "date-time", "title": "Email Sent At" },
          "created_at": { "type": "string", "format": "date-time", "title": "Created At", "readOnly": true },
          "updated_at": { "type": "string", "format": "date-time", "title": "Updated At", "readOnly": true }
        }
      },
      sponsors: {
        "$id": "urn:table:sponsors",
        "title": "Sponsors",
        "description": "Company sponsors and partners",
        "type": "object",
        "required": ["name", "logo_url", "website_url"],
        "properties": {
          "id": { "type": "integer", "title": "ID", "readOnly": true, "primaryKey": true },
          "name": { "type": "string", "title": "Company Name" },
          "logo_url": { "type": "string", "title": "Logo Image", "widget": "media_url" },
          "website_url": { "type": "string", "title": "Website URL", "widget": "web_url" },
          "description": { "type": "string", "title": "Description", "widget": "textarea" },
          "display_order": { "type": "integer", "title": "Display Order", "default": 0 },
          "is_active": { "type": "integer", "title": "Is Active", "default": 1 },
          "created_at": { "type": "string", "format": "date-time", "title": "Created At", "readOnly": true },
          "updated_at": { "type": "string", "format": "date-time", "title": "Updated At", "readOnly": true }
        }
      },
      banners: {
        "$id": "urn:table:banners",
        "title": "Homepage Banners",
        "description": "Homepage banners and promotional content",
        "type": "object",
        "required": ["title", "banner_image_url"],
        "properties": {
          "id": { "type": "integer", "title": "ID", "readOnly": true, "primaryKey": true },
          "title": { "type": "string", "title": "Title" },
          "subtitle": { "type": "string", "title": "Subtitle" },
          "banner_image_url": { "type": "string", "title": "Banner Image", "widget": "media_url" },
          "link_url": { "type": "string", "title": "Link URL", "widget": "web_url" },
          "display_order": { "type": "integer", "title": "Display Order", "default": 1 },
          "is_active": { "type": "integer", "title": "Is Active", "default": 1 },
          "created_at": { "type": "string", "format": "date-time", "title": "Created At", "readOnly": true },
          "updated_at": { "type": "string", "format": "date-time", "title": "Updated At", "readOnly": true }
        }
      },
      contact_submissions: {
        "$id": "urn:table:contact_submissions",
        "title": "Contact Submissions",
        "description": "Contact form submissions",
        "type": "object",
        "required": [],
        "properties": {
          "id": { "type": "integer", "title": "ID", "readOnly": true, "primaryKey": true },
          "uniqueness_check": { "type": "string", "title": "Email/Phone", "description": "For deduplication" },
          "form_data": { "type": "string", "title": "Form Data", "widget": "textarea", "description": "JSON data from form" },
          "notification_email_sent": { "type": "integer", "title": "Notification Sent", "default": 0 },
          "reply_email_sent": { "type": "integer", "title": "Reply Sent", "default": 0 },
          "email_sent_at": { "type": "string", "format": "date-time", "title": "Email Sent At" },
          "created_at": { "type": "string", "format": "date-time", "title": "Created At", "readOnly": true },
          "updated_at": { "type": "string", "format": "date-time", "title": "Updated At", "readOnly": true }
        }
      }
    };

    const schema = mockSchemas[tableName];
    if (!schema) {
      return c.json({ error: "Schema not found" }, 404);
    }

    return c.json(schema);
  } catch (error) {
    console.error("Schema load error:", error);
    return c.json({ error: "Failed to load schema" }, 500);
  }
});

// Generic CRUD endpoints using MariaDB
app.get("/api/tables/:tableName", authMiddleware, async (c) => {
  //@ts-ignore
  const user = c.get("user");
  if (user?.email !== c.env.USER_EMAIL) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const tableName = c.req.param("tableName");
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = (page - 1) * limit;
  const sort = c.req.query("sort");

  try {
    let queryStr = `SELECT * FROM ${tableName}`;
    let countQueryStr = `SELECT COUNT(*) as total FROM ${tableName}`;
    let queryParams: any[] = [];
    
    // Add sorting
    if (sort) {
      const [field, direction] = sort.split(":");
      if (field && (direction === "asc" || direction === "desc")) {
        queryStr += ` ORDER BY ${field} ${direction.toUpperCase()}`;
      }
    } else {
      queryStr += ` ORDER BY id DESC`;
    }
    
    // Add pagination
    queryStr += ` LIMIT ? OFFSET ?`;
    queryParams = [limit, offset];

    const [data, countResult] = await Promise.all([
      query(queryStr, queryParams),
      query(countQueryStr)
    ]);

    const total = countResult[0]?.total || 0;

    return c.json({
      data,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error("Table query error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.json({ error: "Failed to query table", details: errorMessage }, 500);
  }
});

app.post("/api/tables/:tableName", authMiddleware, async (c) => {
  //@ts-ignore
  const user = c.get("user");
  if (user?.email !== c.env.USER_EMAIL) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const tableName = c.req.param("tableName");
  const data = await c.req.json();

  try {
    // Add timestamps
    const now = new Date().toISOString();
    data.created_at = now;
    data.updated_at = now;

    // Remove read-only fields
    delete data.id;

    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map(() => "?").join(", ");

    const queryStr = `INSERT INTO ${tableName} (${fields.join(", ")}) VALUES (${placeholders})`;
    const result = await insert(queryStr, values);

    return c.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Table insert error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.json({ 
      error: "Failed to create record", 
      details: errorMessage,
      sqlError: error 
    }, 500);
  }
});

app.put("/api/tables/:tableName/:id", authMiddleware, async (c) => {
  //@ts-ignore
  const user = c.get("user");
  if (user?.email !== c.env.USER_EMAIL) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const tableName = c.req.param("tableName");
  const id = c.req.param("id");
  const data = await c.req.json();

  try {
    // Add updated timestamp
    data.updated_at = new Date().toISOString();

    // Remove read-only fields
    delete data.id;
    delete data.created_at;

    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(field => `${field} = ?`).join(", ");

    const queryStr = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
    await update(queryStr, [...values, id]);

    return c.json({ success: true });
  } catch (error) {
    console.error("Table update error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.json({ error: "Failed to update record", details: errorMessage }, 500);
  }
});

app.delete("/api/tables/:tableName/:id", authMiddleware, async (c) => {
  //@ts-ignore
  const user = c.get("user");
  if (user?.email !== c.env.USER_EMAIL) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const tableName = c.req.param("tableName");
  const id = c.req.param("id");

  try {
    const queryStr = `DELETE FROM ${tableName} WHERE id = ?`;
    await deleteRecord(queryStr, [id]);

    return c.json({ success: true });
  } catch (error) {
    console.error("Table delete error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.json({ error: "Failed to delete record", details: errorMessage }, 500);
  }
});

// File upload endpoints
app.post("/api/upload/media", authMiddleware, async (c) => {
  //@ts-ignore
  const user = c.get("user");
  if (user?.email !== c.env.USER_EMAIL) {
    return c.json({ error: "Forbidden" }, 403);
  }

  try {
    // Mock implementation - in production, integrate with cloud storage
    const url = "https://images.unsplash.com/photo-1688128320158-5099ab881b12?ixid=M3w2MjE1MDB8MHwxfHNlYXJjaHwxfHxzYW1wbGUlMjBpbWFnZSUyQyUyMHBsYWNlaG9sZGVyJTIwaW1hZ2UlMkMlMjBnZW5lcmljJTIwcGhvdG98ZW58MHx8fHwxNzU4ODk2NTAyfDA&ixlib=rb-4.1.0?w=1024&h=1024";
    return c.json({ url });
  } catch (error) {
    console.error("Media upload error:", error);
    return c.json({ error: "Failed to upload media" }, 500);
  }
});

app.post("/api/upload/file", authMiddleware, async (c) => {
  //@ts-ignore
  const user = c.get("user");
  if (user?.email !== c.env.USER_EMAIL) {
    return c.json({ error: "Forbidden" }, 403);
  }

  try {
    // Mock implementation - in production, integrate with cloud storage
    const url = `https://example.com/files/document-${Date.now()}.pdf`;
    return c.json({ url });
  } catch (error) {
    console.error("File upload error:", error);
    return c.json({ error: "Failed to upload file" }, 500);
  }
});

// CSV Export endpoint
app.get("/api/tables/:tableName/export", authMiddleware, async (c) => {
  //@ts-ignore
  const user = c.get("user");
  if (user?.email !== c.env.USER_EMAIL) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const tableName = c.req.param("tableName");
  const sort = c.req.query("sort");

  try {
    let queryStr = `SELECT * FROM ${tableName}`;
    
    // Add sorting
    if (sort) {
      const [field, direction] = sort.split(":");
      if (field && (direction === "asc" || direction === "desc")) {
        queryStr += ` ORDER BY ${field} ${direction.toUpperCase()}`;
      }
    } else {
      queryStr += ` ORDER BY id DESC`;
    }

    const data = await query(queryStr);

    if (!data || data.length === 0) {
      return c.json({ error: "No data to export" }, 404);
    }

    // Convert to CSV
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];
    
    data.forEach((row: any) => {
      const values = headers.map(header => {
        let value = row[header];
        
        // Handle null/undefined
        if (value === null || value === undefined) {
          return "";
        }
        
        // Strip HTML from rich text fields
        if (typeof value === "string" && value.includes("<")) {
          value = value.replace(/<[^>]*>/g, "");
        }
        
        // Escape quotes and wrap if contains comma
        value = String(value).replace(/"/g, '""');
        if (value.includes(",") || value.includes("\n") || value.includes('"')) {
          value = `"${value}"`;
        }
        
        return value;
      });
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    
    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${tableName}.csv"`
      }
    });
  } catch (error) {
    console.error("CSV export error:", error);
    return c.json({ error: "Failed to export data" }, 500);
  }
});

// =================================================================
// == CONTENT API ENDPOINTS (NEWS, BLOG, EVENTS, SPONSORS)       ==
// =================================================================

// News API endpoints
app.get("/api/news", async (c) => {
  try {
    const results = await query(
      "SELECT * FROM news ORDER BY publication_date DESC"
    );
    
    // Ensure results is always an array
    const safeResults = Array.isArray(results) ? results : [];
    return c.json(safeResults);
  } catch (error) {
    console.error("News fetch error:", error);
    return c.json([], 200); // Return empty array instead of error to prevent crashes
  }
});

app.get("/api/news/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const result = await queryOne(
      "SELECT * FROM news WHERE slug = ?",
      [slug]
    );
    
    if (!result) {
      return c.json({ error: "News article not found" }, 404);
    }
    
    return c.json(result);
  } catch (error) {
    console.error("News detail fetch error:", error);
    return c.json({ error: "Failed to fetch news article" }, 500);
  }
});

// Blog API endpoints
app.get("/api/blog", async (c) => {
  try {
    const results = await query(
      "SELECT * FROM blogposts ORDER BY publication_date DESC"
    );
    
    // Ensure results is always an array
    const safeResults = Array.isArray(results) ? results : [];
    return c.json(safeResults);
  } catch (error) {
    console.error("Blog fetch error:", error);
    return c.json([], 200); // Return empty array instead of error to prevent crashes
  }
});

app.get("/api/blog/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const result = await queryOne(
      "SELECT * FROM blogposts WHERE slug = ?",
      [slug]
    );
    
    if (!result) {
      return c.json({ error: "Blog post not found" }, 404);
    }
    
    return c.json(result);
  } catch (error) {
    console.error("Blog detail fetch error:", error);
    return c.json({ error: "Failed to fetch blog post" }, 500);
  }
});

// Events API endpoints
app.get("/api/events", async (c) => {
  try {
    const results = await query(
      "SELECT * FROM events ORDER BY event_date ASC"
    );
    
    // Ensure results is always an array
    const safeResults = Array.isArray(results) ? results : [];
    return c.json(safeResults);
  } catch (error) {
    console.error("Events fetch error:", error);
    return c.json([], 200); // Return empty array instead of error to prevent crashes
  }
});

app.get("/api/events/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const result = await queryOne(
      "SELECT * FROM events WHERE slug = ?",
      [slug]
    );
    
    if (!result) {
      return c.json({ error: "Event not found" }, 404);
    }
    
    return c.json(result);
  } catch (error) {
    console.error("Event detail fetch error:", error);
    return c.json({ error: "Failed to fetch event" }, 500);
  }
});

// Sponsors API endpoints
app.get("/api/sponsors", async (c) => {
  try {
    const results = await query(
      "SELECT * FROM sponsors WHERE is_active = 1 ORDER BY display_order ASC"
    );
    
    // Ensure results is always an array
    const safeResults = Array.isArray(results) ? results : [];
    return c.json(safeResults);
  } catch (error) {
    console.error("Sponsors fetch error:", error);
    return c.json([], 200); // Return empty array instead of error to prevent crashes
  }
});

// Banners API endpoints
app.get("/api/banners", async (c) => {
  try {
    const results = await query(
      "SELECT * FROM banners WHERE is_active = 1 ORDER BY display_order ASC"
    );
    
    // Ensure results is always an array
    const safeResults = Array.isArray(results) ? results : [];
    return c.json(safeResults);
  } catch (error) {
    console.error("Banners fetch error:", error);
    return c.json([], 200); // Return empty array instead of error to prevent crashes
  }
});

// =================================================================
// == FORM SUBMISSION WITH EMAIL CALLBACK                         ==
// =================================================================

app.post("/api/forms/submit", async (c) => {
  try {
    const body = await c.req.json();
    const { formId, ...formData } = body;

    // Validate required fields
    if (!formId) {
      return c.json({ success: false, message: "Form ID is required" }, 400);
    }

    // Data persistence logic for different form types using MariaDB
    if (formId === "contact_form") {
      // Extract email for uniqueness check
      const uniquenessCheck = formData.email || formData.telefone || "";
      
      const insertResult = await insert(
        "INSERT INTO contact_submissions (uniqueness_check, form_data, notification_email_sent, reply_email_sent, email_sent_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          uniquenessCheck,
          JSON.stringify(formData),
          0, // Will be updated after email sending
          0, // Will be updated after email sending
          new Date().toISOString(),
          new Date().toISOString(),
          new Date().toISOString()
        ]
      );
    } else if (formId === "event_booking") {
      // Extract email for uniqueness check
      const uniquenessCheck = formData.email || formData.telefone || "";
      
      const insertResult = await insert(
        "INSERT INTO eventbookings (event_id, uniqueness_check, form_data, notification_email_sent, reply_email_sent, email_sent_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          formData.event_id || null,
          uniquenessCheck,
          JSON.stringify(formData),
          0, // Will be updated after email sending
          0, // Will be updated after email sending
          new Date().toISOString(),
          new Date().toISOString(),
          new Date().toISOString()
        ]
      );
    }

    // Get email configuration for this form
    const formEmailConfig = (formConfig as any)[formId];

    if (!formEmailConfig) {
      // If no config exists for this form, just return success without sending emails
      console.warn(`No email configuration found for form: ${formId}`);
      return c.json({
        success: true,
        message: "Form submitted successfully (no email config)",
      });
    }

    // Send emails using the universal callback
    const emailResult = await handleFormSubmissionEmails(
      formId,
      formData,
      formEmailConfig,
      {
        API_KEY: c.env.API_KEY || "",
        PROJECT_ID: c.env.PROJECT_ID || "",
        USER_EMAIL: c.env.USER_EMAIL || "",
      }
    );

    if (!emailResult.success) {
      console.error("Email sending errors:", emailResult.errors);
      // Still return success for form submission, but indicate email issues
      return c.json({
        success: true,
        message: "Form submitted but some emails failed",
        emailErrors: emailResult.errors,
      });
    }

    return c.json({
      success: true,
      message: "Form submitted and emails sent successfully",
    });
  } catch (error) {
    console.error("Form submission error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.json(
      {
        success: false,
        message: "An internal error occurred",
        details: errorMessage
      },
      500
    );
  }
});

export default app;

