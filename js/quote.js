/* ==========================================================================
   Om Graphic B2B Printing - Live Price Calculator & AI Parsing Engine
   Security: All user inputs are sanitized before use
   ========================================================================== */

'use strict';

// Simple HTML sanitizer to prevent XSS
function sanitizeText(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .trim();
}

document.addEventListener('DOMContentLoaded', () => {
    // Pricing configurations (rates are in INR based on typical Mumbai offset & digital setups)
    const PRICING_CONFIG = {
        products: {
            brochure: { basePressFee: 2500, clickRate: 3.5, minQty: 100 },
            carton: { basePressFee: 4000, clickRate: 5.0, minQty: 500 },
            leaflet: { basePressFee: 1500, clickRate: 1.5, minQty: 250 },
            stationery: { basePressFee: 1000, clickRate: 2.0, minQty: 100 }
        },
        paperGsm: {
            '80': 0.12,
            '130': 0.18,
            '170': 0.25,
            '300': 0.45
        },
        finishes: {
            lamination_none: 0,
            lamination_gloss: 0.8,
            lamination_matt: 1.0,
            spot_uv: 1.5,
            binding_stitch: 1.2,
            binding_perfect: 4.5,
            binding_wiro: 6.0
        },
        delivery: {
            standard: { multiplier: 1.0, label: 'Standard (5-7 Days)' },
            express: { multiplier: 1.25, label: 'Express (2-3 Days)' }
        }
    };

    // State object holding currently selected options
    const state = {
        product: 'brochure',
        quantity: 1000,
        size: 'a4',
        pages: 16,
        gsm: '130',
        lamination: 'lamination_matt',
        binding: 'binding_stitch',
        spotUv: false,
        delivery: 'standard'
    };

    // DOM Elements Cache
    const el = {
        aiTextInput: document.getElementById('aiTextInput'),
        btnAiFill: document.getElementById('btnAiFill'),
        
        choiceCards: document.querySelectorAll('.choice-card'),
        quantity: document.getElementById('quantity'),
        size: document.getElementById('size'),
        pages: document.getElementById('pages'),
        gsm: document.getElementById('gsm'),
        
        lamination: document.getElementById('lamination'),
        binding: document.getElementById('binding'),
        spotUv: document.getElementById('spotUv'),
        delivery: document.getElementById('delivery'),
        
        // Output text fields
        outPaperCost: document.getElementById('outPaperCost'),
        outPressCost: document.getElementById('outPressCost'),
        outFinishCost: document.getElementById('outFinishCost'),
        outDiscount: document.getElementById('outDiscount'),
        outSubtotal: document.getElementById('outSubtotal'),
        outGst: document.getElementById('outGst'),
        outTotal: document.getElementById('outTotal'),
        
        // Modals
        modalQuote: document.getElementById('modalQuote'),
        modalWhatsapp: document.getElementById('modalWhatsapp'),
        btnRequestFormal: document.getElementById('btnRequestFormal'),
        btnRequestWa: document.getElementById('btnRequestWa'),
        closeModalQuote: document.getElementById('closeModalQuote'),
        closeModalWa: document.getElementById('closeModalWa'),
        
        // Form submits inside modals
        formPdfQuote: document.getElementById('formPdfQuote'),
        formWaQuote: document.getElementById('formWaQuote'),
        
        pagesGroup: document.getElementById('pagesGroup'),
        bindingGroup: document.getElementById('bindingGroup')
    };

    // Exit early if page doesn't contain elements
    if (!el.quantity) return;

    // Attach Event Listeners for controls
    initCalculatorControls();
    
    // Initial Calculation run
    calculateCosts();

    /**
     * Set up UI controls listeners
     */
    function initCalculatorControls() {
        // AI Auto-Fill parser trigger
        if (el.btnAiFill) {
            el.btnAiFill.addEventListener('click', parseNaturalLanguageQuery);
        }

        // Product choice cards clicks
        el.choiceCards.forEach(card => {
            card.addEventListener('click', () => {
                el.choiceCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                
                const radioInput = card.querySelector('input[type="radio"]');
                if (radioInput) {
                    radioInput.checked = true;
                    state.product = radioInput.value;
                    
                    // Conditionally show/hide pages and bindings for Brochures
                    togglePagesAndBindings();
                    
                    // Adjust minimum quantity according to product type
                    adjustQuantityLimits();
                    
                    calculateCosts();
                }
            });
        });

        // Spec inputs changes
        const inputList = ['quantity', 'size', 'pages', 'gsm', 'lamination', 'binding', 'spotUv', 'delivery'];
        inputList.forEach(field => {
            const inputElement = el[field];
            if (inputElement) {
                inputElement.addEventListener('input', () => {
                    let val = inputElement.value;
                    if (inputElement.type === 'checkbox') {
                        val = inputElement.checked;
                    } else if (inputElement.type === 'number') {
                        val = parseInt(val) || 0;
                    }
                    state[field] = val;
                    
                    calculateCosts();
                });
            }
        });

        // Modal triggers
        if (el.btnRequestFormal) {
            el.btnRequestFormal.addEventListener('click', () => {
                el.modalQuote.classList.add('active');
                setTimeout(() => { const f = el.modalQuote.querySelector('input'); if (f) f.focus(); }, 100);
            });
        }
        if (el.btnRequestWa) {
            el.btnRequestWa.addEventListener('click', () => {
                el.modalWhatsapp.classList.add('active');
                setTimeout(() => { const f = el.modalWhatsapp.querySelector('input'); if (f) f.focus(); }, 100);
            });
        }

        // Close button hooks (using IDs)
        function closeAllModals() {
            el.modalQuote.classList.remove('active');
            el.modalWhatsapp.classList.remove('active');
        }
        if (el.closeModalQuote) el.closeModalQuote.addEventListener('click', closeAllModals);
        if (el.closeModalWa) el.closeModalWa.addEventListener('click', closeAllModals);

        // Close on clicking outside modal content
        window.addEventListener('click', (e) => {
            if (e.target === el.modalQuote) closeAllModals();
            if (e.target === el.modalWhatsapp) closeAllModals();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeAllModals();
        });

        // Form handlers
        if (el.formPdfQuote) {
            el.formPdfQuote.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameVal = document.getElementById('pdfName');
                const emailVal = document.getElementById('pdfEmail');
                const companyVal = document.getElementById('pdfCompany');
                const notesVal = document.getElementById('pdfNotes');
                
                if (!nameVal.value.trim() || !emailVal.value.trim() || !companyVal.value.trim()) return;
                
                // Validate email
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal.value.trim())) {
                    emailVal.style.borderColor = '#e53e3e';
                    emailVal.focus();
                    return;
                }
                
                try {
                    triggerPdfDownload(
                        nameVal.value.trim(),
                        companyVal.value.trim(),
                        emailVal.value.trim(),
                        notesVal ? notesVal.value.trim() : ''
                    );
                    
                    el.modalQuote.classList.remove('active');
                    if (window.showToast) {
                        window.showToast('Your PDF quotation has been generated and downloaded successfully!');
                    }
                    el.formPdfQuote.reset();
                } catch (error) {
                    console.error("PDF Generation failed", error);
                    if (window.showToast) {
                        window.showToast('Failed to generate PDF. Please contact our strategy desk directly.', 'error');
                    }
                }
            });
        }

        function triggerPdfDownload(clientName, clientCompany, clientEmail, specialNotes) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const primaryColor = [93, 45, 145]; // Purple #5D2D91
            const secondaryColor = [0, 158, 90]; // Green #009E5A
            const textColor = [44, 62, 80]; // Dark blue-grey #2C3E50
            const lightGrey = [245, 245, 248];

            const margin = 20;
            const width = doc.internal.pageSize.getWidth();
            let yPos = 20;

            function drawDivider(color = [220, 220, 225], thickness = 0.5) {
                doc.setDrawColor(...color);
                doc.setLineWidth(thickness);
                doc.line(margin, yPos, width - margin, yPos);
                yPos += thickness + 4;
            }

            // Top Banner
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, width, 12, 'F');

            // Header Logo & Branding
            yPos = 24;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(...primaryColor);
            doc.text("OM GRAPHICS", margin, yPos);
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(...secondaryColor);
            doc.text("EXCELLENCE IN COMMERCIAL OFF-SET & DIGITAL PRINTING", margin, yPos + 4);

            // Business info
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(110, 110, 115);
            doc.text("220, New Sonal Link Ind Estate, Malad (W), Mumbai - 400064", width - margin, yPos, { align: 'right' });
            doc.text("Phone: +91 22 2880 1042 | Email: uknimkar@gmail.com", width - margin, yPos + 4, { align: 'right' });
            doc.text("GSTIN: 27AABCO2932K1ZX (Simulated)", width - margin, yPos + 8, { align: 'right' });

            yPos += 14;
            drawDivider(primaryColor, 1);

            // Document Details
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(...primaryColor);
            doc.text("ESTIMATE PRICE QUOTATION", margin, yPos);
            
            const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
            const quoteNo = "OGQ-" + Math.floor(100000 + Math.random() * 900000);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 85);
            doc.text(`Date: ${today}`, width - margin, yPos, { align: 'right' });
            doc.text(`Estimate No: ${quoteNo}`, width - margin, yPos + 4, { align: 'right' });

            yPos += 12;

            // Client Info Box
            doc.setFillColor(...lightGrey);
            doc.rect(margin, yPos, width - (margin * 2), 24, 'F');
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(...textColor);
            doc.text("QUOTED TO:", margin + 5, yPos + 5.5);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.text(`Name: ${clientName}`, margin + 5, yPos + 10.5);
            doc.text(`Company: ${clientCompany}`, margin + 5, yPos + 15);
            doc.text(`Email: ${clientEmail}`, margin + 5, yPos + 19.5);

            yPos += 30;

            // Specifications Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10.5);
            doc.setTextColor(...primaryColor);
            doc.text("PRINTING SPECIFICATIONS", margin, yPos);
            yPos += 3;
            drawDivider();

            // Specs
            doc.setFontSize(8.5);
            const specs = [
                ["Product Category", state.product.toUpperCase()],
                ["Quantity Required", state.quantity.toString()],
                ["Product Dimensions", state.size.toUpperCase()],
                ["Paper GSM Index", state.gsm + " GSM"],
                ["Lamination Finish", state.lamination.replace('lamination_', '').toUpperCase()],
                ["Delivery Schedule", state.delivery.toUpperCase()]
            ];
            if (state.product === 'brochure') {
                specs.splice(3, 0, ["Page Count", state.pages.toString()]);
                specs.splice(6, 0, ["Binding Method", state.binding.replace('binding_', '').toUpperCase()]);
            }
            
            specs.forEach(([label, val]) => {
                doc.setFont("helvetica", "bold");
                doc.setTextColor(80, 80, 85);
                doc.text(label, margin + 4, yPos);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(...textColor);
                doc.text(val, margin + 65, yPos);
                yPos += 5;
            });

            yPos += 4;
            
            // Pricing Table Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10.5);
            doc.setTextColor(...primaryColor);
            doc.text("COST BREAKDOWN SUMMARY", margin, yPos);
            yPos += 3;
            drawDivider();

            const priceRows = [
                ["Paper Stock Cost", el.outPaperCost.innerText],
                ["Press Setup & Click Charge", el.outPressCost.innerText],
                ["Post-Press Finish Cost", el.outFinishCost.innerText],
                ["Corporate Bulk Discount", el.outDiscount.innerText],
                ["Net Taxable Subtotal", el.outSubtotal.innerText],
                ["Output GST (18%)", el.outGst.innerText]
            ];

            priceRows.forEach(([label, val]) => {
                doc.setFont("helvetica", "normal");
                doc.setTextColor(80, 80, 85);
                doc.text(label, margin + 4, yPos);
                doc.text(val, width - margin - 4, yPos, { align: 'right' });
                yPos += 5;
            });

            // Total Box
            yPos += 2;
            doc.setFillColor(...primaryColor);
            doc.rect(margin, yPos, width - (margin * 2), 9, 'F');
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10.5);
            doc.setTextColor(255, 255, 255);
            doc.text("NET GRAND TOTAL (INR)", margin + 4, yPos + 6);
            doc.text(el.outTotal.innerText, width - margin - 4, yPos + 6, { align: 'right' });

            yPos += 16;

            // Terms
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(...textColor);
            doc.text("Terms of Business:", margin, yPos);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.2);
            doc.setTextColor(110, 110, 115);
            const terms = [
                "1. This document serves as a preliminary commercial estimate. Formal orders require strategy director signoff.",
                "2. Standard dispatch timelines begin only after approved vector proof files are verified.",
                "3. Billing structure: 50% deposit with work confirmation balance immediately on delivery.",
                "4. All rates listed are valid for 30 calendar days from the date of issue."
            ];
            terms.forEach(term => {
                yPos += 3.5;
                doc.text(term, margin, yPos);
            });

            // Signatory
            yPos += 12;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(...primaryColor);
            doc.text("For OM GRAPHICS", width - margin - 45, yPos);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.text("B2B Estimates Desk", width - margin - 45, yPos + 6);

            doc.save(`OM_GRAPHICS_Quotation_${quoteNo}.pdf`);
        }

        if (el.formWaQuote) {
            el.formWaQuote.addEventListener('submit', (e) => {
                e.preventDefault();
                const clientName = sanitizeText(document.getElementById('waName').value);
                const clientCompany = sanitizeText(document.getElementById('waCompany').value);
                if (!clientName || !clientCompany) return;
                
                // Formulate pre-filled WhatsApp message
                const specsMsg = `Hello OM GRAPHICS! My name is ${clientName} (${clientCompany}). I'd like a formal printing quote. Here are the specs from your calculator:\n\n` +
                    `- Product: ${state.product.toUpperCase()}\n` +
                    `- Quantity: ${state.quantity}\n` +
                    `- Size: ${state.size.toUpperCase()}\n` +
                    (state.product === 'brochure' ? `- Pages: ${state.pages}\n` : '') +
                    `- Paper GSM: ${state.gsm} GSM\n` +
                    `- Finishing: ${state.lamination.replace('lamination_', '')}\n` +
                    (state.product === 'brochure' ? `- Binding: ${state.binding.replace('binding_', '')}\n` : '') +
                    `- Spot UV: ${state.spotUv ? 'Yes' : 'No'}\n` +
                    `- Delivery: ${state.delivery.toUpperCase()}`;
                
                const encodedMsg = encodeURIComponent(specsMsg);
                // Open WhatsApp chat in a new tab (OM GRAPHICS corporate WhatsApp: 9930264933)
                window.open(`https://wa.me/919930264933?text=${encodedMsg}`, '_blank');
                el.modalWhatsapp.classList.remove('active');
            });
        }
    }

    /**
     * Show page controls only for books / brochures
     */
    function togglePagesAndBindings() {
        if (state.product === 'brochure') {
            if (el.pagesGroup) el.pagesGroup.style.display = 'flex';
            if (el.bindingGroup) el.bindingGroup.style.display = 'flex';
        } else {
            if (el.pagesGroup) el.pagesGroup.style.display = 'none';
            if (el.bindingGroup) el.bindingGroup.style.display = 'none';
        }
    }

    /**
     * Adjust validation limits based on product limits
     */
    function adjustQuantityLimits() {
        const limits = PRICING_CONFIG.products[state.product];
        el.quantity.min = limits.minQty;
        if (state.quantity < limits.minQty) {
            state.quantity = limits.minQty;
            el.quantity.value = limits.minQty;
        }
    }

    /**
     * The pricing formula engine
     */
    function calculateCosts() {
        const qty = state.quantity;
        const sizeMultiplier = state.size === 'a4' ? 1.5 : (state.size === 'a3' ? 2.5 : 1.0);
        const pages = state.product === 'brochure' ? state.pages : 1;

        // 1. Calculate Paper Cost
        const paperPricePerSheet = PRICING_CONFIG.paperGsm[state.gsm] || 0.18;
        const totalSheets = qty * pages * sizeMultiplier;
        const paperCost = totalSheets * paperPricePerSheet;

        // 2. Calculate Press/Printing Cost
        const prodConfig = PRICING_CONFIG.products[state.product];
        const pressSetupFee = prodConfig.basePressFee;
        const pressClickFee = qty * pages * sizeMultiplier * prodConfig.clickRate;
        const rawPressCost = pressSetupFee + pressClickFee;
        
        // Simulating digital vs offset economies of scale
        // Offset setups (Komori Lithrone) are cheaper for high quantities
        const pressCost = qty >= 1000 ? rawPressCost * 0.7 : rawPressCost;

        // 3. Calculate Finishing Cost
        const lamRate = PRICING_CONFIG.finishes[state.lamination] || 0;
        const bindRate = state.product === 'brochure' ? (PRICING_CONFIG.finishes[state.binding] || 0) : 0;
        const spotUvRate = state.spotUv ? PRICING_CONFIG.finishes.spot_uv : 0;
        
        const finishCostPerUnit = (lamRate * sizeMultiplier) + bindRate + spotUvRate;
        const finishingCost = qty * finishCostPerUnit;

        // 4. Sum up and evaluate bulk discounts
        let subtotal = paperCost + pressCost + finishingCost;
        
        // Apply delivery multiplier
        const deliveryRate = PRICING_CONFIG.delivery[state.delivery] || PRICING_CONFIG.delivery.standard;
        subtotal = subtotal * deliveryRate.multiplier;

        // Discount system (Economies of scale indicators)
        let discountPercent = 0;
        if (qty >= 25000) discountPercent = 0.15;
        else if (qty >= 10000) discountPercent = 0.10;
        else if (qty >= 5000) discountPercent = 0.05;

        const discountVal = subtotal * discountPercent;
        const netSubtotal = subtotal - discountVal;

        // 5. Taxes (Indian Goods & Service Tax for printing services = 18%)
        const gstVal = netSubtotal * 0.18;
        const finalTotal = netSubtotal + gstVal;

        // Update DOM displays
        el.outPaperCost.innerText = `₹${Math.round(paperCost).toLocaleString('en-IN')}`;
        el.outPressCost.innerText = `₹${Math.round(pressCost).toLocaleString('en-IN')}`;
        el.outFinishCost.innerText = `₹${Math.round(finishingCost).toLocaleString('en-IN')}`;
        
        if (discountPercent > 0) {
            el.outDiscount.innerHTML = `<span class="discount-tag">-${discountPercent * 100}% Bulk Disc</span> -₹${Math.round(discountVal).toLocaleString('en-IN')}`;
        } else {
            el.outDiscount.innerText = `₹0`;
        }
        
        el.outSubtotal.innerText = `₹${Math.round(netSubtotal).toLocaleString('en-IN')}`;
        el.outGst.innerText = `₹${Math.round(gstVal).toLocaleString('en-IN')}`;
        el.outTotal.innerText = `₹${Math.round(finalTotal).toLocaleString('en-IN')}`;
    }

    /**
     * Natural Language parsing (AI Auto-Fill algorithm)
     */
    function parseNaturalLanguageQuery() {
        const rawText = el.aiTextInput.value;
        // Sanitize input - strip HTML tags before parsing
        const text = rawText.replace(/<[^>]*>/g, '').toLowerCase().trim();
        if (!text) {
            if (window.showToast) {
                window.showToast('Please type some specifications first, e.g. "5000 A4 brochures, 16 pages, matt lamination"', 'error');
            }
            el.aiTextInput.focus();
            return;
        }

        // 1. Detect Product Types
        if (text.includes('brochure') || text.includes('catalog') || text.includes('book') || text.includes('magazine')) {
            updateProductSelection('brochure');
        } else if (text.includes('carton') || text.includes('box') || text.includes('packaging') || text.includes('mono')) {
            updateProductSelection('carton');
        } else if (text.includes('leaflet') || text.includes('flyer') || text.includes('pamphlet')) {
            updateProductSelection('leaflet');
        } else if (text.includes('stationery') || text.includes('visiting') || text.includes('envelope')) {
            updateProductSelection('stationery');
        }

        // 2. Detect Quantities (Look for standalone numbers)
        const qtyMatch = text.match(/\b\d{3,6}\b/);
        if (qtyMatch) {
            const parsedQty = parseInt(qtyMatch[0]);
            state.quantity = parsedQty;
            el.quantity.value = parsedQty;
        }

        // 3. Detect Sizes
        if (text.includes('a4')) {
            state.size = 'a4';
            el.size.value = 'a4';
        } else if (text.includes('a3')) {
            state.size = 'a3';
            el.size.value = 'a3';
        } else if (text.includes('a5')) {
            state.size = 'a5';
            el.size.value = 'a5';
        }

        // 4. Detect Page Counts
        const pagesMatch = text.match(/(\d+)\s*(page|pg|pp)/);
        if (pagesMatch) {
            const parsedPages = parseInt(pagesMatch[1]);
            state.pages = parsedPages;
            el.pages.value = parsedPages;
        }

        // 5. Detect paper weights (GSM)
        if (text.includes('80')) {
            state.gsm = '80';
            el.gsm.value = '80';
        } else if (text.includes('130')) {
            state.gsm = '130';
            el.gsm.value = '130';
        } else if (text.includes('170')) {
            state.gsm = '170';
            el.gsm.value = '170';
        } else if (text.includes('300') || text.includes('350')) {
            state.gsm = '300';
            el.gsm.value = '300';
        }

        // 6. Detect Finishes
        if (text.includes('gloss')) {
            state.lamination = 'lamination_gloss';
            el.lamination.value = 'lamination_gloss';
        } else if (text.includes('matt') || text.includes('matte')) {
            state.lamination = 'lamination_matt';
            el.lamination.value = 'lamination_matt';
        } else if (text.includes('no lamination')) {
            state.lamination = 'lamination_none';
            el.lamination.value = 'lamination_none';
        }

        // 7. Detect Spot UV
        if (text.includes('spot uv') || text.includes('uv spot')) {
            state.spotUv = true;
            el.spotUv.checked = true;
        }

        // 8. Detect Bindings
        if (text.includes('wiro') || text.includes('spiral')) {
            state.binding = 'binding_wiro';
            el.binding.value = 'binding_wiro';
        } else if (text.includes('perfect')) {
            state.binding = 'binding_perfect';
            el.binding.value = 'binding_perfect';
        } else if (text.includes('stitch') || text.includes('pin')) {
            state.binding = 'binding_stitch';
            el.binding.value = 'binding_stitch';
        }

        // 9. Detect Delivery
        if (text.includes('fast') || text.includes('express') || text.includes('urgent')) {
            state.delivery = 'express';
            el.delivery.value = 'express';
        }

        // Trigger updates and notification
        togglePagesAndBindings();
        adjustQuantityLimits();
        calculateCosts();

        // Brief flash animation on summary card to indicate it refreshed
        const summaryPanel = document.querySelector('.summary-panel');
        if (summaryPanel) {
            summaryPanel.style.opacity = '0.5';
            setTimeout(() => {
                summaryPanel.style.opacity = '1';
            }, 150);
        }
    }

    /**
     * Helper to synchronise product buttons styling
     */
    function updateProductSelection(productName) {
        state.product = productName;
        el.choiceCards.forEach(card => {
            const radioInput = card.querySelector('input[type="radio"]');
            if (radioInput) {
                if (radioInput.value === productName) {
                    radioInput.checked = true;
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            }
        });
    }
});
