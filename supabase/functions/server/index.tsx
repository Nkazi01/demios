import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// CORS and logging middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use("*", logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// OpenAI Configuration - Read from environment variable
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const OPENAI_BASE_URL = "https://api.openai.com/v1";

console.log("OpenAI API Key configured:", !!OPENAI_API_KEY);

// Medical AI System Prompt
const MEDICAL_AI_PROMPT = `You are an AI Health Assistant for a rural healthcare application. You provide helpful, accurate medical information while emphasizing the importance of professional medical care.

IMPORTANT GUIDELINES:
- Always encourage users to seek professional medical care for serious concerns
- Provide general health information and guidance
- For emergency symptoms, immediately advise calling emergency services
- Be empathetic and supportive
- Use clear, simple language suitable for rural populations
- Include relevant disclaimers about not replacing professional medical advice

When responding:
- For symptoms: Provide general guidance and when to seek care
- For medications: Give general information and stress consulting healthcare providers
- For emergencies: Immediately direct to emergency services
- For health education: Provide evidence-based information

Always end serious medical responses with: "This information is for educational purposes only. Please consult with a healthcare professional for proper diagnosis and treatment."`;

// Initialize storage buckets
async function initializeBuckets() {
  const buckets = [
    "make-3f2c9fd9-medical-documents",
    "make-3f2c9fd9-profile-images",
    "make-3f2c9fd9-clinic-photos",
    "make-3f2c9fd9-medical-images", // New bucket for medical image analysis
  ];

  for (const bucketName of buckets) {
    const { data: existingBuckets } =
      await supabase.storage.listBuckets();
    const bucketExists = existingBuckets?.some(
      (bucket) => bucket.name === bucketName,
    );

    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(
        bucketName,
        {
          public: false,
          allowedMimeTypes: [
            "image/*",
            "application/pdf",
            "text/*",
          ],
        },
      );
      if (error) {
        console.error(
          `Error creating bucket ${bucketName}:`,
          error,
        );
      } else {
        console.log(`Created bucket: ${bucketName}`);
      }
    }
  }
}

// Initialize buckets on startup
initializeBuckets();

