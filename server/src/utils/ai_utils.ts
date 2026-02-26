export interface AnalysisResult {
    risk_score: number;
    status: 'approved' | 'rejected' | 'flagged' | 'pending';
    flags: string[];
    summary: string;
}

export const analyzeClaim = async (claimData: any): Promise<AnalysisResult> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const amount = Number(claimData.amount);
    const flags: string[] = [];
    let status: 'approved' | 'rejected' | 'flagged' | 'pending' = 'approved';
    let risk_score = 0;

    // Simulate analysis logic
    if (amount > 5000) {
        flags.push('High value claim detected');
        risk_score += 40;
    }

    if (claimData.description && (
        claimData.description.toLowerCase().includes('emergency') ||
        claimData.description.toLowerCase().includes('urgent')
    )) {
        risk_score += 10;
    }

    if (risk_score >= 40) {
        status = 'flagged';
    } else if (risk_score >= 70) {
        status = 'rejected';
    }

    const summaries = [
        "Claim appears standard and meets coverage criteria.",
        "Claim flagged for manual review due to high value.",
        "Inconsistencies detected in service description.",
        "AI suggests approval based on provider history."
    ];

    return {
        risk_score,
        status,
        flags,
        summary: status === 'flagged' ? summaries[1] : summaries[0]
    };
};
