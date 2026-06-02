import { readFileSync } from "node:fs";

const path = "reference/db-recon/datasets/fandom-fr/Son_Goku.json";
const data = JSON.parse(readFileSync(path, "utf-8"));
const html = data.parse.text["*"];
const sections = data.parse.sections;

// Find the "Techniques et Capacités" section
const techSection = sections.find(s => s.line.includes("Techniques") || s.line.includes("Capacités"));

if (techSection) {
    console.log(`Found section: ${techSection.line} at index ${techSection.index}`);
    
    // In Fandom JSON, the HTML is a single string.
    // Sections are headers (h2, h3, etc.).
    // We can try to extract the content between this section and the next one of the same level.
    const startTag = techSection.anchor;
    const nextSection = sections.find(s => parseInt(s.index) > parseInt(techSection.index) && s.level === techSection.level);
    
    let subHtml = "";
    if (nextSection) {
        const startIdx = html.indexOf(`id="${startTag}"`);
        const endIdx = html.indexOf(`id="${nextSection.anchor}"`);
        subHtml = html.substring(startIdx, endIdx);
    } else {
        subHtml = html.substring(html.indexOf(`id="${startTag}"`));
    }
    
    console.log("SubHtml Sample:", subHtml.substring(0, 1000));
    
    // Techniques are often in <ul> or defined by <b> titles in paragraphs.
    const techRegex = /<b>(.*?)<\/b>/gs;
    let match;
    while ((match = techRegex.exec(subHtml)) !== null) {
        console.log(`- Potential Tech: ${match[1].replace(/<[^>]+>/g, "").trim()}`);
    }
} else {
    console.log("Section not found");
}
