import axios from "axios";

// 获取课程列表
export async function getCourses() {
    const token = localStorage.getItem('token');  // 从 localStorage 获取 token
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }

    try {
        const response = await fetch('http://localhost:8080/api/admin/getcourses', {
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

        return data;  // 返回数据
    } catch (error) {
        // 捕获任何错误（包括 fetch 错误、JSON 解析错误等）
        console.error('请求过程出错:', error);
        throw error; // 抛出错误，方便上层调用处理
    }
}

// 管理员添加课程
export async function addCourse(courseData) {
    const token = localStorage.getItem('token');  // 从 localStorage 获取 token
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }
    //请求体
    const requestData = {
        id: courseData.id,
        hours: courseData.hours,
        experimentHours: courseData.experimentHours,
        name:courseData.name ,
        description: courseData.description
    }
    try {
        const response = await axios.post('http://localhost:8080/api/admin/addcourse', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 加上 Authorization 头部
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
// 管理员删除课程
export async function deleteCourse(courseId) {
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
        const response = await axios.post('http://localhost:8080/api/admin/delcourse', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 加上 Authorization 头部
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