import React , {useState} from "react";
import "./register.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import {useHistory} from "react-router-dom"
const Register= ()=>{

// const history = useHistory()
const navigate = useNavigate()

    const [newUser, setNewUser] = useState(
        {
    name: "",
    fname:"",
    lname:"",
    email:"",
    password: "",
    reEnterPassword : "",
    birthdate:"",
    photo:""
   
        }
    );

    const handleChange = (e)=>{
        setNewUser({...newUser, [e.target.name]: e.target.value})
    }

    const handlePhoto = (e)=>{
        setNewUser({...newUser, photo: e.target.files[0]})
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("photo",newUser.photo);
        formData.append("birthdate", newUser.birthdate);
        formData.append("name",newUser.name);
        formData.append("fname",newUser.fname);
        formData.append("lname",newUser.lname);
        formData.append("email",newUser.email);
        formData.append("password",newUser.password);
        formData.append("reEnterPassword",newUser.reEnterPassword);

        
        try {
            axios.post("http://localhost:5000/users/register/", formData)
            .then(res =>{
                alert(res.data.message)
                //  history.push("/login")
                navigate("/login")
            })
          
        } catch (error) {
            alert("invalid input",error)
        } 
    }
 
    
return(
    
    <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="container1">
         <div className='register'>
         <h1>Registration Page</h1>
         <input type="text" placeholder="name" name="name" value={newUser.name}  onChange={handleChange}/>
         <input type="text" placeholder="fname" name="fname" value={newUser.fname}  onChange={handleChange}/>
         <input type="text" placeholder="lname" name="lname" value={newUser.lname}  onChange={handleChange}/>
         <input type="email" placeholder="email" name="email" value={newUser.email}  onChange={handleChange}/>
         
         <input type="password" placeholder="password" name="password" value={newUser.password}  onChange={handleChange}/>
         <input type="password" placeholder="reEnterPassword" name="reEnterPassword" value={newUser.reEnterPassword}  onChange={handleChange}/>
        <input type="date" name="birthdate" value = {newUser.date} onChange={handleChange}/>
        <input type="file" accept=".png, .jpg, .jpeg" name="photo" onChange={handlePhoto}/>
        {newUser.photo && (
            <img height={'150px'} width={'100px'} src={URL.createObjectURL(newUser.photo)}/>
        )}
<div className='button' onClick={handleSubmit}>Register</div>
<div>or</div> 
<div className='button'onClick={()=>navigate("/login")}>Login</div> 
        </div>
        </div>
    </form>
)

}
export default Register;