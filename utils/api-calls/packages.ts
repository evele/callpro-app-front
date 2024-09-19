/* ----- System Groups ----- */
type PackagesStepsAPIResponse = {
    result: true,
    steps: PackageStep[],    
}

export async function getPackagesSteps(): Promise<PackagesStepsAPIResponse | APIResponseError>{
    return await fetchWrapper.get(GET_PACKAGE_STEPS_URL) as PackagesStepsAPIResponse | APIResponseError
}

/* ----- Custom Groups ----- */
type MonthlyGroupsPlansAPIResponse = {
    result: true,
    monthly_groups_plans: MonthlyGroupPlan[],    
}

export async function getMonthlyGroupsPlans(): Promise<MonthlyGroupsPlansAPIResponse | APIResponseError>{    
    return await fetchWrapper.get(GET_MONTHLY_GROUPS_PLANS_URL) as MonthlyGroupsPlansAPIResponse | APIResponseError
}