<template>
    <button type="button" class="print-btn" @click="handlePrintPDF">{{ btnText }}</button>
</template>

<script setup>
    import { jsPDF } from "jspdf";
    import html2canvas from "html2canvas";

    const props = defineProps({
        btnText: { type: String, required: false, default: "Save as PDF" },
        elementId: { type: String, required: true },
        fileName: { type: String, required: true },
        pdfWidth: { type: Number, required: false, default: 210 },
        pdfHeight: { type: Number, required: false, default: null },
    });

    const handlePrintPDF = () => {
        console.log('print pdf')

        const element = document.querySelector(`#${props.elementId}`);

        html2canvas(element).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = props.pdfWidth;
            const imgHeight = props.pdfHeight || (canvas.height * imgWidth / canvas.width);

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${props.fileName}.pdf`);
        });

    }
</script>

<style scoped>
    .print-btn {
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
</style>