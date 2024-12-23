// api/lab.js
export async function getLabInfo() {
    const response = await fetch('/api/lab/info');
    return await response.json();
}

export async function getScheduleData() {
    const response = await fetch('/api/lab/schedule');
    return await response.json();
}

export async function getLabManager() {
    const response = await fetch('/api/lab/manager');
    return await response.json();
}

