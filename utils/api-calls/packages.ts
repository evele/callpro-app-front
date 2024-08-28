/* ----- System Groups ----- */
type PackagesStepsAPIResponse = {
    result: boolean,
    steps?: PackageStep[],
    db_error?: string,
}

export async function getPackagesSteps(): Promise<PackagesStepsAPIResponse>{
    const response = await fetchWrapper.get(GET_PACKAGE_STEPS_URL) 
    return response as PackagesStepsAPIResponse
}

/* ----- Custom Groups ----- */
type MonthlyGroupsPlansAPIResponse = {
    result: boolean,
    monthly_groups_plans?: MonthlyGroupPlan[],
    db_error?: string,
}

export async function getMonthlyGroupsPlans(): Promise<MonthlyGroupsPlansAPIResponse>{
    const response = await fetchWrapper.get(GET_MONTHLY_GROUPS_PLANS_URL) 
    return response as MonthlyGroupsPlansAPIResponse
}