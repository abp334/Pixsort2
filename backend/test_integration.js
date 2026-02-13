const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const http = require("http");

// Configuration
const PYTHON_API_URL = "http://127.0.0.1:8000/api/classify/";
const IMAGE_PATH = path.join(__dirname, "../image.png");

async function testIntegration() {
  try {
    console.log(`Reading image from ${IMAGE_PATH}...`);
    if (!fs.existsSync(IMAGE_PATH)) {
      console.error("Image file not found!");
      return;
    }
    const imageBuffer = fs.readFileSync(IMAGE_PATH);
    console.log(`Image read. Size: ${imageBuffer.length} bytes`);

    const formData = new FormData();
    formData.append("image", imageBuffer, "test_image.png");

    console.log("Sending request to Python service...");
    const url = new URL(PYTHON_API_URL);
    
    const request = formData.submit(
      {
        host: url.hostname,
        port: url.port,
        path: url.pathname,
        method: "POST",
      },
      (err, response) => {
        if (err) {
          console.error("Request error:", err);
          return;
        }
        
        console.log(`Response Status: ${response.statusCode}`);
        
        let responseBody = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          responseBody += chunk;
        });
        response.on("end", () => {
          console.log("Response Body:");
          console.log(responseBody);
        });
      }
    );
    
    request.on("error", (err) => {
      console.error("Request connection error:", err);
    });

  } catch (error) {
    console.error("Test failed:", error);
  }
}

testIntegration();
