// api/lab.js
// 获取实验室信息
export async function getLabInfo() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }

    try {
        const response = await fetch('http://localhost:8080/api/lab/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
           // console.log('实验室信息：', data);
            return data;

        }
        else{
            const errorText = await response.text();
            console.error('Error fetching data:', errorText);
            throw new Error('请求失败');
        }

    } catch (error) {
        console.error('请求过程出错:', error);
        throw error;
    }
}

// 获取实验室预约信息
export async function getScheduleData() {
    const token = localStorage.getItem('token');  // 从 localStorage 获取 token
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }

    try {
        const response = await fetch('http://localhost:8080/api/lab/schedule', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 加上 Authorization 头部
            },
            mode : 'cors',
            credentials: 'include' // 如果需要发送 Cookie
        });

        if (!response.ok) {
            // 捕获响应失败的情况
            const errorText = await response.text();
            console.error('Error fetching data:', errorText);
            throw new Error('请求失败');
        }

        // 解析 JSON 数据并打印
        const data = await response.json();
        //console.log('获取的实验室预约数据：', data); // 这里会打印解析后的 JSON 数据

        return data;  // 返回数据
    } catch (error) {
        // 捕获任何错误（包括 fetch 错误、JSON 解析错误等）
        console.error('请求过程出错:', error);
        throw error; // 抛出错误，方便上层调用处理
    }
}


// 获取实验室管理员信息
export async function getLabManager() {
    const token = localStorage.getItem('token');  // 从 localStorage 获取 token
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }

    try {
        const response = await fetch('http://localhost:8080/api/lab/manager', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 加上 Authorization 头部
            },
            mode : 'cors',
            credentials: 'include' // 如果需要发送 Cookie
        });

        if (!response.ok) {
            // 捕获响应失败的情况
            const errorText = await response.text();
            console.error('Error fetching data:', errorText);
            throw new Error('请求失败');
        }

        // 解析 JSON 数据并打印
        const data = await response.json();
        //console.log('获取的实验室负责人信息：', data); // 这里会打印解析后的 JSON 数据

        return data;  // 返回数据
    } catch (error) {
        // 捕获任何错误（包括 fetch 错误、JSON 解析错误等）
        console.error('请求过程出错:', error);
        throw error; // 抛出错误，方便上层调用处理
    }
}

//获取所有实验室信息
export async function getLabs() {
    const token = localStorage.getItem('token');  // 从 localStorage 获取 token
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }

    try {
        const response = await fetch('http://localhost:8080/api/lab/labs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 加上 Authorization 头部
            },
            mode : 'cors',
            credentials: 'include' // 如果需要发送 Cookie
        });

        if (!response.ok) {
            // 捕获响应失败的情况
            const errorText = await response.text();
            console.error('Error fetching data:', errorText);
            throw new Error('请求失败');
        }

        // 解析 JSON 数据并打印
        const data = await response.json();
        //console.log('获取的实验室预约数据：', data); // 这里会打印解析后的 JSON 数据

        return data;  // 返回数据
    } catch (error) {
        // 捕获任何错误（包括 fetch 错误、JSON 解析错误等）
        console.error('请求过程出错:', error);
        throw error; // 抛出错误，方便上层调用处理
    }
}

// 根据实验室id和week获取预约数据
// api/lab.js
import axios from 'axios';

// 根据实验室id和周次获取预约数据
export async function updateScheduleData(labId, week, token) {
    // 构造请求数据
    const requestData = {
        labId: labId,  // 选择的实验室 ID
        week: week,    // 选择的周次
    };

    try {
        // 发送 POST 请求
        const response = await axios.post('http://localhost:8080/api/lab/schedule', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 加上 Authorization 头部
            }
        });

        // 处理成功响应
        if (response.data.code === 200) {

            return response.data;  // 返回已经解析好的数据
        } else {

            throw new Error('提交失败，请检查网络问题');
        }
    } catch (error) {
        // 处理错误
        console.error('提交请求出错:', error);
        throw error; // 抛出错误让调用者处理
    }
}

// 更新实验室信息
export async function postLabInfo(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }

    // console.log("传递来的Id为:"+id)
    const requestData = {
        id: id,
    }
    try {
        const response = await axios.post('http://localhost:8080/api/lab/info', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 加上 Authorization 头部
            }
        });

        if (response.data.code === 200) {

            // console.log("返回的数据为：" + JSON.stringify(response.data, null, 2));
            return response.data;  // 返回已经解析好的数据
        } else {
            const errorText = await response.text();
            console.error('Error fetching data:', errorText);
            throw new Error('请求失败');
        }

    } catch (error) {
        console.error('请求过程出错:', error);
        throw error;  // 抛出错误
    }
}

// 更新实验室负责人信息
export async function postLabManager(id) {
    const token = localStorage.getItem('token');  // 从 localStorage 获取 token
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }
    //请求体
    const requestData = {
        id: id,
    }
    try {
        const response = await axios.post('http://localhost:8080/api/lab/manager', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 加上 Authorization 头部
            }
        });

        if (response.data.code === 200) {

            // console.log("返回的数据为：" + JSON.stringify(response.data, null, 2));
            return response.data;  // 返回已经解析好的数据
        } else {
            const errorText = await response.text();
            console.error('Error fetching data:', errorText);
            throw new Error('请求失败');
        }

    } catch (error) {
        console.error('请求过程出错:', error);
        throw error;  // 抛出错误，方便上层调用处理
    }
}

