/* ==========================================================================
   OM GRAPHICS – B2B Business AI Assistant (js/assistant.js)
   Runs entirely client-side, 100% secure, private, and compatible with GitHub Pages.
   ========================================================================== */

'use strict';

(function initAIAssistant() {
    // ─────────────────────────────────────────────────────────────────────────────
    // 1. Business Knowledge Base
    // ─────────────────────────────────────────────────────────────────────────────
    const KNOWLEDGE_BASE = {
        greetings: [
            "Hello! I am the OM GRAPHICS Business Assistant. How can I help you with your B2B printing requirements today?",
            "Welcome to OM GRAPHICS! I'm here to answer questions about our printing plant, machinery, MOQs, and services. What are you looking to print?"
        ],
        fallback: "I want to make sure I give you the most accurate answer. You can ask me about our offset/digital machinery, MOQs, corporate address, business hours, or how to get a formal quote. You can also connect directly with our Strategy Director on WhatsApp at +91 99302 64933.",
        topics: [
            {
                keys: ['hello', 'hi', 'hey', 'greetings', 'anyone there'],
                response: "Hello! I am the OM GRAPHICS virtual assistant. Ask me about our printing capabilities, plant machinery, MOQs, delivery timelines, or client portfolio. How can I assist you?"
            },
            {
                keys: ['moq', 'minimum quantity', 'minimum order', 'least quantity'],
                response: "Our minimum order quantities (MOQs) depend on the printing process:\n\n" +
                          "• **Offset Press (Komori)**: 1,000 units for brochures/booklets, and 500 units for packaging cartons.\n" +
                          "• **Digital Press (Xerox)**: Low-volume runs starting at **100 units** (ideal for quick corporate mockups and small events)."
            },
            {
                keys: ['machinery', 'machines', 'press', 'equipment', 'komori', 'xerox', 'polar', 'kodak', 'ctp'],
                response: "OM GRAPHICS operates an integrated plant in Mumbai, with top-tier equipment:\n\n" +
                          "• **Printing Presses**: Komori Lithrone 426 (4-color offset, 15k sheets/hr), Komori Lithrone 28 (multicolor offset), Xerox Docucolor Digital (2400 dpi, variable data).\n" +
                          "• **Pre-Press**: Kodak CTP (Computer-to-Plate laser thermal engine, 4000 dpi).\n" +
                          "• **Post-Press & Bindery**: Shoei Folding Line, Polar hydraulic guillotines, perfect binding, section sewn binding, twin-loop wiro binding, center pining (saddle stitching), and thermal lamination."
            },
            {
                keys: ['address', 'location', 'where', 'map', 'factory', 'plant', 'office', 'mumbai', 'malad', 'estate'],
                response: "Our corporate office and integrated print plant are located at:\n\n" +
                          "**220, New Sonal Link Industrial Estate, near Movie Time Cinema, Link Road, Kachpada, Malad (West), Mumbai – 400064**.\n\n" +
                          "Our facility features a dedicated dust-free assembly area, which is audited and approved for B2B pharmaceutical and cosmetic packaging."
            },
            {
                keys: ['contact', 'phone', 'mobile', 'call', 'email', 'whatsapp', 'number', 'reach'],
                response: "You can reach us through multiple channels:\n\n" +
                          "• **Direct Mobile & WhatsApp**: +91 99302 64933 (Strategy Director)\n" +
                          "• **Landlines**: +91 22 2880 1042 / +91 22 2880 3073\n" +
                          "• **Email**: uknimkar@gmail.com\n\n" +
                          "Our plant operates **Monday to Saturday, 9:00 AM to 8:00 PM** (Sundays closed)."
            },
            {
                keys: ['quote', 'price', 'cost', 'estimate', 'calculator', 'rates', 'how much'],
                response: "You can obtain print estimates in two ways:\n\n" +
                          "1. **Instant Estimates**: Use our interactive [AI Quote Tool](quote.html) to calculate prices for brochures, cartons, leaflets, and stationery.\n" +
                          "2. **Formal Quotation**: Submit your specifications on our [Contact page](contact.html) or email us. Our strategy directors issue formal PDF quotes within **2 business hours**."
            },
            {
                keys: ['services', 'print', 'make', 'capabilities', 'products', 'carton', 'brochure', 'leaflet', 'book', 'dangler', 'invitation'],
                response: "We offer 22 distinct B2B print specializations categorized under:\n\n" +
                          "• **Publications & Marketing**: Catalogues, brochures, shade cards, leaflets, books, and visual aids.\n" +
                          "• **Packaging & Cartons**: Mono cartons (SBS board), blister backing cards, dispensers, self-adhesive labels.\n" +
                          "• **Corporate & Event Collateral**: Custom wiro-bound desk/wall calendars, letters, envelopes, gusseted pouch folders, luxury invitations.\n" +
                          "• **Point of Sale (POSM)**: Die-cut danglers, rigid boxes, presentation kits."
            },
            {
                keys: ['clients', 'brands', 'companies', 'portfolio', 'served', 'pfizer', 'paints', 'nivea', 'johnson'],
                response: "Over our 30+ years of operation, we have printed for some of India's leading MNCs:\n\n" +
                          "• **Pharmaceuticals**: Pfizer, Johnson & Johnson, Bayer Zydus, Macleods.\n" +
                          "• **Consumer Goods & Paints**: Asian Paints, Nivea, Kellogg's, Milton, Faber-Castell.\n" +
                          "• **Finance & Corporate**: Crisil Ratings, Mahindra Finance, ICICI Securities."
            },
            {
                keys: ['director', 'owner', 'founder', 'uttam', 'nimkar', 'who is', 'management'],
                response: "OM GRAPHICS was founded in 1996 by **Mr. Uttam Nimkar**, who serves as our Director and Founder. The company's strategy is managed by Mr. Omkar and Mr. Kedar (Sales/Strategy directors), while production is overseen by Mr. Ashok Shirke (Maintenance), Mr. Gopal (Pre-Press), Mr. Ashish (Press), and Mr. Ravi Kadam (Post-Press & QC)."
            },
            {
                keys: ['history', 'years', 'established', '1996', '1992', 'since', 'experience', 'old'],
                response: "OM GRAPHICS was established in **1996** by Mr. Uttam Nimkar. For over **30 years**, we have maintained a reputation for print precision and B2B reliability, growing from a small local press to an ISO-audited packaging and commercial offset vendor."
            },
            {
                keys: ['security', 'secure', 'safe', 'privacy', 'xss'],
                response: "Security is our top priority. Our website employs client-side input sanitization to prevent XSS (cross-site scripting) attacks, protects external redirects via `rel=\"noopener noreferrer\"`, and does not track your chat inputs. All calculations and chat processing occur locally in your browser."
            },
            {
                keys: ['dust-free', 'clean', 'packaging safety', 'pharma compliance'],
                response: "Yes, our plant features a completely isolated **dust-free post-press assembly line**. This is essential for pharmaceutical folding cartons, blister backings, and cosmetic boxes to ensure zero product contamination."
            },
            {
                keys: ['discount', 'cheaper', 'bulk discount', 'volume discount', 'reductions'],
                response: "We offer volume-based pricing discounts for large print runs:\n\n" +
                          "• **5,000+ units**: 5% discount\n" +
                          "• **10,000+ units**: 10% discount\n" +
                          "• **25,000+ units**: 15% discount\n\n" +
                          "All calculations are automated in our [AI Quote Tool](quote.html)."
            },
            {
                keys: ['delivery', 'timeline', 'timings', 'urgent', 'dispatch', 'days', 'duration'],
                response: "Our standard print dispatch schedule:\n\n" +
                          "• **Standard B2B Delivery**: 5 to 7 business days.\n" +
                          "• **Express Delivery**: 2 to 3 business days.\n" +
                          "• **Digital Mockups**: Same-day dispatch for approvals."
            },
            {
                keys: ['proof', 'sample', 'mockup', 'check print', 'test run'],
                response: "Yes! We run physical digital proof samples on our Xerox Docucolor Digital press for layout and color checks. Once you sign off on the proof mockup, we set up the plates on our Komori Lithrone presses for the main run."
            },
            {
                keys: ['paper', 'gsm', 'card', 'board', 'thickness', 'sbs'],
                response: "We support a range of professional paper and board stocks:\n\n" +
                          "• **80 GSM Maplitho**: Corporate letterheads and detailed pharma leaflets.\n" +
                          "• **130 GSM / 170 GSM Art Paper**: Premium glossy or matte brochures and pamphlets.\n" +
                          "• **300 GSM Art Card / SBS Board**: High-rigidity paper board for folding mono cartons and blister backing cards."
            }
        ]
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // 2. Chatbot Core Logic
    // ─────────────────────────────────────────────────────────────────────────────
    function getAssistantResponse(userText) {
        const text = userText.toLowerCase().trim();
        if (!text) return "Please enter a question.";

        // Look for matches
        for (const topic of KNOWLEDGE_BASE.topics) {
            for (const key of topic.keys) {
                if (text.includes(key)) {
                    return topic.response;
                }
            }
        }

        // Contextual fallbacks
        if (text.includes('thank') || text.includes('thanks') || text.includes('ok') || text.includes('great')) {
            return "You're very welcome! Let me know if you need specifications for other machinery or details on B2B print orders.";
        }
        if (text.includes('bye') || text.includes('quit') || text.includes('exit')) {
            return "Thank you for visiting OM GRAPHICS. Have a productive day!";
        }

        return KNOWLEDGE_BASE.fallback;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 3. UI Presentation / HTML Injection
    // ─────────────────────────────────────────────────────────────────────────────
    function injectChatbotUI() {
        // Prevent double injection
        if (document.getElementById('omgraphicAssistantContainer')) return;

        // CSS Styles Inject
        const style = document.createElement('style');
        style.id = 'omgraphicAssistantStyles';
        style.textContent = `
            /* Chat Floating Button */
            .ai-chat-btn {
                position: fixed;
                bottom: 32px;
                right: 110px; /* Offset to prevent overlap with floating WhatsApp */
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--clr-purple, #5D2D91), var(--clr-purple-light, #7C45BC));
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 24px rgba(93, 45, 145, 0.4);
                cursor: pointer;
                z-index: 9999;
                transition: transform var(--t-fast, 0.2s) ease, box-shadow var(--t-fast, 0.2s) ease;
                border: 2px solid rgba(255, 255, 255, 0.1);
            }
            .ai-chat-btn:hover {
                transform: scale(1.08) translateY(-2px);
                box-shadow: 0 12px 32px rgba(93, 45, 145, 0.5);
            }
            .ai-chat-btn-pulse {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: rgba(93, 45, 145, 0.3);
                animation: aiPulse 2s infinite;
                z-index: -1;
            }
            @keyframes aiPulse {
                0% { transform: scale(1); opacity: 1; }
                100% { transform: scale(1.6); opacity: 0; }
            }

            /* Chat Window Container */
            .ai-chat-window {
                position: fixed;
                bottom: 108px;
                right: 32px;
                width: 380px;
                max-width: calc(100vw - 64px);
                height: 520px;
                max-height: calc(100vh - 160px);
                border-radius: 20px;
                background: var(--bg-glass, rgba(255, 255, 255, 0.85));
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid var(--border-glass, rgba(255, 255, 255, 0.2));
                box-shadow: 0 16px 48px rgba(0,0,0,0.18);
                display: flex;
                flex-direction: column;
                z-index: 9999;
                overflow: hidden;
                transform: translateY(20px) scale(0.95);
                opacity: 0;
                pointer-events: none;
                transition: transform var(--t-normal, 0.3s) cubic-bezier(0.175, 0.885, 0.32, 1.1), opacity var(--t-normal, 0.3s) ease;
            }
            body.dark-theme .ai-chat-window {
                background: var(--bg-glass, rgba(28, 28, 30, 0.85));
                border-color: var(--border-glass, rgba(255, 255, 255, 0.08));
                box-shadow: 0 16px 48px rgba(0,0,0,0.5);
            }
            .ai-chat-window.active {
                transform: none;
                opacity: 1;
                pointer-events: auto;
            }

            /* Header */
            .ai-chat-header {
                padding: 16px 20px;
                background: linear-gradient(135deg, var(--clr-purple, #5D2D91), var(--clr-purple-light, #7C45BC));
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .ai-chat-profile {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .ai-chat-avatar {
                width: 36px;
                height: 36px;
                background: rgba(255,255,255,0.15);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid rgba(255,255,255,0.25);
            }
            .ai-chat-title {
                font-weight: 700;
                font-size: 0.95rem;
                letter-spacing: -0.3px;
                font-family: var(--font-heading, 'Outfit', sans-serif);
            }
            .ai-chat-status {
                font-size: 0.72rem;
                opacity: 0.85;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .ai-chat-status-dot {
                width: 6px;
                height: 6px;
                background: #00ff66;
                border-radius: 50%;
                display: inline-block;
                animation: statusBlink 1.5s infinite;
            }
            @keyframes statusBlink {
                0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; }
            }
            .ai-chat-close {
                background: none;
                border: none;
                color: #fff;
                font-size: 1.1rem;
                cursor: pointer;
                opacity: 0.8;
                transition: opacity var(--t-fast, 0.2s) ease;
                padding: 4px;
            }
            .ai-chat-close:hover { opacity: 1; }

            /* Message Area */
            .ai-chat-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
                scroll-behavior: smooth;
            }
            .ai-msg {
                max-width: 82%;
                padding: 12px 16px;
                border-radius: 16px;
                font-size: 0.875rem;
                line-height: 1.5;
                font-family: var(--font-body, 'Inter', sans-serif);
                animation: msgSlideIn 0.3s ease both;
                word-wrap: break-word;
                white-space: pre-wrap;
            }
            @keyframes msgSlideIn {
                from { transform: translateY(12px); opacity: 0; }
                to { transform: none; opacity: 1; }
            }
            .ai-msg-assistant {
                background: var(--bg-tertiary, #f3f3f6);
                color: var(--text-primary, #1c1c1e);
                border-bottom-left-radius: 4px;
                align-self: flex-start;
            }
            body.dark-theme .ai-msg-assistant {
                background: #2c2c2e;
                color: #f2f2f7;
            }
            .ai-msg-user {
                background: linear-gradient(135deg, var(--clr-purple, #5D2D91), var(--clr-purple-light, #7C45BC));
                color: #fff;
                border-bottom-right-radius: 4px;
                align-self: flex-end;
                box-shadow: 0 4px 12px rgba(93, 45, 145, 0.15);
            }
            .ai-msg-assistant a {
                color: var(--clr-purple-light, #7C45BC);
                font-weight: 600;
                text-decoration: none;
            }
            .ai-msg-assistant a:hover {
                text-decoration: underline;
            }

            /* Suggestion Chips */
            .ai-chat-chips {
                display: flex;
                gap: 8px;
                padding: 10px 20px;
                overflow-x: auto;
                background: rgba(0, 0, 0, 0.02);
                border-top: 1px solid var(--border-glass, rgba(0,0,0,0.06));
                border-bottom: 1px solid var(--border-glass, rgba(0,0,0,0.06));
                scrollbar-width: none; /* Hide scrollbar for Firefox */
            }
            body.dark-theme .ai-chat-chips {
                background: rgba(255, 255, 255, 0.02);
                border-color: rgba(255,255,255,0.06);
            }
            .ai-chat-chips::-webkit-scrollbar {
                display: none; /* Hide scrollbar for Chrome/Safari */
            }
            .ai-chip {
                background: var(--bg-tertiary, #fff);
                color: var(--text-secondary, #48484a);
                padding: 8px 14px;
                border-radius: 18px;
                font-size: 0.78rem;
                font-weight: 600;
                cursor: pointer;
                white-space: nowrap;
                border: 1px solid var(--border-glass, rgba(0,0,0,0.08));
                box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05));
                transition: background var(--t-fast, 0.2s) ease, color var(--t-fast, 0.2s) ease, border-color var(--t-fast, 0.2s) ease;
            }
            body.dark-theme .ai-chip {
                background: #1c1c1e;
                color: #aeaeb2;
                border-color: rgba(255,255,255,0.08);
            }
            .ai-chip:hover {
                background: var(--clr-purple-light, #7C45BC);
                color: #fff;
                border-color: var(--clr-purple-light, #7C45BC);
            }

            /* Input Area */
            .ai-chat-input-bar {
                padding: 12px 16px;
                display: flex;
                gap: 10px;
                align-items: center;
                background: var(--bg-glass, #fff);
            }
            body.dark-theme .ai-chat-input-bar {
                background: var(--bg-glass, #1c1c1e);
            }
            .ai-chat-input {
                flex: 1;
                border: 1px solid var(--border-glass, rgba(0,0,0,0.12));
                background: var(--bg-tertiary, #f3f3f6);
                color: var(--text-primary, #1c1c1e);
                padding: 10px 16px;
                border-radius: 14px;
                font-size: 0.88rem;
                font-family: inherit;
                outline: none;
                transition: border-color var(--t-fast, 0.2s) ease, background var(--t-fast, 0.2s) ease;
            }
            body.dark-theme .ai-chat-input {
                border-color: rgba(255,255,255,0.1);
                background: #2c2c2e;
                color: #fff;
            }
            .ai-chat-input:focus {
                border-color: var(--clr-purple-light, #7C45BC);
                background: #fff;
            }
            body.dark-theme .ai-chat-input:focus {
                background: #1c1c1e;
            }
            .ai-chat-send {
                width: 40px;
                height: 40px;
                border-radius: 12px;
                background: linear-gradient(135deg, var(--clr-purple, #5D2D91), var(--clr-purple-light, #7C45BC));
                color: #fff;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform var(--t-fast, 0.2s) ease, opacity var(--t-fast, 0.2s) ease;
                box-shadow: 0 4px 12px rgba(93, 45, 145, 0.25);
            }
            .ai-chat-send:hover {
                transform: scale(1.05);
            }
            .ai-chat-send:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .ai-chat-btn {
                    bottom: 20px;
                    right: 88px;
                    width: 52px;
                    height: 52px;
                }
                .ai-chat-window {
                    bottom: 84px;
                    right: 16px;
                    width: calc(100vw - 32px);
                    height: calc(100vh - 120px);
                    border-radius: 16px;
                }
            }
        `;
        document.head.appendChild(style);

        // Build Container
        const container = document.createElement('div');
        container.id = 'omgraphicAssistantContainer';

        // Float Button HTML
        const floatBtn = document.createElement('div');
        floatBtn.className = 'ai-chat-btn';
        floatBtn.setAttribute('role', 'button');
        floatBtn.setAttribute('aria-label', 'Open AI Assistant');
        floatBtn.innerHTML = `
            <div class="ai-chat-btn-pulse"></div>
            <i class="fas fa-robot fa-lg"></i>
        `;

        // Chat Window HTML
        const chatWin = document.createElement('div');
        chatWin.className = 'ai-chat-window';
        chatWin.innerHTML = `
            <div class="ai-chat-header">
                <div class="ai-chat-profile">
                    <div class="ai-chat-avatar"><i class="fas fa-robot"></i></div>
                    <div>
                        <div class="ai-chat-title">OM GRAPHICS Assistant</div>
                        <div class="ai-chat-status">
                            <span class="ai-chat-status-dot"></span>
                            Online (B2B Brain)
                        </div>
                    </div>
                </div>
                <button class="ai-chat-close" aria-label="Close Assistant"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="ai-chat-messages" id="aiChatMessages">
                <!-- Messages dynamic -->
            </div>

            <div class="ai-chat-chips">
                <div class="ai-chip" data-query="What is your MOQ?">What is your MOQ?</div>
                <div class="ai-chip" data-query="What machines do you run?">What machines do you run?</div>
                <div class="ai-chip" data-query="Where is your Malad plant?">Where is your plant?</div>
                <div class="ai-chip" data-query="How to get a formal quote?">How to get a quote?</div>
            </div>

            <div class="ai-chat-input-bar">
                <input type="text" class="ai-chat-input" placeholder="Type a message..." aria-label="Type message to AI assistant" id="aiChatInputField">
                <button class="ai-chat-send" id="aiChatSendBtn" aria-label="Send message" disabled>
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;

        container.appendChild(floatBtn);
        container.appendChild(chatWin);
        document.body.appendChild(container);

        // Core Event Handlers
        const closeBtn = chatWin.querySelector('.ai-chat-close');
        const messagesBox = chatWin.querySelector('#aiChatMessages');
        const inputField = chatWin.querySelector('#aiChatInputField');
        const sendBtn = chatWin.querySelector('#aiChatSendBtn');
        const chips = chatWin.querySelectorAll('.ai-chip');

        // Toggle Expand
        floatBtn.addEventListener('click', () => {
            chatWin.classList.toggle('active');
            if (chatWin.classList.contains('active')) {
                inputField.focus();
                // Send initial greeting if empty
                if (messagesBox.children.length === 0) {
                    const idx = Math.floor(Math.random() * KNOWLEDGE_BASE.greetings.length);
                    appendMessage(KNOWLEDGE_BASE.greetings[idx], 'assistant');
                }
            }
        });

        closeBtn.addEventListener('click', () => {
            chatWin.classList.remove('active');
        });

        // Close when clicking outside of chat window or button
        window.addEventListener('click', (e) => {
            if (!container.contains(e.target) && chatWin.classList.contains('active')) {
                chatWin.classList.remove('active');
            }
        });

        // Enable/Disable Send Button
        inputField.addEventListener('input', () => {
            sendBtn.disabled = !inputField.value.trim();
        });

        // Submit via Send Button
        sendBtn.addEventListener('click', handleUserSubmit);

        // Submit via Enter
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !sendBtn.disabled) {
                handleUserSubmit();
            }
        });

        // Submit via Quick Chips
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const query = chip.dataset.query;
                inputField.value = query;
                sendBtn.disabled = false;
                handleUserSubmit();
            });
        });

        function handleUserSubmit() {
            const rawText = inputField.value.trim();
            if (!rawText) return;

            // XSS Safe Sanitizer
            const cleanText = rawText
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');

            appendMessage(cleanText, 'user');
            inputField.value = '';
            sendBtn.disabled = true;

            // Typing Indicator Delay
            appendTypingIndicator();

            setTimeout(() => {
                removeTypingIndicator();
                const response = getAssistantResponse(cleanText);
                appendMessage(response, 'assistant');
            }, 750);
        }

        function appendMessage(text, sender) {
            const msg = document.createElement('div');
            msg.className = `ai-msg ai-msg-${sender}`;
            
            // Render markdown-like links [Text](URL)
            let formattedText = text;
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
            formattedText = formattedText.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
            
            msg.innerHTML = formattedText;
            messagesBox.appendChild(msg);
            messagesBox.scrollTop = messagesBox.scrollHeight;
        }

        function appendTypingIndicator() {
            const ind = document.createElement('div');
            ind.id = 'aiTypingIndicator';
            ind.className = 'ai-msg ai-msg-assistant';
            ind.style.display = 'flex';
            ind.style.alignItems = 'center';
            ind.style.gap = '4px';
            ind.style.padding = '8px 16px';
            ind.innerHTML = `
                <span class="dot" style="width:6px; height:6px; background:#8e8e93; border-radius:50%; display:inline-block; animation: dotBounce 1.4s infinite both;"></span>
                <span class="dot" style="width:6px; height:6px; background:#8e8e93; border-radius:50%; display:inline-block; animation: dotBounce 1.4s infinite both 0.2s;"></span>
                <span class="dot" style="width:6px; height:6px; background:#8e8e93; border-radius:50%; display:inline-block; animation: dotBounce 1.4s infinite both 0.4s;"></span>
                <style>
                    @keyframes dotBounce {
                        0%, 80%, 100% { transform: scale(0.6); }
                        40% { transform: scale(1) translateY(-4px); }
                    }
                </style>
            `;
            messagesBox.appendChild(ind);
            messagesBox.scrollTop = messagesBox.scrollHeight;
        }

        function removeTypingIndicator() {
            const ind = document.getElementById('aiTypingIndicator');
            if (ind) ind.remove();
        }
    }

    // Initialize UI on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectChatbotUI);
    } else {
        injectChatbotUI();
    }
})();
