// 获取实验室信息
// 根据输入的上课人数筛选出容量大于等于该人数且状态为 Available 的实验室
import axios from "axios";

export async function getLabCapacity(studentCount)  {
    const token = localStorage.getItem('token');  // 从 localStorage 获取 token
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }
    //请求体
    const requestData = { capacity: studentCount }
    try {
        const response = await axios.post('http://localhost:8080/api/teacher/getLabByCapacity', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 加上 Authorization 头部
            }
        });

        if (response.data.code === 200) {
            // console.log("该函数成功调用！")
            console.log(JSON.stringify(response.data.data,null,2))
            return response.data;  // 返回已经解析好的数据
        } else {

            const errorText = await response.text();
            console.error('Error fetching data:', errorText);
            throw new Error('请求失败');
        }

    } catch (error) {
        console.error('请求过程出错:', error);
        throw error;
    }
}
