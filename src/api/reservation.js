// 获取预约信息
import axios from "axios";

export async function reservation(account) {
    const token = localStorage.getItem('token');  // 从 localStorage 获取 token
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }
    //请求体
    const requestData = {
        teacherAccount: account,
    }
    try {
        const response = await axios.post('http://localhost:8080/api/teacher/getReservation', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });

        if (response.data.code === 200) {
            // console.log(JSON.stringify(response.data.data,null,2))
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
// 删除预约信息
export async function removeReservation(teacherAccount,week,labId,xingQi,period) {
    const token = localStorage.getItem('token');  // 从 localStorage 获取 token
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }
    //请求体
    const requestData = {
        teacherAccount: teacherAccount,
        week: week,
        labId: labId,
        xingQi: xingQi,
        period: period
    }
    try {
        const response = await axios.post('http://localhost:8080/api/teacher/deleteReservation', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });

        if (response.data.code === 200) {
            // console.log(JSON.stringify(response.data.data,null,2))
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