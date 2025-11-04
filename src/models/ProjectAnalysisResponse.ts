export type ProjectAnalysisResponse = {
    project_id: number;
    project_name: string;
    project_status: number;
    project_progress: number;
    team_size: number;
    total_issues: number;
    analysis: {
        summary: string;
        health: {
            overallStatus: string;
            explanation: string;
        };
        productivity: {
            averageProductivity: number | null;
            notes: string;
        };
        issues: {
            overview: string;
            bottlenecks?: string[];
            overdueCount: number;
        };
        risks?: string[];
        recommendations?: string[];
    };
    timestamp: Date;
};