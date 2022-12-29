import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function UserAPI(token) {
  const [isLogged, setIsLogged] = useState(false);
  const [callback, setCallback] = useState(false);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (token) {
      const getStudent = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            'http://localhost:4000/api/student/profile',
            {
              headers: { Authorization: token },
            }
          );
          setIsLogged(true);
          setList(res.data.student.enrolled);
          setUser(res.data.student);
          setLoading(false);
        } catch (error) {
          toast.error(error.response.data.msg);
        }
      };
      getStudent();
    }
  }, [token]);

  const addList = async (course) => {
    if (!isLogged) {
      return alert('Please Login or Registration to Continue Buying');
    }

    const check = list.every((item) => {
      return item.courseDetails._id !== course.courseDetails._id;
    });

    if (check) {
      setList([...list, { ...course }]);

      await axios.patch(
        'http://localhost:4000/api/course/enroll',
        { enrolled: [...list, { ...course }] },
        {
          headers: { Authorization: token },
        }
      );
      toast.success('Successfully Enrolled');
    } else {
      toast.warn('Already Enrolled in This Course');
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    callback: [callback, setCallback],
    user: [user, setUser],
    loading: [loading, setLoading],
    addList: addList,
    list: [list, setList],
  };
}

export default UserAPI;
