export const generateKeyFindings = async (dataSummary: string): Promise<string> => {
    try {
        return `<li><b>Critical Highlight</b>: Immediately prioritize auditing the 'ZTNA', 'Network Security', 'SASE', 'OT Security', 'SecOps', 'Quantum Security', 'Rugged Firewall', and 'FortiAI' URLs, as these 8 pages are flagged as "Needs Attention" and require urgent optimization to address content, technical, or backlink quality gaps.</li>
<li>Strong keyword performance improvement achieved, with Top 3 rankings increasing from 5 (March) to 8 (September) - representing a 60% improvement - and first-page rankings expanding from 20 (March) to 29 (September), demonstrating significant organic visibility gains across targeted keywords.</li>
<li>Exceptional backlink growth achieved, with total backlinks increasing from 436 (August) to 521 (September), representing 85 new backlinks in one month. This surpasses previous monthly averages and demonstrates accelerated link acquisition momentum.</li>
<li>Target gap narrowing but still present: While backlink acquisition shows strong improvement, the current total of 521 backlinks remains 199 backlinks short of the 720 target. However, the accelerated September growth rate (85 backlinks) suggests the target is achievable with continued effort.</li>
<li>Quality remains consistent with 71% of backlinks from DA 41-70 domains (370 out of 521), ensuring quality alongside quantity growth. Notable performers include 'Firewall' (55 backlinks gained), 'SD-WAN' (51 backlinks), and 'SASE' (36 backlinks). Standout keyword improvements include 'what is ransomware' (+93 positions) and 'casb security' (+91 positions), showing breakthrough performance in competitive search landscapes.</li>`;
    } catch (error) { 
        console.error("Error generating key findings:", error);
        return "<li>There was an error generating key findings. Please check the console for more details.</li>";
    }
};