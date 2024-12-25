import axios from "axios";

// 更新教师的基本信息
export async function postTeacherInfo(account,webName,email,phone) {
    const token = localStorage.getItem('token');  // 从 localStorage 获取 token
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');  // 如果没有token，抛出错误
    }
    //请求体
    const requestData = {
        account: account,
        webName: webName,
        email: email,
        phone: phone
    }
    try {
        const response = await axios.post('http://localhost:8080/api/teacher/updateInfo', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 加上 Authorization 头部
            }
        });

        if (response.data.code === 200) {

            // console.log("成功调用！");

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

// 更新密码的 API
export async function postUpdatePassword(password) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');
    }

    // 请求体
    const requestData = { password };

    try {
        const response = await axios.patch('http://localhost:8080/api/teacher/updatePassword', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // 添加 Authorization 头
            }
        });

        return response.data;  // 返回后端响应
    } catch (error) {
        console.error('请求失败:', error);
        throw error;
    }
}
