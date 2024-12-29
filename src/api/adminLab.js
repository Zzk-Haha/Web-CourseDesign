import axios from "axios";

// 获取实验室列表
export async function getLabs() {
    const token = localStorage.getItem('token');  // 从 localStorage 获取 token
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }

    try {
        const response = await fetch('http://localhost:8080/api/admin/getlabs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
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

        return data;  // 返回数据
    } catch (error) {
        // 捕获任何错误（包括 fetch 错误、JSON 解析错误等）
        console.error('请求过程出错:', error);
        throw error; // 抛出错误，方便上层调用处理
    }
}

// 管理员添加实验室
export async function addLab(labData) {
    const token = localStorage.getItem('token');  // 从 localStorage 获取 token
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }
    //请求体
    const requestData = {
        id: labData.id,
        name: labData.name,
        staffId: labData.staffId,
        capacity: labData.capacity,
        configuration: labData.configuration,
        status: labData.status
    }
    try {
        const response = await axios.post('http://localhost:8080/api/admin/addlab', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });

        if (response.data.code === 200) {

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
// 管理员删除实验室
export async function deleteLab(courseId) {
    const token = localStorage.getItem('token');  // 从 localStorage 获取 token
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }
    //请求体
    const requestData = {
        id: courseId,
    }
    try {
        const response = await axios.post('http://localhost:8080/api/admin/dellab', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });

        if (response.data.code === 200) {


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