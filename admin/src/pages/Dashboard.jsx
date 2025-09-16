import React, { useEffect, useState } from 'react'
import "./Dashboard.css"
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const navigate = useNavigate()
  const [userCount, setUserCount] = useState(0)
  const [blogCount, setBlogCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)

  
  const getAllInfo = async() => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/getallinfo", {withCredentials : true})
      if(res.data.success){
        console.log(res.data)
        setUserCount(res.data.userCount)
        setBlogCount(res.data.blogCount)
        setCommentCount(res.data.commentCount)
        toast.success(res.data.message)
      }else {
        toast.error("not found information")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  useEffect(() => {
    getAllInfo()
  }, [])
  
  return (
    <>
      <h1 className='heading'>Welcome to Admin Panel</h1>
      <div className='dash-container'>
        <div className="total-user user">
          <h2>Total Users</h2>
          <p>{ userCount }</p>
          <img src="https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png" alt="users" />
          <button onClick={() => navigate('/users')} className="more-btn">More Info →</button>
        </div>

        <div className="total-user blog">
          <h2>Total Blog</h2>
          <p>{ blogCount }</p>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzsfPVrOZWna6jEvad4SwhFGHP5Xm0avs8yg&s" alt="blogs" />
          <button onClick={() => navigate('/blogs')} className="more-btn">More Info →</button>
        </div>

        <div className="total-user comment">
          <h2>Total Comments</h2>
          <p> {commentCount} </p>
          <img src="https://static.vecteezy.com/system/resources/thumbnails/023/668/595/small_2x/speech-bubble-on-white-background-animated-icon-video.jpg" alt="comments" />
          <button className="more-btn">More Info →</button>
        </div>
      </div>
    </>
  )
}

export default Dashboard
