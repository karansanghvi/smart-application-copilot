// pdfReportGenerator.js - PDF Report Generator for Autofill Process

class AutofillReportGenerator {
    constructor() {
        this.jsPDF = window.jspdf.jsPDF;
    }

    /**
     * Generate PDF report for autofill results
     * @param {Object} reportData - Data for the report
     * @returns {Blob} PDF blob
     */
    generateReport(reportData) {
        const {
            tabInfo,
            totalFields,
            matchedFields,
            fieldsWithoutValues,
            unmatchedFields,
            filledCount,
            timestamp
        } = reportData;

        const doc = new this.jsPDF();
        let yPosition = 20;
        const lineHeight = 7;
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;

        // ========== HEADER ==========
        doc.setFontSize(22);
        doc.setTextColor(16, 185, 129); // Green color
        doc.text('JobFlow Autofill Report', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // Timestamp
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${timestamp}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // ========== TAB INFORMATION ==========
        this.addSectionHeader(doc, 'Tab Information', yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Title: ${this.truncate(tabInfo.title, 60)}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`URL: ${this.truncate(tabInfo.url, 70)}`, margin, yPosition);
        yPosition += 15;

        // ========== SUMMARY STATISTICS ==========
        this.addSectionHeader(doc, 'Summary Statistics', yPosition);
        yPosition += 10;

        const stats = [
            { label: 'Total Fields Detected', value: totalFields },
            { label: 'Fields Successfully Filled', value: filledCount, color: [16, 185, 129] },
            { label: 'Fields Matched (No Value)', value: fieldsWithoutValues.length, color: [245, 158, 11] },
            { label: 'Fields Not Matched', value: unmatchedFields.length, color: [239, 68, 68] },
            { label: 'Success Rate', value: `${((filledCount / totalFields) * 100).toFixed(1)}%`, color: [16, 185, 129] }
        ];

        doc.setFontSize(11);
        stats.forEach(stat => {
            if (stat.color) {
                doc.setTextColor(...stat.color);
            } else {
                doc.setTextColor(0, 0, 0);
            }
            doc.text(`${stat.label}:`, margin, yPosition);
            doc.text(`${stat.value}`, margin + 80, yPosition);
            yPosition += lineHeight;
        });
        yPosition += 10;

        // ========== SUCCESSFULLY FILLED FIELDS ==========
        if (matchedFields.length > 0) {
            yPosition = this.checkPageBreak(doc, yPosition, 40);
            
            this.addSectionHeader(doc, `✓ Successfully Filled Fields (${matchedFields.length})`, yPosition);
            yPosition += 10;

            matchedFields.forEach((field, index) => {
                yPosition = this.checkPageBreak(doc, yPosition, 30);

                // Field number and label
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                doc.setFont(undefined, 'bold');
                doc.text(`${index + 1}. ${this.truncate(field.label, 50)}`, margin, yPosition);
                doc.setFont(undefined, 'normal');
                yPosition += lineHeight;

                // Matched to
                doc.setTextColor(60, 60, 60);
                doc.text(`   Matched to: ${field.matchedTo}`, margin, yPosition);
                yPosition += lineHeight;

                // Confidence
                const confidenceColor = this.getConfidenceColor(field.confidence);
                doc.setTextColor(...confidenceColor);
                doc.text(`   Confidence: ${(field.confidence * 100).toFixed(1)}%`, margin, yPosition);
                yPosition += lineHeight;

                // Value
                doc.setTextColor(16, 185, 129);
                doc.text(`   Value: "${this.truncate(String(field.value), 60)}"`, margin, yPosition);
                yPosition += lineHeight + 3;
            });
            yPosition += 5;
        }

        // ========== FIELDS MATCHED BUT NO VALUE ==========
        if (fieldsWithoutValues.length > 0) {
            yPosition = this.checkPageBreak(doc, yPosition, 40);
            
            this.addSectionHeader(doc, `⚠ Fields Matched But No Value (${fieldsWithoutValues.length})`, yPosition);
            yPosition += 10;

            fieldsWithoutValues.forEach((field, index) => {
                yPosition = this.checkPageBreak(doc, yPosition, 25);

                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                doc.setFont(undefined, 'bold');
                doc.text(`${index + 1}. ${this.truncate(field.label, 50)}`, margin, yPosition);
                doc.setFont(undefined, 'normal');
                yPosition += lineHeight;

                doc.setTextColor(60, 60, 60);
                doc.text(`   Matched to: ${field.matchedTo}`, margin, yPosition);
                yPosition += lineHeight;

                const confidenceColor = this.getConfidenceColor(field.confidence);
                doc.setTextColor(...confidenceColor);
                doc.text(`   Confidence: ${(field.confidence * 100).toFixed(1)}%`, margin, yPosition);
                yPosition += lineHeight;

                doc.setTextColor(245, 158, 11);
                doc.text(`   Status: No value in profile`, margin, yPosition);
                yPosition += lineHeight + 3;
            });
            yPosition += 5;
        }

        // ========== UNMATCHED FIELDS ==========
        if (unmatchedFields.length > 0) {
            yPosition = this.checkPageBreak(doc, yPosition, 40);
            
            this.addSectionHeader(doc, `✗ Fields Not Matched (${unmatchedFields.length})`, yPosition);
            yPosition += 10;

            unmatchedFields.forEach((field, index) => {
                yPosition = this.checkPageBreak(doc, yPosition, 20);

                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                doc.setFont(undefined, 'bold');
                doc.text(`${index + 1}. ${this.truncate(field.label, 50)}`, margin, yPosition);
                doc.setFont(undefined, 'normal');
                yPosition += lineHeight;

                doc.setTextColor(239, 68, 68);
                doc.text(`   Confidence: ${(field.confidence * 100).toFixed(1)}%`, margin, yPosition);
                yPosition += lineHeight;

                doc.setTextColor(100, 100, 100);
                doc.text(`   Status: Below confidence threshold`, margin, yPosition);
                yPosition += lineHeight + 3;
            });
        }

        // ========== FOOTER ==========
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `Page ${i} of ${pageCount}`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
            doc.text(
                'Generated by JobFlow - AI-Powered Job Application Autofill',
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 5,
                { align: 'center' }
            );
        }

        return doc;
    }

    /**
     * Add section header
     */
    addSectionHeader(doc, title, yPosition) {
        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138); // Dark blue
        doc.setFont(undefined, 'bold');
        doc.text(title, 20, yPosition);
        doc.setFont(undefined, 'normal');
        
        // Underline
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition + 2, doc.internal.pageSize.getWidth() - 20, yPosition + 2);
    }

    /**
     * Check if page break is needed
     */
    checkPageBreak(doc, yPosition, spaceNeeded) {
        const pageHeight = doc.internal.pageSize.getHeight();
        if (yPosition + spaceNeeded > pageHeight - 20) {
            doc.addPage();
            return 20; // Start from top of new page
        }
        return yPosition;
    }

    /**
     * Get color based on confidence level
     */
    getConfidenceColor(confidence) {
        if (confidence >= 0.8) return [16, 185, 129]; // Green
        if (confidence >= 0.6) return [245, 158, 11]; // Orange
        return [239, 68, 68]; // Red
    }

    /**
     * Truncate text if too long
     */
    truncate(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    /**
     * Download the PDF
     */
    downloadPDF(doc, filename) {
        doc.save(filename);
    }

    /**
     * Open PDF in new tab
     */
    openPDFInNewTab(doc) {
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
    }
}

// Export for use in dashboard.js
window.AutofillReportGenerator = AutofillReportGenerator;
console.log('✅ PDF Report Generator loaded');