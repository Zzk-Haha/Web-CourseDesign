import axios from "axios";

// 获取课程信息
export async function getCourseData(teacherAccount) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');
    }

    // 请求体
    const requestData = { teacherAccount };

    try {
        const response = await axios.post('http://localhost:8080/api/teacher/getCourses', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });

        // console.log(JSON.stringify(response.data,null,2))

        return response.data.data;  // 返回后端响应
    } catch (error) {
        console.error('请求失败:', error);
        throw error;
    }
}

// 删除课程
export async function delCourse(teacherAccount,courseId) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token is missing.');
        throw new Error('后端未验证，无法登录');
    }

    // 请求体
    const requestData = { teacherAccount,courseId };

    try {
        const response = await axios.post('http://localhost:8080/api/teacher/delCourse', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });

        // console.log(JSON.stringify(response.data,null,2))

        return response.data;  // 返回后端响应
    } catch (error) {
        console.error('请求失败:', error);
        throw error;
    }
}