// Seed demo data on startup
async function seedDemoData() {
  try {
    // Check if clinics already exist
    const existingClinics = await kv.getByPrefix("clinic:");

    if (existingClinics.length === 0) {
      const demoClinics = [
        {
          id: "clinic-1",
          name: "Village Health Center",
          address: "123 Main St, Ruraltown, State 12345",
          phone: "+1 (555) 123-4567",
          services: [
            "General Medicine",
            "Pediatrics",
            "Emergency Care",
            "Pharmacy",
          ],
          coordinates: { lat: 40.7128, lng: -74.006 },
          hours:
            "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM, Sun: Emergency Only",
          availability: "Available",
          created_at: new Date().toISOString(),
        },
        {
          id: "clinic-2",
          name: "Rural Family Medicine",
          address: "456 Oak Avenue, Countryside, State 12346",
          phone: "+1 (555) 234-5678",
          services: [
            "Family Medicine",
            "Vaccinations",
            "Health Screenings",
            "Chronic Care",
          ],
          coordinates: { lat: 40.7589, lng: -73.9851 },
          hours: "Mon-Fri: 7AM-8PM, Sat-Sun: 9AM-5PM",
          availability: "Busy",
          created_at: new Date().toISOString(),
        },
        {
          id: "clinic-3",
          name: "Community Health Clinic",
          address: "789 Pine Road, Farmville, State 12347",
          phone: "+1 (555) 345-6789",
          services: [
            "General Medicine",
            "Mental Health",
            "Women's Health",
            "Dental",
          ],
          coordinates: { lat: 40.6892, lng: -74.0445 },
          hours:
            "Mon-Thu: 8AM-7PM, Fri: 8AM-5PM, Sat: 10AM-3PM",
          availability: "Available",
          created_at: new Date().toISOString(),
        },
      ];

      for (const clinic of demoClinics) {
        await kv.set(`clinic:${clinic.id}`, clinic);
      }

      console.log("Demo clinic data seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding demo data:", error);
  }
}

// Seed data on startup
seedDemoData();

// Add demo notifications for testing
async function createDemoNotifications() {
  try {
    const demoUserIds = [
      "demo-patient-1",
      "demo-doctor-1",
      "demo-admin-1",
    ];

    for (const userId of demoUserIds) {
      const notification = {
        id: `demo-notification-${userId}-${Date.now()}`,
        user_id: userId,
        title: "Welcome to RuralHealth!",
        message:
          "Your account has been successfully set up. Explore our features to get started.",
        type: "system",
        read: false,
        created_at: new Date().toISOString(),
      };

      await kv.set(
        `notification:${notification.id}`,
        notification,
      );
    }
  } catch (error) {
    console.error("Error creating demo notifications:", error);
  }
}

createDemoNotifications();

// Create demo user accounts
async function createDemoUsers() {
  try {
    const demoUsers = [
      {
        id: "demo-patient-1",
        email: "patient@demo.com",
        name: "Sarah Johnson",
        role: "patient",
        phone: "+1 (555) 123-4567",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "demo-doctor-1",
        email: "doctor@demo.com",
        name: "Dr. Michael Chen",
        role: "doctor",
        phone: "+1 (555) 234-5678",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "demo-nurse-1",
        email: "nurse@demo.com",
        name: "Emily Rodriguez",
        role: "nurse",
        phone: "+1 (555) 345-6789",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "demo-admin-1",
        email: "admin@demo.com",
        name: "John Administrator",
        role: "admin",
        phone: "+1 (555) 456-7890",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    for (const user of demoUsers) {
      const existingProfile = await kv.get(
        `user_profile:${user.id}`,
      );
      if (!existingProfile) {
        await kv.set(`user_profile:${user.id}`, user);

        // Create demo Supabase users if they don't exist
        const { data: existingUser } =
          await supabase.auth.admin.getUserById(user.id);
        if (!existingUser.user) {
          const { error } =
            await supabase.auth.admin.createUser({
              user_id: user.id,
              email: user.email,
              password: "demo123",
              user_metadata: {
                name: user.name,
                role: user.role,
                phone: user.phone,
              },
              email_confirm: true,
            });

          if (error) {
            console.warn(
              `Could not create demo user ${user.email}:`,
              error.message,
            );
          } else {
            console.log(`Created demo user: ${user.email}`);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error creating demo users:", error);
  }
}

createDemoUsers();

// Auth middleware
async function requireAuth(c: any, next: any) {
  const accessToken = c.req
    .header("Authorization")
    ?.split(" ")[1];
  if (!accessToken) {
    return c.json(
      { error: "No authorization token provided" },
      401,
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return c.json(
      { error: "Invalid authorization token" },
      401,
    );
  }

  c.set("user", user);
  await next();
}

// OpenAI API Helper Function with enhanced error handling
async function callOpenAI(
  messages: any[],
  temperature = 0.7,
  maxTokens = 1000,
) {
  if (!OPENAI_API_KEY) {
    console.error("OpenAI API key not configured");
    throw new Error("OpenAI API key not configured");
  }

  console.log("Making OpenAI API request...");

  const response = await fetch(
    `${OPENAI_BASE_URL}/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "OpenAI API error:",
      response.status,
      errorText,
    );
    throw new Error(
      `OpenAI API error: ${response.status} - ${errorText}`,
    );
  }

  const data = await response.json();
  console.log("OpenAI API response received successfully");
  return data.choices[0].message.content;
}

// Medical Image Analysis Helper
async function analyzeWoundImage(imageUrl: string) {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  const messages = [
    {
      role: "system",
      content: `You are a medical AI assistant specializing in wound assessment. Analyze the provided wound image and provide:

1. WOUND ASSESSMENT:
   - Type of wound (cut, abrasion, burn, etc.)
   - Approximate size and depth
   - Signs of infection (redness, swelling, discharge)
   - Healing stage assessment

2. RECOMMENDATIONS:
   - Immediate care instructions
   - When to seek professional medical care
   - Warning signs to watch for

3. URGENCY LEVEL:
   - LOW: Minor wound, home care appropriate
   - MEDIUM: Monitor closely, may need professional care
   - HIGH: Requires medical attention soon
   - EMERGENCY: Seek immediate medical care

Be thorough but clear. Always emphasize that this is an assessment tool and not a substitute for professional medical evaluation.`,
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please analyze this wound image and provide your assessment.",
        },
        {
          type: "image_url",
          image_url: {
            url: imageUrl,
          },
        },
      ],
    },
  ];

  return await callOpenAI(messages, 0.3, 1500);
}

// AI Health Assistant Routes

// Enhanced AI Chat endpoint with OpenAI
app.post("/make-server-3f2c9fd9/ai/chat", async (c) => {
  try {
    console.log("AI Chat endpoint called");
    const {
      message,
      user_context,
      conversation_history = [],
    } = await c.req.json();
    console.log("Request data:", {
      message: message?.substring(0, 100),
      user_context,
      historyLength: conversation_history.length,
    });

    // Build conversation context
    const messages = [
      {
        role: "system",
        content: MEDICAL_AI_PROMPT,
      },
    ];

    // Add conversation history
    conversation_history.slice(-6).forEach((msg: any) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    // Add current message with user context
    const contextualMessage = `User context: ${user_context?.role || "patient"} named ${user_context?.name || "User"}

Message: ${message}`;

    messages.push({
      role: "user",
      content: contextualMessage,
    });

    let response;
    if (OPENAI_API_KEY) {
      console.log("Using OpenAI API for response");
      response = await callOpenAI(messages);
      console.log("OpenAI response generated successfully");
    } else {
      console.log(
        "OpenAI API key not available, using fallback",
      );
      response =
        "I apologize, but the AI service is currently unavailable. For urgent health concerns, please contact your healthcare provider or emergency services immediately.";
    }

    return c.json({
      response,
      type: "text",
      timestamp: new Date().toISOString(),
      powered_by: OPENAI_API_KEY
        ? "OpenAI GPT-4"
        : "Fallback Response",
    });
  } catch (error) {
    console.error("AI Chat error:", error);

    // Provide more specific error information
    let errorMessage =
      "I apologize, but I'm having trouble processing your request right now. For urgent health concerns, please contact your healthcare provider immediately.";

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage =
          "AI service configuration issue. Please contact support or use alternative health resources.";
      } else if (error.message.includes("quota")) {
        errorMessage =
          "AI service temporarily at capacity. Please try again in a few minutes or contact healthcare providers directly.";
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        errorMessage =
          "Network connectivity issue. Please check your connection and try again.";
      }
      console.error("Detailed error:", error.message);
    }

    return c.json(
      {
        response: errorMessage,
        type: "text",
        error: true,
        error_details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      200,
    );
  }
});

// Enhanced AI Symptom Checker with OpenAI
app.post(
  "/make-server-3f2c9fd9/ai/symptom-checker",
  async (c) => {
    try {
      console.log("Symptom checker endpoint called");
      const { symptoms, duration, severity, user_context } =
        await c.req.json();

      const messages = [
        {
          role: "system",
          content: `You are a medical AI assistant for symptom assessment. Analyze the provided symptoms and respond with a JSON object containing:

{
  "symptoms": ["array of identified symptoms"],
  "severity": "emergency|high|medium|low",
  "recommendations": ["array of care recommendations"],
  "when_to_seek_care": "specific guidance on when to seek medical care",
  "red_flags": ["warning signs that require immediate attention"],
  "self_care": ["appropriate self-care measures"]
}

Base your assessment on medical knowledge while being conservative about recommending professional care. Always err on the side of safety.`,
        },
        {
          role: "user",
          content: `Patient symptoms: ${symptoms}
Duration: ${duration || "Not specified"}
Pain/Severity level (1-10): ${severity || "Not specified"}
Patient context: ${user_context?.role || "patient"}`,
        },
      ];

      let assessmentText;
      if (OPENAI_API_KEY) {
        assessmentText = await callOpenAI(messages, 0.3, 1000);
      } else {
        // Fallback assessment
        assessmentText = JSON.stringify({
          symptoms: ["General symptoms reported"],
          severity: "medium",
          recommendations: [
            "Monitor symptoms closely",
            "Stay hydrated",
            "Get adequate rest",
          ],
          when_to_seek_care:
            "Consult a healthcare provider if symptoms persist or worsen.",
          red_flags: [
            "High fever",
            "Severe pain",
            "Difficulty breathing",
          ],
          self_care: [
            "Rest",
            "Hydration",
            "Over-the-counter pain relief if appropriate",
          ],
        });
      }

      // Parse JSON response
      let assessment;
      try {
        assessment = JSON.parse(assessmentText);
      } catch (e) {
        console.error(
          "Failed to parse JSON response:",
          assessmentText,
        );
        // If parsing fails, create a structured response
        assessment = {
          symptoms: ["Symptoms require evaluation"],
          severity: "medium",
          recommendations: [
            "Consult with a healthcare provider for proper assessment",
          ],
          when_to_seek_care:
            "Schedule an appointment with your healthcare provider.",
          red_flags: ["Severe symptoms", "Rapid worsening"],
          self_care: [
            "Monitor symptoms",
            "Seek medical guidance",
          ],
        };
      }

      return c.json({
        assessment,
        timestamp: new Date().toISOString(),
        powered_by: OPENAI_API_KEY
          ? "OpenAI GPT-4"
          : "Local Assessment",
      });
    } catch (error) {
      console.error("Symptom checker error:", error);
      return c.json(
        { error: "Symptom analysis temporarily unavailable" },
        500,
      );
    }
  },
);

// Enhanced AI Medication Checker with OpenAI
app.post(
  "/make-server-3f2c9fd9/ai/medication-checker",
  async (c) => {
    try {
      console.log("Medication checker endpoint called");
      const { medications, user_context } = await c.req.json();

      const messages = [
        {
          role: "system",
          content: `You are a clinical pharmacist AI assistant. Analyze the provided medications and respond with a JSON object:

{
  "risk_level": "low|medium|high",
  "interactions": [
    {
      "drugs": "Drug A + Drug B",
      "severity": "minor|moderate|major",
      "description": "Description of interaction",
      "clinical_significance": "Clinical impact"
    }
  ],
  "recommendations": ["array of recommendations"],
  "monitoring_needed": ["what to monitor"],
  "contraindications": ["any contraindications found"]
}

Provide accurate, evidence-based medication interaction analysis. Always recommend consulting healthcare providers for medication decisions.`,
        },
        {
          role: "user",
          content: `Medications to analyze: ${medications.join(", ")}
Patient context: ${user_context?.role || "patient"}`,
        },
      ];

      let analysisText;
      if (OPENAI_API_KEY) {
        analysisText = await callOpenAI(messages, 0.2, 1200);
      } else {
        // Fallback analysis
        analysisText = JSON.stringify({
          risk_level: "low",
          interactions: [],
          recommendations: [
            "Take medications as prescribed",
            "Consult your pharmacist about potential interactions",
            "Keep an updated medication list",
          ],
          monitoring_needed: [
            "Regular follow-ups with healthcare provider",
          ],
          contraindications: [],
        });
      }

      // Parse JSON response
      let analysis;
      try {
        analysis = JSON.parse(analysisText);
      } catch (e) {
        console.error(
          "Failed to parse medication analysis JSON:",
          analysisText,
        );
        analysis = {
          risk_level: "unknown",
          interactions: [],
          recommendations: [
            "Consult with a pharmacist or healthcare provider for medication review",
          ],
          monitoring_needed: [
            "Professional medication review recommended",
          ],
          contraindications: [],
        };
      }

      return c.json({
        analysis,
        timestamp: new Date().toISOString(),
        powered_by: OPENAI_API_KEY
          ? "OpenAI GPT-4"
          : "Basic Analysis",
      });
    } catch (error) {
      console.error("Medication checker error:", error);
      return c.json(
        {
          error: "Medication analysis temporarily unavailable",
        },
        500,
      );
    }
  },
);

// Medical Image Analysis endpoint
app.post(
  "/make-server-3f2c9fd9/ai/analyze-image",
  requireAuth,
  async (c) => {
    try {
      const user = c.get("user");
      const formData = await c.req.formData();
      const file = formData.get("image") as File;
      const analysisType = formData.get("type") as string; // 'wound', 'skin', 'rash'

      if (!file) {
        return c.json({ error: "No image file provided" }, 400);
      }

      // Upload image to storage
      const bucketName = "make-3f2c9fd9-medical-images";
      const fileName = `${user.id}/${crypto.randomUUID()}-${file.name}`;

      const { data: uploadData, error: uploadError } =
        await supabase.storage
          .from(bucketName)
          .upload(fileName, file);

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        return c.json({ error: "Failed to upload image" }, 500);
      }

      // Get signed URL for AI analysis
      const { data: signedUrl } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(fileName, 3600);

      if (!signedUrl?.signedUrl) {
        return c.json(
          { error: "Failed to process image" },
          500,
        );
      }

      let analysis;
      if (OPENAI_API_KEY && analysisType === "wound") {
        try {
          analysis = await analyzeWoundImage(
            signedUrl.signedUrl,
          );
        } catch (error) {
          console.error("Image analysis error:", error);
          analysis =
            "I apologize, but I'm unable to analyze this image at the moment. Please consult with a healthcare professional for proper wound assessment.";
        }
      } else {
        analysis = `Image uploaded successfully. For ${analysisType} analysis, please consult with a healthcare professional who can provide proper visual assessment and recommendations.`;
      }

      // Store analysis result
      const analysisRecord = {
        id: crypto.randomUUID(),
        user_id: user.id,
        image_path: fileName,
        image_url: signedUrl.signedUrl,
        analysis_type: analysisType,
        analysis_result: analysis,
        created_at: new Date().toISOString(),
      };

      await kv.set(
        `image_analysis:${analysisRecord.id}`,
        analysisRecord,
      );

      return c.json({
        analysis_id: analysisRecord.id,
        analysis: analysis,
        image_url: signedUrl.signedUrl,
        timestamp: new Date().toISOString(),
        powered_by: OPENAI_API_KEY
          ? "OpenAI GPT-4 Vision"
          : "Basic Analysis",
      });
    } catch (error) {
      console.error("Image analysis error:", error);
      return c.json({ error: "Image analysis failed" }, 500);
    }
  },
);

// Voice transcription endpoint
app.post(
  "/make-server-3f2c9fd9/ai/transcribe",
  requireAuth,
  async (c) => {
    try {
      const user = c.get("user");
      const formData = await c.req.formData();
      const audioFile = formData.get("audio") as File;

      if (!audioFile) {
        return c.json({ error: "No audio file provided" }, 400);
      }

      let transcription = "";

      if (OPENAI_API_KEY) {
        // Use OpenAI Whisper for transcription
        const transcriptionFormData = new FormData();
        transcriptionFormData.append("file", audioFile);
        transcriptionFormData.append("model", "whisper-1");

        const response = await fetch(
          `${OPENAI_BASE_URL}/audio/transcriptions`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: transcriptionFormData,
          },
        );

        if (response.ok) {
          const data = await response.json();
          transcription = data.text;
        } else {
          const errorText = await response.text();
          console.error(
            "Whisper API error:",
            response.status,
            errorText,
          );
          throw new Error("Transcription failed");
        }
      } else {
        transcription =
          "Voice transcription service is currently unavailable. Please try typing your message instead.";
      }

      // Store transcription record
      const transcriptionRecord = {
        id: crypto.randomUUID(),
        user_id: user.id,
        transcription: transcription,
        created_at: new Date().toISOString(),
      };

      await kv.set(
        `transcription:${transcriptionRecord.id}`,
        transcriptionRecord,
      );

      return c.json({
        transcription_id: transcriptionRecord.id,
        transcription: transcription,
        timestamp: new Date().toISOString(),
        powered_by: OPENAI_API_KEY
          ? "OpenAI Whisper"
          : "Local Processing",
      });
    } catch (error) {
      console.error("Transcription error:", error);
      return c.json(
        {
          transcription:
            "Unable to transcribe audio. Please try typing your message.",
          error: true,
        },
        200,
      );
    }
  },
);

// Get user's image analysis history
app.get(
  "/make-server-3f2c9fd9/ai/image-history",
  requireAuth,
  async (c) => {
    try {
      const user = c.get("user");
      const analyses = await kv.getByPrefix("image_analysis:");
      const userAnalyses = analyses.filter(
        (analysis: any) => analysis.user_id === user.id,
      );

      return c.json({ analyses: userAnalyses });
    } catch (error) {
      console.error("Get image history error:", error);
      return c.json(
        { error: "Failed to fetch image analysis history" },
        500,
      );
    }
  },
);

// Test endpoint for AI functionality
app.get("/make-server-3f2c9fd9/ai/test", async (c) => {
  try {
    const hasApiKey = !!OPENAI_API_KEY;
    let testResult = "API key not configured";

    if (hasApiKey) {
      try {
        const testResponse = await callOpenAI([
          {
            role: "user",
            content:
              'Respond with just "API working" if you can see this message.',
          },
        ]);
        testResult = testResponse;
      } catch (error) {
        testResult = `API error: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    }

    return c.json({
      api_key_configured: hasApiKey,
      test_result: testResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI test error:", error);
    return c.json({ error: "Test failed" }, 500);
  }
});

// Routes (existing routes remain the same)

// User registration
app.post("/make-server-3f2c9fd9/auth/signup", async (c) => {
  try {
    const { email, password, name, role, phone } =
      await c.req.json();

    // Create user in Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { name, role, phone },
        email_confirm: true, // Auto-confirm since no email server configured
      });

    if (authError) {
      console.error("Auth signup error:", authError);
      return c.json({ error: authError.message }, 400);
    }

    // Store user profile in KV store
    const userProfile = {
      id: authData.user.id,
      email,
      name,
      role,
      phone: phone || null,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await kv.set(
      `user_profile:${authData.user.id}`,
      userProfile,
    );

    return c.json({
      user: authData.user,
      profile: userProfile,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json(
      { error: "Internal server error during signup" },
      500,
    );
  }
});

// Get user profile
app.get(
  "/make-server-3f2c9fd9/auth/profile",
  requireAuth,
  async (c) => {
    try {
      const user = c.get("user");
      const profile = await kv.get(`user_profile:${user.id}`);

      if (!profile) {
        return c.json({ error: "Profile not found" }, 404);
      }

      return c.json({ profile });
    } catch (error) {
      console.error("Get profile error:", error);
      return c.json(
        { error: "Internal server error fetching profile" },
        500,
      );
    }
  },
);

// Clinic management
app.get("/make-server-3f2c9fd9/clinics", async (c) => {
  try {
    const location = c.req.query("location");
    const clinics = await kv.getByPrefix("clinic:");

    // Filter by location if provided
    let filteredClinics = clinics;
    if (location) {
      filteredClinics = clinics.filter(
        (clinic: any) =>
          clinic.address
            .toLowerCase()
            .includes(location.toLowerCase()) ||
          clinic.name
            .toLowerCase()
            .includes(location.toLowerCase()),
      );
    }

    return c.json({ clinics: filteredClinics });
  } catch (error) {
    console.error("Get clinics error:", error);
    return c.json(
      { error: "Internal server error fetching clinics" },
      500,
    );
  }
});

app.post(
  "/make-server-3f2c9fd9/clinics",
  requireAuth,
  async (c) => {
    try {
      const user = c.get("user");
      const profile = await kv.get(`user_profile:${user.id}`);

      if (profile?.role !== "admin") {
        return c.json({ error: "Admin access required" }, 403);
      }

      const clinicData = await c.req.json();
      const clinic = {
        id: crypto.randomUUID(),
        ...clinicData,
        created_at: new Date().toISOString(),
      };

      await kv.set(`clinic:${clinic.id}`, clinic);
      return c.json({ clinic });
    } catch (error) {
      console.error("Create clinic error:", error);
      return c.json(
        { error: "Internal server error creating clinic" },
        500,
      );
    }
  },
);

// Appointment management
app.post(
  "/make-server-3f2c9fd9/appointments",
  requireAuth,
  async (c) => {
    try {
      const user = c.get("user");
      const appointmentData = await c.req.json();

      const appointment = {
        id: crypto.randomUUID(),
        patient_id: user.id,
        ...appointmentData,
        status: "scheduled",
        created_at: new Date().toISOString(),
      };

      await kv.set(
        `appointment:${appointment.id}`,
        appointment,
      );

      // Also store in user's appointments list
      const userAppointments =
        (await kv.get(`user_appointments:${user.id}`)) || [];
      userAppointments.push(appointment.id);
      await kv.set(
        `user_appointments:${user.id}`,
        userAppointments,
      );

      // Send notification (stored in KV for demo)
      const notification = {
        id: crypto.randomUUID(),
        user_id: user.id,
        title: "Appointment Confirmed",
        message: `Your appointment has been scheduled for ${appointmentData.date} at ${appointmentData.time}`,
        type: "appointment",
        read: false,
        created_at: new Date().toISOString(),
      };
      await kv.set(
        `notification:${notification.id}`,
        notification,
      );

      return c.json({ appointment, notification });
    } catch (error) {
      console.error("Create appointment error:", error);
      return c.json(
        { error: "Internal server error creating appointment" },
        500,
      );
    }
  },
);

app.get(
  "/make-server-3f2c9fd9/appointments",
  requireAuth,
  async (c) => {
    try {
      const user = c.get("user");
      const profile = await kv.get(`user_profile:${user.id}`);

      let appointments = [];

      if (profile?.role === "patient") {
        const appointmentIds =
          (await kv.get(`user_appointments:${user.id}`)) || [];
        appointments = await kv.mget(
          appointmentIds.map(
            (id: string) => `appointment:${id}`,
          ),
        );
      } else if (
        profile?.role === "doctor" ||
        profile?.role === "nurse"
      ) {
        // Get all appointments for this doctor
        const allAppointments =
          await kv.getByPrefix("appointment:");
        appointments = allAppointments.filter(
          (apt: any) => apt.doctor_id === user.id,
        );
      }

      return c.json({ appointments });
    } catch (error) {
      console.error("Get appointments error:", error);
      return c.json(
        {
          error: "Internal server error fetching appointments",
        },
        500,
      );
    }
  },
);

// Health records
app.post(
  "/make-server-3f2c9fd9/health-records",
  requireAuth,
  async (c) => {
    try {
      const user = c.get("user");
      const profile = await kv.get(`user_profile:${user.id}`);

      if (
        profile?.role !== "doctor" &&
        profile?.role !== "nurse"
      ) {
        return c.json(
          { error: "Medical professional access required" },
          403,
        );
      }

      const recordData = await c.req.json();
      const record = {
        id: crypto.randomUUID(),
        doctor_id: user.id,
        ...recordData,
        created_at: new Date().toISOString(),
      };

      await kv.set(`health_record:${record.id}`, record);

      // Add to patient's records list
      const patientRecords =
        (await kv.get(
          `patient_records:${recordData.patient_id}`,
        )) || [];
      patientRecords.push(record.id);
      await kv.set(
        `patient_records:${recordData.patient_id}`,
        patientRecords,
      );

      return c.json({ record });
    } catch (error) {
      console.error("Create health record error:", error);
      return c.json(
        {
          error: "Internal server error creating health record",
        },
        500,
      );
    }
  },
);

app.get(
  "/make-server-3f2c9fd9/health-records",
  requireAuth,
  async (c) => {
    try {
      const user = c.get("user");
      const patientId = c.req.query("patient_id") || user.id;

      const recordIds =
        (await kv.get(`patient_records:${patientId}`)) || [];
      const records = await kv.mget(
        recordIds.map((id: string) => `health_record:${id}`),
      );

      return c.json({ records });
    } catch (error) {
      console.error("Get health records error:", error);
      return c.json(
        {
          error:
            "Internal server error fetching health records",
        },
        500,
      );
    }
  },
);

// File upload
app.post(
  "/make-server-3f2c9fd9/upload",
  requireAuth,
  async (c) => {
    try {
      const user = c.get("user");
      const formData = await c.req.formData();
      const file = formData.get("file") as File;
      const type = formData.get("type") as string; // 'medical', 'profile', 'clinic'

      if (!file) {
        return c.json({ error: "No file provided" }, 400);
      }

      const bucketName = `make-3f2c9fd9-${type}-${type === "medical" ? "documents" : type === "profile" ? "images" : "photos"}`;
      const fileName = `${user.id}/${crypto.randomUUID()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (error) {
        console.error("File upload error:", error);
        return c.json({ error: "File upload failed" }, 500);
      }

      // Get signed URL for private access
      const { data: signedUrl } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(fileName, 3600); // 1 hour expiry

      return c.json({
        path: data.path,
        url: signedUrl?.signedUrl,
        fileName: file.name,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return c.json(
        { error: "Internal server error during upload" },
        500,
      );
    }
  },
);

// Notifications
app.get(
  "/make-server-3f2c9fd9/notifications",
  requireAuth,
  async (c) => {
    try {
      const user = c.get("user");
      const notifications =
        await kv.getByPrefix("notification:");
      const userNotifications = notifications.filter(
        (notif: any) => notif.user_id === user.id,
      );

      return c.json({ notifications: userNotifications });
    } catch (error) {
      console.error("Get notifications error:", error);
      return c.json(
        {
          error: "Internal server error fetching notifications",
        },
        500,
      );
    }
  },
);

// Real-time consultation requests
app.post(
  "/make-server-3f2c9fd9/consultations/request",
  requireAuth,
  async (c) => {
    try {
      const user = c.get("user");
      const { doctor_id, type, message } = await c.req.json();

      const consultation = {
        id: crypto.randomUUID(),
        patient_id: user.id,
        doctor_id,
        type, // 'video' or 'chat'
        message,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      await kv.set(
        `consultation:${consultation.id}`,
        consultation,
      );

      // Notify doctor
      const notification = {
        id: crypto.randomUUID(),
        user_id: doctor_id,
        title: "New Consultation Request",
        message: `Patient requesting ${type} consultation: ${message}`,
        type: "consultation",
        read: false,
        consultation_id: consultation.id,
        created_at: new Date().toISOString(),
      };
      await kv.set(
        `notification:${notification.id}`,
        notification,
      );

      return c.json({ consultation });
    } catch (error) {
      console.error("Create consultation error:", error);
      return c.json(
        {
          error: "Internal server error creating consultation",
        },
        500,
      );
    }
  },
);

// Analytics for admin
app.get(
  "/make-server-3f2c9fd9/analytics",
  requireAuth,
  async (c) => {
    try {
      const user = c.get("user");
      const profile = await kv.get(`user_profile:${user.id}`);

      if (profile?.role !== "admin") {
        return c.json({ error: "Admin access required" }, 403);
      }

      const [users, clinics, appointments, consultations] =
        await Promise.all([
          kv.getByPrefix("user_profile:"),
          kv.getByPrefix("clinic:"),
          kv.getByPrefix("appointment:"),
          kv.getByPrefix("consultation:"),
        ]);

      const analytics = {
        totalUsers: users.length,
        totalClinics: clinics.length,
        totalAppointments: appointments.length,
        totalConsultations: consultations.length,
        activeUsers: users.filter((u: any) => {
          const lastActive = new Date(u.updated_at);
          const weekAgo = new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          );
          return lastActive > weekAgo;
        }).length,
        appointmentsThisMonth: appointments.filter((a: any) => {
          const appointmentDate = new Date(a.created_at);
          const thisMonth = new Date().getMonth();
          return appointmentDate.getMonth() === thisMonth;
        }).length,
      };

      return c.json({ analytics });
    } catch (error) {
      console.error("Get analytics error:", error);
      return c.json(
        { error: "Internal server error fetching analytics" },
        500,
      );
    }
  },
);

// Health check
app.get("/make-server-3f2c9fd9/health", (c) => {
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "rural-health-server",
    ai_enabled: !!OPENAI_API_KEY,
    openai_configured: !!OPENAI_API_KEY,
  });
});

export default app;

Deno.serve(app.fetch);