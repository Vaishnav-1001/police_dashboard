export function getCaseMetrics(cases = []) {
    const openCases = cases.filter(
        (caseItem) =>
            String(caseItem.status || "").toLowerCase() !== "closed"
    ).length;

    const criticalCases = cases.filter(
        (caseItem) =>
            String(caseItem.priority || "").toLowerCase() === "critical"
    ).length;

    const evidenceItems = cases.reduce(
        (total, caseItem) =>
            total + Number(caseItem.evidence_count || 0),
        0
    );

    const closedCases = cases.filter(
        (caseItem) =>
            String(caseItem.status || "").toLowerCase() === "closed"
    ).length;

    return {
        openCases,
        criticalCases,
        evidenceItems,
        closedCases,
    };
}